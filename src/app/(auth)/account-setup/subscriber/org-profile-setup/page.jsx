"use client";
import { useFormik } from "formik";
import InputAndLabel from "@/components/Form/InputAndLabel";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import * as Yup from 'yup';
import FileUpload from "@/components/Form/FileUpload";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useCreateOrganizationForSubscriberMutation } from "@/redux/organizations/organizationsApi";
import { selectSelectedIndustryId, clearSelectedIndustryId } from "@/redux/industries/industriesSlice";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

const SetupCompanyProfile = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const [createOrg, { isLoading }] = useCreateOrganizationForSubscriberMutation();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [apiAlert, setApiAlert] = useState({ isOpen: false, status: "", message: "" });
    const industryId = useSelector(selectSelectedIndustryId);
    const user = useSelector((state) => state.auth.user);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // If we just registered successfully, don't redirect yet so the user can see the alert
        if (isRedirecting) return;

        if (user?.is_organization_registered) {
            router.push("/account-setup/subscriber/plans");
            return;
        }

        if (!industryId) {
            router.push("/account-setup/subscriber/business-selection");
        } else {
            setIsChecking(false);
        }
    }, [industryId, user, router, isRedirecting]);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            website: "",
            phone: "",
            country: "",
            city: "",
            logo: null,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required(t("Required")),
            email: Yup.string().email(t("Invalid email")).required(t("Required")),
            website: Yup.string().url(t("Invalid URL")),
            phone: Yup.string().required(t("Required")),
            country: Yup.string().required(t("Required")),
            city: Yup.string().required(t("Required")),
        }),
        onSubmit: async (values) => {
            try {
                const payload = {
                    industry_id: industryId,
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    website: values.website || "",
                    country: values.country,
                    city: values.city,
                };

                const response = await createOrg(payload).unwrap();
                setIsRedirecting(true);
                setApiAlert({
                    isOpen: true,
                    status: "success",
                    message: response?.message || t("Organization profile created successfully!")
                });

                dispatch(clearSelectedIndustryId());
            } catch (error) {
                setApiAlert({
                    isOpen: true,
                    status: "error",
                    message: error?.data?.message || t("Something went wrong")
                });
            }
        },
    });

    const isBusy = isLoading || isRedirecting;

    const handleAlertClose = () => {
        setApiAlert(prev => ({ ...prev, isOpen: false }));
        if (apiAlert.status === "success") {
            router.push("/account-setup/subscriber/plans");
        }
    };

    const countries = [
        { _id: "Palestine", name: t("Palestine") },
        { _id: "Syria", name: t("Syria") },
        { _id: "Jordan", name: t("Jordan") },
        { _id: "Lebanon", name: t("Lebanon") },
        { _id: "Egypt", name: t("Egypt") }
    ];
    const cities = [
        { _id: "Gaza", name: t("Gaza") },
        { _id: "Ramallah", name: t("Ramallah") },
        { _id: "Damascus", name: t("Damascus") },
        { _id: "Amman", name: t("Amman") },
        { _id: "Beirut", name: t("Beirut") },
        { _id: "Cairo", name: t("Cairo") }
    ];

    if (isChecking) {
        return (
            <div className="w-screen h-[50vh] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
                <span className="text-md text-gray-500">{t("Verifying selection...")}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full py-8">
            <ApiResponseAlert
                isOpen={apiAlert.isOpen}
                status={apiAlert.status}
                message={apiAlert.message}
                onClose={handleAlertClose}
            />

            <div className="flex flex-col items-start justify-start gap-8 p-8 rounded-2xl shadow-xl bg-white w-full max-w-xl">
                {/* Title */}
                <div className="flex flex-col items-center text-center justify-start gap-2 w-full">
                    <span className="text-primary-500 font-bold uppercase tracking-wider text-xs">
                        {t("Organization Profile")}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {t("Set up your company profile")}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {t("Let's get your company info set in two minutes.")}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="flex flex-col w-full gap-5">
                    <InputAndLabel
                        title="Company Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Company Name..."
                        error={formik.touched.name && formik.errors.name ? formik.errors.name : ""}
                        isRequired={true}
                        disabled={isBusy}
                    />

                    <InputAndLabel
                        title="Email Address"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Email..."
                        error={formik.touched.email && formik.errors.email ? formik.errors.email : ""}
                        isRequired={true}
                        disabled={isBusy}
                    />

                    <InputAndLabel
                        title="Phone Number"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Phone Number..."
                        error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : ""}
                        isRequired={true}
                        disabled={isBusy}
                    />

                    <InputAndLabel
                        title="Website Link"
                        name="website"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Website URL..."
                        error={formik.touched.website && formik.errors.website ? formik.errors.website : ""}
                        isRequired={false}
                        disabled={isBusy}
                    />

                    <div className="flex flex-col sm:flex-row gap-4">
                        <SelectAndLabel
                            title="Country"
                            name="country"
                            value={formik.values.country}
                            onChange={(val) => formik.setFieldValue("country", val)}
                            onBlur={formik.handleBlur}
                            options={countries}
                            error={formik.touched.country && formik.errors.country ? formik.errors.country : ""}
                            placeholder="Select Country..."
                            isRequired={true}
                            disabled={isBusy}
                        />

                        <SelectAndLabel
                            title="City"
                            name="city"
                            value={formik.values.city}
                            onChange={(val) => formik.setFieldValue("city", val)}
                            onBlur={formik.handleBlur}
                            options={cities}
                            error={formik.touched.city && formik.errors.city ? formik.errors.city : ""}
                            placeholder="Select City..."
                            isRequired={true}
                            disabled={isBusy}
                        />
                    </div>

                    <div className="relative flex flex-col gap-1 w-full items-start">
                        <label className="text-gray-900 dark:text-gray-200 text-sm font-medium">
                            {t('Logo (Optional)')}
                        </label>
                        <FileUpload
                            callBack={(file) => formik.setFieldValue("logo", file)}
                            disabled={isBusy}
                        />
                        {formik.values.logo && (
                            <div className="mt-2 text-xs text-primary-500 font-medium">
                                {t("Selected file:")} {formik.values.logo.name}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between gap-4 mt-4">
                        <Link
                            href="/account-setup/subscriber/business-selection"
                            className={`flex-1 text-gray-700 text-sm py-3 border border-gray-200 rounded-xl text-center transition-all
                            ${isBusy ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-50'}`}
                        >
                            {t("Return")}
                        </Link>

                        <button
                            type="submit"
                            disabled={isBusy}
                            className={`flex-[2] bg-primary-500 text-primary-50 text-md py-3 rounded-xl font-bold shadow-lg shadow-primary-200 transition-all
                            ${isBusy ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600 active:scale-95'}`}
                        >
                            {isBusy ? t("Saving...") : t("Save Company Profile")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SetupCompanyProfile;
