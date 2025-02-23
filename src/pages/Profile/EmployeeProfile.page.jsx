import {useParams} from "react-router";
import Table from "../../components/Tables/Table.jsx";
import Page from "../Page.jsx";
import Status from "../Projects/Components/TableInfo/Status.jsx";
import {useTranslation} from "react-i18next";
import SelectWithoutLabel from "../../components/Form/SelectWithoutLabel.jsx";
import TabsOutContent from "../../components/Modal/TabsContener/TabsOutContent.jsx";
import {useState} from "react";
import Rating from "../HR/Rating.jsx";
import ToDoList from "./components/ToDoList.jsx";
import CalendarEmployee from "./components/CalendarEmployee.jsx";
import AddRequestModal from "./modals/AddRequest.modal.jsx";
import profileBanner from "../../assets/images/profileBanner.png"
import {
    RiCake2Line, RiCalendarLine,
    RiCheckboxCircleFill,
    RiDashboard3Line,
    RiGraduationCapLine,
    RiMailLine, RiMoneyDollarCircleLine, RiStarLine, RiTaskLine, RiTimeLine,
    RiUserLine,RiDownload2Line,RiAddLine, RiBriefcaseLine, RiBuilding2Line
} from "@remixicon/react";


function EmployeeProfilePage() {
    const {t} = useTranslation()
    const { slug } = useParams();
    const [employeeId] = slug.split('-')[0];
    const [activeTab, setActiveTab] = useState("Leave");
    const [isAddRequestModal, setIsAddRequestModal] = useState(false);
    const headerTasksRating = [
        {label: "Task"},
        {label: "Date"},
        {label: "Rating"},
        {label: "Commits"},
    ];
    const tabsData = [
        {
            title: "Leave",
            content: (
                <Table
                    classContainer={"max-w-full"}
                    headers={[
                        { label: "Request Date" },
                        { label: "Type" },
                        { label: "Status - Due Date" },
                    ]}
                    rows={[
                        ["15 Nov, 2024", "Annual Leave",<> <Status type={"Scheduled"} title={"Pending"} /></>],
                        ["15 Nov, 2024", "Annual Leave",<> <Status type={"Scheduled"} title={"Pending"} /></>],
                        ["15 Nov, 2024", "Annual Leave",<> <Status type={"Scheduled"} title={"Pending"} /></>],
                    ]}
                    isActions={false}
                    isCheckInput={false}
                    isTitle={false}
                />
            ),
        },
        {
            title: "Delay",
            content: (
                <Table
                    classContainer={"max-w-full"}
                    headers={[
                        { label: "Project Date" },
                        { label: "Project Name" },
                        { label: "Status - Completion Date" },
                    ]}
                    rows={[
                        ["15 Nov, 2024", "Project A", <><Status type={"Ongoing"} title={"In Progress"} /></>],
                    ]}
                    isActions={false}
                    isCheckInput={false}
                    isTitle={false}
                />
            ),
        },

        {
            title: "Financial",
            content: (
                <Table
                    classContainer={"max-w-full"}
                    headers={[
                        { label: "Project Date" },
                        { label: "Project Name" },
                        { label: "Status - Completion Date" },
                    ]}
                    rows={[
                        ["15 Nov, 2024", "Project A", <><Status type={"Ongoing"} title={"In Progress"} /></>],
                    ]}
                    isActions={false}
                    isCheckInput={false}
                    isTitle={false}
                />
            ),
        },
    ];

    const handleTabChange = (tabTitle) => {
        setActiveTab(tabTitle);
    };

    const handelAddRequestModal = () => {
        setIsAddRequestModal(!isAddRequestModal)
    }

    const tasksRows = [
        ["Task Delta","15 Nov, 2024",<><Rating  value={"90"}/></>,<><p className={"text-wrap dark:text-gray-300"}>Good performance on content delivery.</p></>],
        ["Task Delta","15 Nov, 2024",<><Rating  value={"90"}/></>,<><p className={"text-wrap dark:text-gray-300"}>Good performance on content delivery.</p></>],
        ["Task Delta","15 Nov, 2024",<><Rating  value={"90"}/></>,<><p className={"text-wrap dark:text-gray-300"}>Good performance on content delivery.</p></>],
        ["Task Delta","15 Nov, 2024",<><Rating  value={"90"}/></>,<><p className={"text-wrap dark:text-gray-300"}>Good performance on content delivery.</p></>],
    ]
    return (
        <Page isTitle={false} className={"w-full"}>

        <div className={"w-full flex flex-col items-center md:gap-6 xl:gap-4 gap-8 h-full"}>
            <div className={"relative flex min-h-48 justify-center  w-full h-full md:mb-0 mb-44"}>
                <div className={"w-full md:h-40 h-[50vh]"}>
                    <img className={"max-w-full w-full max-h-full object-cover"} src={profileBanner} alt={""} />
                </div>
                <p className={"absolute top-3 right-3 text-sm text-white"}>Change</p>
                <div className={"absolute md:top-1/3 top-[50px] w-full md:px-10 px-2"}>
                    <div className={" rounded-2xl p-4 border dark:border-gray-700 flex bg-white dark:bg-gray-800"}>
                        <div
                            className={"flex md:items-center md:flex-row md:justify-center flex-col justify-between gap-6 flex-1"}>
                            <div className={"flex justify-between items-center"}>
                                <div className={"relative h-[72px] w-[72px]"}>
                                    <img className={"rounded-full h-[72px] w-[72px] max-w-full"}
                                         src={"https://randomuser.me/api/portraits/men/1.jpg"} alt={"image-user"}/>
                                    <RiCheckboxCircleFill size="23"
                                                      className="absolute top-0 right-0 bg-white dark:bg-gray-800 rounded-full text-cyan-500"/>
                                </div>
                                <button
                                    className={"p-1.5 rounded-lg md:hidden text-nowrap bg-none border text-sm dark:border-gray-700 dark:text-gray-200 self-start"}>Edit
                                    profile
                                </button>
                            </div>
                            <div className={"w-full flex md:flex-row flex-col gap-4 "}>
                                <div className={"flex flex-col gap-4 flex-1 md:border-r-2"}>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiUserLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>Name:</span>
                                        <p className={"text-black text-sm dark:text-gray-100"}>Rawan Ahmed</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiCake2Line size={18} className={"text-soft-400 dark:text-gray-300"}/>
                                        <p className={"text-soft-400 text-sm dark:text-gray-300"}>Age:</p>
                                        <p className={"text-black text-sm dark:text-gray-100"}>21</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiGraduationCapLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>Education:</span>
                                        <p className={"text-black text-sm dark:text-gray-100"}>Bachelor’s Degree in Journalism</p>
                                    </div>
                                </div>
                                <div className={"flex flex-col gap-4 flex-1"}>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiBuilding2Line className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>Department:</span>
                                        <p className={"text-black text-sm dark:text-gray-100"}>Publishing</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiBriefcaseLine size="18" className="text-soft-400 dark:text-gray-300"/>
                                        <p className={"text-soft-400 text-sm dark:text-gray-300"}>Role:</p>
                                        <p className={"text-black text-sm dark:text-gray-100"}>Content Editor</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiMailLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>Email:</span>
                                        <p className={"text-black text-sm dark:text-gray-100"}>Rawan@email.com</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                className={"p-1.5 rounded-lg hidden md:block text-nowrap bg-none border text-sm self-start dark:text-gray-200 dark:border-gray-700"}>Edit
                                profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"flex gap-6 md:flex-row flex-col items-start w-full md:px-10 px-2 justify-between"}>
                <div className={"md:w-8/12 w-full flex flex-col gap-4 items-center h-full"}>
                    <div className={"bg-white rounded-2xl p-4 gap-6 md:flex-1 flex flex-col dark:bg-gray-800 items-center w-full"}>
                        <div className={"flex justify-between items-center w-full"}>
                            <p className={"text-lg dark:text-gray-200"}>{t("Requests")}</p>
                            <button
                                onClick={handelAddRequestModal}
                                className={" bg-none p-1.5 border-2 border-primary-base dark:border-primary-200 rounded-xl flex items-center gap-2"}>
                                <RiAddLine size={"18"} className={"text-primary-base dark:text-primary-200"} />
                                <span className={"text-sm text-primary-base dark:text-primary-200"}>{t("Request")}</span>
                            </button>
                        </div>
                        <div className={"flex items-center justify-between w-full"}>
                            <div className={"flex w-1/3"}>
                                <TabsOutContent tabs={tabsData} onTabChange={handleTabChange}/>
                            </div>
                            <div className={"flex gap-2"}>
                                <SelectWithoutLabel title={"Filter by"} className={"w-[94px] h-[36px]"}/>
                                <button
                                    className={"flex dark:text-gray-400 text-sm items-baseline p-2  gap-2 rounded-lg border border-gray-200 dark:border-gray-600"}>
                                    <RiDownload2Line size={15}/>
                                    {t("Export")}
                                </button>
                            </div>
                        </div>
                        <div className={"w-full"}>
                            {tabsData.map(
                                ({title, content}) =>
                                    activeTab === title && <div key={title}>{content}</div>
                            )}
                        </div>
                    </div>
                    <div className={"bg-white rounded-2xl p-4 gap-6 md:flex-1 flex flex-col items-center w-full dark:bg-gray-800"}>
                        <div className={"flex justify-between items-center w-full"}>
                            <p className={"text-lg dark:text-gray-200"}>{t("Tasks Rating")}</p>
                            <div className={"flex gap-2"}>
                                <SelectWithoutLabel title={"Filter by"} className={"w-[94px] h-[36px]"}/>
                                <button
                                    className={"flex dark:text-gray-400 text-sm items-baseline p-2  gap-2 rounded-lg border border-gray-200 dark:border-gray-600"}>
                                    <RiDownload2Line size={"18"}/>
                                    {t("Export")}
                                </button>
                            </div>
                        </div>
                        <div className={"w-full"}>
                            <Table classContainer={"max-w-full"} headers={headerTasksRating} rows={tasksRows} isActions={false}
                                   isCheckInput={false} isTitle={false}/>
                        </div>
                    </div>
                </div>
                <div className={"w-full flex h-full flex-col gap-3"}>
                        <div className={"bg-white rounded-2xl p-4 md:flex-1 w-full gap-4 flex flex-col dark:bg-gray-800"}>
                            <p className={"text-lg text-start dark:text-gray-200"}>Work Information</p>
                            <div className={"flex flex-col w-full gap-6"}>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiMoneyDollarCircleLine size={"18"} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                    <span className={"text-soft-400 text-sm dark:text-gray-300"}>Salary:</span>
                                    <p className={"text-black text-sm dark:text-gray-200"}>$3,500/month</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiTimeLine size={"18"}  className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                    <span className={"text-soft-400 text-sm dark:text-gray-300"}>Working Hours:</span>
                                    <p className={"text-black text-sm dark:text-gray-200"}> 8 hours/day</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiCalendarLine size={"18"} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                    <span className={"text-soft-400 text-sm dark:text-gray-300"}>Annual Leave Days:</span>
                                    <p className={"text-black text-sm dark:text-gray-200"}> 21 days/year</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiDashboard3Line size={"18"}  className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                    <span className={"text-soft-400 text-sm dark:text-gray-300"}>Attendance Rate:</span>
                                    <p className={"text-black text-sm dark:text-gray-200"}>95% for the month</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <RiTaskLine size={"18"}  className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                    <span className={"text-soft-400 text-sm dark:text-gray-300"}>Task Completion:</span>
                                    <p className={"text-black text-sm dark:text-gray-200"}>67%</p>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <RiStarLine size={"18"} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                    <span className={"text-soft-400 text-sm dark:text-gray-300"}>Rating:</span>
                                    <p className={"text-black text-sm dark:text-gray-200"}><Rating value={"90"} /></p>
                                </div>
                            </div>
                    </div>
                    <ToDoList list={[
                        "Edit content for Marketing Trends 2024",
                        "Proofread \"Weekly Report for Publishing",
                        "Publish \"Holiday Campaign Articles",
                        "Edit content for \"Marketing Trends 2024.",
                    ]} isActions={true} isFilter={true} className={"h-[68%]"} />
                </div>
            </div>
            <div className={"w-full flex h-full flex-col gap-3 md:px-10 px-2 pb-10"}>
                <CalendarEmployee />
            </div>
        </div>
            <AddRequestModal isOpen={isAddRequestModal} onClose={handelAddRequestModal} onClick={() => {}} />
        </Page>
    );
}

export default EmployeeProfilePage;