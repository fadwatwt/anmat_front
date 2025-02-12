import Modal from "../../../components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import InputAndLabel from "../../../components/Form/InputAndLabel.jsx";

function AddingAnEmployeeModal({isOpen,onClose}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isBtns={true} btnApplyTitle={"Send Invitation"} className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"} title={"Adding an Employee"} >
            <div className={"px-1"}>
                <div className={"flex flex-col gap-4"}>
                    <InputAndLabel title={"Email"} value={""} name={""} onChange={() => {
                    }} placeholder={"Enter email"}/>
                    <InputAndLabel title={"Role"} value={""} name={""} onChange={() => {
                    }} placeholder={"Enter Role"}/>
                    <InputAndLabel title={"Job Type"} value={""} name={""} onChange={() => {
                    }} placeholder={"Enter Job Type"}/>
                    <InputAndLabel title={"Salary"} value={""} name={""} onChange={() => {
                    }} placeholder={"Enter Salary"}/>
                    <InputAndLabel title={"Department"} value={""} name={""} onChange={() => {
                    }} placeholder={"Enter Department"}/>
                    <InputAndLabel title={"Working Hours"} value={""} name={""} onChange={() => {
                    }} placeholder={"Enter Working Hours"}/>
                    <InputAndLabel title={"Working Days"} value={""} name={""} onChange={() => {
                    }} placeholder={"Enter Working Days"}/>
                    <InputAndLabel title={"Annual Leave Days"} value={""} name={""} onChange={() => {
                    }} placeholder={"Enter Annual Leave Days"}/>
                </div>
            </div>

        </Modal>
    );
}

AddingAnEmployeeModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func
}

export default AddingAnEmployeeModal;