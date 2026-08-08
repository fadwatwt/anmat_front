"use client"
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import {
  useGetTokenPackageTranslationsQuery,
  useCreateTokenPackageTranslationMutation,
  useUpdateTokenPackageTranslationMutation,
  useDeleteTokenPackageTranslationMutation,
} from "@/redux/plans/tokenPackageTranslationsApi.js";
import { useTranslation } from "react-i18next";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { RiDeleteBin7Line } from "@remixicon/react";

const LOCALES = [
  { _id: "ar", name: "العربية" },
  { _id: "en", name: "English" },
];

function TokenPackagesTranslationsModal({ isOpen, onClose, pkg }) {
  const { t } = useTranslation();
  const [selectedLocale, setSelectedLocale] = useState("ar");
  const [apiResponse, setApiResponse] = useState({
    isOpen: false,
    status: "",
    message: "",
  });

  const { data: translations, refetch: refetchTranslations } =
    useGetTokenPackageTranslationsQuery(pkg?._id, { skip: !pkg?._id });

  const [createTranslation, { isLoading: isCreating }] =
    useCreateTokenPackageTranslationMutation();
  const [updateTranslation, { isLoading: isUpdating }] =
    useUpdateTokenPackageTranslationMutation();
  const [deleteTranslation, { isLoading: isDeleting }] =
    useDeleteTokenPackageTranslationMutation();

  const existingTranslation = translations?.find(
    (tr) => tr.locale === selectedLocale
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    features: [],
  });

  useEffect(() => {
    if (existingTranslation) {
      setFormData({
        name: existingTranslation.name || "",
        description: existingTranslation.description || "",
        features: existingTranslation.features || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        features: pkg?.features?.map((f) => f) || [],
      });
    }
  }, [existingTranslation, pkg, selectedLocale]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  const handleSubmit = async () => {
    try {
      if (existingTranslation) {
        await updateTranslation({
          packageId: pkg._id,
          locale: selectedLocale,
          name: formData.name,
          description: formData.description,
          features: formData.features.filter((f) => f && f.trim() !== ""),
        }).unwrap();
        setApiResponse({
          isOpen: true,
          status: "success",
          message: t("Translation updated successfully!"),
        });
      } else {
        await createTranslation({
          packageId: pkg._id,
          locale: selectedLocale,
          name: formData.name,
          description: formData.description,
          features: formData.features.filter((f) => f && f.trim() !== ""),
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
        packageId: pkg._id,
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
        title={`${t("Translations")} - ${pkg?.name || ""}`}
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
              title={t("Package Name")}
              name="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={t("Enter translated package name")}
            />
            <InputAndLabel
              title={t("Description")}
              name="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder={t("Enter translated description")}
            />
          </div>

          {formData.features.length > 0 && (
            <>
              <div className="w-full py-[6px] bg-weak-100 text-start text-xs dark:bg-weak-800 text-weak-800 dark:text-weak-100 px-4">
                {t("Features")}:
              </div>
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="px-4 py-3 border-b border-status-border last:border-0"
                >
                  <InputAndLabel
                    title={`${t("Feature")} ${index + 1}`}
                    name={`features.${index}`}
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={t("Translated feature")}
                  />
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

TokenPackagesTranslationsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pkg: PropTypes.object,
};

export default TokenPackagesTranslationsModal;
