import { RiCheckboxBlankCircleFill, RiCheckboxCircleFill, RiCheckDoubleFill, RiCloseCircleFill, RiFlashlightLine, RiHourglass2Line, RiMastercardFill, RiTimeLine, RiVisaFill } from "@remixicon/react";
import Table from "../../../components/Tables/Table";
import { t } from "i18next";

const headers = [
    { label: "Product", width: "300px" },
    { label: "Reference", width: "200px" },
    { label: "Date", width: "150px" },
    { label: "Amount", width: "100px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];

// Sample data - replace with your actual data
const ordersData = [
    {
        product: "Basic Plan",
        reference: "MGU67900",
        date: "2023-05-15",
        amount: "$99.00",
        status: "Paid"
    },
    {
        product: "Premium Plan",
        reference: "MGU679001",
        date: "2023-05-16",
        amount: "$199.00",
        status: "Not-paid"
    },
    {
        product: "Basic Plan",
        reference: "MGU679002",
        date: "2023-05-15",
        amount: "$99.00",
        status: "Paid"
    },
    {
        product: "Premium Plan",
        reference: "MGU679003",
        date: "2023-05-16",
        amount: "$199.00",
        status: "Paid"
    }
];

const statusConfig = {
    Paid: {
        bgColor: "bg-green-50",
        icon: <RiCheckboxCircleFill size={15} className="text-green-700" />,
        textColor: "text-green-700",
    },
    // Pending: {
    //     bgColor: "bg-yellow-50",
    //     icon: <RiTimeLine size={15} className="text-yellow-700" />,
    //     textColor: "text-yellow-700",
    // },
    "Not-paid": {
        bgColor: "bg-red-50",
        icon: <RiCloseCircleFill size={15} className="text-red-700" />,
        textColor: "text-red-700",
    },
    // Completed: {
    //     bgColor: "bg-blue-50",
    //     icon: <RiCheckDoubleFill size={15} className="text-blue-700" />,
    //     textColor: "text-blue-700",
    // }
};

function BillingHistory() {

    const statusCell = (status) => {
        const config = statusConfig[status] || {
            bgColor: "bg-gray-50",
            icon: <RiQuestionLine size={15} className="text-gray-700" />,
            textColor: "text-gray-700",
        };

        return (
            <div
                key={`status-${status}`}
                className={`flex items-center justify-center gap-1 ${config.bgColor} px-1 py-1 rounded-md`}
            >
                {config.icon}
                <span className={`text-xs ${config.textColor}`}>
                    {status}
                </span>
            </div>
        );
    };

    // Transform data into the format expected by the Table component
    const rows = ordersData.map(order => [
        // Product cell
        <div key="product" className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiFlashlightLine size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <span className="text-lg text-gray-900">
                {order.product}
            </span>
        </div>,

        // Payment Method cell
        <div key="reference" className="flex items-center justify-start gap-2">
            <span className="text-md text-gray-900">
                {order.reference}
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
        <Table
            classContainer={"rounded-2xl px-8"}
            title="Invoices"
            headers={headers}
            isActions={true}
            rows={rows}
            isFilter={true}
        />
    );
}

export default BillingHistory;