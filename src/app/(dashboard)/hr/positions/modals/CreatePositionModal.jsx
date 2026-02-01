import { useState } from "react";
import { useFormik } from "formik";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import PropTypes from "prop-types";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert.jsx";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert.jsx";

import { useCreatePositionMutation } from "@/redux/positions/positionsApi";

const validationSchema = Yup.object({
    title: Yup.string().required("required"),
    description: Yup.string(),
});

function CreatePositionModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [createPosition, { isLoading }] = useCreatePositionMutation();
    const [showConfirmAlert, setShowConfirmAlert] = useState(false);
    const [responseAlert, setResponseAlert] = useState({
        isOpen: false,
        status: "",
        message: "",
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setShowConfirmAlert(true);
        },
    });

    const handleConfirm = async () => {
        try {
            const response = await createPosition(formik.values).unwrap();
            setResponseAlert({
                isOpen: true,
                status: "success",
                message: t("Position created successfully!"),
            });
        } catch (error) {
            setResponseAlert({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to create position. Please try again."),
            });
            console.error("Failed to create position:", error);
        }
    };

    const handleResponseClose = () => {
        const isSuccess = responseAlert.status === "success";
        setResponseAlert({ ...responseAlert, isOpen: false });
        if (isSuccess) {
            formik.resetForm();
            onClose();
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isBtns={true}
                btnApplyTitle={t("Save")}
                btnCancelTitle={t("Cancel")}
                className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"}
                title={t("Create a Position")}
                onClick={formik.handleSubmit}
            >
                <div className="px-1">
                    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
                        <InputAndLabel
                            title={t("Position Name")}
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder={t("Enter position name")}
                            isRequired={true}
                            disabled={isLoading}
                            error={
                                formik.touched.title && formik.errors.title
                                    ? t(formik.errors.title)
                                    : ""
                            }
                        />
                        <TextAreaWithLabel
                            title={t("Description")}
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder={t("Enter Description")}
                            rows={4}
                            disabled={isLoading}
                            error={
                                formik.touched.description && formik.errors.description
                                    ? t(formik.errors.description)
                                    : ""
                            }
                        />
                    </form>
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={showConfirmAlert}
                onClose={() => setShowConfirmAlert(false)}
                onConfirm={handleConfirm}
                title={t("Confirm Creation")}
                message={t("Are you sure you want to create the position \"{{title}}\"?", { title: formik.values.title })}
                confirmBtnText={t("Yes, Create")}
                cancelBtnText={t("Cancel")}
                type="warning"
            />

            <ApiResponseAlert
                isOpen={responseAlert.isOpen}
                status={responseAlert.status}
                message={responseAlert.message}
                onClose={handleResponseClose}
            />
        </>
    );
}

CreatePositionModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
};

export default CreatePositionModal;
