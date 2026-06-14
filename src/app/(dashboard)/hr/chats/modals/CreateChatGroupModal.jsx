import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "../../../../../components/Modal/Modal";
import InputAndLabel from "../../../../../components/Form/InputAndLabel";
import FileUpload from "../../../../../components/Form/FileUpload";
import SelectAndLabel from "../../../../../components/Form/SelectAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import {
    useCreateChatMutation,
    useAddParticipantsMutation,
    useUploadFileMutation,
} from "@/redux/conversations/conversationsAPI";

// model_type values supported by the backend chat schema.
const MODEL_TYPE_OPTIONS = [
    { id: "Project", _id: "Project", name: "Project", value: "Project" },
    { id: "Team", _id: "Team", name: "Team", value: "Team" },
    { id: "Department", _id: "Department", name: "Department", value: "Department" },
    { id: "Issue", _id: "Issue", name: "Issue", value: "Issue" },
];

function CreateChatGroupModal({ isOpen, onClose, isEdit, isView, editData }) {
    const { t } = useTranslation();

    const { data: employeesData } = useGetEmployeesQuery();
    const [createChat, { isLoading: isCreating }] = useCreateChatMutation();
    const [addParticipants, { isLoading: isAddingParticipants }] = useAddParticipantsMutation();
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

    const employees = employeesData || [];

    const [formData, setFormData] = useState({
        title: "",
        modelType: "",
        modelRecord: "",
        participants: [],
        avatar: null,
    });
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const readOnly = !!isView;
    const isSaving = isCreating || isAddingParticipants || isUploading;

    // Build employee options once for the participant selector.
    const participantOptions = employees.map((emp) => ({
        id: emp.user_id || emp._id,
        element: (
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    {(emp.user?.name || "?").charAt(0).toUpperCase()}
                </div>
                <span>{emp.user?.name || t("Unknown")}</span>
            </div>
        ),
        name: emp.user?.name,
    }));

    useEffect(() => {
        if (!isOpen) return;
        if ((isEdit || isView) && editData) {
            const participantIds = (editData.participants_ids || []).map((p) => ({
                id: (p?._id || p)?.toString(),
                element: p?.name || t("Unknown"),
                name: p?.name,
            }));
            setFormData({
                title: editData.title || "",
                modelType: editData.model_type || "",
                modelRecord: editData.model_id ? editData.model_id.toString() : "",
                participants: participantIds,
                avatar: editData.image || null,
            });
        } else {
            setFormData({
                title: "",
                modelType: "",
                modelRecord: "",
                participants: [],
                avatar: null,
            });
        }
    }, [isOpen, isEdit, isView, editData, t]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (readOnly) {
            onClose();
            return;
        }

        if (!formData.title.trim()) {
            setApiResponse({ isOpen: true, status: "error", message: t("Chat Group Title is required") });
            return;
        }

        const participantIds = (formData.participants || [])
            .map((p) => p.id)
            .filter(Boolean);

        if (participantIds.length === 0) {
            setApiResponse({ isOpen: true, status: "error", message: t("Please select at least one participant") });
            return;
        }

        try {
            if (isEdit && editData?._id) {
                // Editing only supports syncing newly added participants.
                const existingIds = (editData.participants_ids || []).map((p) => (p?._id || p)?.toString());
                const newIds = participantIds.filter((id) => !existingIds.includes(id));
                if (newIds.length > 0) {
                    await addParticipants({ chatId: editData._id, participantIds: newIds }).unwrap();
                }
                setApiResponse({ isOpen: true, status: "success", message: t("Chat group updated successfully") });
            } else {
                const payload = {
                    title: formData.title.trim(),
                    participants_ids: participantIds,
                    is_group: true,
                };
                if (formData.modelType) payload.model_type = formData.modelType;
                if (formData.modelRecord) payload.model_id = formData.modelRecord;

                const created = await createChat(payload).unwrap();

                // Optionally upload the avatar against the freshly-created chat.
                const chatId = created?.data?._id || created?._id;
                if (formData.avatar instanceof File && chatId) {
                    await uploadFile({ chatId, file: formData.avatar }).unwrap();
                }
                setApiResponse({ isOpen: true, status: "success", message: t("Chat group created successfully") });
            }
            onClose();
        } catch (err) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: err?.data?.message || t("Failed to save chat group"),
            });
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={isView ? t("Chat Group Details") : isEdit ? t("Chat Group Details") : t("Creating a Chat Group")}
                isBtns={!readOnly}
                btnApplyTitle={isSaving ? t("Saving...") : isEdit ? t("Update") : t("Save")}
                onClick={handleSave}
                className="lg:w-[40%] md:w-9/12 sm:w-11/12 w-full p-6"
            >
                <div className="flex flex-col gap-4">
                    {/* Chat Group Title */}
                    <InputAndLabel
                        title={t("Chat Group Title")}
                        isRequired={true}
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder={t("Chat Group Title")}
                        disabled={readOnly}
                    />

                    {/* Model Type & Record */}
                    <div className="flex gap-4">
                        <div className="w-full md:w-1/2">
                            <SelectAndLabel
                                title={t("Model Type")}
                                options={MODEL_TYPE_OPTIONS}
                                value={formData.modelType}
                                onChange={(val) => !readOnly && handleSelectChange("modelType", val)}
                                onBlur={() => {}}
                                placeholder={t("Select Type")}
                                name="modelType"
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <InputAndLabel
                                title={t("Model Record")}
                                name="modelRecord"
                                value={formData.modelRecord}
                                onChange={handleChange}
                                placeholder={t("Model Record ID")}
                                disabled={readOnly}
                            />
                        </div>
                    </div>

                    {/* Participants */}
                    <div>
                        <label className="text-gray-900 dark:text-gray-200 text-sm mb-2 block">
                            {t("Participants")}
                        </label>
                        <ElementsSelect
                            title=""
                            options={participantOptions}
                            defaultValue={formData.participants}
                            onChange={(val) => handleSelectChange("participants", val)}
                            isMultiple={true}
                            placeholder={t("Select Participants")}
                        />
                    </div>

                    {/* Avatar */}
                    {!readOnly && (
                        <div>
                            <label className="text-gray-900 dark:text-gray-200 text-sm mb-2 block">{t("Avatar")}</label>
                            <FileUpload
                                title={t("Choose a file or drag & drop here")}
                                onFileSelect={(file) => setFormData((prev) => ({ ...prev, avatar: file }))}
                            />
                        </div>
                    )}

                    {/* Note */}
                    <div className="flex gap-2 items-start bg-blue-50 p-2 rounded-md dark:bg-gray-700">
                        <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                            {t("The creator becomes the group admin automatically. You can manage participants after creation.")}
                        </p>
                    </div>
                </div>
            </Modal>

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
            />
        </>
    );
}

CreateChatGroupModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
    isView: PropTypes.bool,
    editData: PropTypes.object,
};

export default CreateChatGroupModal;
