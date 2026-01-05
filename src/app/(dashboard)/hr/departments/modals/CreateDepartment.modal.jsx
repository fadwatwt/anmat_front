import Modal from "@/components/Modal/Modal";
import InputAndLabel from "@/components/Form/InputAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";


function CreateDepartmentModal({isOpen, onClose}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            btnApplyTitle={"Save"}
            onClick={() => {}}
            className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"}
            title={"Add Role"}
        >
            <div className="px-4">
                <div className="flex flex-col gap-4">
                    <InputAndLabel title={"Department Name"} type={"text"} placeholder={""} isRequired={true} />
                    <ElementsSelect title={"Positions"} isMultiple={true}  options={[
                        {id:"1",element:"type 1"},
                        {id:"2",element:"type 2"},
                        {id:"3",element:"type 3"}
                    ]}
                    />
                    <TextAreaWithLabel title={"Description"} placeholder={"Enter description..."} />
                </div>
            </div>
        </Modal>
    );
}

export default CreateDepartmentModal;