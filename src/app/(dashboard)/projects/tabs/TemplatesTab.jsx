import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/Tables/Table.jsx";
import Alert from "@/components/Alerts/Alert.jsx";
import NameAndDescription from "@/app/(dashboard)/projects/_components/TableInfo/NameAndDescription.jsx";
import Department from "@/app/(dashboard)/projects/_components/TableInfo/Department.jsx";
import Assignees from "@/app/(dashboard)/projects/_components/TableInfo/Assignees.jsx";
import Teams from "@/app/(dashboard)/projects/_components/TableInfo/Teams.jsx";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import Progress from "@/app/(dashboard)/projects/_components/TableInfo/Progress.jsx";
import Rating from "@/app/(dashboard)/projects/_components/TableInfo/Rating.jsx";
import { defaultPhoto } from "@/Root.Route.js";
import { convertToSlug } from "@/functions/AnotherFunctions.js";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails.jsx";
import {
    RiLayoutGridFill, RiGroupFill,
    RiTimeFill, RiPencilLine,
    RiEyeLine,
    RiCheckboxCircleFill,
    RiDeleteBinLine,
    RiCalendarFill,
    RiDownload2Line
} from "@remixicon/react";

// Dummy Data for Templates
const
    dummyTemplates = Array.from({ length: 8 }).map((_, i) => ({
        _id: `template-${i}`,
        templateName: `Template ${i + 1}`,
        description: "Template for project management",
        department: {
            name: "Digital Publishing Division",
            icon: RiLayoutGridFill,
        },
        manager: {
            name: `Manager ${i + 1}`,
            role: "Product Manager",
            avatar: defaultPhoto,
        },
        category: "Lorem Ipsum",
        assignees: [
            { name: "User 1", avatar: defaultPhoto },
            { name: "User 2", avatar: defaultPhoto },
            { name: "User 3", avatar: defaultPhoto },
        ],
        teams: [
            { name: "Dev", icon: RiGroupFill },
            { name: "Design", icon: RiLayoutGridFill },
        ],
        assignedDate: "15 Nov, 2024",
        dueDate: "16 Jan, 2025",
        startDate: "15 Nov, 2024",
        endDate: "16 Jan, 2025",
        updatedAt: "16 Jan, 2025",
        progress: 20 + (i * 10),
        rating: 4.5,
        status: { type: i % 3 === 0 ? "Active" : i % 3 === 1 ? "In Review" : "In Progress" },
    }));

function TemplatesTab() {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();

    // Local State
    const [templates, setTemplates] = useState(dummyTemplates);
    const [pagination, setPagination] = useState({ currentPage: 1, rowsPerPage: 7, totalPages: 2 });
    const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setPagination(prev => ({ ...prev, rowsPerPage: newRowsPerPage, currentPage: 1 }));
    };

    const handleViewTemplate = (index) => {
        const template = templates[index];
        router.push(`/projects/templates/${template._id}-${convertToSlug(template.templateName)}`);
    };

    const handleEditTemplate = (index) => {
        const template = templates[index];
        router.push(`/projects/templates/${template._id}/edit`);
    };

    const handleDeleteTemplate = (index) => {
        setSelectedTemplate(templates[index]);
        setIsOpenDeleteAlert(true);
    };

    const confirmDelete = () => {
        setTemplates(prev => prev.filter(t => t._id !== selectedTemplate._id));
        setIsOpenDeleteAlert(false);
        setSelectedTemplate(null);
    };

    const handleStatusChange = (index, newStatus) => {
        const updatedTemplates = [...templates];
        updatedTemplates[index].status.type = newStatus;
        setTemplates(updatedTemplates);
    };

    const handlePublishProject = (index) => {
        const template = templates[index];
        router.push(`/projects/create?templateId=${template._id}`);
    };

    const headers = [
        { label: t("Projects"), width: "300px" },
        { label: t("Manager"), width: "220px" },
        { label: t("Department"), width: "220px" },
        { label: t("Category"), width: "180px" },
        { label: t("Assignees"), width: "180px" },
        { label: t("Teams"), width: "140px" },
        { label: t("Assigned - Due Date"), width: "220px" },
        { label: t("Started - Ended at Date"), width: "220px" },
        { label: t("Updated At"), width: "160px" },
        { label: t("Progress"), width: "120px" },
        { label: t("Rating"), width: "140px" },
        { label: t("Template"), width: "140px" },
        { label: "", width: "50px" }, // Actions
    ];

    const customActions = (index) => (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 p-1 flex flex-col">
            <button
                onClick={() => handleViewTemplate(index)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md"
            >
                <RiEyeLine size={16} className="text-blue-500" /> {t("View")}
            </button>
            <button
                onClick={() => handleEditTemplate(index)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md"
            >
                <RiPencilLine size={16} className="text-blue-500" /> {t("Edit")}
            </button>
            <button onClick={() => handleInvite(index)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiDownload2Line size={16} className="text-blue-500" /> {t("Download Attachs")}
            </button>
            <button
                onClick={() => handleDeleteTemplate(index)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md"
            >
                <RiDeleteBinLine size={16} className="text-red-500" /> {t("Delete")}
            </button>

            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

            <div className="px-2 py-1 mt-1">
                <button
                    onClick={() => handlePublishProject(index)}
                    className="w-full bg-blue-50 text-blue-600 py-1.5 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                    {t("Publish Project")}
                </button>
            </div>
        </div>
    );

    const rows = templates.map((template) => [
        <NameAndDescription
            key={`name-${template._id}`}
            path={`/projects/templates/${template._id}-${convertToSlug(template.templateName)}`}
            name={template.templateName}
            description={template.description}
        />,
        <AccountDetails
            key={`mgr-${template._id}`}
            account={{
                name: template.manager.name,
                rule: template.manager.role,
                imageProfile: template.manager.avatar,
            }}
        />,
        <Department
            key={`dept-${template._id}`}
            name={template.department.name}
            icon={template.department.icon}
        />,
        <span key={`cat-${template._id}`} className="text-sm text-gray-700 dark:text-gray-300">
            {template.category}
        </span>,
        <Assignees key={`assign-${template._id}`} users={template.assignees} />,
        <Teams key={`teams-${template._id}`} teams={template.teams} />,
        <div key={`dates1-${template._id}`} className="flex flex-col text-xs text-gray-500">
            <span>{template.assignedDate}</span>
            <span>{template.dueDate}</span>
        </div>,
        <div key={`dates2-${template._id}`} className="flex flex-col text-xs text-gray-500">
            <span>{template.startDate}</span>
            <span>{template.endDate}</span>
        </div>,
        <span key={`updated-${template._id}`} className="text-xs text-gray-500">
            {template.updatedAt}
        </span>,
        <Progress key={`prog-${template._id}`} percentage={template.progress} />,
        <Rating key={`rating-${template._id}`} rating={template.rating} />,
        <span key={`template-${template._id}`} className="text-sm text-gray-700 dark:text-gray-300">
            Template 1
        </span>,
    ]);

    return (
        <div>
            <Table
                title={t("All Templates")}
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
                handelEdit={handleEditTemplate}
                handelDelete={handleDeleteTemplate}
                className="min-w-[2400px] table-fixed"
            />

            <Alert
                type="warning"
                title={t("Delete Template?")}
                message={t("This action cannot be undone")}
                titleCancelBtn={t("Cancel")}
                titleSubmitBtn={t("Delete")}
                isOpen={isOpenDeleteAlert}
                isBtns={1}
                onClose={() => {
                    setIsOpenDeleteAlert(false);
                    setSelectedTemplate(null);
                }}
                onSubmit={confirmDelete}
            />
        </div>
    );
}

export default TemplatesTab;
