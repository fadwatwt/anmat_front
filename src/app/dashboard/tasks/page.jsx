"use client";
import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchTasks, deleteTask } from "@/redux/tasks/tasksAPI";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import TimeLine from "@/components/TimeLine/TimeLine.jsx";
import EditTaskModal from "@/app/dashboard/tasks/_modal/EditTaskModal.jsx";
import Alert from "@/components/Alert.jsx";
import NameAndDescription from "../projects/Components/TableInfo/NameAndDescription.jsx";
import AccountDetails from "../projects/Components/TableInfo/AccountDetails.jsx";
import { translateDate } from "@/functions/Days.js";
import Priority from "../projects/Components/TableInfo/Priority.jsx";
import Status from "../projects/Components/TableInfo/Status.jsx";
import MembersListXLine from "../projects/details/[slug]/components/MembersListXLine.jsx";
import { convertToSlug } from "@/functions/AnotherFunctions.js";

function TasksPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [taskEdit, setTaskEdit] = useState(null);
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Table headers
  const headers = [
    { label: t("Tasks"), width: "200px" },
    { label: t("Assigned to"), width: "150px" },
    { label: t("Manager"), width: "200px" },
    { label: t("Assigned - Due Date"), width: "300px" },
    { label: t("Priority"), width: "100px" },
    { label: t("Status"), width: "100px" },
    { label: "", width: "50px" },
  ];

  // Handle create task button
  const handleCreateTask = () => {
    router.push("/dashboard/tasks/create");
  };

  // Handle edit modal
  const handleEditModal = (task) => {
    setTaskEdit(task);
    setIsOpenEditModal(true);
  };

  // Handle delete task
  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await dispatch(deleteTask(taskToDelete._id)).unwrap();
        setIsOpenDeleteAlert(false);
        setTaskToDelete(null);
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (task) => {
    setTaskToDelete(task);
    setIsOpenDeleteAlert(true);
  };

  // Generate table rows from tasks
  const taskRowTable = useMemo(() => {
    return tasks.map((task) => [
      <NameAndDescription
        key={`task-${task._id}`}
        path={`/tasks/${task._id}-${convertToSlug(task.title)}`}
        name={task.title}
        description={task.description}
      />,

      <MembersListXLine
        key={`members-${task._id}`}
        members={task.assignedTo || []} // Ensure members is an array
        maxVisible={3}
      />,
      <AccountDetails
        key={`manager-${task._id}`}
        account={{
          name: task.manager?.name || "N/A",
          imageProfile: task.manager?.imageProfile
            ? task.manager.imageProfile
            : "https://ui-avatars.com/api/?name=John+Doe",
        }}
      />,
      // Handle null manager
      <p key={`dates-${task._id}`} className="text-sm dark:text-sub-300">
        {translateDate(task.assignedDate)} - {translateDate(task.dueDate)}
      </p>,
      <Priority
        key={`priority-${task._id}`}
        type={task.priority}
        title={task.priority}
      />,
      <Status
        key={`status-${task._id}`}
        type={task.status}
        title={task.status}
      />,
    ]);
  });

  // Handle loading and error states
  if (error) return <>Error</>;

  return (
    <>
      <Page
        title={"Tasks"}
        isBtn={true}
        btnOnClick={handleCreateTask}
        btnTitle={"Create a Task"}
      >
        <div className={"flex flex-col gap-6"}>
          <div className="flex flex-col gap-2 h-full">
            <Table
              className="custom-class"
              title={"All tasks"}
              headers={headers}
              rows={taskRowTable}
              isActions={true}
              isFilter={true}
              handelDelete={(index) => handleDeleteConfirmation(tasks[index])} // Fixed: Use `tasks` instead of `filteredEmployees`
              handelEdit={(index) => handleEditModal(tasks[index])} // Fixed: Use `tasks` instead of `filteredEmployees`
            />
          </div>
          <div className={"flex md:w-[37.5%] w-screen"}>
            <TimeLine />
          </div>
        </div>
      </Page>

      {/* Edit Task Modal */}
      <EditTaskModal
        task={taskEdit}
        isOpen={isOpenEditModal}
        onClose={() => setIsOpenEditModal(false)}
      />

      {/* Delete Confirmation Alert */}
      <Alert
        type={"warning"}
        title={"Delete Task?"}
        message={"Are you sure you want to delete this task?"}
        titleCancelBtn={"Cancel"}
        titleSubmitBtn={"Delete"}
        isOpen={isOpenDeleteAlert}
        onClose={() => setIsOpenDeleteAlert(false)}
        onSubmit={handleDeleteTask}
        isBtns={1}
      />
    </>
  );
}

export default TasksPage;
