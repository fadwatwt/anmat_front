"use client"
import {
    RiBriefcaseLine,
    RiBuilding2Line,
    RiCake2Line,
    RiCalendarLine,
    RiCheckboxCircleFill,
    RiCheckboxLine,
    RiDiscountPercentLine,
    RiFlashlightLine,
    RiGlobalLine,
    RiGraduationCapLine,
    RiGroupLine,
    RiMailLine,
    RiMapPinLine,
    RiPhoneLine,
    RiUserLine,
    RiWalletLine
} from "@remixicon/react";
import Page from "@/components/Page";
import {useTranslation} from "react-i18next";
import {useParams} from "next/navigation";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status";
import EditAdminProfileModal from "@/app/(dashboard)/profile/_components/modals/admin/EditAdminProfile.modal";
import {useState} from "react";
import ChangePasswordModal from "@/app/(dashboard)/profile/_components/modals/ChangePassword.modal";
import Table from "@/components/Tables/Table";
import {statusCell} from "@/components/StatusCell";

function AdminProfile() {
    const {t,i18n} = useTranslation()
    const [isEditAdminProfileModal,setIsEditAdminProfileModal] = useState(false);
    const [isChangePasswordModal,setIsChangePasswordModal] = useState(false);
    const { slug } = useParams();
    console.log({ slug });

    const handelEditAdminProfileModal = () => {
        setIsEditAdminProfileModal(!isEditAdminProfileModal)
    }
    const handelChangePasswordModal = () => {
        setIsChangePasswordModal(!isChangePasswordModal)
    }

    const headers = [
        { label: "Catalog Company", width: "300px" },
        { label: "Renewal Date", width: "150px" },
        { label: "Status", width: "125px" },
        { label: "", width: "50px" }
    ];

    const plansData = [
        {
            _id: "p1",
            name: "Basic Plan",
            created_at: "May 24, 2025",
            price: "$3/mth",
            status: "Active",
            features: [
                'Access to core dashboard features',
                'Up to 5 team members',
                'Access to core dashboard features',
            ]
        },
        {
            _id: "p2",
            name: "Premium Plan",
            created_at: "May 24, 2025",
            price: "$10/mth",
            status: "Active",
            features: [
                'Access to core dashboard features',
                'Up to 5 team members'
            ]
        },
        {
            _id: "p3",
            name: "Basic Plan",
            created_at: "May 24, 2025",
            price: "$25/mth",
            status: "Not-active",
            features: [
                'Access to core dashboard features',
                'Up to 5 team members',
                'Access to core dashboard features',
            ]
        },
        {
            _id: "p4",
            name: "Premium Plan",
            created_at: "May 24, 2025",
            price: "$12/mth",
            status: "Not-active",
            features: [
                'Access to core dashboard features',
                'Up to 5 team members'
            ]
        }
    ];

    const rows = plansData.map(plan => [

        // Plan Cell
        <div key={`${plan._id}_plan`} className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiFlashlightLine size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <span className="text-md text-gray-900 dark:text-gray-50">
                {plan.name}
            </span>
        </div>,


        // Created at cell
        <div key={`${plan._id}_created_at`}>{plan.created_at}</div>,


        // Status cell
        statusCell(plan.status, plan._id)
    ]);
    // const employeeId = slug ? slug.split('-')[0] : null;
    return (
        <Page isTitle={false} className={"w-full"}>
            <div className={"w-full flex flex-col items-center md:gap-6 xl:gap-4 gap-8 h-full"}>
                <div className={"relative flex min-h-48 justify-center  w-full h-full md:mb-0 mb-44"}>
                    <div className={"w-full md:h-40 h-[50vh]"}>
                        <img className={"max-w-full w-full max-h-full object-cover"} src={"/images/profileBanner.png"} alt={""} />
                    </div>
                    <p className={"absolute top-3 right-3 text-sm text-white"}>{t("Change")}</p>
                    <div className={"absolute md:top-1/3 top-[50px] w-full md:px-10 px-2"}>
                        <div className={" rounded-2xl p-4 border dark:border-gray-700 flex bg-white dark:bg-gray-800"}>
                            <div
                                className={"flex md:items-center md:flex-row md:justify-center flex-col justify-between gap-3 flex-1"}>
                                <div className={"flex justify-between items-center"}>
                                    <div className={"relative h-[72px] w-[72px]"}>
                                        <img className={"rounded-full h-[72px] w-[72px] max-w-full"}
                                             src={"https://randomuser.me/api/portraits/men/1.jpg"} alt={"image-user"}/>
                                        <RiCheckboxCircleFill size="23"
                                                              className="absolute top-0 right-0 bg-white dark:bg-gray-800 rounded-full text-cyan-500"/>
                                    </div>
                                    <button
                                        className={"p-1.5 rounded-lg md:hidden text-nowrap bg-none border text-sm dark:border-gray-700 dark:text-gray-200 self-start"}>{t("Edit profile")}
                                    </button>
                                </div>
                                <div className={"w-full flex md:flex-row flex-col gap-4 "}>
                                    <div className={`flex flex-col gap-4 w-56  ${i18n.language === "ar" ? "md:border-l-2 " :"md:border-r-2 "}`}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiUserLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Name")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium "}>Rawan Ahmed</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiCake2Line size={18} className={"text-soft-400 dark:text-gray-300"}/>
                                            <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Age")}:</p>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>21</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiBriefcaseLine size="18" className="text-soft-400 dark:text-gray-300"/>
                                            <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Role")}:</p>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{t("Content Editor")}</p>
                                        </div>
                                    </div>
                                    <div className={"flex flex-col gap-4 flex-1"}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiMailLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Email")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>Rawan@email.com</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiPhoneLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Phone Number")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>56789087</p>
                                            {/* Unverified & Verified */}
                                            <Status type={"Unverified"} />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handelChangePasswordModal}
                                    className={"p-1.5 rounded-lg hidden md:block text-nowrap bg-blue-100 text-blue-500 border text-sm self-start dark:text-gray-200 dark:border-gray-700"}>
                                    {t("Change password")}
                                </button>
                                <button
                                    onClick={handelEditAdminProfileModal}
                                    className={"p-1.5 rounded-lg hidden md:block text-nowrap bg-none border text-sm self-start dark:text-gray-200 dark:border-gray-700"}>
                                    {t("Edit profile")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"md:px-10 px-2 w-full"}>
                    <div className={" rounded-2xl p-4 border dark:border-gray-700 flex bg-white dark:bg-gray-800"}>
                        <div
                            className={"flex md:items-start md:flex-row md:justify-start flex-col justify-between gap-3 flex-1"}>
                            <div className={"flex justify-between items-start"}>
                                <div className={" h-[72px] w-[72px]"}>
                                    <img className={"rounded-full h-[72px] w-[72px] max-w-full"}
                                         src={"/images/company.default.logo.png"} alt={"image-user"}/>
                                </div>
                            </div>
                            <div className={"w-full flex md:flex-row flex-col gap-4 "}>
                                <div className={`flex flex-col gap-4 w-56  ${i18n.language === "ar" ? "md:border-l-2 " :"md:border-r-2 "}`}>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiUserLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Company")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium "}>Rawan Ahmed</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiGlobalLine size={18} className={"text-soft-400 dark:text-gray-300"}/>
                                        <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Website")}:</p>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>21</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiGraduationCapLine size="18" className="text-soft-400 dark:text-gray-300"/>
                                        <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Industry")}:</p>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{t("Content Editor")}</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1 "}>
                                        <RiGroupLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Country")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>Rawan@email.com</p>
                                    </div>
                                </div>
                                <div className={"flex flex-col gap-4 flex-1"}>
                                    <div className={"name-profile flex items-center gap-1 "}>
                                        <RiMapPinLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Country")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>Rawan@email.com</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiMapPinLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("City")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>56789087</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiMapPinLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Address")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>56789087</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"flex gap-6 md:flex-row flex-col items-start w-full md:px-10 px-2 justify-between"}>
                    <div className={"md:w-full w-full flex flex-col gap-4 items-center h-full"}>
                        <div className={"bg-white rounded-2xl p-4 gap-6 md:flex-1 flex flex-col dark:bg-gray-800 items-center w-full p-5"}>
                            <div className={"w-full border border-gray-200 rounded-md flex flex-col gap-4 p-4"}>
                                <h3 className={"text-lg font-s"}>Subscription Information </h3>
                                <div className={"w-full grid grid-flow-col grid-rows-2 gap-3 "}>

                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiBuilding2Line size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Last Plan Subscribed:")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{t("Publishing")}</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiCheckboxLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Features")}:</span>
                                        <div className={"flex items-center gap-1"}>
                                            {
                                                ["Add employee","Edit project","Edit task","Delete task"].map((item,index)=>(
                                                    <p key={index} className={"bg-blue-50 py-1 px-2 rounded-xl text-black text-sm dark:text-gray-100 font-medium"}>{item}</p>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiCalendarLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Subscription Date")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>56789087</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiCalendarLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Duration")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>8 hours</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiWalletLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Price")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>8 hours</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiDiscountPercentLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"}/>
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Discount")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>8 hours</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <Table
                            classContainer={"rounded-2xl px-8"}
                            title="Subscriptions"
                            headers={headers}
                            isActions={true}
                            handelDelete={() => {}}
                            rows={rows}
                            isFilter={true}
                        />
                    </div>
                </div>
            </div>

            <EditAdminProfileModal isOpen={isEditAdminProfileModal} onClose={handelEditAdminProfileModal} onClick={() => {}} />
            <ChangePasswordModal isOpen={isChangePasswordModal} onClose={handelChangePasswordModal} onClick={() => {}} />
        </Page>
    );
}

export default AdminProfile;