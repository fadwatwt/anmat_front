import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TagInput from "@/components/Form/TagInput";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import {
    useGetPermissionsQuery,
} from "@/redux/permissions/subscriberPermissionsApi";
import { useCreateSubscriberRoleMutation } from "@/redux/roles/subscriberRolesApi";

function AddSubscriberRoleModal({ isOpen, onClose }) {
    const [createRole, { isLoading }] = useCreateSubscriberRoleMutation();
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

    const permissionsSuggestions =
        permissionsResponse?.map((permission) => ({
            id: permission._id,
            name: permission.name,
        })) || [];

    const formik = useFormik({
        initialValues: {
            name: "",
            permissions_ids: [],
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Role name is required"),
            permissions_ids: Yup.array().min(0),
        }),
        onSubmit: async (values) => {
            setIsApprovalOpen(true);
        },
    });

    const handleConfirmCreate = async () => {
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
            setIsApprovalOpen(false);
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
                            value={formik.values.permissions_ids}
                            onChange={handlePermissionsChange}
                        />
                    </div>
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={handleConfirmCreate}
                title="Confirm Create Role"
                message={`Are you sure you want to create the ${formik.values.name} role?`}
                confirmBtnText={isLoading ? "Creating..." : "Confirm"}
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
