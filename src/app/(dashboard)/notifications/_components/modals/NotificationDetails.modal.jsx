import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectAndLabel from "@/components/Form/SelectAndLabel.jsx";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { RiUserLine } from "@remixicon/react";

function NotificationDetailsModal({ isOpen, onClose, notification, onUpdate }) {
    const { t } = useTranslation();

    // Mock data
    const types = [
        { _id: "alert", name: "Alert" },
        { _id: "info", name: "Info" },
        { _id: "warning", name: "Warning" }
    ];
    const sendToOptions = [
        { id: "all", element: "All Users" },
        { id: "managers", element: "Managers" },
    ];
    const modelTypes = [
        { _id: "task", name: "Task" },
        { _id: "project", name: "Project" }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            title={"Notification Details"}
            btnApplyTitle={"Update"}
            classNameBtns={"mt-5"}
            onClick={onUpdate}
        >
            <div className={"w-full flex flex-col gap-5"}>
                <div className="md:col-span-2">
                    <InputAndLabel
                        title={"Title"}
                        value={"Title 1"} // Mock value
                        onChange={() => { }}
                    />
                </div>

                <SelectAndLabel
                    title={"Type"}
                    options={types}
                    name="type"
                    value="info" // Mock value
                    onChange={() => { }}
                    onBlur={() => { }}
                />
                <ElementsSelect
                    title={"Send To"}
                    options={sendToOptions}
                    placeholder={"Select Recipient"}
                    onChange={() => { }}
                    classNameContainer={"w-full"}
                    // Pre-select 'All Users' if needed, e.g. defaultValue={[{id:'all', element:'All Users'}]}
                    defaultValue={[{ id: 'all', element: 'All Users' }]}
                />

                <DateInput title={"Delivered At"} />
                <DateInput title={"Read At"} />

                <div className="md:col-span-2">
                    <DateInput title={"Created At"} />
                </div>

                <SelectAndLabel
                    title={"Type"}
                    options={types}
                    name="type2"
                    value="alert" // Mock value
                    onChange={() => { }}
                    onBlur={() => { }}
                />

                <InputAndLabel
                    title={"Model Name"}
                    value={"Anything"} // Mock value
                    onChange={() => { }}
                />
                <SelectAndLabel
                    title={"Model Type"}
                    options={modelTypes}
                    name="modelType"
                    value="task" // Mock value
                    onChange={() => { }}
                    onBlur={() => { }}
                />

                <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-gray-900 dark:text-gray-200 text-sm">{t("Sent By")}</label>
                    <div className="flex items-center gap-2 p-2 border rounded-xl dark:border-gray-700">
                        <img
                            src="https://randomuser.me/api/portraits/women/44.jpg"
                            alt="Yara"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm dark:text-gray-200">Yara</span>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <TextAreaWithLabel
                        title={"Message"}
                        value={"sdfghjh"} // Mock value
                        onChange={() => { }}
                    />
                </div>
            </div>
        </Modal>
    );
}

NotificationDetailsModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    notification: PropTypes.object,
    onUpdate: PropTypes.func
}

export default NotificationDetailsModal;
