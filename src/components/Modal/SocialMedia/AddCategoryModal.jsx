"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useProcessing } from "@/app/providers";
import {
    useCreateAccountCategoryMutation,
    useUpdateAccountCategoryMutation,
    useGetAccountCategoriesQuery,
} from "@/redux/socialMedia/twitterAccountsApi";

/**
 * Modal for creating or editing a Twitter account category.
 * - `mode="create"` (default): blank form, calls POST /accountcategories.
 * - `mode="edit"`: pre-fills from `category` prop, calls PUT /accountcategories/:id.
 * - `onCreated(category)` fires after a successful create — useful when called
 *   from inside another modal that wants to auto-select the new category.
 */
function AddCategoryModal({ isOpen, onClose, mode = "create", category = null, onCreated }) {
    const { t } = useTranslation();
    const [createCategory, { isLoading: creating }] = useCreateAccountCategoryMutation();
    const [updateCategory, { isLoading: updating }] = useUpdateAccountCategoryMutation();
    const { data: categories = [] } = useGetAccountCategoriesQuery(undefined, { skip: !isOpen });
    const { showProcessing, hideProcessing } = useProcessing();
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: null, message: "" });

    const isEdit = mode === "edit" && category;
    const isLoading = creating || updating;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: isEdit ? category.name || "" : "",
            parent: isEdit ? category.parent?._id || category.parent || "" : "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .trim()
                .min(3, t("Name must be at least 3 characters"))
                .max(32, t("Name is too long"))
                .required(t("Name is required")),
            parent: Yup.string().nullable(),
        }),
        onSubmit: async (values) => {
            showProcessing(isEdit ? t("Updating category...") : t("Creating category..."));
            try {
                const body = { name: values.name.trim() };
                const normalizedParent = values.parent === "__none__" ? "" : values.parent;
                if (normalizedParent) body.parent = normalizedParent;
                else if (isEdit) body.parent = null;

                let response;
                if (isEdit) {
                    response = await updateCategory({ id: category._id, ...body }).unwrap();
                } else {
                    response = await createCategory(body).unwrap();
                    if (typeof onCreated === "function" && response?.data) {
                        onCreated(response.data);
                    }
                }
                setApiResponse({
                    isOpen: true,
                    status: "success",
                    message: response?.message || (isEdit ? t("Category updated") : t("Category created")),
                });
            } catch (error) {
                const message =
                    error?.data?.message ||
                    error?.data?.error ||
                    error?.error ||
                    (isEdit ? t("Failed to update category") : t("Failed to create category"));
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

    // Exclude self (and own descendants) from parent options when editing.
    const parentOptions = (() => {
        // SelectAndLabel disables value="" (placeholder), so use a sentinel id
        // that we map back to null/empty on submit. This is the only way to let
        // the user explicitly choose "no parent" in edit mode.
        const opts = [{ _id: "__none__", name: t("None (top-level)") }];
        const blocked = new Set();
        if (isEdit) {
            blocked.add(String(category._id));
            categories.forEach((c) => {
                const ancestorIds = (c.ancestors || []).map((a) => String(a._id || a));
                if (ancestorIds.includes(String(category._id))) blocked.add(String(c._id));
            });
        }
        categories.forEach((c) => {
            if (!blocked.has(String(c._id))) {
                opts.push({ _id: c._id, name: c.name });
            }
        });
        return opts;
    })();

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={isEdit ? t("Edit Category") : t("Add Category")}
                isBtns={true}
                btnApplyTitle={isLoading ? t("Saving...") : isEdit ? t("Save") : t("Add Category")}
                disabled={isLoading || !formik.isValid}
                onClick={formik.handleSubmit}
                className="lg:w-5/12 md:w-7/12 sm:w-8/12 w-11/12 p-4"
                bypassAlertHide
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                    }}
                    className="flex flex-col gap-3 px-1"
                >
                    <InputAndLabel
                        title={t("Category Name")}
                        placeholder={t("e.g. Marketing")}
                        isRequired
                        type="text"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && formik.errors.name}
                    />
                    <SelectAndLabel
                        title={t("Parent Category")}
                        name="parent"
                        value={formik.values.parent}
                        options={parentOptions}
                        onChange={(val) => formik.setFieldValue("parent", val)}
                        onBlur={() => formik.setFieldTouched("parent", true)}
                        error={formik.touched.parent && formik.errors.parent}
                        placeholder={t("None (top-level)")}
                    />
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

AddCategoryModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(["create", "edit"]),
    category: PropTypes.object,
    onCreated: PropTypes.func,
};

export default AddCategoryModal;
