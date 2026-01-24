"use client";
import { useFormik } from "formik";
import InputAndLabel from "@/components/Form/InputAndLabel";
import * as Yup from 'yup';
import FileUpload from "@/components/Form/FileUpload";
import { useTranslation } from "react-i18next";
import { LiaUser } from "react-icons/lia";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCompleteSubscriberProfileMutation } from "@/redux/auth/authAPI";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

const SetupSubscriberProfile = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [completeProfile, { isLoading }] = useCompleteSubscriberProfileMutation();
    const [error, setError] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false);

    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        status: "",
        message: ""
    });

    const formik = useFormik({
        initialValues: {
            email: searchParams.get("email") || "",
            name: "",
            phone: "",
            password: "",
            password_confirmation: "",
            avatar: null
        },
        validationSchema: Yup.object({
            email: Yup.string().email(t("Invalid email address")).required(t("Required")),
            name: Yup.string().required(t("Required")),
            phone: Yup.string().nullable(),
            password: Yup.string().min(8, t("Password must be at least 8 characters")).required(t("Required")),
            password_confirmation: Yup.string()
                .oneOf([Yup.ref('password'), null], t("Passwords match"))
                .required(t("Required")),
            avatar: Yup.mixed().nullable()
        }),
        onSubmit: async (values) => {
            setError("");
            try {
                const formData = new FormData();
                formData.append("email", values.email);
                formData.append("name", values.name);
                if (values.phone) formData.append("phone", values.phone);
                formData.append("password", values.password);
                formData.append("password_confirmation", values.password_confirmation);
                if (values.avatar) {
                    formData.append("avatar", values.avatar);
                }

                const response = await completeProfile(formData).unwrap();
                setIsRedirecting(true);
                setAlertConfig({
                    isOpen: true,
                    status: "success",
                    message: response?.message || t("Account registered successfully!")
                });
            } catch (err) {
                setError(err.data?.message || err.message || "Registration failed");
                setIsRedirecting(false);
            }
        },
    });

    const handleAlertClose = () => {
        setAlertConfig(prev => ({ ...prev, isOpen: false }));
        if (alertConfig.status === "success") {
            router.push("/sign-in");
        }
    };

    const isBusy = isLoading || isRedirecting;

    return (
        <div className="w-full flex flex-col items-center justify-start gap-8 px-2 py-4">
            <ApiResponseAlert
                isOpen={alertConfig.isOpen}
                status={alertConfig.status}
                message={alertConfig.message}
                onClose={handleAlertClose}
            />

            {/* Title */}
            <div className="flex flex-col items-center gap-3">
                <div className="flex w-20 h-20 justify-center items-center rounded-full bg-[#F3F3F4]">
                    <div className="flex w-12 h-12 justify-center items-center rounded-full bg-white shadow-md">
                        <LiaUser size={30} />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-2xl text-gray-900">
                        {t("Set up your account")}
                    </span>
                    <span className="text-sm text-gray-500">
                        {t("Enter your details to complete registration")}
                    </span>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="flex flex-col w-full gap-4">
                {error && (
                    <div className="w-full p-3 text-sm text-red-500 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                <InputAndLabel
                    title="Email Address"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter email..."
                    error={formik.touched.email && formik.errors.email ? formik.errors.email : ""}
                    isRequired={true}
                    disabled={isBusy}
                />

                <InputAndLabel
                    title="Full Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Full Name..."
                    error={formik.touched.name && formik.errors.name ? formik.errors.name : ""}
                    isRequired={true}
                    disabled={isBusy}
                />

                <InputAndLabel
                    title="Phone Number (Optional)"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Phone Number..."
                    error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : ""}
                    isRequired={false}
                    type="text"
                    disabled={isBusy}
                />

                <InputAndLabel
                    title="Password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="*"
                    error={formik.touched.password && formik.errors.password ? formik.errors.password : ""}
                    isRequired={true}
                    disabled={isBusy}
                />

                <InputAndLabel
                    title="Confirm Password"
                    name="password_confirmation"
                    type="password"
                    value={formik.values.password_confirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="*"
                    error={formik.touched.password_confirmation && formik.errors.password_confirmation ? formik.errors.password_confirmation : ""}
                    isRequired={true}
                    disabled={isBusy}
                />

                <div className={`relative flex flex-col gap-1 w-full items-start`}>
                    <label className="text-gray-900 dark:text-gray-200 text-sm">
                        {t('Avatar (Optional)')}
                    </label>
                    <FileUpload
                        callBack={(file) => formik.setFieldValue("avatar", file)}
                        disabled={isBusy}
                    />
                    {formik.values.avatar && (
                        <div className="mt-4 flex flex-col items-center gap-2">
                            <span className="text-xs text-gray-500">{t("Avatar Preview:")}</span>
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-100 shadow-sm relative group">
                                <img
                                    src={URL.createObjectURL(formik.values.avatar)}
                                    alt="Avatar Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => formik.setFieldValue("avatar", null)}
                                        className="text-white bg-red-500 rounded-full p-1 hover:bg-red-600 shadow-md"
                                        title={t("Remove")}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col items-center justify-center mt-6">
                    <button
                        type="submit"
                        disabled={isBusy}
                        className="bg-primary-500 text-primary-50 text-md w-full md:w-64 py-3 rounded-xl cursor-pointer
                        hover:bg-primary-600 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isBusy ? t("Processing...") : t("Complete Registration")}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SetupSubscriberProfile;
