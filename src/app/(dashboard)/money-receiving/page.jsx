"use client"

import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import {statusCell} from "@/components/StatusCell";
import {MoanyReceivingMethods} from "@/functions/FactoryData";
import {useTranslation} from "react-i18next";
import {RiCheckboxLine, RiCloseCircleLine, RiEditLine, RiEyeLine} from "@remixicon/react";
import {RiDeleteBin7Line} from "react-icons/ri";
import StatusActions from "@/components/Dropdowns/StatusActions";
import moneyReceivingLogo from "../../../../public/images/MoneyMethods/money-methods-logo.png"

function MoneyReceivingPage() {
    const headers = [
        { label: "money receiving method Name", width: "300px" },
        { label: "Type", width: "150px" },
        { label: "Provider", width: "300px" },
        { label: "Currency", width: "150px" },
        { label: "Added At", width: "125px" },
        { label: "Status", width: "125px" },
        { label: "Default Status", width: "125px" },
        { label: "", width: "50px" }
    ];

    const  MoneyReceivingActions = ({actualRowIndex,handelDeleteAction}) => {
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
                text: "Delete", icon: <RiDeleteBin7Line className="text-red-500"/>, onClick: () => {
                    handelDeleteAction()
                    console.log(actualRowIndex)
                },
            },
            {
                text: "Activate", icon: <RiCheckboxLine className="text-green-500"/>, onClick: () => {
                    handelDeleteAction()
                    console.log(actualRowIndex)
                },
            },
            {
                text: "Deactivate", icon: <RiCloseCircleLine className="text-red-500"/>, onClick: () => {
                    handelDeleteAction()
                    console.log(actualRowIndex)
                },
            },
            {
                text: "Set as default", icon: <></>, onClick: () => {
                    handelDeleteAction()
                    console.log(actualRowIndex)
                },
            }
        ]
        return (
            <StatusActions states={statesActions}  className={`w-1/6 ${
                i18n.language === "ar" ? "left-0" : "right-0"
            }`}/>
        );
    }

    const rows = MoanyReceivingMethods.map((method => [

        // Plan Cell
        <div key={`${method._id}_plan`} className="flex items-center justify-start gap-2">
            <span className="text-md text-gray-900 dark:text-gray-50">
                {method.name}
            </span>
        </div>,

        <div key={`${method._id}_type`}>{method.type}</div>,

        <div key={`${method._id}_provider`} className="p-2 flex items-center justify-center gap-2">
            <div className="p-2 w-18 h-10 ">
                <img className={"w-full h-full"} src={"/images/MoneyMethods/money-methods-logo.png"} alt={"img"} />
            </div>
            <p className={"text-gray-800"}>{method.provider}</p>
        </div>,

        <div key={`${method._id}_currency`}>{method.currency}</div>,
        <div key={`${method._id}_added_at`}>{method.added_at}</div>,
        // Status cell
        statusCell(method.status, method._id),
        <div key={`${method._id}_default_status`}>
            {
                method.default_status === "default" && (
                    <div className={"p-2 rounded-xl bg-blue-100  text-center font-seibold  "} >{method.default_status}</div>
                )
            }
        </div>
    ]));
    return (
        <Page title="Money Receiving Methods" isBtn={true} btnTitle="Add receiving method" btnOnClick={() => {}}>
            <Table
                classContainer={"rounded-2xl px-8"}
                title="All money receiving methods"
                headers={headers}
                isActions={false}
                handelDelete={() => {}}
                rows={rows}
                customActions={(actualRowIndex) => (
                    <MoneyReceivingActions handelDeleteAction={() => {}}
                                 actualRowIndex={actualRowIndex} />)
                }
                isFilter={true}
            />
        </Page>
    );
}

export default MoneyReceivingPage;