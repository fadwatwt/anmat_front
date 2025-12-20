import Modal from "@/components/Modal/Modal";
import DefaultSelect from "@/components/Form/DefaultSelect";
import DateInput from "@/components/Form/DateInput";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import PropTypes from "prop-types";
import InputAndLabel from "@/components/Form/InputAndLabel";
import TagInput from "@/components/Form/TagInput";

function EditAdminProfileModal({isOpen,onClose,onClick}) {
    const suggestions = [
        {id: 'add', name: 'add'},
        {id: 'edit', name: 'edit'},
        {id: 'view', name: 'view'},
        {id: 'delete', name: 'delete'},
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} isBtns={true} title={"Edit Profile"}
               btnApplyTitle={"Add"}
               classNameBtns={"mt-5"}
               onClick={onClick}
        >
            <div className={"w-full flex flex-col gap-5"}>
                <InputAndLabel title ={"Email Address"} placeholder={""}/>
                <TagInput title={"Roles"} suggestions={suggestions} />
                <TagInput title={"Permission Type"} suggestions={suggestions} />
                <DateInput title ={"Date of Birth"}/>
                <InputAndLabel title ={"Phone"} placeholder={""}/>
            </div>
        </Modal>
    );
}

EditAdminProfileModal.propTypes = {
    isOpen:PropTypes.bool,
    onClose:PropTypes.func,
    onClick:PropTypes.func
}

export default EditAdminProfileModal;