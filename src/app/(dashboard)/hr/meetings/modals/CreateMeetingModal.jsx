import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal/Modal";
import InputAndLabel from "@/components/Form/InputAndLabel";
import DateInput from "@/components/Form/DateInput";
import ElementsSelect from "@/components/Form/ElementsSelect";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import TimeInput from "@/components/Form/TimeInput";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";

function CreateMeetingModal({ isOpen, onClose, isEdit, editData, onSubmit }) {
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

    const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !isOpen });
    const { data: departments = [] } = useGetDepartmentsQuery(undefined, { skip: !isOpen });

    const departmentOptions = useMemo(
        () => departments.map((d) => ({ id: d._id, name: d.name, element: d.name })),
        [departments],
    );

    const employeeOptions = useMemo(
        () =>
            employees.map((e) => {
                const name = e.user?.name || t("Unknown Employee");
                const image = e.user?.image;
                return {
                    id: e.user?._id || e._id,
                    name,
                    element: (
                        <div className="flex items-center gap-2">
                            {image ? (
                                <img src={image} alt={name} className="w-6 h-6 rounded-full object-cover" />
                            ) : null}
                            <span>{name}</span>
                        </div>
                    ),
                };
            }),
        [employees, t],
    );

    const typeOptions = [
        { id: "online", element: t("Online"), name: "Online" },
        { id: "person", element: t("In Person"), name: "In Person" },
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
        if (!formData.title.trim()) return;
        if (onSubmit) {
            onSubmit(formData);
        } else {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? t("Meeting Details") : t("Creating a Meeting")}
            isBtns={true}
            btnApplyTitle={isEdit ? t("Update") : t("Schedule")}
            onClick={handleSave}
            className="lg:w-[30%] md:w-8/12 sm:w-10/12 w-full p-6"
        >
            <div className="flex flex-col gap-4">
                <InputAndLabel
                    title={t("Meeting Title")}
                    isRequired={true}
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder={t("Meeting Title")}
                />

                <ElementsSelect
                    title={t("Departments")}
                    options={departmentOptions}
                    defaultValue={formData.departments}
                    onChange={(val) => handleSelectChange("departments", val)}
                    isMultiple={true}
                    placeholder={t("Select Departments")}
                />
                <ElementsSelect title={t("Type")}
                    options={typeOptions}
                    defaultValue={formData.type}
                    onChange={(val) => handleSelectChange("type", val)}
                    isMultiple={false}
                    placeholder={t("Select Type")}
                />

                <InputAndLabel
                    title={t("Topics")}
                    name="topics"
                    value={formData.topics}
                    onChange={handleChange}
                    placeholder={t("Topics")}
                />

                <ElementsSelect
                    title={t("Organizers")}
                    options={employeeOptions}
                    defaultValue={formData.admins}
                    onChange={(val) => handleSelectChange("admins", val)}
                    isMultiple={true}
                    placeholder={t("Select Organizers")}
                />

                <ElementsSelect
                    title={t("Participants")}
                    options={employeeOptions}
                    defaultValue={formData.participants}
                    onChange={(val) => handleSelectChange("participants", val)}
                    isMultiple={true}
                    placeholder={t("Select Participants")}
                />

                <div className="flex gap-4">
                    <div className="w-full md:w-1/2">
                        <DateInput
                            title={t("Date")}
                            value={formData.date}
                            onChange={(e) => handleSelectChange("date", e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <TimeInput
                            title={t("Meeting Time")}
                            value={formData.time}
                            onChange={(e) => handleSelectChange("time", e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <TextAreaWithLabel title={t("Description")} name="description"
                        value={formData.description} onChange={handleChange} />

                    <InputAndLabel
                        title={t("Meeting Link")}
                        name="meetingLink"
                        value={formData.meetingLink}
                        onChange={handleChange}
                        placeholder={t("www.google.meet...")}
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
    onSubmit: PropTypes.func,
};

export default CreateMeetingModal;
