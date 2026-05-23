"use client"
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import { useState } from "react";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import BtnAddOutline from "@/components/Form/BtnAddOutline";
import SwitchWithLabel from "@/components/Form/SwitchWithLabel";
import { FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import {
    useCreateTokenPackageMutation,
    useUpdateTokenPackageMutation,
} from "@/redux/plans/tokenPackagesApi";

function TokenPackageModal({ isOpen, onClose, editPackage = null }) {
    const { t } = useTranslation();
    const isEditMode = !!editPackage;
    const [createPackage, { isLoading: isCreating }] = useCreateTokenPackageMutation();
    const [updatePackage, { isLoading: isUpdating }] = useUpdateTokenPackageMutation();

    const [showApproval, setShowApproval] = useState(false);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: editPackage?.name || "",
            description: editPackage?.description || "",
            price_cents: editPackage?.price_cents || "",
            price_label: editPackage?.price_label || "",
            tokens: editPackage?.tokens || "",
            features: editPackage?.features?.length > 0 ? editPackage.features : [""],
            is_active: editPackage?.is_active !== undefined ? editPackage.is_active : true,
            sort_order: editPackage?.sort_order || 0,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            description: Yup.string(),
            price_cents: Yup.number().min(1, "Must be at least 1").required("Required"),
            price_label: Yup.string().required("Required"),
            tokens: Yup.number().min(1, "Must be at least 1").required("Required"),
            features: Yup.array().of(Yup.string()),
            is_active: Yup.boolean().required(),
            sort_order: Yup.number().min(0),
        }),
        onSubmit: () => {
            setShowApproval(true);
        },
    });

    const handleConfirm = async () => {
        try {
            const payload = {
                ...formik.values,
                features: formik.values.features.filter(f => f.trim() !== ""),
                price_cents: Number(formik.values.price_cents),
                tokens: Number(formik.values.tokens),
                sort_order: Number(formik.values.sort_order),
            };

            if (isEditMode) {
                await updatePackage({ id: editPackage._id, ...payload }).unwrap();
                setApiResponse({ isOpen: true, status: "success", message: t("Token package updated successfully!") });
            } else {
                await createPackage(payload).unwrap();
                setApiResponse({ isOpen: true, status: "success", message: t("Token package created successfully!") });
            }
            formik.resetForm();
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed. Please try again."),
            });
        }
    };

    const handleCloseResponse = () => {
        setApiResponse(prev => ({ ...prev, isOpen: false }));
        if (apiResponse.status === "success") {
            onClose();
        }
    };

    const addFeature = () => {
        formik.setFieldValue("features", [...formik.values.features, ""]);
    };

    const removeFeature = (index) => {
        const newFeatures = [...formik.values.features];
        newFeatures.splice(index, 1);
        formik.setFieldValue("features", newFeatures);
    };

    // Auto-generate price_label from price_cents
    const handlePriceCentsChange = (e) => {
        const val = e.target.value;
        formik.setFieldValue("price_cents", val);
        if (val) {
            const dollars = (Number(val) / 100).toFixed(val % 100 === 0 ? 0 : 2);
            formik.setFieldValue("price_label", `$${dollars}`);
        }
    };

    const isSubmitting = isCreating || isUpdating;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            btnApplyTitle={isSubmitting ? t("Saving...") : t("Save")}
            onClick={() => formik.submitForm()}
            className={"lg:w-5/12 md:w-8/12 sm:w-10/12 w-11/12"}
            title={isEditMode ? t("Edit AI Token Package") : t("Add AI Token Package")}
        >
            <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Basic Info */}
                <div className={"px-4 grid grid-cols-1 gap-4"}>
                    <InputAndLabel
                        title="Package Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. Starter Pack"
                        error={formik.touched.name && formik.errors.name}
                        isRequired={true}
                    />
                    <InputAndLabel
                        title="Description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Describe this package..."
                    />
                </div>

                {/* Pricing & Tokens */}
                <div className={"w-full py-[6px] bg-weak-100 text-start text-xs dark:bg-weak-800 text-weak-800 dark:text-weak-100 px-4"}>
                    {t("Pricing & Tokens")}:
                </div>
                <div className={"px-4 grid grid-cols-2 gap-4"}>
                    <InputAndLabel
                        title="Price (cents)"
                        name="price_cents"
                        type="number"
                        value={formik.values.price_cents}
                        onChange={handlePriceCentsChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. 500 = $5"
                        error={formik.touched.price_cents && formik.errors.price_cents}
                        isRequired={true}
                    />
                    <InputAndLabel
                        title="Price Label"
                        name="price_label"
                        value={formik.values.price_label}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. $5"
                        error={formik.touched.price_label && formik.errors.price_label}
                        isRequired={true}
                    />
                </div>
                <div className={"px-4 grid grid-cols-2 gap-4"}>
                    <InputAndLabel
                        title="Number of Tokens"
                        name="tokens"
                        type="number"
                        value={formik.values.tokens}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. 10000"
                        error={formik.touched.tokens && formik.errors.tokens}
                        isRequired={true}
                    />
                    <InputAndLabel
                        title="Sort Order"
                        name="sort_order"
                        type="number"
                        value={formik.values.sort_order}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="0"
                    />
                </div>

                {/* Features */}
                <div className={"w-full py-[6px] bg-weak-100 text-start text-xs dark:bg-weak-800 text-weak-800 dark:text-weak-100 px-4"}>
                    {t("Features")}:
                </div>
                <div className="px-4 flex flex-col gap-3">
                    {formik.values.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="flex-1">
                                <InputAndLabel
                                    name={`features.${index}`}
                                    value={feature}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={`Feature #${index + 1}`}
                                />
                            </div>
                            {formik.values.features.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors mt-1"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    <BtnAddOutline title="Add Feature" onClick={addFeature} />
                </div>

                {/* Status */}
                <div className={"flex flex-col gap-3 px-4 pb-4 mt-2"}>
                    <SwitchWithLabel
                        title="Active Status"
                        description="Make this package available for purchase"
                        isOn={formik.values.is_active}
                        handleToggle={() => formik.setFieldValue("is_active", !formik.values.is_active)}
                    />
                </div>
            </div>

            {/* Alerts */}
            <ApprovalAlert
                isOpen={showApproval}
                onClose={() => setShowApproval(false)}
                onConfirm={handleConfirm}
                title={isEditMode ? t("Update Token Package") : t("Create Token Package")}
                message={`${isEditMode ? t("Are you sure you want to update") : t("Are you sure you want to create")} "${formik.values.name}"?`}
                confirmBtnText={isSubmitting ? t("Saving...") : t("Yes, Confirm")}
                type="info"
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleCloseResponse}
            />
        </Modal>
    );
}

TokenPackageModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    editPackage: PropTypes.object,
};

export default TokenPackageModal;
