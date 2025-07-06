import Modal from "../../../components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import InputAndLabel from "../../../components/Form/InputAndLabel.jsx";
import DateInput from "../../../components/Form/DateInput.jsx";

function AddToDoListModal({isOpen,onClose,onClick}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isBtns={true} title={"Adding a To Do list item"}
               btnApplyTitle={"Add"}
               classNameBtns={"mt-5"}
               onClick={onClick}
        >
            <div className={"w-full flex flex-col gap-5"}>
                <InputAndLabel title={"Title"} placeholder={"Enter To Do Title"} />
                <DateInput title={"Start date"} />
                <DateInput title={"End date"} />
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