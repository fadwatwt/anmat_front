import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/Tables/Table.jsx";
import Alert from "@/components/Alerts/Alert.jsx";
import NameAndDescription from "@/app/(dashboard)/projects/_components/TableInfo/NameAndDescription.jsx";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails.jsx";
import Department from "@/app/(dashboard)/projects/_components/TableInfo/Department.jsx";
import Assignees from "@/app/(dashboard)/projects/_components/TableInfo/Assignees.jsx";
import Teams from "@/app/(dashboard)/projects/_components/TableInfo/Teams.jsx";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import Progress from "@/app/(dashboard)/projects/_components/TableInfo/Progress.jsx";
import Rating from "@/app/(dashboard)/projects/_components/TableInfo/Rating.jsx";
import EditProjectModal from "@/app/(dashboard)/projects/_modal/EditProjectModal";
import { defaultPhoto } from "@/Root.Route.js";
import { convertToSlug } from "@/functions/AnotherFunctions.js";
import { deleteProject } from "@/redux/projects/projectSlice";
import {
    RiLayoutGridFill, RiGroupFill,
    RiTimeFill, RiPencilLine,
    RiEyeLine,
    RiCheckboxCircleFill,
    RiDownload2Line,
    RiCalendarFill
} from "@remixicon/react";
import StatusActions from "@/components/Dropdowns/StatusActions";


import { useGetSubscriberProjectsQuery } from "@/redux/projects/subscriberProjectsApi";
import dayjs from "dayjs";

function ProjectsTab() {
    const { t } = useTranslation();

    const { data: projectsData, isLoading, isError, error } = useGetSubscriberProjectsQuery();
    const projects = projectsData || [];

    const [pagination, setPagination] = useState({ currentPage: 1, rowsPerPage: 7, totalPages: 1 });
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setPagination(prev => ({ ...prev, rowsPerPage: newRowsPerPage, currentPage: 1 }));
    };

    const handleEditProject = (index) => {
        setSelectedProject(projects[index]);
        setIsOpenEditModal(true);
    };

    const handleDeleteProject = (index) => {
        setSelectedProject(projects[index]);
        setIsOpenDeleteAlert(true);
    };

    const confirmDelete = () => {
        // Logic for deletion would go here (mutation call)
        setIsOpenDeleteAlert(false);
        setSelectedProject(null);
    };

    const headers = [
        { label: t("Projects"), width: "300px" },
        { label: t("Manager"), width: "220px" },
        { label: t("Department"), width: "220px" },
        { label: t("Assignees"), width: "180px" },
        { label: t("Start Date"), width: "150px" },
        { label: t("Due Date"), width: "150px" },
        { label: t("Status"), width: "140px" },
        { label: t("Progress"), width: "120px" },
        { label: "", width: "50px" }, // Actions
    ];

    const customActions = (index) => (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 p-1 flex flex-col">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiEyeLine size={16} className="text-blue-500" /> {t("View")}
            </button>
            <button onClick={() => handleEditProject(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiPencilLine size={16} className="text-blue-500" /> {t("Edit")}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiDownload2Line size={16} className="text-blue-500" /> {t("Download Attachs")}
            </button>
        </div>
    );

    const rows = projects.map((project) => [
        <NameAndDescription
            key={`name-${project._id}`}
            path={`/projects/${project._id}-${convertToSlug(project.name)}`}
            name={project.name}
            description={project.description}
        />,
        <AccountDetails
            key={`mgr-${project._id}`}
            account={{
                name: project.manager?.name || project.manager_id?.name || project.manager_id || t("No Manager"),
                rule: t("Manager"),
                imageProfile: project.manager?.imageProfile || project.manager_id?.imageProfile || defaultPhoto,
            }}
        />,
        <Department
            key={`dept-${project._id}`}
            name={project.department?.name || project.department_id?.name || project.department_id || t("No Department")}
            icon={RiLayoutGridFill}
        />,
        <Assignees
            key={`assign-${project._id}`}
            users={(project.assignees || project.assignees_ids || []).map(user => ({
                name: user?.name || user,
                avatar: user?.imageProfile || user?.avatar || defaultPhoto
            }))}
        />,
        <span key={`start-${project._id}`} className="text-sm text-gray-700 dark:text-gray-300">
            {project.start_date ? dayjs(project.start_date).format("DD MMM, YYYY") : t("N/A")}
        </span>,
        <span key={`due-${project._id}`} className="text-sm text-gray-700 dark:text-gray-300">
            {project.due_date ? dayjs(project.due_date).format("DD MMM, YYYY") : t("N/A")}
        </span>,
        <Status key={`status-${project._id}`} type={project.status || "open"} />,
        <Progress key={`prog-${project._id}`} percentage={project.progress || 0} />,
    ]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-primary-500 animate-pulse font-medium">{t("Loading projects...")}</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-64 text-red-500 font-medium">
                {error?.data?.message || t("Error loading projects")}
            </div>
        );
    }

    return (
        <div>
            <Table
                title={t("All Projects")}
                headers={headers}
                rows={rows}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                rowsPerPage={pagination.rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                isActions={false}
                customActions={customActions}
                isCheckInput={true}
                handelEdit={handleEditProject}
                handelDelete={handleDeleteProject}
                className="min-w-[2000px] table-fixed"
            />

            {selectedProject && (
                <EditProjectModal
                    project={selectedProject}
                    isOpen={isOpenEditModal}
                    onClose={() => {
                        setIsOpenEditModal(false);
                        setSelectedProject(null);
                    }}
                />
            )}

            <Alert
                type="warning"
                title={t("Delete Project?")}
                message={t("This action cannot be undone")}
                titleCancelBtn={t("Cancel")}
                titleSubmitBtn={t("Delete")}
                isOpen={isOpenDeleteAlert}
                isBtns={1}
                onClose={() => {
                    setIsOpenDeleteAlert(false);
                    setSelectedProject(null);
                }}
                onSubmit={confirmDelete}
            />
        </div>
    );
}

export default ProjectsTab;
