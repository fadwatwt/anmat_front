import WordTheMiddleAndLine from "@/components/Subcomponents/WordTheMiddleAndLine.jsx";
import { Form, Formik } from "formik";
import DefaultButton from "@/components/Form/DefaultButton.jsx";
import { RiCheckboxCircleFill, RiCloseCircleFill, RiLock2Line } from "@remixicon/react";
import PasswordInput from "@/components/Form/PasswordInput.jsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useUpdatePasswordMutation, useAdminUpdatePasswordMutation } from "@/redux/auth/authAPI";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import * as Yup from "yup";

function ChangePassword() {
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        number: false,
    });
    const { t } = useTranslation();
    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.type === "Admin";
    const [updatePassword, { isLoading: isUpdating }] = useUpdatePasswordMutation();
    const [adminUpdatePassword, { isLoading: isAdminUpdating }] = useAdminUpdatePasswordMutation();
    const isLoading = isUpdating || isAdminUpdating;

    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const validatePassword = (password) => {
        const strength = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
        };
        setPasswordStrength(strength);
    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const payload = {
                old_password: values.currentPassword,
                new_password: values.newPassword,
                new_password_confirmation: values.confirmPassword,
            };
            if (isAdmin) {
                await adminUpdatePassword(payload).unwrap();
            } else {
                await updatePassword(payload).unwrap();
            }
            setApiResponse({ isOpen: true, status: "success", message: t("Password updated successfully") });
            resetForm();
            setPasswordStrength({ length: false, uppercase: false, number: false });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update password"),
            });
        }
    };

    const validationSchema = Yup.object({
        currentPassword: Yup.string().required(t("Required")),
        newPassword: Yup.string()
            .min(8, t("At least 8 characters"))
            .matches(/[A-Z]/, t("At least 1 uppercase letter"))
            .matches(/\d/, t("At least 1 number"))
            .required(t("Required")),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], t("Passwords must match"))
            .required(t("Required")),
    });

    return (
        <div className="flex flex-col justify-start gap-1 items-center p-3">
            <div className="w-full flex flex-col items-start gap-2">
                <p className="text-md text-main-100 dark:text-gray-200">{t("Change Password")}</p>
                <p className="text-sm text-sub-500 dark:text-gray-400">{t("Update password for enhanced account security.")}</p>
            </div>
            <WordTheMiddleAndLine />
            <div className="w-full form">
                <Formik
                    initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
                        <Form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
                            <div className="w-full flex flex-col gap-2">
                                <PasswordInput
                                    isRequired={true}
                                    icon={<RiLock2Line />}
                                    title={t("Current Password")}
                                    name="currentPassword"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.currentPassword}
                                    error={touched.currentPassword && errors.currentPassword}
                                />
                                <PasswordInput
                                    isRequired={true}
                                    icon={<RiLock2Line />}
                                    onChange={(e) => {
                                        handleChange(e);
                                        validatePassword(e.target.value);
                                    }}
                                    onBlur={handleBlur}
                                    title={t("New Password")}
                                    name="newPassword"
                                    value={values.newPassword}
                                    error={touched.newPassword && errors.newPassword}
                                />
                                <PasswordInput
                                    isRequired={true}
                                    icon={<RiLock2Line />}
                                    title={t("Confirm New Password")}
                                    name="confirmPassword"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.confirmPassword}
                                    error={touched.confirmPassword && errors.confirmPassword}
                                />
                            </div>

                            <div className="flex flex-col items-start gap-2">
                                <div className="w-full flex justify-center items-center gap-1 h-1">
                                    <div
                                        className={`flex-1 h-full rounded-2xl ${passwordStrength.length ? "bg-red-500" : "bg-gray-200"}`}></div>
                                    <div
                                        className={`flex-1 h-full rounded-2xl ${passwordStrength.length && passwordStrength.uppercase ? "bg-yellow-500" : "bg-gray-200"}`}></div>
                                    <div
                                        className={`flex-1 h-full rounded-2xl ${passwordStrength.length && passwordStrength.uppercase && passwordStrength.number ? "bg-green-500" : "bg-gray-200"}`}></div>
                                </div>

                                <p className="text-xs text-sub-500 dark:text-gray-400">{t("Weak password. Must contain at least")}</p>

                                <div className="flex items-center gap-1">
                                    {passwordStrength.uppercase ?
                                        <RiCheckboxCircleFill size="15" className="text-green-600" /> :
                                        <RiCloseCircleFill size="15" className="text-gray-500" />
                                    }
                                    <span
                                        className={`text-xs ${passwordStrength.uppercase ? "text-green-600" : "text-gray-500 dark:text-gray-400"}`}>
                                        {t("At least 1 uppercase letter")}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    {passwordStrength.number ?
                                        <RiCheckboxCircleFill size="15" className="text-green-600" /> :
                                        <RiCloseCircleFill size="15" className="text-gray-500" />
                                    }
                                    <span
                                        className={`text-xs ${passwordStrength.number ? "text-green-600" : "text-gray-500 dark:text-gray-400"}`}>
                                        {t("At least 1 number")}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    {passwordStrength.length ?
                                        <RiCheckboxCircleFill size="15" className="text-green-600" /> :
                                        <RiCloseCircleFill size="15" className="text-gray-500" />
                                    }
                                    <span
                                        className={`text-xs ${passwordStrength.length ? "text-green-600" : "text-gray-500 dark:text-gray-400"}`}>
                                        {t("At least 8 characters")}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full flex flex-col items-start gap-4">
                                <div className="w-full justify-start flex gap-2">
                                <DefaultButton type="button" title={t("Cancel")}
                                        className="font-medium dark:text-gray-200" />
                                    <DefaultButton type="submit" disabled={isLoading}
                                        title={t("Apply Changes")}
                                        className="bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"
                                    />
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
            />
        </div>
    );
}

export default ChangePassword;
