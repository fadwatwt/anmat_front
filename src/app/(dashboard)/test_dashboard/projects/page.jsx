"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import Alert from "@/components/Alert.jsx";
import NameAndDescription from "@/app/dashboard/projects/_components/TableInfo/NameAndDescription.jsx";
import AccountDetails from "@/app/dashboard/projects/_components/TableInfo/AccountDetails.jsx";
import { translateDate } from "@/functions/Days.js";
import Priority from "@/app/dashboard/projects/_components/TableInfo/Priority.jsx";
import Status from "@/app/dashboard/projects/_components/TableInfo/Status.jsx";
import { convertToSlug } from "@/functions/AnotherFunctions.js";
import {
  fetchProjects,
  deleteProject,
  setPagination,
} from "@/redux/projects/projectSlice";
import {
  // selectProjectStatus,
  selectPagination,
} from "@/redux/projects/projectSelectors.js";
import { defaultPhoto } from "@/Root.Route.js";
import {projects} from "@/functions/FactoryData"
import EditProjectModal from "@/app/dashboard/projects/_modal/EditProjectModal";
import EmployeeProjectStates from "@/app/employee/_components/EmployeeStates";

function ProjectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  // const projects = useSelector(selectAllProjects) || [];
  const pagination = useSelector(selectPagination);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
//   const MemoizedNameAndDescription = memo(NameAndDescription);
// const MemoizedAccountDetails = memo(AccountDetails);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch, pagination.currentPage, pagination.rowsPerPage]);

  const handlePageChange = (newPage) => {
    dispatch(setPagination({ currentPage: newPage }));
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    dispatch(setPagination({ rowsPerPage: newRowsPerPage, currentPage: 1 }));
  };

  const handleCreateProjectBtn = () =>
    router.push("/dashboard/projects/create");

  const handleEditProject = (index) => {
    setSelectedProject(projects[index]);
    setIsOpenEditModal(true);
  };

  const handleDeleteProject = (index) => {
    setSelectedProject(projects[index]);
    setIsOpenDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (selectedProject) {
      try {
        await dispatch(deleteProject(selectedProject._id)).unwrap();
        setIsOpenDeleteAlert(false);
        setSelectedProject(null);
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    }
  };

  const headers = [
    { label: t("Projects"), width: "200px" },
    { label: t("Manager"), width: "150px" },
    { label: t("ِAssigned-Due Date"), width: "150px" },
    { label: t("No of Tasks"), width: "100px" },
    { label: t("Priority"), width: "100px" },
    { label: t("Status"), width: "100px" },
    { label: "", width: "50px" },
  ];

  const rows = projects.map((project) => [
    <NameAndDescription
      key={`name-${project._id}`}
      path={`/projects/${project._id}-${convertToSlug(project.name)}`}
      name={project.projectName || t("No Name")}
      description={project.description || t("No Description")}
    />,
    <AccountDetails
      key={`account-${project._id}`}
      account={{
        name: project.manager?.name || t("Unassigned"),
        rule: project.manager ? t("Manager") : t("N/A"),
        imageProfile: project.assignedTo?.avatar || defaultPhoto,
      }}
    />,
    <p key={`date-${project._id}`} className="text-sm dark:text-sub-300">
      {project.dueDate ? translateDate(project.dueDate) : t("No Date")}
    </p>,
    <p key={`tasks-${project._id}`} className="text-sm dark:text-sub-300">
      {Array.isArray(project.tasks) ? project.tasks.length : 0}
    </p>,
    <Priority
      key={`priority-${project._id}`}
      type={project.priority?.type?.toLowerCase().replace(" ", "-") || "low"}
      title={t(project.priority?.title) || t("Low")}
    />,
    <Status
      key={`status-${project._id}`}
      type={project.status?.type?.toLowerCase().replace(" ", "-") || "pending"}
      title={t(project.status.title) || t("Pending")}
    />,
  ]);


  return (
    <>
      <Page
        title={t("Projects")}
      >
        <div className="flex flex-col gap-6">
          <Table
            title={t("All Projects")}
            customActions={(actualRowIndex) => (
                <EmployeeProjectStates actualRowIndex={actualRowIndex} />
            )}
            headers={headers}
            rows={rows}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            rowsPerPage={pagination.rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </Page>

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
    </>
  );
}

export default ProjectPage;
