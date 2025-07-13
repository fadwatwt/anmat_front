"use client";

import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { fetchTasks } from "@/redux/tasks/tasksAPI";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import { translateDate } from "@/functions/Days.js";
import { convertToSlug } from "@/functions/AnotherFunctions.js";
import { tasksRows as tasks }  from "@/functions/FactoryData";
import EmployeeProjectStates from "@/app/employee/_components/EmployeeStates";

// ✅ Lazy-loaded components

const NameAndDescription = dynamic(() => import("@/app/dashboard/projects/_components/TableInfo/NameAndDescription"), { ssr: false });
const AccountDetails = dynamic(() => import("@/app/dashboard/projects/_components/TableInfo/AccountDetails"), { ssr: false });
const Priority = dynamic(() => import("@/app/dashboard/projects/_components/TableInfo/Priority"), { ssr: false });
const Status = dynamic(() => import("@/app/dashboard/projects/_components/TableInfo/Status"), { ssr: false });
const MembersListXLine = dynamic(() => import("@/app/dashboard/projects/details/[slug]/components/MembersListXLine"), { ssr: false });

function TasksPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const { tasks, loading, error } = useSelector((state) => state.tasks);

  // ✅ Fetch tasks only if needed
  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      dispatch(fetchTasks());
    }
  }, [dispatch, tasks]);

  const headers = [
    { label: t("Tasks"), width: "200px" },
    { label: t("Manager"), width: "200px" },
    { label: t("Assignees"), width: "150px" },
    { label: t("Assigned - Due Date"), width: "300px" },
    { label: t("Priority"), width: "100px" },
    { label: t("Status"), width: "100px" },
    { label: "", width: "50px" },
  ];


  const taskRowTable = useMemo(() => {
    return tasks.map((task) => [
      <NameAndDescription
          key={`name-${task._id}`}
          path={`/tasks/${task._id}-${convertToSlug(task.title)}`}
          name={task.title}
          description={task.description}
      />,
      <AccountDetails
          key={`manager-${task._id}`}
          account={{
            name: task.manager?.name || "N/A",
            imageProfile: task.manager?.imageProfile || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.manager?.name || "John Doe")}`,
          }}
      />,
      <MembersListXLine
          key={`members-${task._id}`}
          members={task.members || []}
          maxVisible={3}
      />,
      <p key={`dates-${task._id}`} className="text-sm dark:text-sub-300">
        {translateDate(task.assignedDate)} - {translateDate(task.dueDate)}
      </p>,
      <Priority
          key={`task-${task._id}`}
          type={task.priority?.type?.toLowerCase().replace(" ", "-") || "low"}
          title={t(task.priority?.title) || t("Low")}
      />,
      <Status
          key={`status-${task._id}`}
          type={task.status?.type?.toLowerCase().replace(" ", "-") || "pending"}
          title={t(task.status.title) || t("Pending")}
      />,
    ]);
  }, [tasks]);

  // if (error) {
  //   return (
  //       <Page title={t("Tasks")}>
  //         <div className="text-center text-red-500 mt-8">
  //           {t("Failed to load tasks. Please try again later.")}
  //         </div>
  //       </Page>
  //   );
  // }

  return (
      <>
        <Page
            title={t("Tasks")}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 h-full">
              {/*{loading ? (*/}
              {/*    <div className="text-center py-6">{t("Loading tasks...")}</div>*/}
              {/*) : (*/}
                  <Table
                      className="custom-class"
                      title={t("All Tasks")}
                      headers={headers}
                      rows={taskRowTable}
                      customActions={(actualRowIndex) => (
                          <EmployeeProjectStates actualRowIndex={actualRowIndex} />
                      )}
                      isFilter={true}
                  />
              {/*)}*/}
            </div>
          </div>
        </Page>
      </>
  );
}

export default TasksPage;
