import Modal from "@/components/Modal/Modal";
import InputAndLabel from "@/components/Form/InputAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useGetDepartmentProfileQuery } from "@/redux/departments/departmentsApi";
import { useCreateChatMutation } from "@/redux/conversations/conversationsAPI";
import { useProcessing } from "@/app/providers";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setActiveChat } from "@/redux/conversations/conversationsSlice";
import { useRouter } from "next/navigation";

function CreateChatGroupModal({ isOpen, onClose, departmentData }) {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const { showProcessing, hideProcessing } = useProcessing();
    
    const { data: departmentProfile, isLoading: isProfileLoading } = useGetDepartmentProfileQuery(
        departmentData?._id,
        { skip: !departmentData?._id }
    );
    const [createChat] = useCreateChatMutation();

    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (departmentData) {
            setGroupName(`${departmentData.name} Group`);
            // Reset selection when department changes
            setSelectedMembers([]);
        }
    }, [departmentData]);

    const employees = departmentProfile?.employees || [];
    const membersOptions = employees.map(emp => ({
        id: emp.user?._id || emp._id,
        element: emp.user?.name || t("Unknown Employee")
    }));

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            alert(t("Please enter a group name"));
            return;
        }

        if (selectedMembers.length === 0) {
            alert(t("Please select at least one member"));
            return;
        }

        showProcessing(t("Creating chat group..."));
        try {
            // Extract IDs from selected objects
            const memberIds = selectedMembers.map(m => m.id);

            const result = await createChat({
                title: groupName,
                participants_ids: memberIds,
                is_group: true,
                model_type: "Department",
                model_id: departmentData._id
            }).unwrap();

            const chatObject = result?.data || result;

            if (chatObject?._id) {
                dispatch(setActiveChat(chatObject));
                onClose();
                router.push("/conversations");
            }
        } catch (error) {
            console.error("Failed to create group chat:", error);
            alert(t("Failed to create group chat. Please try again."));
        } finally {
            hideProcessing();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            btnApplyTitle={t("Create Group")}
            onClick={handleCreateGroup}
            className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"}
            title={t("Create Chat Group")}
        >
            <div className="px-4">
                <div className="flex flex-col gap-4">
                    <InputAndLabel
                        title={t("Group Name")}
                        type={"text"}
                        placeholder={t("Enter group name")}
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        isRequired={true}
                    />

                    <ElementsSelect
                        title={t("Add Members")}
                        isMultiple={true}
                        options={membersOptions}
                        placeholder={isProfileLoading ? t("Loading employees...") : t("Select members")}
                        onChange={(selected) => setSelectedMembers(selected)}
                        value={selectedMembers}
                    />

                    <TextAreaWithLabel
                        title={t("Description")}
                        placeholder={t("Enter group description...")}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
