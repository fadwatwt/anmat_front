import Modal from "@/components/Modal/Modal.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import PropTypes from "prop-types";
import DefaultSelect from "@/components/Form/DefaultSelect.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import { useTranslation } from "react-i18next";

function AddRequestModal({isOpen,onClose,onClick}) {
    const { t } = useTranslation();
    return (
        <Modal isOpen={isOpen} onClose={onClose} isBtns={true} title={t("Sending a Request")}
               btnApplyTitle={t("Add")}
               classNameBtns={"mt-5"}
               onClick={onClick}
        >
            <div className={"w-full flex flex-col gap-5"}>
                <DefaultSelect options={[t("Select Request...")]} title={t("Request type")}   onChange={() => {}}/>
                <DefaultSelect options={[t("Select Manager...")]} title={t("Manager")}   onChange={() => {}}/>
                <DateInput title={t("Date")} />
                <TextAreaWithLabel title={t("Reason")} placeholder={t("Enter text...")} />
            </div>
        </Modal>
    );
}

AddRequestModal.propTypes = {
    isOpen:PropTypes.bool,
    onClose:PropTypes.func,
    onClick:PropTypes.func
}

export default AddRequestModal;
