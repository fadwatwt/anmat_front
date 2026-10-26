'use client';

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import DefaultButton from "@/components/Form/DefaultButton";
import { useCreateEmployeeInvitationShareLinkMutation, useInviteEmployeeMutation } from "@/redux/employees/employeesApi";
import { IoCheckmarkCircle, IoCopyOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

function InviteEmployeeModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [inviteEmployee, { isLoading }] = useInviteEmployeeMutation();
    const [createShareLink, { isLoading: isCreatingShareLink }] = useCreateEmployeeInvitationShareLinkMutation();
    const [apiError, setApiError] = useState("");

    // Success modal state
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [invitationData, setInvitationData] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [copyError, setCopyError] = useState("");

    const formik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t("Invalid email address"))
                .required(t("Email is required"))
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setApiError("");
                const response = await inviteEmployee({ email: values.email }).unwrap();

                if (response.status === "success") {
                    let shareLink = "";
                    try {
                        const shareResponse = await createShareLink(response.data.invitation_id).unwrap();
                        shareLink = shareResponse?.data?.link || "";
                    } catch (error) {
                        setCopyError(error?.data?.message || t("Failed to create share link"));
                    }
                    setInvitationData({ ...response.data, share_link: shareLink });
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

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setInvitationData(null);
        setIsCopied(false);
        setCopyError("");
        onClose();
    };

    const handleCopyShareLink = async () => {
        if (!invitationData?.invitation_id) return;
        try {
            setCopyError("");
            let link = invitationData.share_link;
            if (!link) {
                const response = await createShareLink(invitationData.invitation_id).unwrap();
                link = response?.data?.link;
                setInvitationData((current) => ({ ...current, share_link: link }));
            }
            if (!link) throw new Error("Share link was not returned");
            await navigator.clipboard.writeText(link);
            setIsCopied(true);
            window.setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            setCopyError(error?.data?.message || t("Failed to copy link"));
        }
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
                className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-4 pb-4"}
                title={t("Invite New Employee")}
            >
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <div className="px-1">
                            {apiError && (
                                <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg dark:bg-red-900/20">{apiError}</div>
                            )}

                            <div className="flex flex-col gap-4">
                                <InputAndLabel
                                    title={t("Email")}
                                    name="email"
                                    placeholder={t("Enter employee email")}
                                    {...formik.getFieldProps("email")}
                                    error={formik.touched.email && formik.errors.email}
                                />
                            </div>
                        </div>
                    </div>
                    <DefaultButton
                        type={'submit'}
                        title={isLoading || formik.isSubmitting ? t("Sending...") : t("Invite")}
                        disabled={isLoading || formik.isSubmitting || !formik.isValid}
                        className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white mt-4 w-full"}
                    />
                </form>
            </Modal>

            {/* Success Modal */}
            <Modal
                isOpen={showSuccessModal}
                onClose={handleCloseSuccessModal}
                isBtns={false}
                className={"lg:w-5/12 md:w-8/12 sm:w-10/12 w-11/12"}
                title={t("Invitation Sent Successfully")}
            >
                <div className="flex flex-col gap-6 px-4 py-2">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/30">
                            <IoCheckmarkCircle size={50} className="text-green-500" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center">
                        <p className="text-cell-secondary text-lg">
                            {t("Invitation email has been sent successfully to")}
                        </p>
                        <p className="text-primary-600 dark:text-primary-400 font-semibold text-lg mt-1">
                            {invitationData?.email}
                        </p>
                        {invitationData?.organization?.name && (
                            <p className="text-cell-secondary text-sm mt-2">
                                {t("Organization")}: {invitationData.organization.name}
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl border border-status-border bg-status-bg p-4">
                        <label className="mb-2 block text-sm font-medium text-cell-primary">
                            {t("Shareable registration link")}
                        </label>
                        <p className="mb-3 text-sm text-cell-secondary">
                            {t("The copied link requires the employee to verify their email before activation.")}
                        </p>
                        <div className="flex items-stretch gap-2">
                            <input
                                type="text"
                                readOnly
                                dir="ltr"
                                value={invitationData?.share_link || ""}
                                placeholder={isCreatingShareLink ? t("Creating link...") : ""}
                                className="min-w-0 flex-1 rounded-lg border border-status-border bg-surface px-3 text-sm text-cell-secondary outline-none"
                                onFocus={(event) => event.target.select()}
                            />
                            <button
                                type="button"
                                onClick={handleCopyShareLink}
                                disabled={isCreatingShareLink}
                                className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70 dark:bg-primary-200 dark:text-black"
                            >
                                {isCreatingShareLink ? (
                                    <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
                                ) : isCopied ? (
                                    <IoCheckmarkCircle size={18} />
                                ) : (
                                    <IoCopyOutline size={18} />
                                )}
                                {isCopied ? t("Copied!") : t("Copy")}
                            </button>
                        </div>
                        {copyError && <p className="mt-2 text-sm text-red-500">{copyError}</p>}
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-center pb-2">
                        <DefaultButton
                            type="button"
                            title={t("Close")}
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
