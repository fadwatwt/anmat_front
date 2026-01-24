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

AddRoleModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddRoleModal;
