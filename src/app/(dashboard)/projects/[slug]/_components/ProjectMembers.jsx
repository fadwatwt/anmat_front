import PropTypes from "prop-types";
import BtnAddOutline from "@/components/Form/BtnAddOutline.jsx";
import { useTranslation } from "react-i18next";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import useDropdown from "@/Hooks/useDropdown.js";
import ActionsBtns from "@/components/ActionsBtns.jsx";
import { useState } from "react";
import AddMember from "./AddMember.jsx";
import CreateTeamModal from "@/app/(dashboard)/projects/_modal/CreateTeamModal.jsx";


function ProjectMembers({ teams = [], title = "Project Members" }) {
    const { t } = useTranslation()
    const [dropdownOpen, setDropdownOpen] = useDropdown();
    const [addMemberModal, setAddMemberModal] = useState({ isOpen: false, teamIndex: null });
    const [createTeamModal, setCreateTeamModal] = useState(false);

    const getBadge = (rule) => {
        switch (rule) {
            case "Manager":
                return <span className="px-2 py-0.5 rounded-full text-teal-700 border border-teal-700 text-[11px]">{t("Manager")}</span>;
            case "Team lead":
                return <span className="px-2 py-0.5 rounded-full text-purple-700 border border-purple-700 text-[11px]">{t("Team lead")}</span>;
            default:
                return null;
        }
    };
    const handleDropdownToggle = (key) => {
        setDropdownOpen(dropdownOpen === key ? null : key);
    };

    const handleAddMember = (teamIndex) => {
        setAddMemberModal({ isOpen: true, teamIndex });
    }

    const handleCloseAddMember = () => {
        setAddMemberModal({ isOpen: false, teamIndex: null });
    }

    return (
        <>
            <div className={"flex flex-col w-full p-4 rounded-2xl items-start gap-4 bg-white dark:bg-white-0"}>
                <div className="flex justify-between items-center w-full">
                    <p className={"text-lg dark:text-gray-200"}>{t(title)}</p>
                    <div className="w-fit">
                        <BtnAddOutline onClick={() => setCreateTeamModal(true)} title={"Create a team"} />
                    </div>
                </div>

                <div className={"flex flex-col gap-6 w-full "}>
                    {
                        teams.map((team, teamIndex) => (
                            <div key={teamIndex} className="flex flex-col gap-3 w-full">
                                <p className="text-md font-medium text-gray-600 dark:text-gray-300">{team.name}</p>
                                <div className="flex flex-col gap-3 w-full pl-2">
                                    {team.members.map((member, memberIndex) => {
                                        const key = `${teamIndex}-${memberIndex}`;
                                        return (
                                            <div key={memberIndex} className={"flex justify-between items-center"}>
                                                <div className={"flex gap-3 items-center"}>
                                                    <div className={"w-10 h-10"}>
                                                        <img
                                                            src={member.imageProfile}
                                                            alt={"image member"}
                                                            className={"max-w-full rounded-full w-10 h-10 object-cover"} />
                                                    </div>
                                                    <div className={"nameAndWork flex flex-col gap-1 items-start"}>
                                                        <div className={"nameAndRule flex gap-1 items-center"}>
                                                            <p className={"text-sm dark:text-gray-200"}>{member.name}</p>
                                                            {
                                                                getBadge(member.rule)
                                                            }
                                                        </div>
                                                        <p className={"text-xs text-sub-500 dark:text-sub-300"}>{member.work}</p>
                                                    </div>
                                                </div>
                                                <div className="relative cursor-pointer flex-1 flex justify-end dropdown-container"
                                                    onClick={() => handleDropdownToggle(key)}>
                                                    <PiDotsThreeVerticalBold />
                                                    {dropdownOpen === key && <ActionsBtns className={"mt-5"} isEditBtn={false} handleDelete={() => { }} />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <BtnAddOutline onClick={() => handleAddMember(teamIndex)} title={"Add a member"} />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <AddMember
                isOpen={addMemberModal.isOpen}
                onClose={handleCloseAddMember}
                teamName={addMemberModal.teamIndex !== null ? teams[addMemberModal.teamIndex].name : null}
            />
            <CreateTeamModal isOpen={createTeamModal} onClose={() => setCreateTeamModal(false)} />

        </>
    );
}

ProjectMembers.propTypes = {
    teams: PropTypes.array.isRequired,
    title: PropTypes.string
}

export default ProjectMembers;