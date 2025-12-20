"use client";

import {
     RiCheckboxCircleLine, RiCloseCircleLine, RiEditLine,
    RiFlashlightLine,
} from "@remixicon/react";
import {useTranslation} from "react-i18next";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import {companyList} from "@/functions/FactoryData";
import {statusCell} from "@/components/StatusCell";
import {RiDeleteBin7Line} from "react-icons/ri";
import StatusActions from "@/components/Dropdowns/StatusActions";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import {useState} from "react";

const headers = [
    { label: "Subscriber", width: "300px" },
    { label: "Company", width: "300px" },
    { label: "Plan", width: "300px" },
    { label: "Industry ", width: "150px" },
    { label: "Subscribed at", width: "150px" },
    { label: "Users", width: "100px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];


function AdminCompaniesSubscriptions() {
    const [isDeleteSubAert,setIsDeleteSubAert] = useState(false);

    const handleDeleteSubAert = () => {
        setIsDeleteSubAert(!isDeleteSubAert);
    }

    // Transform data into the format expected by the Table component
    const rows = companyList.map(company => [
        <div key="company" className="flex items-center justify-start gap-2">
            <div className={"flex justify-between items-start"}>
                <div className={" h-[50px] w-[50px]"}>
                    <img className={"rounded-full h-[50px] w-[50px] max-w-full"}
                         src={"https://randomuser.me/api/portraits/men/1.jpg"} alt={"image-user"}/>
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-0">
                <span className="text-lg text-gray-900 dark:text-gray-50">
                    {company.subscriber_details?.name}
                </span>
            </div>
        </div>,
        // Company Name cell
        <div key="company" className="flex items-center justify-start gap-2">
            <div className={"flex justify-between items-start"}>
                <div className={" h-[50px] w-[50px]"}>
                    <img className={"rounded-full h-[50px] w-[50px] max-w-full"}
                         src={"/images/company.default.logo.png"} alt={"image-user"}/>
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-0">
                <span className="text-lg text-gray-900 dark:text-gray-50">
                    {company.company_name}
                </span>
                <span className="text-sm text-gray-500">
                    {company.company_website}
                </span>
            </div>
        </div>,

        // Plan Cell
        <div key="plan" className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiFlashlightLine size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <span className="text-lg text-gray-900 dark:text-gray-50">
                {company.subscriber_details?.plan}
            </span>
        </div>,

        // Date cell
        <div key="industry">{company.industry}</div>,
        <div key="date">{company.subscriber_details?.subscribed_at}</div>,

        // Users Subscribed cell
        <div key="amount" className="px-2 py-1 text-gray-900 text-md bg-gray-50 text-center rounded-[25px]">
            {company.users}
        </div>,

        // Status cell
        statusCell(company.status)
    ]);


    const industryOptions = [
        { name: "All", value: "All" },
        { name: "Design", value: "design" },
        { name: "Product Management", value: "product management" }
    ];

    const  SubscriptionActions = ({actualRowIndex}) => {
        const {t, i18n} = useTranslation();
        const statesActions = [
            {
                text: "Edit", icon: <RiEditLine className="text-primary-400"/>, onClick: () => {
                    console.log(actualRowIndex)
                },
            },
            {
                text: "Active", icon: <RiCheckboxCircleLine className="text-green-500"/>, onClick: () => {
                    console.log(actualRowIndex)
                },
            },
            {
                text: "Deactivate", icon: <RiCloseCircleLine className="text-red-500"/>, onClick: () => {
                    console.log(actualRowIndex)
                },
            },
            {
                text: "Delete", icon: <RiDeleteBin7Line className="text-red-500"/>, onClick: () => {
                    handleCloseCheckAert()
                    console.log(actualRowIndex)
                },
            }
        ]
        return (
            <StatusActions states={statesActions}  className={`${
                i18n.language === "ar" ? "left-0" : "right-0"
            }`}/>
        );
    }

    return (
        <Page title="Subscribers" isBtn={false}>
            <Table
                classContainer={"rounded-2xl px-8"}
                title="All Subscribers"
                headers={headers}
                isActions={false}
                rows={rows}
                isFilter={true}
                showStatusFilter={true}
                showIndustryFilter={true}
                customActions={(actualRowIndex) => (
                    <SubscriptionActions actualRowIndex={actualRowIndex} />)
                }
                industryOptions={industryOptions}
            />
            <CheckAlert isOpen={isDeleteSubAert}  title={"Cancel Subscription "} titleSubmitBtn={"Yes, Stop"} titleCancelBtn={"Cancel"}
                        feature={"this client"} subFeature={"Delete Subscription"} onClose={handleDeleteSubAert} onSubmit={handleDeleteSubAert} isBtns={true}  />
        </Page>
    );
}

export default AdminCompaniesSubscriptions;