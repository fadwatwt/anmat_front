import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table.jsx";
import Alert from "@/components/Alerts/Alert.jsx";
import NameAndDescription from "@/app/(dashboard)/projects/_components/TableInfo/NameAndDescription.jsx";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails.jsx";
import Department from "@/app/(dashboard)/projects/_components/TableInfo/Department.jsx";
import Assignees from "@/app/(dashboard)/projects/_components/TableInfo/Assignees.jsx";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import Progress from "@/app/(dashboard)/projects/_components/TableInfo/Progress.jsx";
import EvaluationModal from "@/components/Modal/EvaluationModal";
import StatusActions from "@/components/Dropdowns/StatusActions";
import Modal from "@/components/Modal/Modal.jsx";
import EditProjectModal from "@/app/(dashboard)/projects/_modal/EditProjectModal";
import SaveAsTemplateModal from "@/app/(dashboard)/projects/_modal/SaveAsTemplateModal";
import StarRating from "@/components/StarRating";
import { 
    useGetSubscriberProjectsQuery, 
    useUpdateSubscriberProjectMutation 
} from "@/redux/projects/subscriberProjectsApi";
import { useSelector } from "react-redux";
import { defaultPhoto } from "@/Root.Route.js";
import { usePermission } from "@/Hooks/usePermission";
import {
    RiLayoutGridFill,
    RiPencilLine,
    RiEyeLine,
    RiDownload2Line,
    RiFileCopy2Line,
    RiStarLine,
} from "@remixicon/react";
import dayjs from "dayjs";

function ProjectsTab() {
    const { t } = useTranslation();
    const canEvaluate = usePermission("projects.evaluate");
    const canEditProject = usePermission("projects.update");
    const canDeleteProject = usePermission("projects.delete");

    const { data: projectsData, isLoading, isError, error } = useGetSubscriberProjectsQuery();
    const projects = projectsData || [];

    const [updateProject, { isLoading: isUpdating }] = useUpdateSubscriberProjectMutation();

    const [pagination, setPagination] = useState({ currentPage: 1, rowsPerPage: 7, totalPages: 1 });
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
    const [isOpenTemplateModal, setIsOpenTemplateModal] = useState(false);
    const [isOpenStatusModal, setIsOpenStatusModal] = useState(false);
    const [isOpenEvaluationModal, setIsOpenEvaluationModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const router = useRouter();

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setPagination(prev => ({ ...prev, rowsPerPage: newRowsPerPage, currentPage: 1 }));
    };

    const handleViewProject = (project) => {
        if (project?._id || project?.id) {
            router.push(`/projects/${project._id || project.id}/details`);
        }
    };

    const handleEditProject = (project) => {
        setSelectedProject(project);
        setIsOpenEditModal(true);
    };

    const handleDeleteProject = (project) => {
        setSelectedProject(project);
        setIsOpenDeleteAlert(true);
    };

    const handleSaveAsTemplate = (project) => {
        setSelectedProject(project);
        setIsOpenTemplateModal(true);
    };

    const handleOpenStatusModal = (project) => {
        setSelectedProject(project);
        setIsOpenStatusModal(true);
    };

    const handleOpenEvaluation = (project) => {
        setSelectedProject(project);
        setIsOpenEvaluationModal(true);
    };

    const handleStatusUpdate = async (status, evaluationPayload = null) => {
        if (status === 'done' && !evaluationPayload && canEvaluate) {
            setIsOpenStatusModal(false);
            setIsOpenEvaluationModal(true);
            return;
        }

        if (selectedProject) {
            try {
                const payload = { id: selectedProject._id, data: { status } };
                if (evaluationPayload) {
                    Object.assign(payload.data, evaluationPayload);
                }
                await updateProject(payload).unwrap();
                setIsOpenStatusModal(false);
                setIsOpenEvaluationModal(false);
                setSelectedProject(null);
            } catch (err) {
                console.error("Failed to update status:", err);
            }
        }
    };

    const confirmDelete = () => {
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
        { label: t("Evaluation"), width: "180px" },
        { label: "", width: "50px" }, // Actions
    ];

    const allowedStatuses = ['open', 'in-progress', 'completed', 'cancelled'];
    if (canEvaluate) allowedStatuses.push('done');

    const customActions = (index) => {
        const project = projects[index];
        const actions = [
            {
                text: t("View Details"),
                icon: <RiEyeLine className="text-blue-500" />,
                onClick: () => handleViewProject(project),
            },
        ];

        if (canEditProject) {
            actions.push(
                {
                    text: t("Edit Project"),
                    icon: <RiPencilLine className="text-primary-500" />,
                    onClick: () => handleEditProject(project),
                },
                {
                    text: t("Change Status"),
                    icon: <RiLayoutGridFill className="text-amber-500" />,
                    onClick: () => handleOpenStatusModal(project),
                }
            );
        }

        if (canEvaluate) {
            actions.push({
                text: t("Evaluate & Done"),
                icon: <RiStarLine className="text-green-500" />,
                onClick: () => handleOpenEvaluation(project),
            });
        }

        if (canEditProject) {
            actions.push({
                text: t("Save as Template"),
                icon: <RiFileCopy2Line className="text-amber-500" />,
                onClick: () => handleSaveAsTemplate(project),
            });
        }

        actions.push({
            text: t("Download Attachs"),
            icon: <RiDownload2Line className="text-blue-500" />,
            onClick: () => {},
        });

        return <StatusActions states={actions} />;
    };

    const rows = projects.map((project) => [
        <NameAndDescription
            key={`name-${project._id}`}
            path={`/projects/${project._id}/details`}
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
        <span key={`start-${project._id}`} className="text-sm text-cell-primary text-nowrap">
            {project.start_date ? dayjs(project.start_date).format("DD MMM, YYYY") : t("N/A")}
        </span>,
        <span key={`due-${project._id}`} className="text-sm text-cell-primary text-nowrap">
            {project.due_date ? dayjs(project.due_date).format("DD MMM, YYYY") : t("N/A")}
        </span>,
        <Status key={`status-${project._id}`} type={project.status || "open"} />,
        <Progress key={`prog-${project._id}`} percentage={project.progress || 0} />,
        <div key={`eval-${project._id}`}>
            {project.overall_rating > 0 ? (
                <StarRating rating={project.overall_rating} />
            ) : (
                <span className="text-xs text-cell-secondary italic opacity-60">
                    {t("Not evaluated yet")}
                </span>
            )}
        </div>,
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
                handelEdit={canEditProject ? handleEditProject : undefined}
                handelDelete={canDeleteProject ? handleDeleteProject : undefined}
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

            {selectedProject && (
                <SaveAsTemplateModal
                    project={selectedProject}
                    isOpen={isOpenTemplateModal}
                    onClose={() => {
                        setIsOpenTemplateModal(false);
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

            <Modal
                isOpen={isOpenStatusModal}
                onClose={() => setIsOpenStatusModal(false)}
                title={t("Update Project Status")}
                className="w-11/12 md:w-1/3 p-4"
            >
                <div className="flex flex-col gap-2 p-4">
                    {allowedStatuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusUpdate(status)}
                            className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                        >
                            <Status type={status} />
                        </button>
                    ))}
                </div>
            </Modal>

            <EvaluationModal
                isOpen={isOpenEvaluationModal}
                onClose={() => {
                    setIsOpenEvaluationModal(false);
                    setSelectedProject(null);
                }}
                onSubmit={(payload) => handleStatusUpdate('done', payload)}
                type="project"
                isSubmitting={isUpdating}
            />
        </div>
    );
}

export default ProjectsTab;
