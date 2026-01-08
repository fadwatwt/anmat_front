import React, { useState, useEffect } from "react";
import PropTypes, { element } from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "../../../../../components/Modal/Modal";
import InputAndLabel from "../../../../../components/Form/InputAndLabel";
import FileUpload from "../../../../../components/Form/FileUpload";
import SelectAndLabel from "../../../../../components/Form/SelectAndLabel";
import { IoAdd, IoClose } from "react-icons/io5";
import ElementsSelect from "@/components/Form/ElementsSelect";
import { employeesFactory } from "@/functions/FactoryData";

function CreateChatGroupModal({ isOpen, onClose, isEdit, editData }) {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        title: "",
        modelType: "",
        modelRecord: "",
        participants: [],
        avatar: null,
    });

    const [admins, setAdmins] = useState([{ userId: null, permission: [] }]);

    // Dummy Options for MultiSelect (id, value)
    const modelTypeOptions = [
        { id: "Project", value: "Project", _id: "Project", name: "Project" },
        { id: "Team", value: "Team", _id: "Team", name: "Team" },
        { id: "Department", value: "Department", _id: "Department", name: "Department" },
        { id: "Issue", value: "Issue", _id: "Issue", name: "Issue" },
    ];

    const participantOptions = employeesFactory.map(emp => ({
        ...emp,
        _id: emp.id,
        value: emp.name // SelectAndLabel might not need value but MultiSelect did. SelectAndLabel uses name.
    }));

    const permissionOptions = [
        { id: "View", element: "View", _id: "View", name: "View" },
        { id: "Edit", element: "Edit", _id: "Edit", name: "Edit" },
    ];

    useEffect(() => {
        if (isEdit && editData) {
            setFormData({
                title: editData.title || "",
                modelType: editData.modelType || "",
                modelRecord: editData.modelRecord || "",
                participants: editData.participants || [],
                avatar: editData.avatar || null,
            });
            setAdmins(editData.admins || [{ userId: null, permission: [] }]);
        } else {
            // Reset
            setFormData({
                title: "",
                modelType: "",
                modelRecord: "",
                participants: [],
                avatar: null,
            });
            setAdmins([{ userId: null, permission: [] }]);
        }
    }, [isOpen, isEdit, editData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleAdminChange = (index, field, value) => {
        const newAdmins = [...admins];
        newAdmins[index][field] = value;
        setAdmins(newAdmins);
    };

    const addAdminRow = () => {
        setAdmins([...admins, { userId: null, permission: [] }]);
    };

    const removeAdminRow = (index) => {
        if (admins.length > 1) {
            const newAdmins = admins.filter((_, i) => i !== index);
            setAdmins(newAdmins);
        }
    };

    const handleSave = () => {
        console.log("Saving Chat Group:", { ...formData, admins });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Chat Group Details" : "Creating a Chat Group"}
            isBtns={true}
            btnApplyTitle={isEdit ? "Update" : "Save"}
            onClick={handleSave}
            className="lg:w-[40%] md:w-9/12 sm:w-11/12 w-full p-6"
        >
            <div className="flex flex-col gap-4">
                {/* Chat Group Title */}
                <InputAndLabel
                    title="Chat Group Title"
                    isRequired={true}
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Chat Group Title"
                />

                {/* Model Type & Record */}
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <SelectAndLabel
                            title="Model Type"
                            options={modelTypeOptions}
                            value={formData.modelType}
                            onChange={(val) => handleSelectChange("modelType", val)}
                            placeholder="Select Type"
                            name="modelType"
                        />
                    </div>
                    <div className="w-1/2">
                        <InputAndLabel
                            title="Model Record"
                            isRequired={true}
                            name="modelRecord"
                            value={formData.modelRecord}
                            onChange={handleChange}
                            placeholder="Model Record Name"
                        />
                    </div>
                </div>

                {/* Participants */}
                <ElementsSelect
                    title=""
                    options={employeesFactory.map(emp => ({
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
                        ...emp
                    }))}
                    defaultValue={formData.participants}
                    onChange={(val) => handleSelectChange("participants", val)}
                    isMultiple={true}
                    placeholder="Select Participants"
                />


                {/* Admins Section */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <label className="text-gray-900 w-7/12 dark:text-gray-200 text-sm font-medium">{t("Admin")}</label>
                        <label className="text-gray-900 w-5/12  dark:text-gray-200 text-sm font-medium">{t("Permissions")}</label>
                    </div>

                    {admins.map((admin, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <div className="w-7/12">
                                <ElementsSelect
                                    title=""
                                    options={employeesFactory.map(emp => ({
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
                                        ...emp
                                    }))}
                                    defaultValue={admin.userId ? [admin.userId] : []}
                                    onChange={(val) => handleAdminChange(index, "userId", val[0])}
                                    isMultiple={false}
                                    placeholder="Select Admin"
                                    name={`admins-${index}`}
                                    classNameContainer="mb-0"
                                />
                            </div>
                            <div className="w-5/12">
                                <ElementsSelect
                                    title=""
                                    options={permissionOptions}
                                    defaultValue={Array.isArray(admin.permission) ? admin.permission : (admin.permission ? [permissionOptions.find(p => p.id === admin.permission)] : [])}
                                    onChange={(val) => handleAdminChange(index, "permission", val)}
                                    // defaultValue={admin.permission}
                                    // onChange={(val) => handleAdminChange(index, "permission", val)}
                                    isMultiple={true}
                                    placeholder="Select Permission"
                                    name={`permissions-${index}`}
                                    classNameContainer="mb-0"
                                />
                            </div>
                            {admins.length > 1 && (
                                <button onClick={() => removeAdminRow(index)} className="text-red-500 hover:text-red-700">
                                    <IoClose size={20} />
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={addAdminRow}
                        className="text-blue-600 text-sm font-medium flex items-center gap-1 mt-1 w-fit hover:underline"
                    >
                        <IoAdd size={16} /> {t("Add New Admin")}
                    </button>
                </div>

                {/* Avatar */}
                <div>
                    <label className="text-gray-900 dark:text-gray-200 text-sm mb-2 block">{t("Avatar")}</label>
                    <FileUpload
                        title="Choose a file or drag & drop here"
                        onFileSelect={(file) => setFormData({ ...formData, avatar: file })}
                    />
                </div>

                {/* Note */}
                <div className="flex gap-2 items-start bg-blue-50 p-2 rounded-md dark:bg-gray-700">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                        {t("You can optionally add other members alert in this department Or Team")}
                    </p>
                </div>
            </div>
        </Modal>
    );
}

CreateChatGroupModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
    editData: PropTypes.object,
};

export default CreateChatGroupModal;
