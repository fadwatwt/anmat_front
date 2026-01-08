import React, { useState, useEffect } from "react";
import PropTypes, { element } from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal/Modal";
import InputAndLabel from "@/components/Form/InputAndLabel";
import DefaultSelect from "@/components/Form/DefaultSelect";
import DateInput from "@/components/Form/DateInput";
import InputWithIcon from "@/components/Form/InputWithIcon";
import ElementsSelect from "@/components/Form/ElementsSelect";
import { RiTimeLine } from "@remixicon/react";
import { employeesFactory } from "@/functions/FactoryData";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import TimeInput from "@/components/Form/TimeInput";

function CreateMeetingModal({ isOpen, onClose, isEdit, editData }) {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        title: "",
        departments: [],
        type: "",
        topics: "",
        admins: [],
        participants: [],
        date: "",
        time: "",
        description: "",
        meetingLink: "",
    });

    const departmentOptions = [
        { id: "dept1", value: "Development", label: "Development", name: "Development" },
        { id: "dept2", value: "Sales", label: "Sales", name: "Sales" },
        { id: "dept3", value: "Marketing", label: "Marketing", name: "Marketing" },
        { id: "dept4", value: "HR", label: "HR", name: "HR" },
    ];

    const typeOptions = [
        { id: "online", element: "Online", name: "Online" },
        { id: "person", element: "In Person", name: "In Person" },
    ];

    useEffect(() => {
        if (isEdit && editData) {
            setFormData({
                title: editData.title || "",
                departments: editData.departments || [],
                type: editData.type || "",
                topics: editData.topics || "",
                admins: editData.admins || [],
                participants: editData.participants || [],
                date: editData.date || "",
                time: editData.time || "",
                description: editData.description || "",
                meetingLink: editData.meetingLink || "",
            });
        } else {
            setFormData({
                title: "",
                departments: [],
                type: "",
                topics: "",
                admins: [],
                participants: [],
                date: "",
                time: "",
                description: "",
                meetingLink: "",
            });
        }
    }, [isOpen, isEdit, editData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        console.log("Saving Meeting:", formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Meeting Details" : "Creating a Meeting"}
            isBtns={true}
            btnApplyTitle={isEdit ? "Update" : "Schedule"}
            onClick={handleSave}
            className="lg:w-[30%] md:w-8/12 sm:w-10/12 w-full p-6"
        >
            <div className="flex flex-col gap-4">
                <InputAndLabel
                    title="Meeting Title"
                    isRequired={true}
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Meeting Title"
                />

                <ElementsSelect
                    title="Departments"
                    options={departmentOptions.map(dept => ({ ...dept, element: <span>{dept.name}</span> }))}
                    defaultValue={formData.departments}
                    onChange={(val) => handleSelectChange("departments", val)}
                    isMultiple={true}
                    placeholder="Select Departments"
                />
                <ElementsSelect title="Type"
                    options={typeOptions}
                    defaultValue={formData.type}
                    onChange={(val) => handleSelectChange("type", val)}
                    isMultiple={false}
                    placeholder="Select Type"
                />

                <InputAndLabel
                    title="Topics"
                    name="topics"
                    value={formData.topics}
                    onChange={handleChange}
                    placeholder="Topics"
                />

                <ElementsSelect
                    title="Admins"
                    options={employeesFactory.map((emp) => ({
                        id: emp.id,
                        element: (
                            <div className="flex items-center gap-2">
                                <img
                                    src={emp.imageProfile}
                                    alt={emp.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <span>{emp.name}</span>
                            </div>
                        ),
                        ...emp,
                    }))}
                    defaultValue={formData.admins}
                    onChange={(val) => handleSelectChange("admins", val)}
                    isMultiple={true}
                    placeholder="Select Admins"
                />

                <ElementsSelect
                    title="Participants"
                    options={employeesFactory.map((emp) => ({
                        id: emp.id,
                        element: (
                            <div className="flex items-center gap-2">
                                <img
                                    src={emp.imageProfile}
                                    alt={emp.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <span>{emp.name}</span>
                            </div>
                        ),
                        ...emp,
                    }))}
                    defaultValue={formData.participants}
                    onChange={(val) => handleSelectChange("participants", val)}
                    isMultiple={true}
                    placeholder="Select Participants"
                />

                <div className="flex gap-4">
                    <div className="w-1/2">
                        <DateInput
                            title="Date"
                            value={formData.date}
                            onChange={(e) => handleSelectChange("date", e.target.value)}
                        />
                    </div>
                    <div className="w-1/2">
                        <TimeInput
                            title="Meeting Time"
                            value={formData.time}
                            onChange={(e) => handleSelectChange("time", e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <TextAreaWithLabel title="Description" name="description"
                        value={formData.description} onChange={handleChange} />

                    <InputAndLabel
                        title="Meeting Link"
                        name="meetingLink"
                        value={formData.meetingLink}
                        onChange={handleChange}
                        placeholder="www.google.meet..."
                    />

                    <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium">
                        {t("Add to Calendar")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

CreateMeetingModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
    editData: PropTypes.object,
};

export default CreateMeetingModal;
