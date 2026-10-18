import { ImSpinner2 } from "react-icons/im";
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TagInput from "@/components/Form/TagInput";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import {
    useGetPermissionsQuery,
} from "@/redux/permissions/subscriberPermissionsApi";
import { useCreateSubscriberRoleMutation } from "@/redux/roles/subscriberRolesApi";
import { useProcessing } from "@/app/providers";
import { useTranslation } from "react-i18next";
import { getPermissionLabel } from "@/config/permissionTranslations";
import { selectSocialMediaGrants } from "@/redux/auth/authSlice";

// Subscribers cannot manage social media unless an admin has granted them the
// platform. Twitter is the only implemented platform, so when it is not
// granted we hide social_media_* permissions from the role permission picker.
const hasSocialMediaAccess = (grants) =>
    Array.isArray(grants) && grants.includes("twitter");

const isSocialMediaPermission = (name) =>
    String(name || "").startsWith("social_media_") ||
    String(name || "").startsWith("twitter_");

function AddSubscriberRoleModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const socialMediaGrants = useSelector(selectSocialMediaGrants);
    const [createRole, { isLoading }] = useCreateSubscriberRoleMutation();
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });
    const { showProcessing, hideProcessing } = useProcessing();

    const { data: permissionsResponse, isLoading: isLoadingPermissions } =
        useGetPermissionsQuery(undefined, {
            skip: !isOpen,
        });

    const socialAllowed = hasSocialMediaAccess(socialMediaGrants);

    const permissionsSuggestions =
        permissionsResponse
            ?.filter(
                (permission) =>
                    socialAllowed ||
                    !isSocialMediaPermission(permission.name),
            )
            .map((permission) => ({
                id: permission._id,
                name: permission.name,
            })) || [];

    const formik = useFormik({
        initialValues: {
            name: "",
            permissions_ids: [],
        },
        validationSchema: Yup.object({
            name: Yup.string().required(t("Role name is required")),
            permissions_ids: Yup.array().min(0),
        }),
        onSubmit: async (values) => {
            setIsApprovalOpen(true);
        },
    });

    const handleConfirmCreate = async () => {
        setIsApprovalOpen(false);
        showProcessing("Creating Role...");
        try {
            const payload = {
                name: formik.values.name,
                permissions_ids: formik.values.permissions_ids.map((tag) => tag.id),
            };

            const response = await createRole(payload).unwrap();
            const status = response?.status || "success";

            setApiResponse({
                isOpen: true,
                status,
                message: response?.message || "Role created successfully!",
            });
        } catch (error) {
            const errorMessage =
                error?.data?.message ||
                error?.data?.error ||
                error?.error ||
                "Failed to create role. Please try again.";

            setApiResponse({
                isOpen: true,
                status: "error",
                message: errorMessage,
            });
        } finally {
            hideProcessing();
        }
    };

    useEffect(() => {
        if (!isOpen) {
            formik.resetForm();
            setApiResponse({ isOpen: false, status: null, message: "" });
        }
    }, [isOpen]);

    const handlePermissionsChange = (tags) => {
        formik.setFieldValue("permissions_ids", tags);
    };

    const allSelected =
        permissionsSuggestions.length > 0 &&
        permissionsSuggestions.every((permission) =>
            formik.values.permissions_ids.some((p) => p.id === permission.id)
        );

    const someSelected = permissionsSuggestions.some((permission) =>
        formik.values.permissions_ids.some((p) => p.id === permission.id)
    );

    const selectAllRef = useRef(null);

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someSelected && !allSelected;
        }
    }, [someSelected, allSelected]);

    const handleSelectAllChange = (e) => {
        if (e.target.checked) {
            const existing = formik.values.permissions_ids;
            const merged = [...existing];
            permissionsSuggestions.forEach((permission) => {
                if (!merged.some((p) => p.id === permission.id)) {
                    merged.push(permission);
                }
            });
            handlePermissionsChange(merged);
        } else {
            handlePermissionsChange([]);
        }
    };

    const handleApiResponseClose = () => {
        if (apiResponse.status === "success") {
            formik.resetForm();
            onClose();
        }
        setApiResponse({ isOpen: false, status: null, message: "" });
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isBtns={true}
                btnApplyTitle={isLoading ? t("Creating...") : t("Save")}
                onClick={formik.handleSubmit}
                className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"}
                title={t("Add Role")}
            >
                <div className="px-1">
                    <div className="flex flex-col gap-4">
                        <InputAndLabel
                            title={t("Role Name")}
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder={t("Enter Role Name...")}
                            error={
                                formik.touched.name && formik.errors.name
                                    ? formik.errors.name
                                    : ""
                            }
                            isRequired={true}
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-cell-secondary">{t("Permissions")}</label>
                            {isLoadingPermissions ? (
                                <p className="text-sm text-cell-secondary"> <div className="flex items-center justify-center w-full p-4"><ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} /></div> </p>
                            ) : (
                                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto border border-status-border rounded-md p-3">
                                    <label className="flex items-center gap-2 cursor-pointer border-b border-status-border pb-2 mb-1">
                                        <input
                                            ref={selectAllRef}
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={handleSelectAllChange}
                                            className="w-4 h-4 text-primary-base bg-status-bg border-status-border rounded focus:ring-primary-base dark:focus:ring-primary-base focus:ring-2 checkbox-custom"
                                        />
                                        <span className="text-sm font-semibold text-cell-secondary">{t("Select All")}</span>
                                    </label>
                                    {permissionsSuggestions.map((permission) => {
                                        const isChecked = formik.values.permissions_ids.some(
                                            (p) => p.id === permission.id
                                        );
                                        return (
                                            <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            handlePermissionsChange([...formik.values.permissions_ids, permission]);
                                                        } else {
                                                            handlePermissionsChange(
                                                                formik.values.permissions_ids.filter((p) => p.id !== permission.id)
                                                            );
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-primary-base bg-status-bg border-status-border rounded focus:ring-primary-base dark:focus:ring-primary-base focus:ring-2 checkbox-custom"
                                                />
                                                <span className="text-sm text-cell-secondary">
                                                    {getPermissionLabel(permission.name, permission)}
                                                </span>
                                            </label>
                                        );
                                    })}
                                    {permissionsSuggestions.length === 0 && (
                                        <p className="text-sm text-cell-secondary text-center">{t("No permissions available.")}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={handleConfirmCreate}
                title={t("Confirm Create Role")}
                message={t("Are you sure you want to create the ROLE_NAME role?", { ROLE_NAME: formik.values.name })}
                confirmBtnText={isLoading ? t("Creating...") : t("Confirm")}
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

AddSubscriberRoleModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
};

export default AddSubscriberRoleModal;
