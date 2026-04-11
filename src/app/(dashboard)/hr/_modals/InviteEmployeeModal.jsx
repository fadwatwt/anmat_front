'use client';

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import DefaultButton from "@/components/Form/DefaultButton";
import { useInviteEmployeeMutation } from "@/redux/employees/employeesApi";
import { IoCopyOutline, IoCheckmarkCircle } from "react-icons/io5";
import { useTranslation } from "react-i18next";

function InviteEmployeeModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [inviteEmployee, { isLoading }] = useInviteEmployeeMutation();
    const [apiError, setApiError] = useState("");

    // Success modal state
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [invitationData, setInvitationData] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required")
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setApiError("");
                const response = await inviteEmployee({ email: values.email }).unwrap();

                if (response.status === "success") {
                    setInvitationData(response.data);
                    setShowSuccessModal(true);
                    resetForm();
                }
            } catch (error) {
                setApiError(
                    error?.data?.message || error.message || "Failed to send invitation. Please try again."
                );
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true,
    });

    const handleCopyLink = async () => {
        if (invitationData?.link) {
            try {
                await navigator.clipboard.writeText(invitationData.link);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy link:", err);
            }
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setInvitationData(null);
        setIsCopied(false);
        onClose();
    };

    const handleCloseInviteModal = () => {
        formik.resetForm();
        setApiError("");
        onClose();
    };

    return (
        <>
            {/* Invite Employee Modal */}
            <Modal
                isOpen={isOpen && !showSuccessModal}
                onClose={handleCloseInviteModal}
                isBtns={false}
                customBtns={
                    <DefaultButton
                        type={'button'}
                        title={isLoading || formik.isSubmitting ? "Sending..." : "Invite"}
                        onClick={formik.handleSubmit}
                        disabled={isLoading || formik.isSubmitting || !formik.isValid}
                        className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white mt-4"}
                    />
                }
                className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-4 pb-4"}
                title={"Invite New Employee"}
            >
                <div className="flex flex-col gap-2">
                    <div className="px-1">
                        {apiError && (
                            <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg">{apiError}</div>
                        )}

                        <div className="flex flex-col gap-4">
                            <InputAndLabel
                                title="Email"
                                name="email"
                                placeholder="Enter employee email"
                                {...formik.getFieldProps("email")}
                                error={formik.touched.email && formik.errors.email}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Success Modal with Copy Registration URL */}
            <Modal
                isOpen={showSuccessModal}
                onClose={handleCloseSuccessModal}
                isBtns={false}
                className={"lg:w-5/12 md:w-8/12 sm:w-10/12 w-11/12"}
                title={"Invitation Sent Successfully"}
            >
                <div className="flex flex-col gap-6 px-4 py-2">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="rounded-full p-3 bg-green-100">
                            <IoCheckmarkCircle size={50} className="text-green-500" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center">
                        <p className="text-gray-700 dark:text-gray-300 text-lg">
                            {t("Invitation email has been sent successfully to")}
                        </p>
                        <p className="text-primary-600 dark:text-primary-400 font-semibold text-lg mt-1">
                            {invitationData?.email}
                        </p>
                        {invitationData?.organization?.name && (
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                                {t("Organization")}: {invitationData.organization.name}
                            </p>
                        )}
                    </div>

                    {/* Registration Link Section */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 block">
                            {t("Registration URL")}
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3 overflow-hidden">
                                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                    {invitationData?.link}
                                </p>
                            </div>
                            <button
                                onClick={handleCopyLink}
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${isCopied
                                    ? 'bg-green-500 text-white'
                                    : 'bg-primary-500 dark:bg-primary-200 text-white dark:text-black hover:opacity-90'
                                    }`}
                            >
                                {isCopied ? (
                                    <>
                                        <IoCheckmarkCircle size={18} />
                                        <span>{t("Copied!")}</span>
                                    </>
                                ) : (
                                    <>
                                        <IoCopyOutline size={18} />
                                        <span>{t("Copy URL")}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-center pb-2">
                        <DefaultButton
                            type="button"
                            title={t("Done")}
                            onClick={handleCloseSuccessModal}
                            className="bg-primary-500 dark:bg-primary-200 dark:text-black text-white font-medium px-8"
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
}

InviteEmployeeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default InviteEmployeeModal;
