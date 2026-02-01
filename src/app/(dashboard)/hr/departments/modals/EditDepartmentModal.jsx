import { useState, useEffect } from "react";
import { useFormik } from "formik";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import PropTypes from "prop-types";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert.jsx";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert.jsx";

import { useUpdateDepartmentMutation } from "@/redux/departments/departmentsApi";
import { useGetPositionsQuery } from "@/redux/positions/positionsApi";

const validationSchema = Yup.object({
    name: Yup.string().required("required"),
    description: Yup.string(),
    rate: Yup.number().required("required").min(0).max(1),
    positions_ids: Yup.array().min(1, "At least one position is required"),
});

function EditDepartmentModal({ isOpen, onClose, department }) {
    const { t } = useTranslation();
    const [updateDepartment, { isLoading }] = useUpdateDepartmentMutation();
    const { data: positions = [] } = useGetPositionsQuery();

    const [showConfirmAlert, setShowConfirmAlert] = useState(false);
    const [responseAlert, setResponseAlert] = useState({
        isOpen: false,
        status: "",
        message: "",
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            rate: 0,
            positions_ids: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            setShowConfirmAlert(true);
        },
    });

    useEffect(() => {
        if (department && isOpen) {
            formik.setValues({
                name: department.name || "",
                description: department.description || "",
                rate: department.rate || 0,
                positions_ids: (department.positions_ids || []).map(pos => ({
                    id: pos._id,
                    element: pos.title
                })),
            });
        }
    }, [department, isOpen]);

    const handleConfirm = async () => {
        try {
            const payload = {
                id: department._id,
                name: formik.values.name,
                description: formik.values.description,
                rate: formik.values.rate,
                positions_ids: formik.values.positions_ids.map(p => p.id)
            };
            await updateDepartment(payload).unwrap();
            setResponseAlert({
                isOpen: true,
                status: "success",
                message: t("Department updated successfully!"),
            });
        } catch (error) {
            setResponseAlert({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update department. Please try again."),
            });
            console.error("Failed to update department:", error);
        } finally {
            setShowConfirmAlert(false);
        }
    };

    const handleResponseClose = () => {
        const isSuccess = responseAlert.status === "success";
        setResponseAlert({ ...responseAlert, isOpen: false });
        if (isSuccess) {
            onClose();
        }
    };

    const positionOptions = positions.map(pos => ({
        id: pos._id,
        element: pos.title
    }));

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isBtns={true}
                btnApplyTitle={t("Update")}
                btnCancelTitle={t("Cancel")}
                className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"}
                title={t("Edit Department")}
                onClick={formik.handleSubmit}
            >
                <div className="px-1">
                    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
                        <InputAndLabel
                            title={t("Department Name")}
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder={t("Enter department name")}
                            isRequired={true}
                            disabled={isLoading}
                            error={formik.touched.name && formik.errors.name ? t(formik.errors.name) : ""}
                        />

                        <ElementsSelect
                            title={t("Positions")}
                            isMultiple={true}
                            options={positionOptions}
                            defaultValue={formik.values.positions_ids}
                            onChange={(val) => formik.setFieldValue("positions_ids", val)}
                            placeholder={t("Select positions")}
                        />
                        {formik.touched.positions_ids && formik.errors.positions_ids && (
                            <p className="text-red-500 text-xs mt-[-10px]">{t(formik.errors.positions_ids)}</p>
                        )}

                        <InputAndLabel
                            title={t("Rate")}
                            name="rate"
                            type="number"
                            value={formik.values.rate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder={t("Enter rate (0 - 1)")}
                            isRequired={true}
                            disabled={isLoading}
                            min={0}
                            max={1}
                            step={0.01}
                            error={formik.touched.rate && formik.errors.rate ? t(formik.errors.rate) : ""}
                        />

                        <TextAreaWithLabel
                            title={t("Description")}
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder={t("Enter Description")}
                            rows={4}
                            disabled={isLoading}
                            error={formik.touched.description && formik.errors.description ? t(formik.errors.description) : ""}
                        />
                    </form>
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={showConfirmAlert}
                onClose={() => setShowConfirmAlert(false)}
                onConfirm={handleConfirm}
                title={t("Confirm Update")}
                message={t("Are you sure you want to update the department \"{{name}}\"?", { name: department?.name })}
                confirmBtnText={t("Yes, Update")}
                cancelBtnText={t("Cancel")}
                type="warning"
            />

            <ApiResponseAlert
                isOpen={responseAlert.isOpen}
                status={responseAlert.status}
                message={responseAlert.message}
                onClose={handleResponseClose}
            />
        </>
    );
}

EditDepartmentModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    department: PropTypes.object,
};

export default EditDepartmentModal;
