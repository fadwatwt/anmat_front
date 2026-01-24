"use client"
import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import TagInput from "@/components/Form/TagInput";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import {
  useGetAdminPermissionsQuery,
  useUpdateAdminRolePermissionsMutation,
} from "@/redux/roles/adminRolesAPI";

function SyncPermissionsModal({ isOpen, onClose, roleId, roleName, currentPermissions = [] }) {
  const [updatePermissions, { isLoading }] = useUpdateAdminRolePermissionsMutation();
  const [apiResponse, setApiResponse] = useState({
    isOpen: false,
    status: null,
    message: "",
  });

  const { data: permissionsResponse, isLoading: isLoadingPermissions } =
    useGetAdminPermissionsQuery(undefined, {
      skip: !isOpen, // Only fetch when modal is open
    });

  const permissionsSuggestions = useMemo(
    () =>
      permissionsResponse?.data?.map((permission) => ({
        id: permission._id,
        name: permission.name,
      })) || [],
    [permissionsResponse?.data]
  );

  // Map current permissions to TagInput format
  const currentPermissionsTags = useMemo(() => {
    if (!currentPermissions || currentPermissions.length === 0) {
      return [];
    }

    return currentPermissions
      .map((permission) => {
        // If it's a string (ID), find the permission object
        if (typeof permission === "string") {
          const found = permissionsSuggestions.find((p) => p.id === permission);
          return found ? { id: found.id, name: found.name } : null;
        }
        
        // If it's an object, check for different ID property names
        if (permission && typeof permission === "object") {
          // Handle _id (MongoDB format)
          const permissionId = permission._id || permission.id;
          const permissionName = permission.name;
          
          if (permissionId && permissionName) {
            // Check if it exists in suggestions, if not, use the permission data directly
            const found = permissionsSuggestions.find((p) => p.id === permissionId);
            return found 
              ? { id: found.id, name: found.name }
              : { id: permissionId, name: permissionName };
          }
        }
        
        return null;
      })
      .filter(Boolean);
  }, [currentPermissions, permissionsSuggestions]);

  const formik = useFormik({
    initialValues: {
      admin_permissions_ids: currentPermissionsTags,
    },
    enableReinitialize: true, // Reinitialize when currentPermissionsTags changes
    validationSchema: Yup.object({
      admin_permissions_ids: Yup.array().min(0, "Select permissions"),
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

      try {
        const payload = {
          admin_permissions_ids: values.admin_permissions_ids.map((tag) => tag.id),
        };

        const response = await updatePermissions({ id: roleId, ...payload }).unwrap();
        const status = response?.status || "success";

        setApiResponse({
          isOpen: true,
          status,
          message:
            response?.message || "Permissions synced successfully!",
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
      }
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setApiResponse({ isOpen: false, status: null, message: "" });
    }
  }, [isOpen]);

  // Update form values when modal opens and permissions are loaded
  useEffect(() => {
    if (isOpen) {
      // Wait for permissions to load before setting values
      if (permissionsSuggestions.length > 0) {
        formik.setFieldValue("admin_permissions_ids", currentPermissionsTags);
      } else if (!isLoadingPermissions) {
        // If permissions finished loading but no suggestions, set empty array
        formik.setFieldValue("admin_permissions_ids", []);
      }
    }
  }, [isOpen, currentPermissionsTags, permissionsSuggestions.length, isLoadingPermissions]);

  const handlePermissionsChange = (tags) => {
    formik.setFieldValue("admin_permissions_ids", tags);
  };

  const handleApiResponseClose = () => {
    // On success: close the modal
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
              value={formik.values.admin_permissions_ids}
              onChange={handlePermissionsChange}
            />
          </div>
        </div>
      </Modal>

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={handleApiResponseClose}
      />
    </>
  );
}

SyncPermissionsModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  roleId: PropTypes.string,
  roleName: PropTypes.string,
  currentPermissions: PropTypes.array,
};

export default SyncPermissionsModal;
