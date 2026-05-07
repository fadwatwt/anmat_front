import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectAndLabel from "@/components/Form/SelectAndLabel.jsx";
import { useCreateSupportTicketMutation } from "@/redux/support-tickets/supportTicketsApi";
import { useTranslation } from "react-i18next";
import { useState } from "react";

function CreateTicketModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [createTicket, { isLoading }] = useCreateSupportTicketMutation();
    const [apiError, setApiError] = useState("");

    const priorityOptions = [
        { _id: "low", name: t("Low") },
        { _id: "medium", name: t("Medium") },
        { _id: "high", name: t("High") },
        { _id: "urgent", name: t("Urgent") }
    ];

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            priority: "low"
        },
        validationSchema: Yup.object({
            title: Yup.string().required(t("Title is required")).max(255),
            description: Yup.string().required(t("Description is required")),
            priority: Yup.string().required()
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setApiError("");
                await createTicket(values).unwrap();
                resetForm();
                onClose();
            } catch (error) {
                setApiError(error?.data?.message || t("Failed to create ticket"));
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleClose = () => {
        formik.resetForm();
        setApiError("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            isBtns={true}
            btnApplyTitle={isLoading || formik.isSubmitting ? t("Creating...") : t("Create Ticket")}
            onClick={formik.handleSubmit}
            className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"}
            title={t("Open Support Ticket")}
            disableSubmit={isLoading || formik.isSubmitting || !formik.isValid}
        >
            <div className="px-1 flex flex-col gap-4">
                {apiError && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{apiError}</div>
                )}

                <InputAndLabel
                    title={t("Title")}
                    name="title"
                    placeholder={t("Brief description of the issue")}
                    {...formik.getFieldProps("title")}
                    error={formik.touched.title && formik.errors.title}
                />

                <SelectAndLabel
                    title={t("Priority")}
                    name="priority"
                    options={priorityOptions}
                    value={formik.values.priority}
                    onChange={(val) => formik.setFieldValue("priority", val)}
                    error={formik.touched.priority && formik.errors.priority}
                    onBlur={() => {}}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-cell-primary">{t("Description")}</label>
                    <textarea
                        className="w-full bg-surface border border-status-border rounded-xl p-3 outline-none focus:border-primary-500 min-h-[120px] text-sm"
                        placeholder={t("Provide details about the issue or request")}
                        {...formik.getFieldProps("description")}
                    />
                    {formik.touched.description && formik.errors.description && (
                        <p className="text-xs text-red-500">{formik.errors.description}</p>
                    )}
                </div>
            </div>
        </Modal>
    );
}

CreateTicketModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CreateTicketModal;
