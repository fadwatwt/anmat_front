// ProjectsPage.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Page from "../Page.jsx";
import Table from "../../components/Tables/Table.jsx";
import EditProjectModal from "./modal/EditProjectModal.jsx";
import Alert from "../../components/Alert.jsx";
import NameAndDescription from "./Components/TableInfo/NameAndDescription.jsx";
import AccountDetails from "./Components/TableInfo/AccountDetails.jsx";
import { translateDate } from "../../functions/Days.js";
import Priority from "./Components/TableInfo/Priority.jsx";
import Status from "./Components/TableInfo/Status.jsx";
import { convertToSlug } from "../../functions/AnotherFunctions.js";
import {
  fetchProjects,
  deleteProject,
  setPagination,
} from "../../redux/projects/projectSlice";
import {
  selectProjectStatus,
  selectPagination,
  selectAllProjects,
} from "../../redux/projects/projectSelectors.js";

function ProjectsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(selectAllProjects) || [];
  const status = useSelector(selectProjectStatus);
  const pagination = useSelector(selectPagination);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch, pagination.currentPage, pagination.rowsPerPage]);
  console.log("Projects:", projects);
  console.log("Status:", status);
  console.log("Pagination:", pagination);
  const handlePageChange = (newPage) => {
    dispatch(setPagination({ currentPage: newPage }));
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    dispatch(setPagination({ rowsPerPage: newRowsPerPage, currentPage: 1 }));
  };

  const handelCreateProjectBtn = () => navigate("/projects/create");

  const handleEditProject = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    setSelectedProject(project);
    setIsOpenEditModal(true);
  };

  const handleDeleteProject = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    setSelectedProject(project);
    setIsOpenDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedProject) {
      dispatch(deleteProject(selectedProject._id));
      setIsOpenDeleteAlert(false);
      setSelectedProject(null);
    }
  };

  const headers = [
    { label: t("Projects"), width: "200px" },
    { label: t("Manager"), width: "150px" },
    { label: t("Due Date"), width: "150px" },
    { label: t("Tasks"), width: "100px" },
    { label: t("Priority"), width: "100px" },
    { label: t("Status"), width: "100px" },
    { label: "", width: "50px" },
  ];

  const rows =
    projects.length > 0
      ? projects.map((project) => ({
          id: project._id,
          cells: [
            <NameAndDescription
              key={`name-${project._id}`}
              path={`/projects/${project._id}-${convertToSlug(project.name)}`}
              name={project.name || t("No Name")}
              description={project.description || t("No Description")}
            />,
            <AccountDetails
              key={`account-${project._id}`}
              account={{
                name: project.assignedTo?.name || t("Unassigned"),
                rule: project.assignedTo ? t("Manager") : t("N/A"),
                imageProfile:
                  project.assignedTo?.avatar || "/default-avatar.png",
              }}
            />,
            <p
              key={`date-${project._id}`}
              className="text-sm dark:text-sub-300"
            >
              {project.endDate ? translateDate(project.endDate) : t("No Date")}
            </p>,
            <p
              key={`tasks-${project._id}`}
              className="text-sm dark:text-sub-300"
            >
              {Array.isArray(project.tasks) ? project.tasks.length : 0}
            </p>,
            <Priority
              key={`priority-${project._id}`}
              type={project.priority?.toLowerCase().replace(" ", "-") || "low"}
              title={t(project.priority) || t("Low")}
            />,
            <Status
              key={`status-${project._id}`}
              type={
                project.status?.toLowerCase().replace(" ", "-") || "pending"
              }
              title={t(project.status) || t("Pending")}
            />,
          ],
        }))
      : [];

  return (
    <>
      <Page
        title={t("Projects")}
        isBtn={true}
        btnOnClick={handelCreateProjectBtn}
        btnTitle={t("Create Project")}
      >
        <div className="flex flex-col gap-6">
          <Table
            title={t("All Projects")}
            headers={headers}
            rows={rows}
            isActions={true}
            isFilter={true}
            handelDelete={handleDeleteProject}
            handelEdit={handleEditProject}
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
        onClose={() => {
          setIsOpenDeleteAlert(false);
          setSelectedProject(null);
        }}
        onSubmit={confirmDelete}
      />
    </>
  );
}

export default ProjectsPage;
