"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectAndLabel from "@/components/Form/SelectAndLabel.jsx";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import { useGetIndustriesForSubscribersQuery } from "@/redux/industries/industriesApi";
import { useUpdateSubscriberOrganizationMutation } from "@/redux/organizations/organizationsApi";
import { useProcessing } from "@/app/providers";
import { useTranslation } from "react-i18next";

function EditOrganizationModal({ isOpen, onClose, organization }) {
    const { t } = useTranslation();
    const [updateOrganization] = useUpdateSubscriberOrganizationMutation();
    const { showProcessing, hideProcessing } = useProcessing();
    const { data: industriesData, isLoading: isLoadingIndustries } = useGetIndustriesForSubscribersQuery(undefined, {
        skip: !isOpen
    });

    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });

    const countries = [
        { _id: "Palestine", name: t("Palestine") },
        { _id: "Jordan", name: t("Jordan") },
        { _id: "Egypt", name: t("Egypt") },
        { _id: "UAE", name: t("UAE") },
        { _id: "Saudi Arabia", name: t("Saudi Arabia") },
    ];

    const cities = [
        { _id: "Gaza", name: t("Gaza") },
        { _id: "Ramallah", name: t("Ramallah") },
        { _id: "Jerusalem", name: t("Jerusalem") },
        { _id: "Nablus", name: t("Nablus") },
        { _id: "Hebron", name: t("Hebron") },
        { _id: "Amman", name: t("Amman") },
        { _id: "Cairo", name: t("Cairo") },
        { _id: "Dubai", name: t("Dubai") },
        { _id: "Riyadh", name: t("Riyadh") },
    ];

    const industries = industriesData?.map(ind => ({
        _id: ind._id,
        name: ind.name
    })) || [];

    const formik = useFormik({
        initialValues: {
            name: organization?.name || "",
            industry_id: organization?.industry?._id || organization?.industry_id || (typeof organization?.industry === 'string' ? organization?.industry : ""),
            email: organization?.email || "",
            phone: organization?.phone || "",
            website: organization?.website || "",
            country: organization?.country || "",
            city: organization?.city || "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required(t("Name is required")),
            industry_id: Yup.string().required(t("Industry is required")),
            email: Yup.string().email(t("Invalid email")).required(t("Email is required")),
            phone: Yup.string().required(t("Phone is required")),
            website: Yup.string().url(t("Invalid URL")),
            country: Yup.string().required(t("Country is required")),
            city: Yup.string().required(t("City is required")),
        }),
        onSubmit: async (values) => {
            setIsApprovalOpen(true);
        },
    });

    const handleConfirmUpdate = async () => {
        setIsApprovalOpen(false);
        showProcessing(t("Updating Organization..."));
        try {
            const response = await updateOrganization(formik.values).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: response?.message || t("Organization updated successfully!"),
            });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update organization. Please try again."),
            });
        } finally {
            hideProcessing();
        }
    };

    const handleApiResponseClose = () => {
        if (apiResponse.status === "success") {
            onClose();
        }
        setApiResponse({ isOpen: false, status: null, message: "" });
    };

    useEffect(() => {
        if (!isOpen) {
            setApiResponse({ isOpen: false, status: null, message: "" });
        }
    }, [isOpen]);

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isBtns={true}
                btnApplyTitle={t("Save Changes")}
                onClick={formik.handleSubmit}
                className={"lg:w-6/12 md:w-8/12 w-11/12 px-6 py-4"}
                title={t("Edit Organization")}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputAndLabel
                        title="Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter organization name"
                        error={formik.touched.name && formik.errors.name ? formik.errors.name : ""}
                        isRequired={true}
                    />
                    <SelectAndLabel
                        title="Industry"
                        name="industry_id"
                        value={formik.values.industry_id}
                        options={industries}
                        onChange={(val) => formik.setFieldValue("industry_id", val)}
                        onBlur={() => formik.setFieldTouched("industry_id", true)}
                        error={formik.touched.industry_id && formik.errors.industry_id ? formik.errors.industry_id : ""}
                        isRequired={true}
                    />
                    <InputAndLabel
                        title="Email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter email"
                        error={formik.touched.email && formik.errors.email ? formik.errors.email : ""}
                        isRequired={true}
                    />
                    <InputAndLabel
                        title="Phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter phone number"
                        error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : ""}
                        isRequired={true}
                    />
                    <InputAndLabel
                        title="Website"
                        name="website"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="https://example.com"
                        error={formik.touched.website && formik.errors.website ? formik.errors.website : ""}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <SelectAndLabel
                            title="Country"
                            name="country"
                            value={formik.values.country}
                            options={countries}
                            onChange={(val) => formik.setFieldValue("country", val)}
                            onBlur={() => formik.setFieldTouched("country", true)}
                            error={formik.touched.country && formik.errors.country ? formik.errors.country : ""}
                            isRequired={true}
                        />
                        <SelectAndLabel
                            title="City"
                            name="city"
                            value={formik.values.city}
                            options={cities}
                            onChange={(val) => formik.setFieldValue("city", val)}
                            onBlur={() => formik.setFieldTouched("city", true)}
                            error={formik.touched.city && formik.errors.city ? formik.errors.city : ""}
                            isRequired={true}
                        />
                    </div>
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={handleConfirmUpdate}
                title={t("Confirm Update")}
                message={t("Are you sure you want to update organization details?")}
                confirmBtnText={t("Confirm")}
                type="warning"
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleApiResponseClose}
            />
        </>
    );
}

EditOrganizationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    organization: PropTypes.object,
};

export default EditOrganizationModal;
