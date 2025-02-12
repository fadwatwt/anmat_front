// import propTypes from "prop-types"
import {useParams} from "react-router";
import Page from "../../../Page.jsx";
import ProjectMembers from "./components/ProjectMembers.jsx";
import SelectWithoutLabel from "../../../../components/Form/SelectWithoutLabel.jsx";
import TasksList from "./components/TasksList.jsx";
import TaskComments from "./components/TaskComments.jsx";
import CommentInput from "../../../../components/CommentInput.jsx";
import AttachmentsList from "./components/AttachmentsList.jsx";
import ActivityLogs from "./components/ActivityLogs.jsx";
import TimeLine from "../../../../components/TimeLine/TimeLine.jsx";
import {useTranslation} from "react-i18next";
import {getTimeDifference} from "../../../../functions/Days.js";
import InfoCard from "../../../components/InfoCard.jsx";
import {useState} from "react";
import {filterAndSortTasks} from "../../../../functions/functionsForTasks.js";
import EditProjectModal from "../../modal/EditProjectModal.jsx";

function ProjectDetails() {
    const {id} = useParams();
    const {t} = useTranslation()
    const [isOpenEditModal,setIsOpenEditModal] = useState(false)
    const breadcrumbItems = [
        {title: 'Projects', path: '/projects'},
        {title: 'Project Details', path: ''}
    ];

    const date1 = "2025-01-15T14:30:00";
    const date2 = "2025-01-13T13:40:00";

    const members = [
        {
            name: "John Doe",
            imageProfile: "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg", // رابط الصورة الافتراضية
            rule: "Manager",
            work: "Managing project timelines and deliverables"
        },
        {
            name: "Jane Smith",
            imageProfile: "https://media.istockphoto.com/id/1303206558/photo/headshot-portrait-of-smiling-businessman-talk-on-video-call.jpg?s=612x612&w=0&k=20&c=hMJhVHKeTIznZgOKhtlPQEdZqb0lJ5Nekz1A9f8sPV8=",
            rule: "Team lead",
            work: "Developing frontend components"
        },
        {
            name: "Alice Johnson",
            imageProfile: "https://media.istockphoto.com/id/1199100409/photo/portrait-of-successful-businessman.jpg?s=612x612&w=0&k=20&c=U7fzV2RqONjttzqr4r_cGHWueUN3SP8BOH4mn0hiw4E=",
            rule: "Designer",
            work: "Designing user-friendly interfaces"
        },
        {
            name: "Bob Brown",
            imageProfile: "https://assets.entrepreneur.com/content/3x2/2000/20150406145944-dos-donts-taking-perfect-linkedin-profile-picture-selfie-mobile-camera-2.jpeg?format=pjeg&auto=webp&crop=1:1",
            rule: "QA",
            work: "Testing for quality assurance"
        }
    ];

    const tasks = [
        {
            name: "Design Website Layout",
            members: [
                {
                    name: "John Doe",
                    imageProfile: "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg",
                },
                {
                    name: "Jane Smith",
                    imageProfile: "https://media.istockphoto.com/id/1303206558/photo/headshot-portrait-of-smiling-businessman-talk-on-video-call.jpg?s=612x612&w=0&k=20&c=hMJhVHKeTIznZgOKhtlPQEdZqb0lJ5Nekz1A9f8sPV8=",
                },
                {
                    name: "Alice Johnson",
                    imageProfile: "https://media.istockphoto.com/id/1199100409/photo/portrait-of-successful-businessman.jpg?s=612x612&w=0&k=20&c=U7fzV2RqONjttzqr4r_cGHWueUN3SP8BOH4mn0hiw4E=",
                },
            ],
            delivery: "Delayed",
            rate: null,
            assignedDate: "2025-01-15T14:30:00", // جديد
            dueDate: "2025-01-20T13:40:00", // جديد
            deadLine: "2025-01-19T23:59:59", // جديد
            startDate: "2025-01-10T09:00:00", // جديد
            department: "Design", // جديد
        },
        {
            name: "Implement Backend APIs",
            members: [
                {
                    name: "Bob Brown",
                    imageProfile: "https://assets.entrepreneur.com/content/3x2/2000/20150406145944-dos-donts-taking-perfect-linkedin-profile-picture-selfie-mobile-camera-2.jpeg?format=pjeg&auto=webp&crop=1:1",
                },
                {
                    name: "Alice Johnson",
                    imageProfile: "https://media.istockphoto.com/id/1199100409/photo/portrait-of-successful-businessman.jpg?s=612x612&w=0&k=20&c=U7fzV2RqONjttzqr4r_cGHWueUN3SP8BOH4mn0hiw4E=",
                },
                {
                    name: "Bob Brown",
                    imageProfile: "https://assets.entrepreneur.com/content/3x2/2000/20150406145944-dos-donts-taking-perfect-linkedin-profile-picture-selfie-mobile-camera-2.jpeg?format=pjeg&auto=webp&crop=1:1",
                },
                {
                    name: "Alice Johnson",
                    imageProfile: "https://media.istockphoto.com/id/1199100409/photo/portrait-of-successful-businessman.jpg?s=612x612&w=0&k=20&c=U7fzV2RqONjttzqr4r_cGHWueUN3SP8BOH4mn0hiw4E=",
                },
            ],
            delivery: "late",
            timeLate: getTimeDifference(date1, date2), // لا تغييرات
            rate: 2,
            assignedDate: "2025-01-14T10:00:00", // جديد
            dueDate: "2025-01-18T16:00:00", // جديد
            deadLine: "2025-01-17T23:59:59", // جديد
            startDate: "2025-01-12T08:30:00", // جديد
            department: "Backend Development", // جديد
        },
        {
            name: "Perform QA Testing",
            members: [
                {
                    name: "Jane Smith",
                    imageProfile: "https://media.istockphoto.com/id/1303206558/photo/headshot-portrait-of-smiling-businessman-talk-on-video-call.jpg?s=612x612&w=0&k=20&c=hMJhVHKeTIznZgOKhtlPQEdZqb0lJ5Nekz1A9f8sPV8=",
                },
                {
                    name: "Bob Brown",
                    imageProfile: "https://assets.entrepreneur.com/content/3x2/2000/20150406145944-dos-donts-taking-perfect-linkedin-profile-picture-selfie-mobile-camera-2.jpeg?format=pjeg&auto=webp&crop=1:1",
                },
            ],
            delivery: "Delayed",
            rate: 4.5,
            assignedDate: "2025-01-16T14:00:00",
            dueDate: "2025-01-22T12:00:00",
            deadLine: "2025-01-21T23:59:59",
            startDate: "2025-01-15T11:00:00",
            department: "QA",
        },
    ];



    const comments = [
        {
            account: members[0], // أول عضو
            timeAgo: '2025-01-12T08:00:00', // تاريخ محدد
            text: "Great progress on the project so far!",
            images: [
                "https://i.cdn.turner.com/dr/cnnarabic/cnnarabic/release/sites/default/files/styles/landscape_780x440/public/image/1_6.JPG?itok=pmNMX7TP", // رابط صورة للتعليق
            ],
        },
        {
            account: members[1], // ثاني عضو
            timeAgo: '2025-01-11T10:00:00', // تاريخ محدد
            text: "We need to discuss the timeline adjustments.",
            images: [
                "https://res.cloudinary.com/dw4e01qx8/f_auto,q_auto/images/gogxbp2tjsjvbnas7ygk", // رابط صورة للتعليق
                "https://res.cloudinary.com/dw4e01qx8/f_auto,q_auto/images/jfj1ro8ejfzmojl6k75w",
            ],
        },
        {
            account: members[2], // ثالث عضو
            timeAgo: '2025-01-10T09:30:00', // تاريخ محدد
            text: "Please review the design drafts I shared.",
            images: [],
        },
        {
            account: members[3], // رابع عضو
            timeAgo: '2025-01-12T15:00:00', // تاريخ محدد
            text: "Testing has uncovered some critical issues.",
            images: [
                "https://images.adsttc.com/media/images/5c6e/5b10/284d/d151/2900/06ab/medium_jpg/L4979_N41_hd.jpg?1550736130",
            ],
        },
    ];


    const attachments = [
        {
            name: "Project_Plan.pdf",
            size: "2.4 MB",
            type: "pdf"
        },
        {
            name: "UI_Design.png",
            size: "1.2 MB",
            type: "image"
        },
        {
            name: "Team_Meeting.mp4",
            size: "15 MB",
            type: "video"
        },
        {
            name: "Documentation.docx",
            size: "500 KB",
            type: "document"
        }
    ];

    const activityLogs = [
        {
            type: "add",
            title: "New task added",
            description: "John Doe added a new task: Design website layout.",
            timeAgo: "2025-01-13T14:00:00.000Z",
        },
        {
            type: "video",
            title: "Meeting scheduled",
            description: "Bob Brown added a comment to the task: Perform QA Testing.",
            timeAgo: "2025-01-13T11:00:00.000Z",
        },
        {
            type: "uploaded",
            title: "File uploaded",
            description: "Jane Smith uploaded 'UI_Design.png' to the project.",
            timeAgo: "2025-01-12T16:00:00.000Z",
        },
        {
            type: "check",
            title: "Task completed",
            description: "Alice Johnson marked the task 'Implement Backend APIs' as complete.",
            timeAgo: "2025-01-10T16:00:00.000Z",
        },
        {
            type: "add",
            title: "New task added",
            description: "Bob Brown added a comment to the task: Perform QA Testing.",
            timeAgo: "2025-01-13T11:00:00.000Z",
        },
    ];
    const filterOptions = [
        {id:"deadLine",name:"dead line"},
        {id:"startDate",name:"start date"},
        {id:"department",name:"department"}
    ]
    const [filterTasks, setFilterTasks] = useState(tasks);
    const handelChangeFilterTask = (value) => {
        switch (value) {
            case "deadLine":
                setFilterTasks(filterAndSortTasks(tasks, "deadLine", true));
                break;
            case "startDate":
                setFilterTasks(filterAndSortTasks(tasks, "startDate", true));
                break;
            case "department":
                setFilterTasks(filterAndSortTasks(tasks, "department", true));
                break;
            default:
                setFilterTasks(tasks);
        }
    };

    const handelEditModal = () => {
        setIsOpenEditModal(!isOpenEditModal)
    }

    return (
        <Page title={"Project Details"} isBreadcrumbs={true} breadcrumbs={breadcrumbItems}>
            <div className={"w-full flex items-start  gap-8 flex-col md:flex-row"}>
                <div className={"flex flex-col gap-6 md:w-[60%] w-full "}>
                    <InfoCard type={"project"} handelEditAction={handelEditModal}/>
                    <div className={"p-4 bg-white dark:bg-white-0 rounded-2xl w-full flex flex-col gap-3"}>
                        <div className={"title-header pb-3 w-full flex items-center justify-between "}>
                            <p className={"text-lg dark:text-gray-200"}>{t("Project Tasks")} </p>
                            <SelectWithoutLabel onChange={handelChangeFilterTask} options={filterOptions} title={"Filter by"} className={"w-[120px] h-[36px]"}/>
                        </div>
                        <TasksList tasks={filterTasks}/>
                    </div>
                    <div className={"bg-white dark:bg-white-0 rounded-2xl w-full flex flex-col gap-3"}>
                        <div className={"p-4 flex flex-col gap-3"}>
                            <div className={"title-header w-full flex items-center justify-between"}>
                                <p className={"text-lg dark:text-gray-200 "}>{t("Comments")}</p>
                            </div>
                            <TaskComments comments={comments}/>
                        </div>
                        <CommentInput/>
                    </div>
                </div>
                <div className={"flex-1 flex flex-col gap-6"}>
                    <ProjectMembers members={members}/>
                    <AttachmentsList attachments={attachments}/>
                    <ActivityLogs activityLogs={activityLogs}/>
                    <TimeLine/>
                </div>

            </div>
            <EditProjectModal project={{tasks:tasks}} isOpen={isOpenEditModal} onClose={handelEditModal} />
        </Page>
    );
}

ProjectDetails.propTypes = {}
export default ProjectDetails;