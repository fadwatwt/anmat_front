import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import {
    updateEmployee,
    fetchEmployees,
} from "@/redux/employees/employeeAPI.js";
import { fetchRoles } from "@/redux/roles/rolesSlice.js";
import { fetchDepartments } from "@/redux/departments/departmentAPI.js";
import DefaultButton from "@/components/Form/DefaultButton";

function InviteEmployeeModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.employees);
    const [apiError, setApiError] = useState("");
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    console.log(roles, "roles");
    console.log(loading, "loading");
    console.log(departments)

    useEffect(() => {
        if (isOpen) {
            setApiError("");
            dispatch(fetchRoles())
                ?.then((res) => {
                    setRoles(
                        res.payload.data.map((role) => ({
                            value: role._id,
                            label: role.name,
                        }))
                    );
                })
                .catch(() => setApiError("Failed to fetch roles. Please try again."));

            dispatch(fetchDepartments())
                ?.then((res) => {
                    setDepartments(
                        res.payload.map((dept) => ({
                            value: dept._id,
                            label: dept.name,
                        }))
                    );
                })
                .catch(() =>
                    setApiError("Failed to fetch departments. Please try again.")
                );
        }
    }, [isOpen, dispatch]);

    const formik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required")
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setApiError("");
                await dispatch(
                    updateEmployee({ id: values._id, employeeData: values })
                )?.unwrap();
                dispatch(fetchEmployees());
                onClose();
            } catch (error) {
                setApiError(
                    error.message || "Failed to update employee. Please try again."
                );
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        if (isOpen) {
            setApiError("");

            dispatch(fetchDepartments())
                ?.then((res) => {
                    setDepartments(
                        res.payload.map((dept) => ({
                            _id: dept._id, // Ensure the correct property names
                            name: dept.name,
                        }))
                    );
                })
                .catch(() =>
                    setApiError("Failed to fetch departments. Please try again.")
                );
        }
    }, [isOpen, dispatch]);

    const usersResult = [];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={false}
            customBtns={<DefaultButton type={'button'} title={"Invite"}
                className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white mt-4"} />}
            btnApplyTitle={formik.isSubmitting ? "Saving..." : "Invite"}
            onClick={formik.handleSubmit}
            className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"}
            title={"Invite New Employee"}
            disableSubmit={formik.isSubmitting || !formik.isValid}
        >
            <div className="flex flex-col gap-2">
                <div className="px-1">
                    {apiError && (
                        <div className="mb-4 text-red-500 text-sm">{apiError}</div>
                    )}

                    <div className="flex flex-col gap-4">
                        <InputAndLabel
                            title="Email"
                            name="email"
                            placeholder="Enter employer email"
                            {...formik.getFieldProps("email")}
                            error={formik.errors.email}
                        />

                    </div>
                </div>
                {usersResult.length > 0 && <div className="flex flex-col gap-2 border border-gray-200 rounded-xl px-4 py-2">
                    {usersResult.map(() => <div className="flex items-top gap-1 px-2 py-1 border-b border-gray-200">
                        <div className="rounded-full w-8 h-8">
                            <img src="" alt="avatar" className="w-full h-full" />
                        </div>
                        <div className="flex flex-col gap-0">
                            <span className="text-md text-gray-800">
                                User Name
                            </span>
                            <span className="text-md text-gray-500">
                                user@name.com
                            </span>
                        </div>
                    </div>)}
                </div>}
            </div>
        </Modal>
    );
}

InviteEmployeeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default InviteEmployeeModal;
