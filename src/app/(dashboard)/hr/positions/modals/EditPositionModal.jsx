import { useState, useEffect } from "react";
import { useFormik } from "formik";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import PropTypes from "prop-types";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert.jsx";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert.jsx";

import { useUpdatePositionMutation } from "@/redux/positions/positionsApi";

const validationSchema = Yup.object({
    title: Yup.string().required("required"),
    description: Yup.string(),
});

function EditPositionModal({ isOpen, onClose, position }) {
    const { t } = useTranslation();
    const [updatePosition, { isLoading }] = useUpdatePositionMutation();
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

    useEffect(() => {
        if (position && isOpen) {
            formik.setValues({
                title: position.title || "",
                description: position.description || "",
            });
        }
    }, [position, isOpen]);

    const handleConfirm = async () => {
        try {
            await updatePosition({ id: position._id, ...formik.values }).unwrap();
            setResponseAlert({
                isOpen: true,
                status: "success",
                message: t("Position updated successfully!"),
            });
        } catch (error) {
            setResponseAlert({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update position. Please try again."),
            });
            console.error("Failed to update position:", error);
        } finally {
            setShowConfirmAlert(false);
        }
    };

    const handleResponseClose = () => {
        const isSuccess = responseAlert.status === "success";
        setResponseAlert({ ...responseAlert, isOpen: false });
        if (isSuccess) {
            onClose();
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isBtns={true}
                btnApplyTitle={t("Update")}
                btnCancelTitle={t("Cancel")}
                className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"}
                title={t("Edit Position")}
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
                title={t("Confirm Update")}
                message={t("Are you sure you want to update the position \"{{title}}\"?", { title: position?.title })}
                confirmBtnText={t("Yes, Update")}
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

EditPositionModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    position: PropTypes.object,
};

export default EditPositionModal;
