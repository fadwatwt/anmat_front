
import {
    RiBuilding4Line,
    RiCheckboxCircleFill,
    RiCheckLine,
    RiCopperDiamondLine, RiFacebookCircleFill,
    RiFlashlightLine, RiLinkedinBoxFill, RiTwitterXLine
} from "@remixicon/react";
import Collapse from "@/components/LandingPage/Collapse.jsx";
function Desktop2Page() {
    let isOnSwitch = false;
    const handelIsOnSwitch = () => {
        isOnSwitch = !isOnSwitch;
    }
    return (
        <div className={"flex flex-col w-full items-center max-h-screen overflow-y-auto"}>
            <div
                className={"w-full flex justify-center bg-gradient-to-t to-primary-500 from-primary-900 via-primary-600 pt-5"}>
                <div className={"flex flex-col gap-8 max-w-[87rem] w-[87rem]"}>
                    <div className={"flex justify-between"}>
                        <div className={"flex gap-6 items-center"}>
                            <div className={"flex items-center gap-2"}>
                                <img src="/images/LandingPage/logoBlue.png" alt={"logo"} className={"w-8 h-8"}/>
                                <p className={" text-white"}>Anmat</p>
                            </div>
                            <nav className={"flex gap-6 text-white"}>
                                <li className={"list-none "}>Home</li>
                                <li className={"list-none "}>Features</li>
                                <li className={"list-none "}>Pricing</li>
                                <li className={"list-none "}>FAQ</li>
                            </nav>
                        </div>
                        <div className={"flex items-center gap-3"}>
                            <p className={" text-white"}>{"Login"}</p>
                            <button className={"bg-white py-1.5 px-3 rounded-md "}>Sign up</button>
                        </div>
                    </div>
                    <div className={"w-full flex flex-col items-center gap-3"}>
                        <p className={"text-5xl max-w-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-400 via-primary-100 bg-clip-text text-transparent text-wrap "}>Your
                            Ultimate Management Dashboard</p>
                        <p className={"text-primary-200 max-w-3xl"}>All the tools you need for collaboration, analytics,
                            and
                            decision-making in one place.</p>
                    </div>
                    <div className={"flex justify-center items-center gap-3"}>
                        <button className={"bg-white py-2 px-3 rounded-md text-sm"}> Get started</button>
                        <p className={"text-primary-200"}>Login</p>
                    </div>
                    <div className={"flex justify-center w-full"}>
                        <img src="/images/LandingPage/dashboardImage.png" alt={"dashboard image"} className={"w-8/12"}/>
                    </div>
                </div>
            </div>
            <div className={"max-w-[87rem] w-[87rem] flex flex-col justify-center items-center gap-10"}>
                <div className={"flex flex-col py-10"}>
                    <p className={"text-blue-500 text-sm"}>Main Features</p>
                    <p className={"text-4xl font-bold text-black "}>Key Features</p>
                </div>
                <div className={" w-full grid grid-cols-2 gap-6"}>
                    <div className={"bg-gradient-to-tr from-[#FED2CC] to-[#FFDFDB80] py-0 w-full rounded-xl"}>
                        <div className={"flex flex-col gap-2 items-start "}>
                            <div className={" pt-10 px-10 pb-4 flex-col items-start gap-2 text-start"}>
                                <p className={"text-lg font-bold text-black"}>Performance Analytics</p>
                                <p className={"text-black text-wrap"}>Track performance across tasks, employees, and
                                    departments.</p>
                            </div>
                            <div className={"relative w-full h-72 flex justify-end pr-10 py-0 overflow-hidden"}>
                                <img src="/images/LandingPage/pioChart.png" alt={"chart1"} className={"w-72 absolute right-10 top-11"}/>
                                <img src="/images/LandingPage/chart1.png" alt={"chart1"} className={"w-72 absolute right-64 -top-4"}/>
                            </div>
                        </div>
                    </div>
                    <div className={"bg-gradient-to-tr from-[#D2C3FE] to-[#E2D6FF80] w-full rounded-md"}>
                        <div className={"flex flex-col gap-2 items-start "}>
                            <div className={" pt-10 px-10 pb-4 flex-col items-start gap-2 text-start"}>
                                <p className={"text-lg font-bold text-black"}>Performance Analytics</p>
                                <p className={"text-black text-wrap"}>Track performance across tasks, employees, and
                                    departments.</p>
                            </div>
                            <div className={"relative w-full h-72 flex justify-center pr-10 py-0 overflow-hidden"}>
                                <img src="/images/LandingPage/notifications.png" alt={"notifications image"} className={"w-96 absolute -top-3"}/>
                            </div>
                        </div>
                    </div>
                    <div className={"bg-gradient-to-tr from-[#BFDDD1] to-[#D6EAE180] w-full rounded-xl"}>
                        <div className={"flex flex-col gap-2 items-start "}>
                            <div className={" pt-10 px-10 pb-4 flex-col items-start gap-2 text-start"}>
                                <p className={"text-lg font-bold text-black"}>Performance Analytics</p>
                                <p className={"text-black text-wrap"}>Track performance across tasks, employees, and
                                    departments.</p>
                            </div>
                            <div className={"relative w-full h-72 flex justify-end pr-10 py-0 overflow-hidden"}>
                                <img src="/images/LandingPage/fileInputImage.png" alt={"chart1"} className={"w-72 absolute right-64 -top-4"}/>
                                <img src="/images/LandingPage/followAndUnfollowModalImage.png" alt={"chart1"} className={"w-72 absolute right-10 top-11"}/>
                            </div>
                        </div>
                    </div>
                    <div className={"bg-gradient-to-tr from-[#C7D5FF] to-[#E5EBFF80] w-full rounded-xl"}>
                        <div className={"flex flex-col gap-2 items-start "}>
                            <div className={" pt-10 px-10 pb-4 flex-col items-start gap-2 text-start"}>
                                <p className={"text-lg font-bold text-black"}>Performance Analytics</p>
                                <p className={"text-black text-wrap"}>Track performance across tasks, employees, and
                                    departments.</p>
                            </div>
                            <div className={"relative w-full h-72 flex justify-end pr-10 py-0 overflow-hidden"}>
                                <img src="/images/LandingPage/taskStagesImage.png" alt={"chart1"}
                                     className={"w-96 absolute right-52 top-11"}/>
                                <img src="/images/LandingPage/projectDetailsImage.png" alt={"chart1"}
                                     className={"w-72 absolute right-0 -top-4"}/>

                            </div>
                        </div>
                    </div>
                </div>
                <div className={"bg-primary-700 w-full rounded-xl flex items-start justify-between gap-3"}>
                    <div className={"flex flex-col items-start justify-start gap-6 py-10 pl-10"}>
                        <p className={"text-white text-3xl font-bold"}>Connect with your team</p>
                        <div className={"flex flex-col gap-8"}>
                            <div className={"flex gap-1"}>
                                <RiCheckboxCircleFill size={"30"} className={"text-white"}/>
                                <p className={"text-lg text-white"}>Seamless Communication & Collaboration</p>
                            </div>
                            <div className={"flex gap-1"}>
                                <RiCheckboxCircleFill size={"30"} className={"text-white"}/>
                                <p className={"text-lg text-white"}>Real-time messaging</p>
                            </div>
                            <div className={"flex gap-1"}>
                                <RiCheckboxCircleFill size={"30"} className={"text-white"}/>
                                <p className={"text-lg text-white"}>Effortless meeting scheduling</p>
                            </div>
                            <div className={"flex gap-1"}>
                                <RiCheckboxCircleFill size={"30"} className={"text-white"}/>
                                <p className={"text-lg text-white"}>Stay organized & on track</p>
                            </div>
                            <div className={"w-1/2"}>
                                <button className={"py-2 rounded-xl w-full bg-primary-100 text-primary-900"}> Get started
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={"py-8"}>
                        <img src="/images/LandingPage/companyImag1.png" alt={"company"} className={" max-w-[480px]"}/>
                    </div>
                </div>
                <div className={"flex flex-col w-full "}>
                    <div className={"flex flex-col py-10 gap-12"}>
                        <div className={"flex flex-col"}>
                            <p className={"text-blue-500 text-sm"}>Main Features</p>
                            <p className={"text-4xl font-bold text-black "}>Plans tailored for your team</p>
                        </div>
                        <div className={"flex items-center justify-center gap-3 relative"}>
                            <p>Pay Monthly </p>
                            <button
                                type={"submit"}
                                className={`w-10 h-5 flex items-center dark:shadow-inner dark:drop-shadow shadow-gray-500 dark:border border-gray-700 rounded-full p-0.5 transition-colors ${
                                    isOnSwitch
                                        ? "bg-primary-500 dark:bg-primary-200"
                                        : "bg-[#E2E4E9] dark:bg-gray-800"
                                }`}
                            >
                                <div
                                    className={`relative bg-white  dark:shadow-inner  dark:shadow-gray-500 dark:bg-gray-800 w-3.5 h-3.5 rounded-full  transform transition-transform flex items-center justify-center  `}
                                >
                                    {/* Small Circle Inside */}
                                    <div
                                        className={`w-1.5 h-1.5 rounded-full dark:shadow-inner drop-shadow shadow-gray-500 `}
                                    />
                                </div>
                            </button>
                            <p>Pay Yearly</p>
                            <img src="/images/LandingPage/arrowSwitchImage.png" alt={"arrow"}
                                 className={"absolute w-[185px] h-[87px] right-[24rem] -top-7"}/>
                        </div>
                        <div className={"w-full flex justify-center items-center gap-5"}>
                            <div
                                className={"w-1/4 rounded-xl border border-gray-300 shadow-md flex flex-col gap-5 py-8 px-6"}>
                                <div className={"flex flex-col gap-2 justify-center items-center"}>
                                    <div
                                        className={"rounded-full w-12 h-12 bg-primary-100 flex items-center justify-center"}>
                                        <span
                                            className={"rounded-full p-1 bg-primary-200 flex items-center justify-center"}>
                                            <RiFlashlightLine size={"25"} className={"text-blue-700"}/>
                                        </span>
                                    </div>
                                    <p className={"text-primary-700 text-2xl"}>Basic plan</p>
                                    <p className={"text-4xl font-bold text-black"}>$10/mth</p>
                                    <p className={"text-gray-400 text-sm"}>All the basics to get started.</p>
                                </div>
                                <div className={""}>
                                    <div className={"flex flex-col items-start gap-4"}>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>Access to core dashboard features</p>
                                        </div>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>Basic task and project management</p>
                                        </div>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>Up to 5 team members</p>
                                        </div>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>10GB cloud storage per user</p>
                                        </div>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>Email support</p>
                                        </div>
                                    </div>
                                </div>
                                <button className={"rounded-[10px] bg-primary-base w-full py-2.5 text-white"}>Get
                                    started
                                </button>
                            </div>
                            <div
                                className={"w-1/4 rounded-xl border border-gray-300 shadow-md flex flex-col gap-5 py-8 px-6"}>
                                <div className={"flex flex-col gap-2 justify-center items-center"}>
                                    <div
                                        className={"rounded-full w-12 h-12 bg-primary-100 flex items-center justify-center"}>
                                        <span
                                            className={"rounded-full p-1 bg-primary-200 flex items-center justify-center"}>
                                            <RiCopperDiamondLine size={"25"} className={"text-blue-700"}/>
                                        </span>
                                    </div>
                                    <p className={"text-primary-700 text-2xl"}>Professional plan</p>
                                    <p className={"text-4xl font-bold text-black"}>$30/mth</p>
                                    <p className={"text-gray-400 text-sm"}>Enhanced features for growing teams.</p>
                                </div>
                                <div className={""}>
                                    <div className={"flex flex-col items-start gap-4"}>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>Task and team management</p>
                                        </div>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>Performance analytics for employees</p>
                                        </div>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>Up to 20 team members</p>
                                        </div>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>50GB cloud storage per user</p>
                                        </div>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>Priority support</p>
                                        </div>
                                    </div>
                                </div>
                                <button className={"rounded-[10px] bg-primary-base w-full py-2.5 text-white"}>Get
                                    started
                                </button>
                            </div>
                            <div
                                className={"w-1/4 rounded-xl border border-gray-300 shadow-md flex flex-col gap-5 py-8 px-6"}>
                                <div className={"flex flex-col gap-2 justify-center items-center"}>
                                    <div
                                        className={"rounded-full w-12 h-12 bg-primary-100 flex items-center justify-center"}>
                                        <span
                                            className={"rounded-full p-1 bg-primary-200 flex items-center justify-center"}>
                                            <RiBuilding4Line size={"25"} className={"text-blue-700"}/>
                                        </span>
                                    </div>
                                    <p className={"text-primary-700 text-2xl"}>Enterprise plan</p>
                                    <p className={"text-4xl font-bold text-black"}>$50/mth</p>
                                    <p className={"text-gray-400 text-sm"}>Complete control for large Enterprise.</p>
                                </div>
                                <div className={""}>
                                    <div className={"flex flex-col items-start gap-4"}>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>Advanced custom fields</p>
                                        </div>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>Unlimited team members</p>
                                        </div>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>Unlimited storage per user</p>
                                        </div>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>Personalized account manager</p>
                                        </div>
                                        <div className={"flex items-center gap-2 justify-start"}>
                                            <div
                                                className={"w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"}>
                                                <RiCheckLine size={"21"} className={"text-primary-700"}/></div>
                                            <p className={"text-sm"}>24/7 premium support</p>
                                        </div>
                                    </div>
                                </div>
                                <button className={"rounded-[10px] bg-primary-base w-full py-2.5 text-white"}>Get
                                    started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"flex flex-col gap-5 justify-center items-center"}>
                    <p className={"text-lg text-gray-400"}>Trusted by X companies</p>
                    <div className={"flex items-center max-w-full px-10 gap-8"}>
                        <img src="/images/LandingPage/Companys/company1.png" alt={""} className={"w-44"} />
                        <img src="/images/LandingPage/Companys/company2.png" alt={""} className={"w-44"} />
                        <img src="/images/LandingPage/Companys/company3.png" alt={""} className={"w-44"} />
                        <img src="/images/LandingPage/Companys/company4.png" alt={""} className={"w-44"} />
                        <img src="/images/LandingPage/Companys/company5.png" alt={""} className={"w-44"} />
                    </div>
                </div>
                <div className={"flex flex-col gap-5 w-1/2  "}>
                    <div className={"flex flex-col gap-5"}>
                        <p className={"text-black text-2xl font-bold"}>Frequently asked questions</p>
                        <p className={"text-gray-500"}>Everything you need to know about managing your dashboard.</p>
                    </div>
                    <div className={"flex flex-col px-20 gap-5 "}>
                        <Collapse
                            title={"Can I customize permissions for my team?"}
                            text={"Yes, the dashboard allows you to set and customize permissions based on roles, ensuring secure and efficient task delegation."}
                       />
                        <Collapse
                            title={"Can I switch to a different plan later?"}
                            text={"Yes, the dashboard allows you to set and customize permissions based on roles, ensuring secure and efficient task delegation."}
                        />
                        <Collapse
                            title={"What happens to data if I cancel my subscription?"}
                            text={"Yes, the dashboard allows you to set and customize permissions based on roles, ensuring secure and efficient task delegation."}
                        />
                        <Collapse
                            title={"Can I integrate third-party tools with the dashboard?"}
                            text={"Yes, the dashboard allows you to set and customize permissions based on roles, ensuring secure and efficient task delegation."}
                        />
                        <Collapse
                            title={"How does the analytics feature work?"}
                            text={"Yes, the dashboard allows you to set and customize permissions based on roles, ensuring secure and efficient task delegation."}
                        />
                        <Collapse
                            title={"How do I update my contact email?"}
                            text={"Yes, the dashboard allows you to set and customize permissions based on roles, ensuring secure and efficient task delegation."}
                        />
                        <div className={"flex flex-col items-center gap-5 pt-10 pb-16"}>
                            <div className={"flex relative justify-center"}>
                                <div className={"p-1 rounded-full w-13 h-13 "}>
                                    <img src="/images/users/user1.png" alt={"user1"} className={"rounded-full w-10 h-10"}/>
                                </div>
                                <div className={"p-1 rounded-full w-13 h-13 absolute -top-1"}>
                                    <img src="/images/users/user2.png" alt={"user2"} className={"rounded-full w-10 h-10"}/>
                                </div>
                                <div className={"p-1 rounded-full w-13 h-13"}>
                                    <img src="/images/users/user3.png" alt={"user3"} className={"rounded-full w-10 h-10"}/>
                                </div>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <p className={"text-xl text-black"}>Connect with us</p>
                                <p className={"text-gray-600 text-sm"}>Quickly get started by exploring our product today!</p>
                            </div>
                            <button className={"bg-primary-base text-white rounded-xl py-2 px-3"}>Get started</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"footer w-full flex justify-between items-center bg-gray-700 px-7 py-12"}>
                <div className={"icons flex items-center gap-3"}>
                    <RiFacebookCircleFill size={"22"} className={"text-gray-200"} />
                    <RiLinkedinBoxFill size={"22"} className={"text-gray-200"} />
                    <RiTwitterXLine size={"22"} className={"text-gray-200"} />
                </div>
                <div className={"flex gap-2 items-center"}>
                    <img src="/images/LandingPage/logoBlue.png" alt={""} className={"w-8"}/>
                    <p className={"text-gray-200"}>Management</p>
                </div>
                <p className={"text-gray-200"}>© 2025 Management. All rights reserved.</p>
            </div>
        </div>
    );
}

export default Desktop2Page;