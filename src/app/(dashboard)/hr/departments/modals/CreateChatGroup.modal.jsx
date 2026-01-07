import Modal from "@/components/Modal/Modal";
import InputAndLabel from "@/components/Form/InputAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import PropTypes from "prop-types";

function CreateChatGroupModal({ isOpen, onClose, departmentData }) {
    // Example members data - ideally this would come from props or an API
    const membersOptions = [
        { id: "1", element: "Ahmed Ali" },
        { id: "2", element: "Sarah Smith" },
        { id: "3", element: "John Doe" },
        { id: "4", element: "Maria Garcia" },
        { id: "5", element: "James Johnson" },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            btnApplyTitle={"Create Group"}
            onClick={() => { }}
            className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"}
            title={"Create Chat Group"}
        >
            <div className="px-4">
                <div className="flex flex-col gap-4">
                    <InputAndLabel
                        title={"Group Name"}
                        type={"text"}
                        placeholder={departmentData ? `${departmentData.name} Group` : "Enter group name"}
                        defaultValue={departmentData ? `${departmentData.name} Group` : ""}
                        isRequired={true}
                    />

                    <ElementsSelect
                        title={"Add Members"}
                        isMultiple={true}
                        options={membersOptions}
                        placeholder={"Select members"}
                    />

                    <TextAreaWithLabel
                        title={"Description"}
                        placeholder={"Enter group description..."}
                    />
                </div>
            </div>
        </Modal>
    );
}

CreateChatGroupModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    departmentData: PropTypes.object
};

export default CreateChatGroupModal;
