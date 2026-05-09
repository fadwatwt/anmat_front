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

import { useGetProjectTemplatesQuery, useDeleteProjectTemplateMutation } from "@/redux/projects/subscriberProjectTemplatesApi";
import Loading from "@/components/Loading";
import dayjs from "dayjs";
import { usePermission } from "@/Hooks/usePermission";

function TemplatesTab() {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();

    const canCreateProject = usePermission("projects.create");
    const canEditTemplate = usePermission("project_templates.update");
    const canDeleteTemplate = usePermission("project_templates.delete");
    const canViewTemplate = usePermission("project_templates.view");

    const { data: projectTemplates, isLoading, isError } = useGetProjectTemplatesQuery();
    const [deleteTemplate] = useDeleteProjectTemplateMutation();

    console.log("API Response - Project Templates:", projectTemplates);

    const templates = projectTemplates || [];

    const [pagination, setPagination] = useState({ currentPage: 1, rowsPerPage: 7, totalPages: 1 });
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
        router.push(`/projects/templates/${template._id}-${convertToSlug(template.name)}`);
    };

    const handleEditTemplate = (index) => {
        const template = templates[index];
        router.push(`/projects/templates/${template._id}/edit`);
    };

    const handleDeleteTemplate = (index) => {
        setSelectedTemplate(templates[index]);
        setIsOpenDeleteAlert(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteTemplate(selectedTemplate._id).unwrap();
            setIsOpenDeleteAlert(false);
            setSelectedTemplate(null);
        } catch (err) {
            console.error("Failed to delete template:", err);
        }
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
        { label: t("Updated At"), width: "160px" },
        { label: t("Usage"), width: "140px" },
        { label: "", width: "50px" }, // Actions
    ];

    const customActions = (index) => (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 p-1 flex flex-col">
            {canViewTemplate && (
                <button
                    onClick={() => handleViewTemplate(index)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md"
                >
                    <RiEyeLine size={16} className="text-blue-500" /> {t("View")}
                </button>
            )}
            {canEditTemplate && (
                <button
                    onClick={() => handleEditTemplate(index)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md"
                >
                    <RiPencilLine size={16} className="text-blue-500" /> {t("Edit")}
                </button>
            )}
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md">
                <RiDownload2Line size={16} className="text-blue-500" /> {t("Download Attachs")}
            </button>
            {canDeleteTemplate && (
                <button
                    onClick={() => handleDeleteTemplate(index)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left rounded-md"
                >
                    <RiDeleteBinLine size={16} className="text-red-500" /> {t("Delete")}
                </button>
            )}

            {canCreateProject && (
                <>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                    <div className="px-2 py-1 mt-1">
                        <button
                            onClick={() => handlePublishProject(index)}
                            className="w-full bg-blue-50 text-blue-600 py-1.5 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                            {t("Publish Project")}
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    if (isLoading) return <Loading />;
    if (isError) return <div className="text-red-500 p-4">Error loading templates</div>;

    const rows = templates.map((template) => [
        <NameAndDescription
            key={`name-${template._id}`}
            path={`/projects/templates/${template._id}-${convertToSlug(template.name || "template")}`}
            name={template.name}
            description={template.description}
        />,
        <AccountDetails
            key={`mgr-${template._id}`}
            account={{
                name: template.manager?.name || "N/A",
                rule: "Manager",
                imageProfile: defaultPhoto,
            }}
        />,
        <Department
            key={`dept-${template._id}`}
            name={template.department?.name || "N/A"}
            icon={RiLayoutGridFill}
        />,
        <span key={`cat-${template._id}`} className="text-sm text-gray-700 dark:text-gray-300">
            {template.category || "General"}
        </span>,
        <Assignees 
            key={`assign-${template._id}`} 
            users={template.assignees?.map(a => ({ 
                name: a.name || "N/A", 
                avatar: defaultPhoto 
            })) || []} 
        />,
        <span key={`updated-${template._id}`} className="text-xs text-gray-500">
            {dayjs(template.updated_at).format("DD MMM, YYYY")}
        </span>,
        <span key={`usage-${template._id}`} className="text-sm text-gray-700 dark:text-gray-300">
            {template.usage_count || 0} {t("uses")}
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
                handelEdit={canEditTemplate ? handleEditTemplate : undefined}
                handelDelete={canDeleteTemplate ? handleDeleteTemplate : undefined}
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
