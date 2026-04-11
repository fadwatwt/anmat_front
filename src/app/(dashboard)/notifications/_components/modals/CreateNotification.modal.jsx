import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectAndLabel from "@/components/Form/SelectAndLabel.jsx";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function CreateNotificationModal({ isOpen, onClose, onClick }) {
    const { t } = useTranslation();

    // Mock options
    const types = [
        { _id: "alert", name: "Alert" },
        { _id: "info", name: "Info" },
        { _id: "warning", name: "Warning" }
    ];
    const sendToOptions = [
        { id: "all", element: "All Users" },
        { id: "managers", element: "Managers" },
        { id: "employees", element: "Employees" }
    ];
    const modelTypes = [
        { _id: "task", name: "Task" },
        { _id: "project", name: "Project" },
        { _id: "leave", name: "Leave Request" }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            title={"Notification Details"}
            btnApplyTitle={"Create"}
            classNameBtns={"mt-5"}
            onClick={onClick}
        >
            <div className={"w-full flex flex-col gap-5"}>
                <InputAndLabel
                    title={"Title"}
                    placeholder={"Title"}
                />

                <SelectAndLabel
                    title={"Type"}
                    options={types}
                    placeholder={"Select Type"}
                    name="type"
                    value=""
                    onChange={() => { }}
                    onBlur={() => { }}
                />
                <ElementsSelect
                    title={"Send To"}
                    options={sendToOptions}
                    placeholder={"Select Recipient"}
                    onChange={() => { }}
                    classNameContainer={"w-full"}
                />

                <DateInput title={"Created At"} />

                <SelectAndLabel
                    title={"Type"}
                    options={types}
                    placeholder={"Select Type"}
                    name="type2"
                    value=""
                    onChange={() => { }}
                    onBlur={() => { }}
                />

                <InputAndLabel
                    title={"Model Name"}
                    placeholder={"Model Name"}
                />
                <SelectAndLabel
                    title={"Model Type"}
                    options={modelTypes}
                    placeholder={"Select Model Type"}
                    name="modelType"
                    value=""
                    onChange={() => { }}
                    onBlur={() => { }}
                />

                <TextAreaWithLabel
                    title={"Message"}
                    placeholder={"Enter message..."}
                />
            </div>
        </Modal>
    );
}

CreateNotificationModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onClick: PropTypes.func
}

export default CreateNotificationModal;
