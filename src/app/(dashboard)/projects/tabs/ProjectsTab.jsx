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


// Dummy Data
const dummyProjects = Array.from({ length: 8 }).map((_, i) => ({
    _id: `proj-${i}`,
    projectName: "Pulse Dashboard",
    description: "Developing a dashboard for real-time analytics",
    manager: {
        name: "Fatma Ahmed Mohamed",
        role: "Product Manager",
        avatar: defaultPhoto,
    },
    department: {
        name: "Digital Publishing Division",
        icon: RiLayoutGridFill,
    },
    category: "Lorem Ipsum",
    assignees: [
        { name: "User 1", avatar: defaultPhoto },
        { name: "User 2", avatar: defaultPhoto },
        { name: "User 3", avatar: defaultPhoto },
        { name: "User 4", avatar: defaultPhoto },
    ],
    teams: [
        { name: "Dev", icon: RiGroupFill },
        { name: "Design", icon: RiLayoutGridFill },
        { name: "QA", icon: RiGroupFill },
    ],
    assignedDate: "15 Nov, 2024",
    dueDate: "16 Jan, 2025",
    startDate: "15 Nov, 2024",
    endDate: "16 Jan, 2025",
    updatedAt: "16 Jan, 2025",
    progress: 20,
    rating: 4.5,
    template: "Template 1",
    status: { type: i % 2 === 0 ? "Active" : "In Review" },
}));


function ProjectsTab() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Local State for dummy functionality
    const [projects, setProjects] = useState(dummyProjects);
    const [pagination, setPagination] = useState({ currentPage: 1, rowsPerPage: 7, totalPages: 2 });
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
        // Dummy delete
        setProjects(prev => prev.filter(p => p._id !== selectedProject._id));
        setIsOpenDeleteAlert(false);
        setSelectedProject(null);
    };

    const headers = [
        { label: t("Projects"), width: "300px" },
        { label: t("Manager"), width: "220px" },
        { label: t("Department"), width: "220px" },
        { label: t("Category"), width: "180px" },
        { label: t("Assignees"), width: "180px" },
        { label: t("Teams"), width: "140px" },
        { label: t("Assigned - Due Date"), width: "220px" },
        { label: t("Status"), width: "140px" },
        { label: t("Progress"), width: "120px" },
        // Optional extra columns based on screenshot 2
        { label: t("Rating"), width: "140px" },
        { label: "", width: "50px" }, // Actions
    ];

    const customActions = (index) => (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 p-1 flex flex-col">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiEyeLine size={16} className="text-blue-500" /> {t("View")}
            </button>
            <button onClick={() => handleEdit(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiPencilLine size={16} className="text-blue-500" /> {t("Edit")}
            </button>
            <button onClick={() => handleInvite(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiDownload2Line size={16} className="text-blue-500" /> {t("Download Attachs")}
            </button>
            <button onClick={() => handleCancelClick(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiCheckboxCircleFill size={16} className="text-green-500" /> {t("Active")}
            </button>
            <button onClick={() => handleCancelClick(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiCalendarFill size={16} className="text-yellow-500" /> {t("In Review")}
            </button>
            <button onClick={() => handleCancelClick(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiTimeFill size={16} className="text-red-500" /> {t("In Progress")}
            </button>
            <div className="px-2 py-1">
                <button className="w-full bg-blue-50 text-blue-600 py-1.5 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors">
                    {t("View Project Chat")}
                </button>
            </div>
        </div>
    );

    const rows = projects.map((project) => [
        <NameAndDescription
            key={`name-${project._id}`}
            path={`/projects/${project._id}-${convertToSlug(project.projectName)}`}
            name={project.projectName}
            description={project.description}
        />,
        <AccountDetails
            key={`mgr-${project._id}`}
            account={{
                name: project.manager.name,
                rule: project.manager.role,
                imageProfile: project.manager.avatar,
            }}
        />,
        <Department
            key={`dept-${project._id}`}
            name={project.department.name}
            icon={project.department.icon}
        />,
        <span key={`cat-${project._id}`} className="text-sm text-gray-700 dark:text-gray-300">
            {project.category}
        </span>,
        <Assignees key={`assign-${project._id}`} users={project.assignees} />,
        <Teams key={`teams-${project._id}`} teams={project.teams} />,
        <div key={`dates-${project._id}`} className="flex flex-col text-xs text-gray-500">
            <span>{project.assignedDate}</span>
            <span>{project.dueDate}</span>
        </div>,
        <Status key={`status-${project._id}`} type={project.status.type} />,
        <Progress key={`prog-${project._id}`} percentage={project.progress} />,
        <Rating key={`rating-${project._id}`} rating={project.rating} />,
    ]);

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
