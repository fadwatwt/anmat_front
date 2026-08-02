"use client"
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import {
  useGetIndustryTranslationsQuery,
  useCreateIndustryTranslationMutation,
  useUpdateIndustryTranslationMutation,
  useDeleteIndustryTranslationMutation,
} from "@/redux/industries/industryTranslationsApi.js";
import { useTranslation } from "react-i18next";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { RiDeleteBin7Line } from "@remixicon/react";

const LOCALES = [
  { _id: "ar", name: "العربية" },
  { _id: "en", name: "English" },
];

function IndustriesTranslationsModal({ isOpen, onClose, industry }) {
  const { t } = useTranslation();
  const [selectedLocale, setSelectedLocale] = useState("ar");
  const [apiResponse, setApiResponse] = useState({
    isOpen: false,
    status: "",
    message: "",
  });

  const { data: translations, refetch: refetchTranslations } =
    useGetIndustryTranslationsQuery(industry?._id, { skip: !industry?._id });

  const [createTranslation, { isLoading: isCreating }] =
    useCreateIndustryTranslationMutation();
  const [updateTranslation, { isLoading: isUpdating }] =
    useUpdateIndustryTranslationMutation();
  const [deleteTranslation, { isLoading: isDeleting }] =
    useDeleteIndustryTranslationMutation();

  const existingTranslation = translations?.find(
    (tr) => tr.locale === selectedLocale
  );

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (existingTranslation) {
      setFormData({
        name: existingTranslation.name || "",
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [existingTranslation, industry, selectedLocale]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (existingTranslation) {
        await updateTranslation({
          industryId: industry._id,
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
          industryId: industry._id,
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
        industryId: industry._id,
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
        title={`${t("Translations")} - ${industry?.name || ""}`}
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
              title={t("Industry Name")}
              name="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={t("Enter translated industry name")}
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

IndustriesTranslationsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  industry: PropTypes.object,
};

export default IndustriesTranslationsModal;
