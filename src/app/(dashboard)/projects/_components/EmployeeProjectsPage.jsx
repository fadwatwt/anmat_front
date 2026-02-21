import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table.jsx";
import NameAndDescription from "@/app/(dashboard)/projects/_components/TableInfo/NameAndDescription.jsx";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails.jsx";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import { defaultPhoto } from "@/Root.Route.js";
import { convertToSlug } from "@/functions/AnotherFunctions.js";
import Page from "@/components/Page.jsx";
import {
    RiLayoutGridFill, RiGroupFill,
    RiEyeLine,
    RiPencilLine,
} from "@remixicon/react";

// Dummy Data matching structure
const dummyProjects = Array.from({ length: 8 }).map((_, i) => ({
    _id: `proj-${i}`,
    projectName: "Pulse Dashboard",
    description: "Developing a dashboard for real-time analytics",
    manager: {
        name: "Fatma Ahmed Mohamed",
        role: "Product Manager",
        avatar: defaultPhoto,
    },
    assignedDate: "15 Nov, 2024",
    dueDate: "16 Jan, 2025",
    startDate: "15 Nov, 2024",
    endDate: "16 Jan, 2025",
    updatedAt: "16 Jan, 2025",
    status: { type: i % 2 === 0 ? "Active" : "In Review" },
}));

function EmployeeProjectsPage() {
    const { t } = useTranslation();

    // Local State
    const [projects, setProjects] = useState(dummyProjects);
    const [pagination, setPagination] = useState({ currentPage: 1, rowsPerPage: 7, totalPages: 2 });

    // Handlers
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setPagination(prev => ({ ...prev, rowsPerPage: newRowsPerPage, currentPage: 1 }));
    };

    const handleView = (index) => {
        console.log("View project", projects[index]);
    };

    const handleEdit = (index) => {
        console.log("Edit project (limited)", projects[index]);
    };

    const headers = [
        { label: t("Projects"), width: "20%" },
        { label: t("Manager"), width: "20%" },
        { label: t("Assigned - Due Date"), width: "15%" },
        { label: t("Started - Ended at Date"), width: "15%" },
        { label: t("Updated At"), width: "10%" },
        { label: t("Status"), width: "10%" },
        { label: "", width: "5%" }, // Actions
    ];

    const customActions = (index) => (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 p-1 flex flex-col">
            <button onClick={() => handleView(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiEyeLine size={16} className="text-blue-500" /> {t("View")}
            </button>
            <button onClick={() => handleEdit(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiPencilLine size={16} className="text-blue-500" /> {t("Edit")}
            </button>
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
        <div key={`dates-${project._id}`} className="flex flex-col text-xs text-gray-500">
            <span>{project.assignedDate}</span>
            <span>{project.dueDate}</span>
        </div>,
        <div key={`start-end-${project._id}`} className="flex flex-col text-xs text-gray-500">
            <span>{project.startDate}</span>
            <span>{project.endDate}</span>
        </div>,
        <span key={`updated-${project._id}`} className="text-sm text-gray-700 dark:text-gray-300">
            {project.updatedAt}
        </span>,
        <Status key={`status-${project._id}`} type={project.status.type} />,
    ]);

    return (
        <Page
            title={t("Projects")}
        >
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
                className="min-w-[1200px] table-fixed" // Adjusted min-width since fewer columns
            />
        </Page>
    );
}

export default EmployeeProjectsPage;
