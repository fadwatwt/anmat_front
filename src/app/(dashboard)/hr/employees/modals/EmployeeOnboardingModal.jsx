"use client";

import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { RiMailSendLine, RiUserAddLine } from "@remixicon/react";
import Modal from "@/components/Modal/Modal.jsx";

function EmployeeOnboardingModal({ isOpen, onClose, onDirectCreate, onInvite }) {
    const { i18n } = useTranslation();
    const isArabic = i18n.language?.startsWith("ar");
    const copy = {
        title: isArabic ? "إضافة موظف" : "Add Employee",
        intro: isArabic ? "اختر الطريقة المناسبة لإضافة الموظف" : "Choose how you want to add the employee",
        directTitle: isArabic ? "إنشاء مباشر" : "Create Directly",
        directDescription: isArabic
            ? "أدخل جميع بيانات الموظف وحدد كلمة مرور مؤقتة، وسيتم إرسال رسالة تحقق إلى الموظف."
            : "Enter all employee details and set a temporary password. A verification email will be sent to the employee.",
        inviteTitle: isArabic ? "دعوة عبر البريد" : "Invite by Email",
        inviteDescription: isArabic
            ? "أرسل دعوة ليُنشئ الموظف كلمة المرور ويُكمل التسجيل بنفسه."
            : "Send an invitation so the employee can create a password and complete the registration.",
    };
    const choose = (handler) => {
        onClose();
        handler();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={copy.title} className="max-w-xl p-0">
            <div className="flex flex-col gap-4 pb-5">
                <p className="text-sm text-cell-secondary">{copy.intro}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => choose(onDirectCreate)}
                        className="flex flex-col items-start gap-3 rounded-2xl border border-status-border p-4 text-start hover:border-primary-base hover:bg-badge-bg transition-colors"
                    >
                        <span className="rounded-xl bg-primary-50 dark:bg-primary-950/30 p-2.5 text-primary-base"><RiUserAddLine size={24} /></span>
                        <span className="font-semibold text-table-title">{copy.directTitle}</span>
                        <span className="text-xs leading-5 text-cell-secondary">{copy.directDescription}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => choose(onInvite)}
                        className="flex flex-col items-start gap-3 rounded-2xl border border-status-border p-4 text-start hover:border-primary-base hover:bg-badge-bg transition-colors"
                    >
                        <span className="rounded-xl bg-primary-50 dark:bg-primary-950/30 p-2.5 text-primary-base"><RiMailSendLine size={24} /></span>
                        <span className="font-semibold text-table-title">{copy.inviteTitle}</span>
                        <span className="text-xs leading-5 text-cell-secondary">{copy.inviteDescription}</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}

EmployeeOnboardingModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDirectCreate: PropTypes.func.isRequired,
    onInvite: PropTypes.func.isRequired,
};

export default EmployeeOnboardingModal;
