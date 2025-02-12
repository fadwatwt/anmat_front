import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import Page from "../Page.jsx";
import Table from "../../components/Tables/Table.jsx";
import TimeLine from "../../components/TimeLine/TimeLine.jsx";
import {useState} from "react";
import {tasksRows} from "../../functions/FactoryData.jsx";
import EditTaskModal from "./modal/EditTaskModal.jsx";
import Alert from "../../components/Alert.jsx";
import NameAndDescription from "../Projects/Components/TableInfo/NameAndDescription.jsx";
import AccountDetails from "../Projects/Components/TableInfo/AccountDetails.jsx";
import {translateDate} from "../../functions/Days.js";
import Priority from "../Projects/Components/TableInfo/Priority.jsx";
import Status from "../Projects/Components/TableInfo/Status.jsx";
import MembersListXLine from "../Projects/Components/ProjectDetails/components/MembersListXLine.jsx";
import {convertToSlug} from "../../functions/AnotherFunctions.js";

function TasksPage() {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [isOpenEditModal,setIsOpenEditModal] = useState(false)
    const [taskEdit,setTaskEdit] = useState(null)
    const [isOpenDeleteAlert,setIsOpenDeleteAlert] = useState(false)
    const headers = [
        {label: t("Tasks"), width: "200px"},
        {label: t("Assigned to"), width: "150px"},
        {label: t("Manager"), width: "200px"},
        {label: t("Assigned - Due  Date"), width: "300px"},
        {label: t("Priority"), width: "100px"},
        {label: t("Status"), width: "100px"},
        {label: "", width: "50px"},
    ];


    const handelCreateProjectBtn = () => {
        navigate("/tasks/create");
    }
    const handelEditModal = (index) => {
        console.log(index)
        setTaskEdit({tasks:tasksRows[index]})
        setIsOpenEditModal(!isOpenEditModal)
    }
    const handelDeleteTask = (index) => {
        console.log(index)
        setIsOpenDeleteAlert(!isOpenDeleteAlert)
    }
    const rows = tasksRows.length > 0
        ? tasksRows.map((task) => ({
            id: task.id,
            cells: [
                <NameAndDescription
                    key={`name-${task.id}`}
                    path={`/tasks/${task.id}-${convertToSlug(task.name)}`}
                    name={task.name || t("No Name")}
                    description={task.description || t("No Description")}
                />,
                <MembersListXLine
                    key={`members-${task.id}`}
                    members={task.members}
                    maxVisible={task.maxVisibleMembers}
                />,
                <AccountDetails
                    key={`account-${task.id}`}
                    account={task.account || { name: t("Unassigned"), rule: t("N/A"), imageProfile: "/default-avatar.png" }}
                />,
                <p key={`date-${task.id}`} className="text-sm dark:text-sub-300">
                    {task.dateStart && task.dateEnd
                        ? `${translateDate(task.dateStart)} - ${translateDate(task.dateEnd)}`
                        : t("No Date")}
                </p>,
                <Priority
                    key={`priority-${task.id}`}
                    type={task.priority?.type || "low"}
                    title={task.priority?.title || t("Low")}
                />,
                <Status
                    key={`status-${task.id}`}
                    type={task.status?.type || "pending"}
                    title={task.status?.title || t("Pending")}
                />,
            ],
        }))
        : [];
    return (
        <>
            <Page title={"Tasks"} isBtn={true} btnOnClick={handelCreateProjectBtn} btnTitle={"Create a Task"}>
                <div className={"flex flex-col gap-6"}>
                    <div className="flex flex-col gap-2 h-full">
                        <Table className="custom-class" title={"All tasks"} handelDelete={handelDeleteTask}
                               headers={headers} handelEdit={handelEditModal} isActions={true}
                               rows={rows}
                               isFilter={true}/>
                    </div>
                <div className={"flex md:w-[37.5%] w-screen"}>
                    <TimeLine/>
                </div>
            </div>
        </Page>
            <EditTaskModal task={taskEdit} isOpen={isOpenEditModal} onClose={handelEditModal} />
            <Alert type={"warning"} title={"Delete Task?"}
                   message={"Are you sure you want to delete this task."}
                   titleCancelBtn={"Cancel"}
                   titleSubmitBtn={"Delete"} isOpen={isOpenDeleteAlert} onClose={() => setIsOpenDeleteAlert(!isOpenDeleteAlert)} />
        </>
    );
}

export default TasksPage;