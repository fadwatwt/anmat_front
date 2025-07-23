"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import Alert from "@/components/Alert.jsx";
import NameAndDescription from "@/app/(dashboard)/projects/_components/TableInfo/NameAndDescription.jsx";
import AccountDetails from "@/app/(dashboard)/projects/_components/TableInfo/AccountDetails.jsx";
import { translateDate } from "@/functions/Days.js";
import Priority from "@/app/(dashboard)/projects/_components/TableInfo/Priority.jsx";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import { convertToSlug } from "@/functions/AnotherFunctions.js";
import {
  fetchProjects,
  deleteProject,
  setPagination,
} from "@/redux/projects/projectSlice";
import { selectPagination, selectAllProjects } from "@/redux/projects/projectSelectors.js";
import { defaultPhoto } from "@/Root.Route.js";
import EditProjectModal from "@/app/(dashboard)/projects/_modal/EditProjectModal";
import EmployeeProjectStates from "@/app/(dashboard)/_components/EmployeeStates";

// Sample projects data
const sampleProjects = [
  {
    _id: "1",
    projectName: "Website Redesign",
    description: "Redesign the company website",
    manager: { name: "Jane Doe", avatar: "/avatars/jane.jpg" },
    dueDate: "2025-08-15",
    tasks: [1, 2, 3],
    priority: { type: "high", title: "High" },
    status: { type: "in-progress", title: "In Progress" },
  },
  {
    _id: "2",
    projectName: "Mobile App Update",
    description: "Update the mobile app features",
    manager: { name: "John Smith", avatar: "/avatars/john.jpg" },
    dueDate: "2025-09-01",
    tasks: [1, 2],
    priority: { type: "medium", title: "Medium" },
    status: { type: "pending", title: "Pending" },
  },
  {
    _id: "3",
    projectName: "Data Migration",
    description: "Migrate data to new server",
    manager: { name: "Alice Brown", avatar: "/avatars/alice.jpg" },
    dueDate: "2025-07-30",
    tasks: [1],
    priority: { type: "low", title: "Low" },
    status: { type: "completed", title: "Completed" },
  },
];

function ProjectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const projects = useSelector(selectAllProjects) || sampleProjects; // Fallback to sample data
  const pagination = useSelector(selectPagination);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Define authUserType (e.g., from context or state management)
  const authUserType = "Employee"; // Change to "Employee" or "Company-Manager"

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch, pagination.currentPage, pagination.rowsPerPage]);

  const handlePageChange = (newPage) => {
    dispatch(setPagination({ currentPage: newPage }));
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    dispatch(setPagination({ rowsPerPage: newRowsPerPage, currentPage: 1 }));
  };

  const handleCreateProjectBtn = () => router.push("/projects/create");

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

  // Define headers based on user type
  const headersConfig = {
    Employee: [
      { label: t("Projects"), width: "200px" },
      { label: t("Manager"), width: "150px" },
      { label: t("ِAssigned-Due Date"), width: "150px" },
      { label: t("No of Tasks"), width: "100px" },
      { label: t("Priority"), width: "100px" },
      { label: t("Status"), width: "100px" },
      { label: "", width: "50px" },
    ],
    "Company-Manager": [
      { label: t("Projects"), width: "200px" },
      { label: t("Manager"), width: "150px" },
      { label: t("Due Date"), width: "150px" },
      { label: t("Tasks"), width: "100px" },
      { label: t("Priority"), width: "100px" },
      { label: t("Status"), width: "100px" },
      { label: "", width: "50px" },
    ],
  };

  // Define rows
  const rows = projects.map((project) => [
    <NameAndDescription
      key={`name-${project._id}`}
      path={`/projects/${project._id}-${convertToSlug(project.projectName)}`}
      name={project.projectName || t("No Name")}
      description={project.description || t("No Description")}
    />,
    <AccountDetails
      key={`account-${project._id}`}
      account={{
        name: project.manager?.name || t("Unassigned"),
        rule: project.manager ? t("Manager") : t("N/A"),
        imageProfile: project.manager?.avatar || defaultPhoto,
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

  // Define Table props based on user type
  const tableProps = {
    Employee: {
      customActions: (actualRowIndex) => <EmployeeProjectStates actualRowIndex={actualRowIndex} />,
    },
    "Company-Manager": {
      isActions: true,
      isCheckInput: false,
      handelEdit: handleEditProject,
      handelDelete: handleDeleteProject,
    },
  };

  const pageProps = {
    "Company-Manager": {
      isBtn: true,
      btnOnClick: handleCreateProjectBtn,
      btnTitle: t("Create Project"),
    },
  };

  return (
    <>
      <Page
        title={t("Projects")}
        {...(pageProps[authUserType] || {})}
      >
        <div className="flex flex-col gap-6">
          <Table
            title={t("All Projects")}
            headers={headersConfig[authUserType]}
            rows={rows}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            rowsPerPage={pagination.rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            {...tableProps[authUserType]}
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