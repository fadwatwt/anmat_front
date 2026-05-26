"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel";
import PasswordInput from "@/components/Form/PasswordInput";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import AddCategoryModal from "@/components/Modal/SocialMedia/AddCategoryModal.jsx";
import { useProcessing } from "@/app/providers";
import { selectPermissions } from "@/redux/auth/authSlice";
import {
    useCreateTwitterAccountMutation,
    useGetAccountCategoriesQuery,
} from "@/redux/socialMedia/twitterAccountsApi";

const HAS_PERMISSION = (perms, key) =>
    Array.isArray(perms) && (perms.includes("*") || perms.includes(key));

function AddTwitterAccountModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const permissions = useSelector(selectPermissions);
    const canCreateCategory = HAS_PERMISSION(permissions, "social_media_categories.create");
    const [createAccount, { isLoading }] = useCreateTwitterAccountMutation();
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
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            Category: "",
            Description: "",
            SecretKey: "",
            location: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().trim().required(t("Account name is required")),
            email: Yup.string().email(t("Invalid email")).nullable(),
            phone: Yup.string().nullable(),
            password: Yup.string().min(6, t("Password must be at least 6 characters")).required(t("Password is required")),
            Category: Yup.string().required(t("Category is required")),
            Description: Yup.string().max(500, t("Too long")).nullable(),
            location: Yup.string().nullable(),
            SecretKey: Yup.string()
                .trim()
                .matches(/^[A-Z2-7\s]*$/i, t("2FA secret key uses base32 characters (A–Z, 2–7) only"))
                .nullable(),
        }),
        onSubmit: async (values) => {
            showProcessing(t("Creating Twitter account..."));
            try {
                const payload = {
                    name: values.name.trim(),
                    password: values.password,
                    Category: values.Category,
                };
                if (values.email) payload.email = values.email;
                if (values.phone) payload.phone = values.phone;
                if (values.Description) payload.Description = values.Description;
                if (values.location) payload.location = values.location;
                if (values.SecretKey) payload.SecretKey = values.SecretKey.replace(/\s+/g, "").toUpperCase();

                const response = await createAccount(payload).unwrap();
                setApiResponse({
                    isOpen: true,
                    status: "success",
                    message: response?.message || t("Twitter account created successfully"),
                });
            } catch (error) {
                const message =
                    error?.data?.message ||
                    error?.data?.error ||
                    error?.error ||
                    t("Failed to create Twitter account");
                setApiResponse({ isOpen: true, status: "error", message });
            } finally {
                hideProcessing();
            }
        },
    });

    useEffect(() => {
        if (!isOpen) {
            formik.resetForm();
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
                title={t("Add Twitter Account")}
                isBtns={true}
                btnApplyTitle={isLoading ? t("Saving...") : t("Add Account")}
                disabled={isLoading || !formik.isValid}
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
                        title={t("Account Name")}
                        placeholder={t("@username")}
                        isRequired
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && formik.errors.name}
                    />
                    <PasswordInput
                        title={t("Account Password")}
                        placeholder={t("Account password")}
                        isRequired
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && formik.errors.password}
                    />
                    <InputAndLabel
                        title={t("Email")}
                        placeholder={t("user@example.com")}
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && formik.errors.email}
                    />
                    <InputAndLabel
                        title={t("Phone")}
                        placeholder={t("Phone number")}
                        type="text"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && formik.errors.phone}
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
                    <div className="flex flex-col gap-1">
                        <SelectAndLabel
                            title={t("Category")}
                            name="Category"
                            isRequired
                            value={formik.values.Category}
                            options={categories.map((c) => ({ _id: c._id, name: c.name }))}
                            onChange={(val) => formik.setFieldValue("Category", val)}
                            onBlur={() => formik.setFieldTouched("Category", true)}
                            error={formik.touched.Category && formik.errors.Category}
                            placeholder={catsLoading ? t("Loading categories...") : t("Select category")}
                        />
                        {canCreateCategory && (
                            <button
                                type="button"
                                onClick={() => setIsAddCategoryOpen(true)}
                                className="self-start mt-1 inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600"
                            >
                                <FiPlus size={12} />
                                {t("Add new category")}
                            </button>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 w-full items-start">
                        <label className="text-cell-primary text-sm font-medium">
                            {t("2FA Secret Key")}
                        </label>
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
                            {t("Required only for accounts with two-factor authentication enabled. Find it on Twitter under Settings → Security → Two-factor authentication → Authentication app.")}
                        </p>
                        {formik.touched.SecretKey && formik.errors.SecretKey && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.SecretKey}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 w-full items-start">
                        <label className="text-cell-primary text-sm font-medium">{t("Description")}</label>
                        <textarea
                            name="Description"
                            value={formik.values.Description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder={t("Optional description...")}
                            rows={3}
                            className="py-2 px-2 text-sm bg-status-bg border-status-border border-2 rounded-xl w-full focus:outline-none focus:border-primary-400 text-cell-primary placeholder:text-cell-secondary/50"
                        />
                        {formik.touched.Description && formik.errors.Description && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.Description}</p>
                        )}
                    </div>
                </form>
            </Modal>
            <AddCategoryModal
                isOpen={isAddCategoryOpen}
                onClose={() => setIsAddCategoryOpen(false)}
                mode="create"
                onCreated={(newCat) => {
                    if (newCat?._id) formik.setFieldValue("Category", newCat._id);
                }}
            />
            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleAlertClose}
            />
        </>
    );
}

AddTwitterAccountModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default AddTwitterAccountModal;
