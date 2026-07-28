"use client"
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import {
  useGetFeatureTypeTranslationsQuery,
  useCreateFeatureTypeTranslationMutation,
  useUpdateFeatureTypeTranslationMutation,
  useDeleteFeatureTypeTranslationMutation,
} from "@/redux/plans/featureTypeTranslationsApi.js";
import { useTranslation } from "react-i18next";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { RiDeleteBin7Line } from "@remixicon/react";

const LOCALES = [
  { _id: "ar", name: "العربية" },
  { _id: "en", name: "English" },
];

function FeatureTypeTranslationsModal({ isOpen, onClose, featureType }) {
  const { t } = useTranslation();
  const [selectedLocale, setSelectedLocale] = useState("ar");
  const [apiResponse, setApiResponse] = useState({
    isOpen: false,
    status: "",
    message: "",
  });

  const { data: translations, refetch: refetchTranslations } =
    useGetFeatureTypeTranslationsQuery(featureType?._id, { skip: !featureType?._id });

  const [createTranslation, { isLoading: isCreating }] =
    useCreateFeatureTypeTranslationMutation();
  const [updateTranslation, { isLoading: isUpdating }] =
    useUpdateFeatureTypeTranslationMutation();
  const [deleteTranslation, { isLoading: isDeleting }] =
    useDeleteFeatureTypeTranslationMutation();

  const existingTranslation = translations?.find(
    (tr) => tr.locale === selectedLocale
  );

  const [formData, setFormData] = useState({
    title: "",
    details: "",
  });

  useEffect(() => {
    if (existingTranslation) {
      setFormData({
        title: existingTranslation.title || "",
        details: existingTranslation.details || "",
      });
    } else {
      setFormData({
        title: "",
        details: "",
      });
    }
  }, [existingTranslation, featureType, selectedLocale]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (existingTranslation) {
        await updateTranslation({
          featureTypeId: featureType._id,
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
          featureTypeId: featureType._id,
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
        message: error?.data?.message || t("Failed to save translation."),
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTranslation({
        featureTypeId: featureType._id,
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
        message: error?.data?.message || t("Failed to delete translation."),
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
        title={`${t("Translations")} - ${featureType?.title || ""}`}
      >
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="px-4">
            <SelectAndLabel
              title={t("Language")}
              name="locale"
              value={selectedLocale}
              options={LOCALES.map((l) => ({
                ...l,
                name: l.name,
              }))}
              onChange={(val) => setSelectedLocale(val)}
            />
          </div>

          <div className="px-4 grid grid-cols-1 gap-4">
            <InputAndLabel
              title={t("Title")}
              name="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder={t("Enter translated title")}
            />
            <InputAndLabel
              title={t("Details")}
              name="details"
              value={formData.details}
              onChange={(e) => handleChange("details", e.target.value)}
              placeholder={t("Enter translated details")}
            />
          </div>

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

export default FeatureTypeTranslationsModal;
