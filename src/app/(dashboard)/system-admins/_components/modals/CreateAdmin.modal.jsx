"use client"
import Modal from "@/components/Modal/Modal.jsx";
import DefaultSelect from "@/components/Form/DefaultSelect.jsx";
import PropTypes from "prop-types";
import InputAndLabel from "@/components/Form/InputAndLabel";
import PasswordInput from "@/components/Form/PasswordInput";
import TagInput from "@/components/Form/TagInput";


function CreateAdminModal({ isOpen, onClose, onClick }) {
    const suggestions = [
        {id: 'add', name: 'add'},
        {id: 'edit', name: 'edit'},
        {id: 'view', name: 'view'},
        {id: 'delete', name: 'delete'},
    ];
    return (
        <Modal isOpen={isOpen} onClose={onClose} isBtns={true} title={"Add User"}
            btnApplyTitle={"Add"}
            classNameBtns={"mt-5"}
            onClick={onClick}
        >
            <div className={"w-full flex flex-col gap-5"}>
                <InputAndLabel title={"Name"} />
                <InputAndLabel title={"Email"} />
                <PasswordInput title={"Password"} />
                <PasswordInput title={"Confirm Password"} />
                <TagInput suggestions={suggestions} title={"Roles"} />

            </div>
        </Modal>
    )
}

CreateAdminModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onClick: PropTypes.func
}


export default CreateAdminModal;