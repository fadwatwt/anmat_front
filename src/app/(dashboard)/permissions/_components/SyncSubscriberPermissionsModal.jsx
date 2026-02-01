import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import TagInput from "@/components/Form/TagInput";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import {
    useGetPermissionsQuery,
} from "@/redux/permissions/subscriberPermissionsApi";
import { useSyncSubscriberRolePermissionsMutation } from "@/redux/roles/subscriberRolesApi";

function SyncSubscriberPermissionsModal({ isOpen, onClose, roleId, roleName, currentPermissions = [] }) {
    const [updatePermissions, { isLoading }] = useSyncSubscriberRolePermissionsMutation();
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });

    const { data: permissionsResponse, isLoading: isLoadingPermissions } =
        useGetPermissionsQuery(undefined, {
            skip: !isOpen,
        });

    const permissionsSuggestions = useMemo(
        () =>
            permissionsResponse?.map((permission) => ({
                id: permission._id,
                name: permission.name,
            })) || [],
        [permissionsResponse]
    );

    const currentPermissionsTags = useMemo(() => {
        if (!currentPermissions || currentPermissions.length === 0) {
            return [];
        }

        return currentPermissions
            .map((permission) => {
                if (typeof permission === "string") {
                    const found = permissionsSuggestions.find((p) => p.id === permission);
                    return found ? { id: found.id, name: found.name } : null;
                }

                if (permission && typeof permission === "object") {
                    const permissionId = permission._id || permission.id;
                    const permissionName = permission.name;

                    if (permissionId && permissionName) {
                        return { id: permissionId, name: permissionName };
                    }
                }

                return null;
            })
            .filter(Boolean);
    }, [currentPermissions, permissionsSuggestions]);

    const handleConfirmSync = async () => {
        if (!roleId) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: "Role ID is missing. Please try again.",
            });
            setIsApprovalOpen(false);
            return;
        }

        try {
            const payload = {
                permissions_ids: formik.values.permissions_ids.map((tag) => tag.id),
            };

            const response = await updatePermissions({ id: roleId, ...payload }).unwrap();
            const status = response?.status || "success";

            setApiResponse({
                isOpen: true,
                status,
                message: response?.message || "Permissions synced successfully!",
            });
        } catch (error) {
            const errorMessage =
                error?.data?.message ||
                error?.data?.error ||
                error?.error ||
                "Failed to sync permissions. Please try again.";

            setApiResponse({
                isOpen: true,
                status: "error",
                message: errorMessage,
            });
        } finally {
            setIsApprovalOpen(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            permissions_ids: currentPermissionsTags,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            permissions_ids: Yup.array().min(0),
        }),
        onSubmit: async (values) => {
            if (!roleId) {
                setApiResponse({
                    isOpen: true,
                    status: "error",
                    message: "Role ID is missing. Please try again.",
                });
                return;
            }
            setIsApprovalOpen(true);
        },
    });

    useEffect(() => {
        if (!isOpen) {
            formik.resetForm();
            setApiResponse({ isOpen: false, status: null, message: "" });
        }
    }, [isOpen]);

    const handlePermissionsChange = (tags) => {
        formik.setFieldValue("permissions_ids", tags);
    };

    const handleApiResponseClose = () => {
        if (apiResponse.status === "success") {
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
                btnApplyTitle={isLoading ? "Syncing..." : "Sync Permissions"}
                onClick={formik.handleSubmit}
                className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"}
                title={`Sync Permissions - ${roleName || "Role"}`}
            >
                <div className="px-1">
                    <div className="flex flex-col gap-4">
                        <TagInput
                            title="Permissions"
                            isRequired={false}
                            suggestions={permissionsSuggestions}
                            placeholder={
                                isLoadingPermissions
                                    ? "Loading permissions..."
                                    : "Select Permissions..."
                            }
                            value={formik.values.permissions_ids}
                            onChange={handlePermissionsChange}
                        />
                    </div>
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={handleConfirmSync}
                title="Confirm Sync Permissions"
                message={`Are you sure you want to sync permissions for the ${roleName} role?`}
                confirmBtnText={isLoading ? "Syncing..." : "Confirm"}
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

SyncSubscriberPermissionsModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    roleId: PropTypes.string,
    roleName: PropTypes.string,
    currentPermissions: PropTypes.array,
};

export default SyncSubscriberPermissionsModal;
