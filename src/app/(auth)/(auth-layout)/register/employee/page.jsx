"use client";
import { useFormik } from "formik";
import InputAndLabel from "@/components/Form/InputAndLabel";
import * as Yup from 'yup';
import { useTranslation } from "react-i18next";
import { LiaUser } from "react-icons/lia";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRegisterEmployeeAccountMutation } from "@/redux/auth/authAPI";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

const EmployeeRegistration = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [registerEmployee, { isLoading }] = useRegisterEmployeeAccountMutation();
    const [error, setError] = useState("");
    const [invitationToken, setInvitationToken] = useState("");
    const [organizationId, setOrganizationId] = useState("");
    const [isCheckingToken, setIsCheckingToken] = useState(true);

    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        status: "",
        message: ""
    });

    useEffect(() => {
        // Extract token and org from hash, handling potential multiple '#' delimiters
        const hash = window.location.hash.substring(1); // remove first #
        const paramsArray = hash.split(/[&#]/);

        let token = "";
        let orgId = "";

        paramsArray.forEach(p => {
            const [key, ...val] = p.split('=');
            if (key === 'reg_emp_t') token = val.join('=');
            if (key === 'org') orgId = val.join('=');
        });

        if (token) {
            setInvitationToken(token);
            setOrganizationId(orgId || "");
            setIsCheckingToken(false);
        } else {
            router.push('/sign-in');
        }
    }, [router]);

    const formik = useFormik({
        initialValues: {
            email: "",
            name: "",
            phone: "",
            password: "",
            password_confirmation: ""
        },
        validationSchema: Yup.object({
            email: Yup.string().email(t("Invalid email address")).required(t("Required")),
            name: Yup.string().required(t("Required")),
            phone: Yup.string().required(t("Required")),
            password: Yup.string().min(8, t("Password must be at least 8 characters")).required(t("Required")),
            password_confirmation: Yup.string()
                .oneOf([Yup.ref('password'), null], t("Passwords must match"))
                .required(t("Required"))
        }),
        onSubmit: async (values) => {
            setError("");
            try {
                const payload = {
                    ...values,
                    invitation_token: invitationToken,
                    organization_id: organizationId
                };

                const response = await registerEmployee(payload).unwrap();
                setAlertConfig({
                    isOpen: true,
                    status: "success",
                    message: response?.message || t("Account registered successfully!")
                });
            } catch (err) {
                setError(err.data?.message || err.message || t("Registration failed"));
            }
        },
    });

    const handleAlertClose = () => {
        setAlertConfig(prev => ({ ...prev, isOpen: false }));
        if (alertConfig.status === "success") {
            router.push("/sign-in");
        }
    };

    if (isCheckingToken) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full flex flex-col items-center justify-start gap-8 overflow-hidden overflow-y-auto px-2 py-6">
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
                            <LiaUser size={30} className="text-primary-500" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <span className="text-2xl font-semibold text-gray-900">
                            {t("Set up your account")}
                        </span>
                        <span className="text-sm text-gray-500">
                            {t("Enter your details to sign up as an employee")}
                        </span>
                    </div>
                </div>

                {/* Form */}
                <form id="employee-registration-form" onSubmit={formik.handleSubmit} className="flex flex-col w-full gap-5 max-w-md">
                    {error && (
                        <div className="w-full p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    <InputAndLabel
                        title={t("Full Name")}
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={t("Enter Full Name...")}
                        error={formik.touched.name && formik.errors.name}
                        isRequired={true}
                    />

                    <InputAndLabel
                        title={t("Email Address")}
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={t("Enter Email Address...")}
                        error={formik.touched.email && formik.errors.email}
                        isRequired={true}
                    />

                    <InputAndLabel
                        title={t("Phone Number")}
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={t("Enter Phone Number...")}
                        error={formik.touched.phone && formik.errors.phone}
                        isRequired={true}
                        type={"text"}
                    />

                    <InputAndLabel
                        title={t("Password")}
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="********"
                        error={formik.touched.password && formik.errors.password}
                        isRequired={true}
                    />

                    <InputAndLabel
                        title={t("Confirm Password")}
                        name="password_confirmation"
                        type="password"
                        value={formik.values.password_confirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="********"
                        error={formik.touched.password_confirmation && formik.errors.password_confirmation}
                        isRequired={true}
                    />

                    {/* Buttons */}
                    <div className="flex flex-col items-center justify-center mt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary-500 text-white font-medium text-md w-full py-3 rounded-xl cursor-pointer
                            hover:bg-primary-600 transition-colors shadow-md disabled:bg-primary-300 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {t("Processing...")}
                                </>
                            ) : t("Register Account")}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EmployeeRegistration;