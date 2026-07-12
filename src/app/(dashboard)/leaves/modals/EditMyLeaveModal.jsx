"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DateInput from "@/components/Form/DateInput";
import TimeInput from "@/components/Form/TimeInput";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import Modal from "@/components/Modal/Modal.jsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useUpdateMyLeaveMutation } from "@/redux/leaves/employeeLeavesApi";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useProcessing } from "@/app/providers";

function EditMyLeaveModal({ isOpen, onClose, leaveData }) {
    const { t } = useTranslation();
    const { showProcessing, hideProcessing } = useProcessing();
    const [updateMyLeave, { isLoading }] = useUpdateMyLeaveMutation();

    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const validationSchema = Yup.object().shape({
        date: Yup.date()
            .required(t("Date is required")),
        start_time: Yup.string()
            .required(t("Start time is required")),
        end_time: Yup.string()
            .required(t("End time is required"))
            .test("after-start", t("End time must be after start time"), function (value) {
                const { start_time } = this.parent;
                if (!start_time || !value) return true;
                return value > start_time;
            }),
        reason: Yup.string()
            .required(t("Reason is required")),
    });

    const formik = useFormik({
        initialValues: {
            date: "",
            start_time: "",
            end_time: "",
            reason: "",
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: () => {
            setIsApprovalOpen(true);
        },
    });

    useEffect(() => {
        if (leaveData && isOpen) {
            formik.setValues({
                date: leaveData.date || "",
                start_time: leaveData.start_time || "",
                end_time: leaveData.end_time || "",
                reason: leaveData.reason || "",
            });
        }
    }, [leaveData, isOpen]);

    const onConfirmSave = async () => {
        showProcessing(t("Updating Leave Request..."));
        try {
            await updateMyLeave({ id: leaveData._id, ...formik.values }).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Leave request updated successfully")
            });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || error.message || t("Failed to update leave request")
            });
        } finally {
            hideProcessing();
            setIsApprovalOpen(false);
        }
    };

    const handleCloseApiResponse = () => {
        setApiResponse(prev => ({ ...prev, isOpen: false }));
        if (apiResponse.status === "success") {
            onClose();
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isBtns={true}
                btnApplyTitle={isLoading ? t("Saving...") : t("Save")}
                btnCancelTitle={t("Cancel")}
                onClick={() => formik.handleSubmit()}
                className="lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"
                title={t("Edit Leave Request")}
                isDisabled={isLoading}
            >
                <div className="px-1 overflow-visible">
                    <div className="flex flex-col gap-4">
                        <DateInput
                            title={t("Date")}
                            placeholder={t("Select Date")}
                            name="date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.date && formik.errors.date && (
                            <p className="text-red-error text-[11px] font-medium mt-[-12px] ml-1">{formik.errors.date}</p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <TimeInput
                                title={t("Start Time")}
                                name="start_time"
                                value={formik.values.start_time}
                                onChange={formik.handleChange}
                                isRequired={true}
                                error={formik.touched.start_time && formik.errors.start_time}
                            />

                            <TimeInput
                                title={t("End Time")}
                                name="end_time"
                                value={formik.values.end_time}
                                onChange={formik.handleChange}
                                isRequired={true}
                                error={formik.touched.end_time && formik.errors.end_time}
                            />
                        </div>

                        <TextAreaWithLabel
                            title={t("Reason")}
                            name="reason"
                            placeholder={t("Explain the reason for your request")}
                            value={formik.values.reason}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.reason && formik.errors.reason}
                            isRequired
                        />
                    </div>
                </div>
            </Modal>

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={onConfirmSave}
                title={t("Update Leave Request")}
                message={t("Are you sure you want to update this leave request?")}
                confirmBtnText={t("Confirm")}
                cancelBtnText={t("Cancel")}
                type="info"
            />

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleCloseApiResponse}
                successTitle={t("Success")}
                errorTitle={t("Error")}
            />
        </>
    );
}

EditMyLeaveModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    leaveData: PropTypes.object,
};

export default EditMyLeaveModal;
