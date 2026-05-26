"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useProcessing } from "@/app/providers";
import {
    useUpdateTwitterAccountMutation,
    useGetAccountCategoriesQuery,
} from "@/redux/socialMedia/twitterAccountsApi";
import { useTranslation } from "react-i18next";

function EditTwitterAccountModal({ isOpen, onClose, account }) {
    const { t } = useTranslation();
    const [updateAccount, { isLoading }] = useUpdateTwitterAccountMutation();
    const { data: categories = [], isLoading: catsLoading } = useGetAccountCategoriesQuery(
        undefined,
        { skip: !isOpen },
    );
    const { showProcessing, hideProcessing } = useProcessing();
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: account?.AccountDataInfo1?.FullName || account?.name || "",
            description: account?.Description || "",
            location: account?.AccountBasicInfo?.Location || "",
            Category: account?.Category?._id || account?.Category || "",
            SecretKey: account?.AccountBasicInfo?.SecretKey || "",
        },
        validationSchema: Yup.object({
            name: Yup.string().nullable(),
            description: Yup.string().max(500, t("Too long")).nullable(),
            location: Yup.string().nullable(),
            Category: Yup.string().nullable(),
            SecretKey: Yup.string()
                .trim()
                .matches(/^[A-Z2-7\s]*$/i, t("2FA secret key uses base32 characters (A–Z, 2–7) only"))
                .nullable(),
        }),
        onSubmit: async (values) => {
            if (!account?._id) return;
            showProcessing("Updating Twitter account...");
            try {
                const payload = {};
                if (values.name) payload.name = values.name;
                if (values.description) payload.description = values.description;
                if (values.location) payload.location = values.location;
                if (values.Category) payload.Category = values.Category;
                // Always send SecretKey (including empty) so users can clear it.
                const originalSecret = account?.AccountBasicInfo?.SecretKey || "";
                const trimmed = (values.SecretKey || "").replace(/\s+/g, "").toUpperCase();
                if (trimmed !== originalSecret) {
                    payload.SecretKey = trimmed;
                }

                const response = await updateAccount({ id: account._id, ...payload }).unwrap();
                setApiResponse({
                    isOpen: true,
                    status: "success",
                    message: response?.message || t("Account updated successfully"),
                });
            } catch (error) {
                const message =
                    error?.data?.message ||
                    error?.data?.error ||
                    error?.error ||
                    t("Failed to update account");
                setApiResponse({ isOpen: true, status: "error", message });
            } finally {
                hideProcessing();
            }
        },
    });

    useEffect(() => {
        if (!isOpen) {
            setApiResponse({ isOpen: false, status: null, message: "" });
        }
    }, [isOpen]);

    const handleAlertClose = () => {
        if (apiResponse.status === "success") onClose();
        setApiResponse({ isOpen: false, status: null, message: "" });
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={t("Edit Account — {{name}}", { name: account?.name || "" })}
                isBtns={true}
                btnApplyTitle={isLoading ? t("Saving...") : t("Save Changes")}
                disabled={isLoading}
                onClick={formik.handleSubmit}
                className="lg:w-5/12 md:w-8/12 sm:w-7/12 w-11/12 p-4"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                    }}
                    className="flex flex-col gap-3 px-1"
                >
                    <InputAndLabel
                        title={t("Display Name")}
                        placeholder={t("Full name shown on profile")}
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && formik.errors.name}
                    />
                    <InputAndLabel
                        title={t("Proxy (Location)")}
                        placeholder={t("ip:port  or  ip:port:user:pass")}
                        type="text"
                        name="location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.location && formik.errors.location}
                    />
                    <SelectAndLabel
                        title={t("Category")}
                        name="Category"
                        value={formik.values.Category}
                        options={categories.map((c) => ({ _id: c._id, name: c.name }))}
                        onChange={(val) => formik.setFieldValue("Category", val)}
                        onBlur={() => formik.setFieldTouched("Category", true)}
                        error={formik.touched.Category && formik.errors.Category}
                        placeholder={catsLoading ? t("Loading categories...") : t("Select category")}
                    />
                    <div className="flex flex-col gap-1 w-full items-start">
                        <label className="text-cell-primary text-sm font-medium">{t("2FA Secret Key")}</label>
                        <input
                            type="text"
                            name="SecretKey"
                            value={formik.values.SecretKey}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder={t("ABCD EFGH IJKL MNOP (base32 — leave empty if 2FA is disabled)")}
                            autoComplete="off"
                            spellCheck={false}
                            className="py-2 px-2 text-sm bg-status-bg border-status-border border-2 rounded-xl w-full focus:outline-none focus:border-primary-400 text-cell-primary placeholder:text-cell-secondary/50 font-mono tracking-wider"
                        />
                        <p className="text-xs text-cell-secondary">
                            {t("Required only for accounts with two-factor authentication enabled.")}
                        </p>
                        {formik.touched.SecretKey && formik.errors.SecretKey && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.SecretKey}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 w-full items-start">
                        <label className="text-cell-primary text-sm font-medium">{t("Description")}</label>
                        <textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder={t("Optional bio...")}
                            rows={3}
                            className="py-2 px-2 text-sm bg-status-bg border-status-border border-2 rounded-xl w-full focus:outline-none focus:border-primary-400 text-cell-primary placeholder:text-cell-secondary/50"
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
                        )}
                    </div>
                </form>
            </Modal>
            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleAlertClose}
            />
        </>
    );
}

EditTwitterAccountModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    account: PropTypes.object,
};

export default EditTwitterAccountModal;
