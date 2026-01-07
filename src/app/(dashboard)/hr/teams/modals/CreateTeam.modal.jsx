import Modal from "@/components/Modal/Modal";
import InputAndLabel from "@/components/Form/InputAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import PropTypes from "prop-types";
import { departments, employeesFactory } from "@/functions/FactoryData";

function CreateTeamModal({ isOpen, onClose }) {
    // Map departments to options format
    const departmentOptions = departments
        .filter(d => d.value !== 'all')
        .map(d => ({ id: d.value, element: d.name }));

    // Map employees to options format for leader/members
    const employeeOptions = employeesFactory.map(e => ({
        id: e.id,
        element: e.name,
        // You could add imageProfile here if ElementsSelect supports rendering custom options
    }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            btnApplyTitle={"Create Team"}
            onClick={() => { }}
            className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"}
            title={"Create New Team"}
        >
            <div className="px-4">
                <div className="flex flex-col gap-4">
                    <InputAndLabel
                        title={"Team Name"}
                        type={"text"}
                        placeholder={"Enter team name"}
                        isRequired={true}
                    />

                    <ElementsSelect
                        title={"Department"}
                        options={departmentOptions}
                        placeholder={"Select Department"}
                        isMultiple={false}
                    />

                    <ElementsSelect
                        title={"Team Leader"}
                        options={employeeOptions}
                        placeholder={"Select Team Leader"}
                        isMultiple={false}
                    />

                    <ElementsSelect
                        title={"Team Members"}
                        isMultiple={true}
                        options={employeeOptions}
                        placeholder={"Select members"}
                    />

                    <TextAreaWithLabel
                        title={"Description"}
                        placeholder={"Enter team description..."}
                    />
                </div>
            </div>
        </Modal>
    );
}

CreateTeamModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
};

export default CreateTeamModal;
