import Modal from "@/components/Modal/Modal.jsx";
import PasswordInput from "@/components/Form/PasswordInput.jsx";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function ChangePasswordModal({ isOpen, onClose, onClick }) {
    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            title={"Change Password"}
            btnApplyTitle={"Save"}
            classNameBtns={"mt-5"}
            onClick={onClick}
        >
            <div className={"w-full flex flex-col gap-5"}>
                <PasswordInput title={"Current Password"} placeholder={"********"} />
                <PasswordInput title={"New Password"} placeholder={"********"} />
                <PasswordInput title={"Confirm New Password"} placeholder={"********"} />
            </div>
        </Modal>
    );
}

ChangePasswordModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onClick: PropTypes.func
}

export default ChangePasswordModal;