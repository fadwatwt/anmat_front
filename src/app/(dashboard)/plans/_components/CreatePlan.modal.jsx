"use client"
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import { useCreateSubscriptionPlanMutation } from "@/redux/plans/subscriptionPlansApi.js";
import { useGetSubscriptionFeatureTypesQuery } from "@/redux/plans/subscriptionsFeatureTypesApi.js";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import { useState } from "react";
import Switch2 from "@/components/Form/Switch2";
import { RiDeleteBin7Line } from "react-icons/ri";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function CreatePlanModal({ isOpen, onClose }) {
  const [createSubscriptionPlan, { isLoading: isCreating }] = useCreateSubscriptionPlanMutation();
  const { data: featureTypes } = useGetSubscriptionFeatureTypesQuery("active");

  const calculateDays = (interval, count) => {
    const counts = {
      day: 1,
      week: 7,
      month: 30,
      year: 365
    };
    return (counts[interval] || 30) * (parseInt(count) || 1);
  };

  const [showApproval, setShowApproval] = useState(false);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      pricing: [
        {
          price: "",
          interval: "month",
          interval_count: 1,
          days_number: 30,
          discount: 0,
          is_active: true
        }
      ],
      features: [
        {
          feature_type_id: "",
          properties: []
        }
      ],
      trial: {
        trial_days: 14,
        is_active: true
      },
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

  const handleConfirmCreate = async () => {
    try {
      const result = await createSubscriptionPlan(formik.values).unwrap();
      setApiResponse({
        isOpen: true,
        status: "success",
        message: "Plan created successfully!"
      });
      formik.resetForm();
    } catch (error) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: error?.data?.message || "Failed to create plan. Please try again."
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

    // Initialize properties based on attributes_definitions
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
      .map(ft => ({ ...ft, name: ft.title }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={"Save"}
      onClick={formik.handleSubmit}
      className={"lg:w-5/12 md:w-8/12 sm:w-10/12 w-11/12"}
      title={"Add Plan"}
    >
      <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <div className={"px-4 grid grid-cols-1 gap-4"}>
          <InputAndLabel
            title="Plan Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter plan name"
            error={formik.touched.name && formik.errors.name}
            isRequired={true}
          />
          <InputAndLabel
            title="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter plan description"
            error={formik.touched.description && formik.errors.description}
            isRequired={true}
          />
        </div>

        <div className={"w-full p-2 bg-gray-50 px-4 text-gray-800 text-xs font-bold border-y border-gray-100"}>
          Plan Pricing
        </div>

        {formik.values.pricing.map((price, index) => (
          <div key={index} className="px-4 py-2 border-b border-gray-50 last:border-0 relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-gray-400">Price Option #{index + 1}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-400">Active</span>
                  <Switch2
                    className={"h-4 w-8"}
                    isOn={formik.values.pricing[index].is_active}
                    handleToggle={() => formik.setFieldValue(`pricing.${index}.is_active`, !formik.values.pricing[index].is_active)}
                  />
                </div>
                {formik.values.pricing.length > 1 && (
                  <button type="button" onClick={() => removePricing(index)} className="text-red-500 hover:text-red-700">
                    <RiDeleteBin7Line size={16} />
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
          <button type="button" onClick={addPricing} className={"w-full bg-primary-50 text-primary-600 py-2 text-xs rounded-lg hover:bg-primary-100 transition-colors border border-dashed border-primary-200"}>
            + Add Another Pricing Option
          </button>
        </div>

        <div className={"w-full p-2 bg-gray-50 px-4 text-gray-800 text-xs font-bold border-y border-gray-100 mt-2"}>
          Plan Features
        </div>

        {formik.values.features.map((feature, index) => {
          const selectedType = featureTypes?.find(ft => ft._id === feature.feature_type_id);
          return (
            <div key={index} className="px-4 py-3 border-b border-gray-50 last:border-0 bg-white shadow-sm mx-4 rounded-xl border border-gray-100 mb-2">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-primary-600">Feature #{index + 1}</span>
                {formik.values.features.length > 1 && (
                  <button type="button" onClick={() => removeFeature(index)} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors">
                    <RiDeleteBin7Line size={16} />
                  </button>
                )}
              </div>

              <SelectAndLabel
                title="Feature Type"
                name={`features.${index}.feature_type_id`}
                value={feature.feature_type_id}
                options={getAvailableFeatureTypes(index)}
                onChange={(val) => handleFeatureTypeChange(index, val)}
                onBlur={formik.handleBlur}
                error={formik.touched.features?.[index]?.feature_type_id && formik.errors.features?.[index]?.feature_type_id}
                isRequired={true}
              />

              {/* Dynamic Attributes */}
              {selectedType && feature.properties.length > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Properties</p>
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
          <button type="button" onClick={addFeature} className={"w-full bg-blue-50 text-blue-700 py-2 text-xs rounded-lg hover:bg-blue-100 transition-colors border border-dashed border-blue-200"}>
            + Add New Feature Group
          </button>
        </div>

        <div className={"flex flex-col gap-3 px-4 pb-4 mt-2"}>
          <div className="flex flex-col p-3 bg-gray-50 rounded-xl border border-gray-100 gap-3">
            <div className="flex items-center justify-between">
              <div className={"flex flex-col"}>
                <span className={"text-sm font-medium text-gray-900"}>Free Trial enabled</span>
                <p className={"text-[10px] text-gray-500"}>Activate free trial for this plan</p>
              </div>
              <Switch2
                className={"h-5 w-10"}
                isOn={formik.values.trial.is_active}
                handleToggle={() => formik.setFieldValue("trial.is_active", !formik.values.trial.is_active)}
              />
            </div>

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
                  placeholder="Enter number of days"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className={"flex flex-col"}>
              <span className={"text-sm font-medium text-gray-900"}>Active Status</span>
              <p className={"text-[10px] text-gray-500"}>Make this plan available for subscription</p>
            </div>
            <Switch2
              className={"h-5 w-10"}
              isOn={formik.values.is_active}
              handleToggle={() => formik.setFieldValue("is_active", !formik.values.is_active)}
            />
          </div>
        </div>
      </div>

      {/* Alerts */}
      <ApprovalAlert
        isOpen={showApproval}
        onClose={() => setShowApproval(false)}
        onConfirm={handleConfirmCreate}
        title="Create Subscription Plan"
        message={`Are you sure you want to create the "${formik.values.name}" plan?`}
        confirmBtnText={isCreating ? "Creating..." : "Yes, Create"}
        type="info"
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

CreatePlanModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default CreatePlanModal;

