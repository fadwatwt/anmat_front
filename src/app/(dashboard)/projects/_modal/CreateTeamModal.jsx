import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import SelectAndLabel from "@/components/Form/SelectAndLabel.jsx";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import FileUpload from "@/components/Form/FileUpload.jsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function CreateTeamModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [teamData, setTeamData] = useState({
        projectName: "Omega Project",
        teamName: "",
        teamLeader: null,
        relatedModelType: "",
        relatedModelRecord: "",
        members: [],
        createGroupChat: false,
    });

    const handleChange = (field, value) => {
        setTeamData((prev) => ({ ...prev, [field]: value }));
    };

    const teamLeaders = [
        { id: 1, name: "Ahmed", image: "https://i.pravatar.cc/150?u=1" },
        { id: 2, name: "Fatma", image: "https://i.pravatar.cc/150?u=2" },
    ].map(user => ({
        ...user,
        element: (
            <div className="flex items-center gap-2">
                <img src={user.image} alt={user.name} className="w-6 h-6 rounded-full" />
                <span>{user.name}</span>
            </div>
        )
    }));

    const allMembers = [
        { id: 1, name: "Yara Nabil", username: "Yara", image: "https://i.pravatar.cc/150?u=3" },
        { id: 2, name: "Ahmed Khalil", username: "Ahmed", image: "https://i.pravatar.cc/150?u=4" }
    ].map(user => ({
        ...user,
        element: (
            <div className="flex items-center gap-2">
                <img src={user.image} alt={user.name} className="w-6 h-6 rounded-full" />
                <span>{user.name}</span>
            </div>
        )
    }));

    const modelTypes = [
        { id: "task", name: "Task" },
        { id: "subtask", name: "Subtask" },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t("Creating a Team")}
            isBtns={true}
            btnApplyTitle={t("Create")}
            onSubmit={() => {
                console.log("Create team", teamData);
                onClose();
            }}
        >
            <div className="flex flex-col gap-4 w-full">
                <SelectAndLabel
                    label={t("Project Name")}
                    options={[{ id: "Omega Project", name: "Omega Project" }]}
                    value={teamData.projectName}
                    onChange={(e) => handleChange("projectName", e.target.value)}
                    classNameContainer="w-full"
                />

                <InputAndLabel
                    label={t("Team Name")}
                    placeholder={t("Team Name..")}
                    value={teamData.teamName}
                    onChange={(e) => handleChange("teamName", e.target.value)}
                    classNameContainer="w-full"
                />

                <ElementsSelect
                    title={t("Team Leader")}
                    placeholder={t("Select Team Leader...")}
                    options={teamLeaders}
                    defaultValue={teamData.teamLeader ? [teamData.teamLeader] : []}
                    onChange={(val) => handleChange("teamLeader", val[0])}
                    isMultiple={false}
                    classNameContainer="w-full"
                />

                <SelectAndLabel
                    label={t("Related Model-Type")}
                    placeholder={t("Select Related Model-Type...")}
                    options={modelTypes}
                    value={teamData.relatedModelType}
                    onChange={(e) => handleChange("relatedModelType", e.target.value)}
                    classNameContainer="w-full"
                />

                <SelectAndLabel
                    label={t("Related Model Record")}
                    placeholder={t("Select Related Model Record...")}
                    options={[]} // Dummy
                    value={teamData.relatedModelRecord}
                    onChange={(e) => handleChange("relatedModelRecord", e.target.value)}
                    classNameContainer="w-full"
                />

                <ElementsSelect
                    title={t("Members")}
                    placeholder={t("Select Members...")}
                    options={allMembers}
                    defaultValue={teamData.members}
                    onChange={(val) => handleChange("members", val)}
                    isMultiple={true}
                    classNameContainer="w-full"
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                        {t("Avatar")}
                    </label>
                    <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white-5">
                        <FileUpload />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="createGroupChat"
                        checked={teamData.createGroupChat}
                        onChange={(e) => handleChange("createGroupChat", e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="createGroupChat" className="text-sm text-gray-700 dark:text-gray-300">
                        {t("Allow creating group chat for the team")}
                    </label>
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
