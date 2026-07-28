"use client"
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import {
  useGetPlanTranslationsQuery,
  useCreatePlanTranslationMutation,
  useUpdatePlanTranslationMutation,
  useDeletePlanTranslationMutation,
} from "@/redux/plans/planTranslationsApi.js";
import { useTranslation } from "react-i18next";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { RiDeleteBin7Line } from "@remixicon/react";

const LOCALES = [
  { _id: "ar", name: "العربية" },
  { _id: "en", name: "English" },
];

function PlanTranslationsModal({ isOpen, onClose, plan }) {
  const { t } = useTranslation();
  const [selectedLocale, setSelectedLocale] = useState("ar");
  const [apiResponse, setApiResponse] = useState({
    isOpen: false,
    status: "",
    message: "",
  });

  const { data: translations, refetch: refetchTranslations } =
    useGetPlanTranslationsQuery(plan?._id, { skip: !plan?._id });

  const [createTranslation, { isLoading: isCreating }] =
    useCreatePlanTranslationMutation();
  const [updateTranslation, { isLoading: isUpdating }] =
    useUpdatePlanTranslationMutation();
  const [deleteTranslation, { isLoading: isDeleting }] =
    useDeletePlanTranslationMutation();

  const existingTranslation = translations?.find(
    (tr) => tr.locale === selectedLocale
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    feature_translations: [],
  });

  useEffect(() => {
    if (existingTranslation) {
      setFormData({
        name: existingTranslation.name || "",
        description: existingTranslation.description || "",
        feature_translations:
          existingTranslation.feature_translations?.map((ft) => ({
            feature_type_id: ft.plan_feature?._id || ft.feature_type_id,
            title: ft.title || "",
            details: ft.details || "",
          })) || [],
      });
    } else {
      const featureTranslations = plan?.features?.map((f) => ({
        feature_type_id: f.plan_feature?._id || f.feature_type_id,
        title: "",
        details: "",
      })) || [];
      setFormData({
        name: "",
        description: "",
        feature_translations: featureTranslations,
      });
    }
  }, [existingTranslation, plan, selectedLocale]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index, field, value) => {
    const updated = [...formData.feature_translations];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, feature_translations: updated }));
  };

  const handleSubmit = async () => {
    try {
      if (existingTranslation) {
        await updateTranslation({
          planId: plan._id,
          locale: selectedLocale,
          ...formData,
        }).unwrap();
        setApiResponse({
          isOpen: true,
          status: "success",
          message: t("Translation updated successfully!"),
        });
      } else {
        await createTranslation({
          planId: plan._id,
          locale: selectedLocale,
          ...formData,
        }).unwrap();
        setApiResponse({
          isOpen: true,
          status: "success",
          message: t("Translation created successfully!"),
        });
      }
      refetchTranslations();
    } catch (error) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message:
          error?.data?.message || t("Failed to save translation."),
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTranslation({
        planId: plan._id,
        locale: selectedLocale,
      }).unwrap();
      setApiResponse({
        isOpen: true,
        status: "success",
        message: t("Translation deleted successfully!"),
      });
      refetchTranslations();
    } catch (error) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message:
          error?.data?.message || t("Failed to delete translation."),
      });
    }
  };

  const isLoading = isCreating || isUpdating || isDeleting;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isBtns={true}
        btnApplyTitle={
          isLoading
            ? t("Saving...")
            : existingTranslation
            ? t("Update")
            : t("Create")
        }
        onClick={handleSubmit}
        disabled={isLoading}
        className={"lg:w-5/12 md:w-8/12 sm:w-10/12 w-11/12"}
        title={`${t("Translations")} - ${plan?.name || ""}`}
      >
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="px-4">
            <SelectAndLabel
              title={t("Language")}
              name="locale"
              value={selectedLocale}
              options={LOCALES.map((l) => ({
                ...l,
                name: t(l.name),
              }))}
              onChange={(val) => setSelectedLocale(val)}
            />
          </div>

          <div className="px-4 grid grid-cols-1 gap-4">
            <InputAndLabel
              title={t("Plan Name")}
              name="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={t("Enter translated plan name")}
            />
            <InputAndLabel
              title={t("Description")}
              name="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder={t("Enter translated description")}
            />
          </div>

          {formData.feature_translations.length > 0 && (
            <>
              <div className="w-full py-[6px] bg-weak-100 text-start text-xs dark:bg-weak-800 text-weak-800 dark:text-weak-100 px-4">
                {t("Feature Translations")}:
              </div>
              {formData.feature_translations.map((ft, index) => (
                <div
                  key={index}
                  className="px-4 py-3 border-b border-status-border last:border-0"
                >
                  <span className="text-xs font-semibold text-primary-600 mb-2 block">
                    {plan?.features?.[index]?.plan_feature?.title ||
                      `${t("Feature")} ${index + 1}`}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputAndLabel
                      title={t("Title")}
                      name={`feature_translations.${index}.title`}
                      value={ft.title}
                      onChange={(e) =>
                        handleFeatureChange(index, "title", e.target.value)
                      }
                      placeholder={t("Translated title")}
                    />
                    <InputAndLabel
                      title={t("Details")}
                      name={`feature_translations.${index}.details`}
                      value={ft.details}
                      onChange={(e) =>
                        handleFeatureChange(index, "details", e.target.value)
                      }
                      placeholder={t("Translated details")}
                    />
                  </div>
                </div>
              ))}
            </>
          )}

          {existingTranslation && (
            <div className="px-4">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
              >
                <RiDeleteBin7Line size={16} />
                {t("Delete Translation")}
              </button>
            </div>
          )}
        </div>
      </Modal>

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse({ isOpen: false, status: "", message: "" })}
      />
    </>
  );
}

export default PlanTranslationsModal;
