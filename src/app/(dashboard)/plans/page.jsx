"use client"

import {
     RiCloseCircleLine, RiEditLine, RiEyeLine,
    RiFlashlightLine
} from "@remixicon/react";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import { useState } from "react";
import CreatePlanModal from "./_components/CreatePlanModal";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import {useTranslation} from "react-i18next";
import StatusActions from "@/components/Dropdowns/StatusActions";
import {RiDeleteBin7Line} from "react-icons/ri";
import {statusCell} from "@/components/StatusCell";

const headers = [
    { label: "Plan", width: "300px" },
    { label: "Price", width: "150px" },
    { label: "Created at", width: "150px" },
    { label: "Features", width: "300px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];

// Sample data - replace with your actual data
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


const  PlanActions = ({actualRowIndex,handelDeleteAction}) => {
    const {t, i18n} = useTranslation();
    const statesActions = [
        {
            text: "View", icon: <RiEyeLine className="text-primary-400"/>, onClick: () => {
                console.log(actualRowIndex)
            }
        },
        {
            text: "Edit", icon: <RiEditLine className="text-primary-400"/>, onClick: () => {
                console.log(actualRowIndex)
            },
        },
        {
            text: "Stop Free Trial", icon: <RiCloseCircleLine className="text-red-500"/>, onClick: () => {
                console.log(actualRowIndex)
            },
        },
        {
            text: "Delete", icon: <RiDeleteBin7Line className="text-red-500"/>, onClick: () => {
                handelDeleteAction()
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

function PlansPage() {

    const [createPlanModalOpen, setCreatePlanModal] = useState();
    const [checkAlertDeletePlanModal, setCheckAlertDeletePlanModal] = useState();
    const toggleCreatePlanModalOpen = () => {
        setCreatePlanModal(!createPlanModalOpen);
    }
    const toggleCheckAlertDeletePlanModal = () => {
        setCheckAlertDeletePlanModal(!checkAlertDeletePlanModal);
    }


    // Transform data into the format expected by the Table component
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

        // Price cell
        <div key={`${plan._id}_price`}>{plan.price}</div>,

        // Created at cell
        <div key={`${plan._id}_created_at`}>{plan.created_at}</div>,

        // Features cell
        <div key={`${plan._id}_features`} className="flex flex-row flex-nowrap items-center justify-start gap-2 overflow-x-auto">
            {
                plan.features.map(feature => {
                    return (
                        <div key="features" className="px-2 py-1 text-primary-600 text-sm bg-primary-50 text-center rounded-[25px]">
                            {feature}
                        </div>
                    )
                })
            }
        </div>,

        // Status cell
        statusCell(plan.status, plan._id)
    ]);

    return (
        <Page title="Plans" isBtn={true} btnTitle="Add Plan" btnOnClick={toggleCreatePlanModalOpen}>
            <Table
                classContainer={"rounded-2xl px-8"}
                title="All Plans"
                headers={headers}
                isActions={false}
                handelDelete={toggleCheckAlertDeletePlanModal}
                rows={rows}
                customActions={(actualRowIndex) => (
                    <PlanActions handelDeleteAction={toggleCheckAlertDeletePlanModal}
                                 actualRowIndex={actualRowIndex} />)
            }
                isFilter={true}
            />
                <CheckAlert isOpen={checkAlertDeletePlanModal}  title={"Stop Free Trial "} titleSubmitBtn={"Yes, Stop"} titleCancelBtn={"Cancel"}
                        feature={"Basic plan"} subFeature={"Stop Free Trial"} onSubmit={() => {}} onClose={toggleCheckAlertDeletePlanModal} isBtns={true}  />
            <CreatePlanModal isOpen={createPlanModalOpen} onClose={toggleCreatePlanModalOpen} />
        </Page>
    );
}

export default PlansPage;