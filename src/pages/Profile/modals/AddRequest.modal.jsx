import Modal from "../../../components/Modal/Modal.jsx";
import DateInput from "../../../components/Form/DateInput.jsx";
import PropTypes from "prop-types";
import DefaultSelect from "../../../components/Form/DefaultSelect.jsx";
import TextAreaWithLabel from "../../../components/Form/TextAreaWithLabel.jsx";

function AddRequestModal({isOpen,onClose,onClick}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isBtns={true} title={"Sending a Request"}
               btnApplyTitle={"Add"}
               classNameBtns={"mt-5"}
               onClick={onClick}
        >
            <div className={"w-full flex flex-col gap-5"}>
                <DefaultSelect options={["Select Request..."]} title={"Request type"}   onChange={() => {}}/>
                <DefaultSelect options={["Select Manager..."]} title={"Manager"}   onChange={() => {}}/>
                <DateInput title={"Date"} />
                <TextAreaWithLabel title={"Reason"} placeholder={"Enter text..."} />
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