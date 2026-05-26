import Modal from "../../../../../components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import InputAndLabel from "../../../../../components/Form/InputAndLabel.jsx";
import DateInput from "../../../../../components/Form/DateInput.jsx";
import { useTranslation } from "react-i18next";

function AddToDoListModal({isOpen,onClose,onClick}) {
    const { t } = useTranslation();
    return (
        <Modal isOpen={isOpen} onClose={onClose} isBtns={true} title={t("Adding a To Do list item")}
               btnApplyTitle={t("Add")}
               classNameBtns={"mt-5"}
               onClick={onClick}
        >
            <div className={"w-full flex flex-col gap-5"}>
                <InputAndLabel title={t("Title")} placeholder={t("Enter To Do Title")} />
                <DateInput title={t("Start date")} />
                <DateInput title={t("End date")} />
            </div>
        </Modal>
    );
}

AddToDoListModal.propTypes = {
    isOpen:PropTypes.bool,
    onClose:PropTypes.func,
    onClick:PropTypes.func
}

export default AddToDoListModal;
