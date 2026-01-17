"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiEditLine, RiEyeLine } from "@remixicon/react";
import { RiDeleteBin7Line } from "react-icons/ri";

import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { statusCell } from "@/components/StatusCell";
import CreateIndustryModal from "@/app/(dashboard)/industries/modals/CreateIndustry.modal.";

// 1. تعريف العناوين الثابتة خارج المكون
const TABLE_HEADERS = [
    { label: "Industry Title", width: "300px" },
    { label: "Logo", width: "150px" },
    { label: "Created At", width: "150px" },
    { label: "Updated At", width: "150px" },
    { label: "Status", width: "150px" },
    { label: "", width: "50px" }
];

// 2. مكون الأكشنز المنفصل
const IndustryActions = ({ actualRowIndex, i18n }) => {
    const actions = [
        {
            text: "Edit",
            icon: <RiEditLine className="text-primary-400" />,
            onClick: () => console.log("Edit:", actualRowIndex)
        },
        {
            text: "Delete",
            icon: <RiDeleteBin7Line className="text-red-500" />,
            onClick: () => console.log("Delete:", actualRowIndex)
        }
    ];

    return (
        <StatusActions
            states={actions}
            className={i18n.language === "ar" ? "left-0" : "right-0"}
        />
    );
};

function IndustriesPage() {
    const { i18n } = useTranslation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // دالة التبديل (Toggles)
    const toggleCreateModal = () => setIsCreateModalOpen(!isCreateModalOpen);
    const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

    // 3. معالجة البيانات وتحويلها لصفوف الجدول
    const rows = useMemo(() => {
        return industriesData.map((item) => [
            // اسم الصناعة
            <div key={`${item._id}_name`} className="font-medium">{item.name}</div>,

            // اللوجو
            <div key={`${item._id}_logo`} className="w-12 h-12 flex items-center justify-center">
                {item.logo ? (
                    <img className="w-full h-full object-contain" src={item.logo} alt={item.name} />
                ) : (
                    <div className="bg-gray-200 w-full h-full rounded flex items-center justify-center text-[10px]">No Logo</div>
                )}
            </div>,

            // تاريخ الإنشاء
            <div key={`${item._id}_created`}>{item.created_at}</div>,

            // تاريخ التحديث
            <div key={`${item._id}_updated`}>{item.updated_at || "---"}</div>,
            statusCell(item.status, item._id)
        ]);
    }, []);

    return (
        <Page
            title="Industries"
            isBtn={true}
            btnTitle="Add Industry"
            btnOnClick={toggleCreateModal}
        >
            <Table
                title="All Industries"
                headers={TABLE_HEADERS}
                rows={rows}
                classContainer="rounded-2xl px-8"
                isActions={false}
                isFilter={true}
                handelDelete={toggleDeleteModal}
                customActions={(index) => (
                    <IndustryActions
                        actualRowIndex={index}
                        i18n={i18n}
                    />
                )}
            />
            <CreateIndustryModal isOpen={isCreateModalOpen} onClose={toggleCreateModal} onClick={() => { }} />
        </Page>
    );
}

// بيانات تجريبية محدثة لتطابق العرض
const industriesData = [
    {
        _id: "p1",
        name: "Basic Plan",
        logo: "/path-to-logo.png",
        created_at: "May 24, 2025",
        updated_at: "June 01, 2025",
        status: "Active"
    },
    {
        _id: "p2",
        name: "Premium Plan",
        logo: null,
        created_at: "May 24, 2025",
        updated_at: "June 05, 2025",
        status: "Active"
    }
];

export default IndustriesPage;