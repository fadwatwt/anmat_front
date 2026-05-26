import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal/Modal";
import InputAndLabel from "@/components/Form/InputAndLabel";

function InviteEmployeeModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");

    const handleSend = () => {
        console.log("Inviting email:", email);
        onClose();
        setEmail("");
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t("Invite Employee")}
            isBtns={true}
            btnApplyTitle={t("Send")}
            onClick={handleSend}
            className="lg:w-[35%] md:w-1/2 sm:w-11/12 w-full p-6"
        >
            <div className="flex flex-col gap-4">
                <InputAndLabel
                    title={t("Email")}
                    isRequired={true}
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("example@gmail.com")}
                    type="email"
                />
            </div>
        </Modal>
    );
}

InviteEmployeeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default InviteEmployeeModal;
