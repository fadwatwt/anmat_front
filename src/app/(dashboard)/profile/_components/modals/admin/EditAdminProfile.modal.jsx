import Modal from "@/components/Modal/Modal";
import PropTypes from "prop-types";
import InputAndLabel from "@/components/Form/InputAndLabel";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateAdminAccountMutation, useLazyGetUserQuery } from "@/redux/auth/authAPI";
import { selectUser, selectAuth, setUser } from "@/redux/auth/authSlice";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import { useTranslation } from "react-i18next";

function EditAdminProfileModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const { token } = useSelector(selectAuth);
    const [getUser] = useLazyGetUserQuery();
    const [updateAdminAccount, { isLoading }] = useUpdateAdminAccountMutation();

    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
    const [showApproval, setShowApproval] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: user?.name || "",
            phone: user?.phone || user?.phoneNumber || "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required(t("Required")),
            phone: Yup.string().required(t("Required")),
        }),
        onSubmit: () => {
            setShowApproval(true);
        },
    });

    const handleConfirmUpdate = async () => {
        try {
            await updateAdminAccount(formik.values).unwrap();

            // Refresh user info after successful update
            if (token) {
                const refreshedUser = await getUser(token).unwrap();
                dispatch(setUser(refreshedUser?.data || refreshedUser));
            }

            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Profile updated successfully")
            });
            setShowApproval(false);
            onClose();
        } catch (error) {
            setShowApproval(false);
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update profile")
            });
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isBtns={true}
                title={t("Edit Profile")}
                btnApplyTitle={t("Update")}
                classNameBtns={"mt-5"}
                onClick={formik.handleSubmit}
                isLoading={isLoading}
            >
                <div className={"w-full flex flex-col gap-5"}>
                    <InputAndLabel
                        title={t("Name")}
                        placeholder={t("Name")}
                        isRequired={true}
                        name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        error={formik.touched.name && formik.errors.name}
                    />
                    <InputAndLabel
                        title={t("Phone")}
                        placeholder={t("Phone")}
                        isRequired={true}
                        name="phone"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        error={formik.touched.phone && formik.errors.phone}
                    />
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={showApproval}
                onClose={() => setShowApproval(false)}
                onConfirm={handleConfirmUpdate}
                title={t("Confirm Update")}
                message={t("Are you sure you want to update your profile information?")}
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

EditAdminProfileModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
}

export default EditAdminProfileModal;