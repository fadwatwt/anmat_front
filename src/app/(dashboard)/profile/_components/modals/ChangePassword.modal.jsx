import Modal from "@/components/Modal/Modal.jsx";
import PasswordInput from "@/components/Form/PasswordInput.jsx";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useUpdatePasswordMutation, useAdminUpdatePasswordMutation } from "@/redux/auth/authAPI";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import { useSelector } from "react-redux";
import { selectUserType } from "@/redux/auth/authSlice";

function ChangePasswordModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const userType = useSelector(selectUserType);

    const [updatePassword, { isLoading: isUserLoading }] = useUpdatePasswordMutation();
    const [adminUpdatePassword, { isLoading: isAdminLoading }] = useAdminUpdatePasswordMutation();

    const isLoading = isUserLoading || isAdminLoading;
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
    const [showApproval, setShowApproval] = useState(false);

    const formik = useFormik({
        initialValues: {
            old_password: "",
            new_password: "",
            new_password_confirmation: "",
        },
        validationSchema: Yup.object({
            old_password: Yup.string().required(t("Required")),
            new_password: Yup.string().min(8, t("Password must be at least 8 characters")).required(t("Required")),
            new_password_confirmation: Yup.string()
                .oneOf([Yup.ref('new_password'), null], t("Passwords must match"))
                .required(t("Required")),
        }),
        onSubmit: () => {
            setShowApproval(true);
        },
    });

    const handleConfirmUpdate = async () => {
        try {
            const mutation = userType === "Admin" ? adminUpdatePassword : updatePassword;
            const response = await mutation(formik.values).unwrap();

            setApiResponse({
                isOpen: true,
                status: "success",
                message: response?.message || t("Password updated successfully")
            });
            formik.resetForm();
            setShowApproval(false);
            onClose();
        } catch (error) {
            setShowApproval(false);
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update password")
            });
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isBtns={true}
                title={t("Change Password")}
                btnApplyTitle={t("Save")}
                classNameBtns={"mt-5"}
                onClick={formik.handleSubmit}
                isLoading={isLoading}
            >
                <div className={"w-full flex flex-col gap-5"}>
                    <PasswordInput
                        title={t("Current Password")}
                        placeholder={"********"}
                        name="old_password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.old_password}
                        error={formik.touched.old_password && formik.errors.old_password}
                    />
                    <PasswordInput
                        title={t("New Password")}
                        placeholder={"********"}
                        name="new_password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.new_password}
                        error={formik.touched.new_password && formik.errors.new_password}
                    />
                    <PasswordInput
                        title={t("Confirm New Password")}
                        placeholder={"********"}
                        name="new_password_confirmation"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.new_password_confirmation}
                        error={formik.touched.new_password_confirmation && formik.errors.new_password_confirmation}
                    />
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={showApproval}
                onClose={() => setShowApproval(false)}
                onConfirm={handleConfirmUpdate}
                title={t("Confirm Change")}
                message={t("Are you sure you want to change your password?")}
                confirmBtnText={t("Confirm")}
                cancelBtnText={t("Cancel")}
                type="info"
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
            />
        </>
    );
}

ChangePasswordModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ChangePasswordModal;