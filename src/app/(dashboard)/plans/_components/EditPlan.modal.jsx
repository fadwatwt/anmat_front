"use client"
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import { useUpdateSubscriptionPlanMutation } from "@/redux/plans/subscriptionPlansApi.js";
import { useGetSubscriptionFeatureTypesQuery } from "@/redux/plans/subscriptionsFeatureTypesApi.js";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import { useState, useEffect } from "react";
import Switch2 from "@/components/Form/Switch2";
import SwitchWithLabel from "@/components/Form/SwitchWithLabel";
import { RiDeleteBin7Line, RiInformationLine, RiHashtag } from "@remixicon/react";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useTranslation } from "react-i18next";
import BtnAddOutline from "@/components/Form/BtnAddOutline";
import ElementsSelect from "@/components/Form/ElementsSelect";
import { FiTrash2 } from "react-icons/fi";

function EditPlanModal({ isOpen, onClose, plan }) {
  const { t } = useTranslation();
  const [updateSubscriptionPlan, { isLoading: isUpdating }] = useUpdateSubscriptionPlanMutation();
  const { data: featureTypes } = useGetSubscriptionFeatureTypesQuery("active");

  const [showApproval, setShowApproval] = useState(false);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  const calculateDays = (interval, count) => {
    const counts = { day: 1, week: 7, month: 30, year: 365 };
    return (counts[interval] || 30) * (parseInt(count) || 1);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      pricing: [],
      features: [],
      trial: { trial_days: 14, is_active: true },
      is_active: true
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      pricing: Yup.array().of(
        Yup.object({
          price: Yup.number().required("Required"),
          interval: Yup.string().required("Required"),
          interval_count: Yup.number().required("Required"),
          days_number: Yup.number().required("Required"),
          discount: Yup.number().min(0).required("Required"),
          is_active: Yup.boolean().required()
        })
      ),
      features: Yup.array().of(
        Yup.object({
          feature_type_id: Yup.string().required("Required"),
          properties: Yup.array().of(
            Yup.object({
              key: Yup.string().required(),
              value: Yup.mixed().required("Required")
            })
          )
        })
      ),
      trial: Yup.object({
        trial_days: Yup.number().when("is_active", {
          is: true,
          then: () => Yup.number().min(1, "Minimum 1 day").required("Required"),
          otherwise: () => Yup.number().notRequired()
        }),
        is_active: Yup.boolean().required()
      }),
      is_active: Yup.boolean().required()
    }),
    onSubmit: async (values) => {
      setShowApproval(true);
    },
  });

  useEffect(() => {
    if (plan && isOpen) {
      formik.setValues({
        name: plan.name || "",
        description: plan.description || "",
        pricing: plan.pricing?.map(p => ({
            price: p.price ?? 0,
            interval: p.interval || "month",
            interval_count: p.interval_count ?? 1,
            days_number: p.days_number ?? 30,
            discount: p.discount ?? 0,
            is_active: p.is_active ?? true
        })) || [],
        features: plan.features?.map(f => ({
            feature_type_id: f.feature_type?._id || f.plan_feature?._id || f.feature_type_id || "",
            properties: f.properties || []
        })) || [],
        trial: {
            trial_days: plan.trial?.trial_days ?? 14,
            is_active: plan.trial?.is_active ?? false
        },
        is_active: plan.is_active ?? true
      });
    }
  }, [plan, isOpen]);

  const handleConfirmUpdate = async () => {
    try {
      await updateSubscriptionPlan({ id: plan._id, ...formik.values }).unwrap();
      setApiResponse({
        isOpen: true,
        status: "success",
        message: "Plan updated successfully! A new version has been archived."
      });
    } catch (error) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: error?.data?.message || "Failed to update plan."
      });
    }
  };

  const handleCloseResponse = () => {
    setApiResponse(prev => ({ ...prev, isOpen: false }));
    if (apiResponse.status === "success") {
      onClose();
    }
  };

  const addPricing = () => {
    formik.setFieldValue("pricing", [
      ...formik.values.pricing,
      { price: "", interval: "month", interval_count: 1, days_number: 30, discount: 0, is_active: true }
    ]);
  };

  const removePricing = (index) => {
    const newPricing = [...formik.values.pricing];
    newPricing.splice(index, 1);
    formik.setFieldValue("pricing", newPricing);
  };

  const addFeature = () => {
    formik.setFieldValue("features", [
      ...formik.values.features,
      { feature_type_id: "", properties: [] }
    ]);
  };

  const removeFeature = (index) => {
    const newFeatures = [...formik.values.features];
    newFeatures.splice(index, 1);
    formik.setFieldValue("features", newFeatures);
  };

  const handleFeatureTypeChange = (index, featureTypeId) => {
    const selectedType = featureTypes.find(ft => ft._id === featureTypeId);
    const newFeatures = [...formik.values.features];

    const initialProperties = selectedType?.attributes_definitions.map(attr => ({
      key: attr.key,
      value: attr.data_type === "number" ? 0 : ""
    })) || [];

    newFeatures[index] = {
      feature_type_id: featureTypeId,
      properties: initialProperties
    };

    formik.setFieldValue("features", newFeatures);
  };

  const getAvailableFeatureTypes = (currentIndex) => {
    if (!featureTypes) return [];
    const selectedIds = formik.values.features
      .map((f, i) => i !== currentIndex ? f.feature_type_id : null)
      .filter(id => id !== null);

    return featureTypes
      .filter(ft => !selectedIds.includes(ft._id))
      .map(ft => ({ id: ft._id, element: ft.title, ...ft }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={isUpdating ? t("Updating...") : t("Update Plan")}
      onClick={() => formik.submitForm()}
      className={"lg:w-5/12 md:w-8/12 sm:w-10/12 w-11/12"}
      title={"Edit Plan"}
    >
      <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {/* Warning Banner */}
        <div className="mx-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
            <RiInformationLine size={20} className="text-blue-500 shrink-0 mt-0.5" />
            <div className="flex flex-col">
                <span className="text-xs font-bold text-blue-700">Financial Rights Preservation</span>
                <p className="text-[10px] text-blue-600 leading-tight">
                    Updating this plan will automatically archive the current version. Existing subscribers will stay on their current price and features until their next renewal.
                </p>
            </div>
        </div>

        <div className={"px-4 grid grid-cols-1 gap-4"}>
          <InputAndLabel
            title="Plan Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
            isRequired={true}
          />
          <InputAndLabel
            title="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description}
            isRequired={true}
          />
        </div>

        <div className={"w-full py-[6px] bg-weak-100 text-start text-xs dark:bg-weak-800 text-weak-800 dark:text-weak-100 px-4"}>
          {t("Plan Pricing")}:
        </div>

        {formik.values.pricing.map((price, index) => (
          <div key={index} className="px-4 py-2 border-b border-status-border last:border-0 relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-cell-secondary">Price Option #{index + 1}</span>
              <div className="flex items-center gap-3">
                <SwitchWithLabel
                  title="Active"
                  isOn={formik.values.pricing[index].is_active}
                  handleToggle={() => formik.setFieldValue(`pricing.${index}.is_active`, !formik.values.pricing[index].is_active)}
                  className="!p-0 !bg-transparent !border-0 !rounded-none gap-2"
                />
                {formik.values.pricing.length > 1 && (
                  <button type="button" onClick={() => removePricing(index)} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <InputAndLabel
                title="Price"
                name={`pricing.${index}.price`}
                type="number"
                value={formik.values.pricing[index].price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pricing?.[index]?.price && formik.errors.pricing?.[index]?.price}
                isRequired={true}
              />
              <InputAndLabel
                title="Discount (%)"
                name={`pricing.${index}.discount`}
                type="number"
                value={formik.values.pricing[index].discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pricing?.[index]?.discount && formik.errors.pricing?.[index]?.discount}
                isRequired={true}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputAndLabel
                title="Interval Count"
                name={`pricing.${index}.interval_count`}
                type="number"
                value={formik.values.pricing[index].interval_count}
                onChange={(e) => {
                  const val = e.target.value;
                  formik.setFieldValue(`pricing.${index}.interval_count`, val);
                  formik.setFieldValue(`pricing.${index}.days_number`, calculateDays(formik.values.pricing[index].interval, val));
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.pricing?.[index]?.interval_count && formik.errors.pricing?.[index]?.interval_count}
                isRequired={true}
              />
              <SelectAndLabel
                title="Interval"
                name={`pricing.${index}.interval`}
                value={formik.values.pricing[index].interval}
                options={[
                  { _id: "day", name: "Day" },
                  { _id: "week", name: "Week" },
                  { _id: "month", name: "Month" },
                  { _id: "year", name: "Year" }
                ]}
                onChange={(val) => {
                  formik.setFieldValue(`pricing.${index}.interval`, val);
                  formik.setFieldValue(`pricing.${index}.days_number`, calculateDays(val, formik.values.pricing[index].interval_count));
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.pricing?.[index]?.interval && formik.errors.pricing?.[index]?.interval}
                isRequired={true}
              />
              <InputAndLabel
                title="Days Number"
                name={`pricing.${index}.days_number`}
                type="number"
                value={formik.values.pricing[index].days_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isRequired={true}
                disabled={true}
              />
            </div>
          </div>
        ))}

        <div className={"px-4"}>
          <BtnAddOutline title="Add Another Pricing Option" onClick={addPricing} />
        </div>

        <div className={"w-full py-[6px] bg-weak-100 text-start text-xs dark:bg-weak-800 text-weak-800 dark:text-weak-100 px-4 mt-2"}>
          {t("Plan Features")}:
        </div>

        {formik.values.features.map((feature, index) => {
          const selectedType = featureTypes?.find(ft => ft._id === feature.feature_type_id);
          return (
            <div key={index} className="px-4 py-3 border-b border-status-border last:border-0 bg-surface shadow-sm mx-4 rounded-xl border border-status-border mb-2">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-primary-600">Feature #{index + 1}</span>
                {formik.values.features.length > 1 && (
                  <button type="button" onClick={() => removeFeature(index)} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>

              <ElementsSelect
                title="Feature Type"
                options={getAvailableFeatureTypes(index)}
                value={getAvailableFeatureTypes(index).filter(ft => ft.id === feature.feature_type_id)}
                onChange={(val) => handleFeatureTypeChange(index, val[0]?.id)}
                placeholder="Select Feature Type"
                error={formik.touched.features?.[index]?.feature_type_id && formik.errors.features?.[index]?.feature_type_id}
              />

              {selectedType && feature.properties.length > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-3 p-3 bg-status-bg rounded-lg">
                  <p className="text-[10px] text-cell-secondary uppercase tracking-wider font-bold">Properties</p>
                  {feature.properties.map((prop, propIndex) => {
                    const attrDef = selectedType.attributes_definitions.find(a => a.key === prop.key);
                    return (
                      <InputAndLabel
                        key={prop.key}
                        title={prop.key}
                        name={`features.${index}.properties.${propIndex}.value`}
                        type={attrDef?.data_type === "number" ? "number" : "text"}
                        value={prop.value}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.features?.[index]?.properties?.[propIndex]?.value &&
                          formik.errors.features?.[index]?.properties?.[propIndex]?.value
                        }
                        isRequired={true}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className={"px-4"}>
          <BtnAddOutline title="Add New Feature Group" onClick={addFeature} />
        </div>

        <div className={"flex flex-col gap-3 px-4 pb-4 mt-2"}>
          <SwitchWithLabel
            title="Free Trial enabled"
            description="Activate free trial for this plan"
            isOn={formik.values.trial.is_active}
            handleToggle={() => formik.setFieldValue("trial.is_active", !formik.values.trial.is_active)}
          />

          {formik.values.trial.is_active && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <InputAndLabel
                title="Trial Days"
                name="trial.trial_days"
                type="number"
                value={formik.values.trial.trial_days}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.trial?.trial_days && formik.errors.trial?.trial_days}
                isRequired={true}
              />
            </div>
          )}

          <SwitchWithLabel
            title="Active Status"
            description="Make this plan available for subscription"
            isOn={formik.values.is_active}
            handleToggle={() => formik.setFieldValue("is_active", !formik.values.is_active)}
          />
        </div>
      </div>

      <ApprovalAlert
        isOpen={showApproval}
        onClose={() => setShowApproval(false)}
        onConfirm={handleConfirmUpdate}
        title="Update Subscription Plan"
        message={`Are you sure you want to update the "${plan?.name}" plan? This will create a new version.`}
        confirmBtnText={isUpdating ? "Updating..." : "Yes, Update"}
        type="warning"
      />

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={handleCloseResponse}
      />
    </Modal>
  );
}

EditPlanModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  plan: PropTypes.object,
};

export default EditPlanModal;
