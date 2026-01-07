"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CreateTeamModal from "@/app/(dashboard)/hr/teams/modals/CreateTeam.modal";
import CreateChatGroupModal from "@/app/(dashboard)/hr/departments/modals/CreateChatGroup.modal";
import TeamRatingModal from "@/app/(dashboard)/hr/teams/modals/TeamRating.modal";
// import EvaluationModal from "@/app/(dashboard)/hr/teams/modals/EvaluationModal";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails.jsx";
import { RiEditLine, RiDeleteBin7Line, RiNotification4Line, RiChat1Line, RiStarLine } from "@remixicon/react";
import StatusActions from "@/components/Dropdowns/StatusActions";
import Alert from "@/components/Alerts/Alert";
import Table from "@/components/Tables/Table"
import Page from "@/components/Page";
import { teamsFactory } from "@/functions/FactoryData";

import SendNotificationModal from "@/app/(dashboard)/hr/employees/modals/SendNotification.modal.jsx";

function TeamsPage() {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenCreateChatGroupModal, setIsOpenCreateChatGroupModal] = useState(false);
    const [isOpenEvaluationModal, setIsOpenEvaluationModal] = useState(false);
    const [isOpenSendNotificationModal, setIsOpenSendNotificationModal] = useState(false); // Added state

    // Edit & Deletion states
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedDeleteTeam, setSelectedDeleteTeam] = useState(null);
    const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
    const [isOpenSuccessDeleteAlert, setIsOpenSuccessDeleteAlert] = useState(false);

    // Filters
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const headers = [
        { label: t("Teams"), width: "250px" },
        { label: t("Related Model"), width: "300px" },
        { label: t("Team Leader"), width: "200px" },
        { label: t("Team Members"), width: "150px" },
        { label: t("No. of Active Tasks / Projects"), width: "150px" },
        { label: t("No. of Employees"), width: "120px" },
        { label: t("Score"), width: "120px" },
        { label: "", width: "50px" },
    ];

    const TeamActions = ({ actualRowIndex }) => {
        const { t, i18n } = useTranslation();
        const team = teamsFactory[actualRowIndex];

        const statesActions = [
            {
                text: t("Edit"),
                icon: <RiEditLine size={20} className="text-primary-400" />,
                onClick: () => {
                    setSelectedTeam(team);
                    setIsOpenCreateModal(true);
                },
            },
            {
                text: t("Send Notification"),
                icon: <RiNotification4Line size={20} className="text-primary-400" />,
                onClick: () => {
                    setSelectedTeam(team);
                    setIsOpenSendNotificationModal(true);
                }
            },
            {
                text: t("Delete"),
                icon: <RiDeleteBin7Line size={20} className="text-red-500" />,
                onClick: () => handleDeleteTeam(team),
            },
            {
                text: t("Create Chat Group"),
                icon: <RiChat1Line size={20} className="text-primary-400" />,
                onClick: () => {
                    setSelectedTeam(team);
                    setIsOpenCreateChatGroupModal(true);
                }
            }
        ]
        return (
            <StatusActions states={statesActions} className={`${i18n.language === "ar" ? "left-0" : "right-0"
                }`} />
        );
    }

    const TeamRowTable = (teams) => {
        return teams?.map((team, index) => [
            <AccountDetails
                key={`team-${index}`}
                path={`/hr/teams/${team.id}`}
                account={{
                    name: team.name,
                    imageProfile: team.icon || "/images/icons/team-placeholder.png",
                }}
            />,
            <AccountDetails
                key={`related-${index}`}
                path={`/hr/departments/${team.id}`} // Or project path based on type
                account={{
                    name: team.relatedModel?.name || "-",
                    imageProfile: team.relatedModel?.image,
                }}
                subTitle={team.relatedModel?.typeSubtitle} // Pass subtitle if AccountDetails supports it or custom component needed
            />,
            <AccountDetails
                key={`leader-${index}`}
                path={`/hr/employees/${team.leader?.id}`}
                account={{
                    name: team.leader?.name || t("No Leader"),
                    imageProfile: team.leader?.imageProfile,
                }}
            />,
            <div key={`members-${index}`} className="flex items-center">
                <div className="flex -space-x-3 rtl:space-x-reverse overflow-hidden p-1">
                    {team.members?.slice(0, 4).map((member, i) => (
                        <div key={i} className="relative z-10 w-8 h-8 rounded-full border-2 border-white dark:border-gray-800">
                            <img src={member.imageProfile} alt="" className="w-full h-full rounded-full object-cover" />
                        </div>
                    ))}
                    {team.members_count > 0 && (
                        <div className="relative z-20 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-gray-100 text-[10px] font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            +{team.members_count}
                        </div>
                    )}
                </div>
            </div>,
            <div key={`stats-${index}`} className="flex items-center text-sm text-gray-500 py-2">
                <span className="font-medium text-gray-600">
                    {team.tasks_count || 0}
                </span>
            </div>,
            <div key={`employees-${index}`} className="flex items-center text-sm text-gray-500 py-2">
                <span className="font-medium text-gray-600 px-4">
                    {team.employees_count || 0}
                </span>
            </div>,
            <button
                key={`score-${index}`}
                onClick={() => {
                    setSelectedTeam(team);
                    setIsOpenEvaluationModal(true);
                }}
                className="flex items-center gap-1 px-3 py-1 border border-gray-200 bg-gray-50   rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
                <RiStarLine className="text-orange-400" size={16} />
                {t("Rate")}
            </button>
        ]);
    };

    const handleDeleteTeam = (team) => {
        setSelectedDeleteTeam(team);
        setIsOpenDeleteAlert(true);
    };

    const handleDeleteConfirmation = async (isConfirmed) => {
        setIsOpenDeleteAlert(false);
        if (isConfirmed && selectedDeleteTeam) {
            console.log("Deleting team:", selectedDeleteTeam.id);
            setIsOpenSuccessDeleteAlert(true);
        }
    };

    return (
        <Page title={t("HR - Teams Management")}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 h-full">
                    <Table
                        title={t("Teams")}
                        headers={headers}
                        isActions={false}
                        isCheckInput={true}
                        showListOfDepartments={true}
                        selectedDepartment={selectedDepartment}
                        onDepartmentChange={setSelectedDepartment}
                        customActions={(actualRowIndex) => (
                            <TeamActions actualRowIndex={actualRowIndex} />
                        )}
                        rows={TeamRowTable(teamsFactory)}
                        headerActions={
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => setIsOpenSendNotificationModal(true)}
                                    className="bg-[#EEF2FF] text-[#375DFB] px-4 py-2 rounded-lg text-sm font-medium">
                                    {t("Send Notification")}
                                </button>
                                <button
                                    onClick={() => setIsOpenCreateModal(true)}
                                    className="bg-[#375DFB] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                                    <span>+</span>
                                    {t("Create a Team")}
                                </button>
                            </div>
                        }
                    />
                </div>
            </div>

            <CreateTeamModal
                isOpen={isOpenCreateModal}
                onClose={() => setIsOpenCreateModal(false)}
            />

            <CreateChatGroupModal
                isOpen={isOpenCreateChatGroupModal}
                onClose={() => {
                    setIsOpenCreateChatGroupModal(false);
                    setSelectedTeam(null);
                }}
                departmentData={selectedTeam} // Reusing prop, potentially rename prop in future
            />

            {/* <EvaluationModal
                isOpen={isOpenEvaluationModal}
                onClose={() => {
                    setIsOpenEvaluationModal(false);
                    setSelectedTeam(null);
                }}
                team={selectedTeam}
            /> */}
            <TeamRatingModal
                isOpen={isOpenEvaluationModal}
                onClose={() => {
                    setIsOpenEvaluationModal(false);
                    setSelectedTeam(null);
                }}
                team={selectedTeam}
            />

            <SendNotificationModal
                isOpen={isOpenSendNotificationModal}
                onClose={() => setIsOpenSendNotificationModal(false)}
            />

            <Alert
                type="delete"
                isOpen={isOpenDeleteAlert}
                onClose={() => setIsOpenDeleteAlert(false)}
                title="Delete Team"
                message={
                    <span>
                        Are you sure you want to <b>Delete {selectedDeleteTeam?.name}</b>?
                    </span>
                }
                isBtns={true}
                titleSubmitBtn="Yes, Delete"
                titleCancelBtn="Cancel"
                onSubmit={handleDeleteConfirmation}
            />
            <Alert
                type="success"
                title="Team Deleted"
                isBtns={false}
                message={`The team "${selectedDeleteTeam?.name}" has been successfully deleted.`}
                isOpen={isOpenSuccessDeleteAlert}
                onClose={() => setIsOpenSuccessDeleteAlert(false)}
            />
        </Page>
    );
}

export default TeamsPage;
