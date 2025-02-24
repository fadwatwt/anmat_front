import {useState} from "react";
import {HiMiniCheckBadge} from "react-icons/hi2";
import {FaRegUser} from "react-icons/fa";
import {LuCake} from "react-icons/lu";
import {TbSchool} from "react-icons/tb";
import {RiBuilding2Line, RiLockLine} from "react-icons/ri";
import {MdEmail} from "react-icons/md";
import Page from "../../Page.jsx";
import AttendanceTab from "../Tabs/AttendanceTab.jsx";
import RotationTap from "../Tabs/RotationTap.jsx";
import ToDoList from "../components/ToDoList.jsx";

function EmployeeProfilePage() {
    const [slug, setSlug] = useState("66e69ec5845e00ff449e6d62-kirollos");
    const [employeeId] = slug.split('-')[0];

    return (
        <Page isTitle={false} className={"w-full"}>
            <div className={"w-full flex flex-col items-center gap-6"}>
                {/* Employee Profile Header */}
                <div className={"relative flex min-h-48 justify-center w-full"}>
                    <div className={"w-full md:h-40 h-[50vh]"}>
                        <img
                            className={"max-w-full w-full max-h-full object-cover"}
                            src={"https://media.istockphoto.com/id/1470053023/photo/panoramic-fresh-green-spring-and-summer-background-with-sun-lens-flare-and-defocused-blurred.jpg?b=1&s=612x612&w=0&k=20&c=xkD0vx6erKGryV6qs_EO1Mso9ncxqaZY45yT6v6HGkg="}
                            alt={""}
                        />
                    </div>
                    <p className={"absolute top-3 right-3 text-sm text-white"}>Change</p>
                    <div className={"absolute md:top-1/3 top-[50px] w-full px-10"}>
                        <div className={"rounded-md p-4 border flex bg-white"}>
                            <div className={"flex md:items-center md:flex-row md:justify-center flex-col justify-between gap-6 flex-1"}>
                                <div className={"flex justify-between items-center"}>
                                    <div className={"relative h-[72px] w-[72px]"}>
                                        <img
                                            className={"rounded-full h-[72px] w-[72px] max-w-full"}
                                            src={"https://randomuser.me/api/portraits/men/1.jpg"}
                                            alt={"image-user"}
                                        />
                                        <HiMiniCheckBadge
                                            size={23}
                                            className={"absolute top-0 right-0 bg-white rounded-full text-cyan-500"}
                                        />
                                    </div>
                                    <button
                                        className={"p-1.5 rounded-lg md:hidden text-nowrap bg-none border text-sm self-start"}>
                                        Edit profile
                                    </button>
                                </div>
                                <div className={"w-full flex md:flex-row flex-col gap-4"}>
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
                                    className={"p-1.5 rounded-lg hidden md:block text-nowrap bg-none border text-sm self-start"}>
                                    Edit profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className={"w-full px-10"}>
                    <div className={"bg-white rounded-2xl p-4"}>
                        <AttendanceTab/>
                    </div>
                </div>

                {/* Rotation Table */}
                <div className={"w-full px-10"}>
                    <div className={"bg-white rounded-2xl p-4"}>
                        <RotationTap/>
                    </div>
                </div>

                {/* ToDo List */}
                <div className={"w-full px-10"}>
                    <div className={"bg-white rounded-2xl p-4"}>
                        <ToDoList
                            list={[
                                "Edit content for Marketing Trends 2024",
                                "Proofread \"Weekly Report for Publishing\"",
                                "Publish \"Holiday Campaign Articles\"",
                                "Edit content for \"Marketing Trends 2024\".",
                            ]}
                            isActions={true}
                            isFilter={true}
                            className={"flex-1"}
                        />
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default EmployeeProfilePage;