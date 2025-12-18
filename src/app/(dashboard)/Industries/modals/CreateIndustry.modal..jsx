import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";

import InputAndLabel from "@/components/Form/InputAndLabel";
import FileUpload from "@/components/Form/FileUpload";

function CreateIndustryModal({isOpen,onClose,onClick}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isBtns={true} title={"Sending a Request"}
               btnApplyTitle={"Add"}
               classNameBtns={"mt-5"}
               onClick={onClick}
        >
            <div className={"w-full flex flex-col gap-5"}>
                <InputAndLabel title={"Name"} placeholder={"Enter name..."} />
               <FileUpload title={"Logo"} />
            </div>
        </Modal>
    );
}

CreateIndustryModal.propTypes = {
    isOpen:PropTypes.bool,
    onClose:PropTypes.func,
    onClick:PropTypes.func
}

export default CreateIndustryModal;