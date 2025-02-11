import {useParams} from "react-router";
import {HiMiniCheckBadge} from "react-icons/hi2";
import {FaRegClock, FaRegUser} from "react-icons/fa";
import {LuCake} from "react-icons/lu";
import {TbSchool} from "react-icons/tb";
import {RiBuilding2Line, RiLockLine} from "react-icons/ri";
import {MdEmail, MdOutlineCalendarToday} from "react-icons/md";
import Table from "../../../components/Tables/Table.jsx";
import Page from "../../Page.jsx";
import Status from "../../Projects/Components/TableInfo/Status.jsx";
import {useTranslation} from "react-i18next";
import {FiPlus} from "react-icons/fi";
import SelectWithoutLabel from "../../../components/Form/SelectWithoutLabel.jsx";
import {TfiImport, TfiStar} from "react-icons/tfi";
import TabsOutContent from "../../../components/Modal/TabsContener/TabsOutContent.jsx";
import {useState} from "react";
import Rating from "../Rating.jsx";
import {AiOutlineDashboard, AiOutlineDollar} from "react-icons/ai";
import {BsFileCheck} from "react-icons/bs";
import ToDoList from "../components/ToDoList.jsx";


function EmployeeProfilePage() {
    const {t} = useTranslation()
    const { slug } = useParams();
    const [employeeId] = slug.split('-')[0];
    const [activeTab, setActiveTab] = useState("Leave");
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

    const tasksRows = [
        ["Task Delta","15 Nov, 2024",<><Rating  value={"90"}/></>,<><p className={"text-wrap"}>Good performance on content delivery.</p></>],
        ["Task Delta","15 Nov, 2024",<><Rating  value={"90"}/></>,<><p className={"text-wrap"}>Good performance on content delivery.</p></>],
        ["Task Delta","15 Nov, 2024",<><Rating  value={"90"}/></>,<><p className={"text-wrap"}>Good performance on content delivery.</p></>],
        ["Task Delta","15 Nov, 2024",<><Rating  value={"90"}/></>,<><p className={"text-wrap"}>Good performance on content delivery.</p></>],
    ]
    return (
        <Page isTitle={false} className={"w-full"}>

        <div className={"w-full flex flex-col items-center md:gap-6 xl:gap-4 gap-8"}>
            <div className={"relative flex min-h-48 justify-center  w-full"}>
                <div className={"w-full md:h-40 h-[50vh]"}>
                    <img className={"max-w-full w-full max-h-full object-cover"} src={"https://media.istockphoto.com/id/1470053023/photo/panoramic-fresh-green-spring-and-summer-background-with-sun-lens-flare-and-defocused-blurred.jpg?b=1&s=612x612&w=0&k=20&c=xkD0vx6erKGryV6qs_EO1Mso9ncxqaZY45yT6v6HGkg="} alt={""} />
                </div>
                <p className={"absolute top-3 right-3 text-sm text-white"}>Change</p>
                <div className={"absolute md:top-1/3 top-[50px] w-full px-10"}>
                    <div className={" rounded-md p-4 border flex bg-white"}>
                        <div
                            className={"flex md:items-center md:flex-row md:justify-center flex-col justify-between gap-6 flex-1"}>
                            <div className={"flex justify-between items-center"}>
                                <div className={"relative h-[72px] w-[72px]"}>
                                    <img className={"rounded-full h-[72px] w-[72px] max-w-full"}
                                         src={"https://randomuser.me/api/portraits/men/1.jpg"} alt={"image-user"}/>
                                    <HiMiniCheckBadge size={23}
                                                      className={"absolute top-0 right-0 bg-white rounded-full text-cyan-500"}/>
                                </div>
                                <button
                                    className={"p-1.5 rounded-lg md:hidden text-nowrap bg-none border text-sm self-start"}>Edit
                                    profile
                                </button>
                            </div>
                            <div className={"w-full flex md:flex-row flex-col gap-4 "}>
                                <div className={"flex flex-col gap-4 flex-1 md:border-r-2"}>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <FaRegUser className={"text-soft-400 text-sm"}/>
                                        <span className={"text-soft-400 text-sm"}>Name:</span>
                                        <p className={"text-black text-sm"}>Rawan Ahmed</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <LuCake size={18} className={"text-soft-400"}/>
                                        <p className={"text-soft-400 text-sm"}>Age:</p>
                                        <p className={"text-black text-sm"}>21</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <TbSchool size={18} className={"text-soft-400 text-sm"}/>
                                        <span className={"text-soft-400 text-sm"}>Education:</span>
                                        <p className={"text-black text-sm"}>Bachelor’s Degree in Journalism</p>
                                    </div>
                                </div>
                                <div className={"flex flex-col gap-4 flex-1"}>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiBuilding2Line className={"text-soft-400 text-sm"}/>
                                        <span className={"text-soft-400 text-sm"}>Department:</span>
                                        <p className={"text-black text-sm"}>Publishing</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiLockLine size={18} className={"text-soft-400"}/>
                                        <p className={"text-soft-400 text-sm"}>Role:</p>
                                        <p className={"text-black text-sm"}>Content Editor</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <MdEmail size={18} className={"text-soft-400 text-sm"}/>
                                        <span className={"text-soft-400 text-sm"}>Email:</span>
                                        <p className={"text-black text-sm"}>Rawan@email.com</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                className={"p-1.5 rounded-lg hidden md:block text-nowrap bg-none border text-sm self-start"}>Edit
                                profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"flex gap-6 md:flex-row h-full flex-col items-start w-full px-10 justify-between"}>
                <div className={"md:w-8/12 w-full flex flex-col gap-4 items-center "}>
                    <div className={"bg-white rounded-2xl p-4 gap-6 md:flex-1 flex flex-col items-center w-full"}>
                        <div className={"flex justify-between items-center w-full"}>
                            <p className={"text-lg"}>{t("Requests")}</p>
                            <button
                                className={" bg-none p-1.5 border-2 border-primary-base rounded-xl flex items-center gap-2"}>
                                <FiPlus className={"text-primary-base dark:text-primary-200"} size={13}/>
                                <span className={"text-sm text-primary-base"}>{t("Request")}</span>
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
                                    <TfiImport size={15}/>
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
                    <div className={"bg-white rounded-2xl p-4 gap-6 md:flex-1 flex flex-col items-center w-full"}>
                        <div className={"flex justify-between items-center w-full"}>
                            <p className={"text-lg"}>{t("Tasks Rating")}</p>
                            <div className={"flex gap-2"}>
                                <SelectWithoutLabel title={"Filter by"} className={"w-[94px] h-[36px]"}/>
                                <button
                                    className={"flex dark:text-gray-400 text-sm items-baseline p-2  gap-2 rounded-lg border border-gray-200 dark:border-gray-600"}>
                                    <TfiImport size={15}/>
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
                <div className={"md:flex-1 w-full h-full flex flex-col gap-3"}>
                        <div className={"bg-white rounded-2xl p-4 md:flex-1 w-full gap-4 flex flex-col"}>
                            <p className={"text-lg text-start"}>Work Information</p>
                            <div className={"flex flex-col w-full gap-6"}>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <AiOutlineDollar className={"text-soft-400 text-sm"}/>
                                    <span className={"text-soft-400 text-sm"}>Salary:</span>
                                    <p className={"text-black text-sm"}>$3,500/month</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <FaRegClock  className={"text-soft-400 text-sm"}/>
                                    <span className={"text-soft-400 text-sm"}>Working Hours:</span>
                                    <p className={"text-black text-sm"}> 8 hours/day</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <MdOutlineCalendarToday className={"text-soft-400 text-sm"}/>
                                    <span className={"text-soft-400 text-sm"}>Annual Leave Days:</span>
                                    <p className={"text-black text-sm"}> 21 days/year</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <AiOutlineDashboard  className={"text-soft-400 text-sm"}/>
                                    <span className={"text-soft-400 text-sm"}>Attendance Rate:</span>
                                    <p className={"text-black text-sm"}>95% for the month</p>
                                </div>
                                <div className={"name-profile flex items-center gap-1"}>
                                    <BsFileCheck  className={"text-soft-400 text-sm"}/>
                                    <span className={"text-soft-400 text-sm"}>Task Completion:</span>
                                    <p className={"text-black text-sm"}>67%</p>
                                </div>
                                <div className={"name-profile flex items-center gap-2"}>
                                    <TfiStar  className={"text-soft-400 text-sm"}/>
                                    <span className={"text-soft-400 text-sm"}>Rating:</span>
                                    <p className={"text-black text-sm"}><Rating value={"90"} /></p>
                                </div>
                            </div>
                    </div>
                    <ToDoList list={[
                        "Edit content for Marketing Trends 2024",
                        "Proofread \"Weekly Report for Publishing",
                        "Publish \"Holiday Campaign Articles",
                        "Edit content for \"Marketing Trends 2024.",
                    ]} isActions={true} isFilter={true} className={"flex-1"} />

                </div>
            </div>
        </div>
        </Page>
    );
}

export default EmployeeProfilePage;