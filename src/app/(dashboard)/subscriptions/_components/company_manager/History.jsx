"use client"

import { RiFlashlightLine} from "@remixicon/react";
import Table from "@/components/Tables/Table";
import {statusCell} from "@/components/StatusCell";
import {useTranslation} from "react-i18next";
import StatusActions from "@/components/Dropdowns/StatusActions";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import Alert from "@/components/Alerts/Alert";

const headers = [
    { label: "Product", width: "200px" },
    { label: "Payment Method", width: "200px" },
    { label: "Date", width: "150px" },
    { label: "Amount", width: "100px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];

// Sample data - replace with your actual data
const ordersData = [
    {
        product: "Basic Plan",
        paymentMethod: "Master Card",
        date: "2023-05-15",
        amount: "$99.00",
        status: "Paid"
    },
    {
        product: "Premium Plan",
        paymentMethod: "Master Card",
        date: "2023-05-16",
        amount: "$199.00",
        status: "Not-paid"
    },
    {
        product: "Basic Plan",
        paymentMethod: "Master Card",
        date: "2023-05-15",
        amount: "$99.00",
        status: "Paid"
    },
    {
        product: "Premium Plan",
        paymentMethod: "Master Card",
        date: "2023-05-16",
        amount: "$199.00",
        status: "Paid"
    }
];

function History() {

    const  HistoryActions = ({actualRowIndex}) => {
        const {t, i18n} = useTranslation();
        const statesActions = [
            {
                text: "Re-order", icon:null, onClick: () => {
                    console.log(actualRowIndex)
                }
            },
        ]
        return (
            <StatusActions states={statesActions}  className={` *:text-blue-500 p-1 bg-blue-100 block text-center rounded ${
                i18n.language === "ar" ? "left-0" : "right-0"
            }`}/>
        );
    }

    // Transform data into the format expected by the Table component
    const rows = ordersData.map(order => [
        // Product cell
        <div key="product" className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiFlashlightLine size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <span className="text-sm text-gray-900">
                {order.product}
            </span>
        </div>,

        // Payment Method cell
        <div key="product" className="flex items-center justify-start gap-2">
                <div className="p-2 h-12 w-18">
                    <img src={"/images/payments/mastercard.png"} alt={"img"} className={"w-full h-full object-cover"} />
                </div>
            <span className="text-sm text-gray-900">
                {order.paymentMethod}
            </span>
        </div>,

        // Date cell
        <div key="date">{order.date}</div>,

        // Amount cell
        <div key="amount">{order.amount}</div>,

        // Status cell
        statusCell(order.status)
    ]);

    return (
        <>
        <Table
            classContainer={"rounded-2xl px-8"}
            title="Invoices"
            headers={headers}
            isActions={false}
            rows={rows}
            isFilter={true}
            customActions={(actualRowIndex) => (
                <HistoryActions actualRowIndex={actualRowIndex} />)
            }
        />
            <CheckAlert
                isOpen={false}
                onClose={() => {}}
                type="warning"
                title="Confirm Re-Order"
                confirmBtnText="Confirm"
                description={
                    <p>
                        Are you sure you want to <span className="font-bold text-black">Re-Order</span> the
                        <span className="font-bold text-black"> professional plan</span>?
                    </p>
                }
                onSubmit={() => {}}
            />
        </>
    );
}

export default History;