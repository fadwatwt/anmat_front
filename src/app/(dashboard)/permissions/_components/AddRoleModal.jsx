"use client"
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TagInput from "@/components/Form/TagInput";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import {
  useGetAdminPermissionsQuery,
  useCreateAdminRoleMutation,
} from "@/redux/roles/adminRolesAPI";

function AddRoleModal({ isOpen, onClose }) {
  const [createAdminRole, { isLoading }] = useCreateAdminRoleMutation();
  const [apiResponse, setApiResponse] = useState({
    isOpen: false,
    status: null,
    message: "",
  });

  const { data: permissionsResponse, isLoading: isLoadingPermissions } =
    useGetAdminPermissionsQuery(undefined, {
      skip: !isOpen, // Only fetch when modal is open
    });

  const permissionsSuggestions =
    permissionsResponse?.data?.map((permission) => ({
      id: permission._id,
      name: permission.name,
    })) || [];

  const formik = useFormik({
    initialValues: {
      name: "",
      admin_permissions_ids: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Role name is required"),
      admin_permissions_ids: Yup.array().min(
        0,
        "Select at least one permission"
      ),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          name: values.name,
          admin_permissions_ids: values.admin_permissions_ids.map(
            (tag) => tag.id
          ),
        };

        const response = await createAdminRole(payload).unwrap();
        const status = response?.status || "success";

        setApiResponse({
          isOpen: true,
          status,
          message:
            response?.message || "Role created successfully!",
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

  const handlePermissionsChange = (tags) => {
    formik.setFieldValue("admin_permissions_ids", tags);
  };

  const handleApiResponseClose = () => {
    // On success: reset form and close the AddRole modal
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
        btnApplyTitle={isLoading ? "Creating..." : "Save"}
        onClick={formik.handleSubmit}
        className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"}
        title={"Add Role"}
      >
        <div className="px-1">
          <div className="flex flex-col gap-4">
            <InputAndLabel
              title="Role Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Role Name..."
              error={
                formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : ""
              }
              isRequired={true}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Permissions</label>
              {isLoadingPermissions ? (
                <p className="text-sm text-gray-500">Loading permissions...</p>
              ) : (
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3">
                  {permissionsSuggestions.map((permission) => {
                    const isChecked = formik.values.admin_permissions_ids.some(
                      (p) => p.id === permission.id
                    );
                    return (
                      <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handlePermissionsChange([...formik.values.admin_permissions_ids, permission]);
                            } else {
                              handlePermissionsChange(
                                formik.values.admin_permissions_ids.filter((p) => p.id !== permission.id)
                              );
                            }
                          }}
                          className="w-4 h-4 text-primary-base bg-gray-100 border-gray-300 rounded focus:ring-primary-base dark:focus:ring-primary-base focus:ring-2 dark:bg-gray-700 dark:border-gray-600 checkbox-custom"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {permission.name}
                        </span>
                      </label>
                    );
                  })}
                  {permissionsSuggestions.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">No permissions available.</p>
                  )}
                </div>
              )}
            </div>
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

AddRoleModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddRoleModal;
