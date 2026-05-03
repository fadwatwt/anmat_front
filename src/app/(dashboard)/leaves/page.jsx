"use client";
import { useTranslation } from "react-i18next";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import { useGetMyLeavesQuery } from "@/redux/leaves/employeeLeavesApi";
import { format, parse } from "date-fns";

function MyLeavesPage() {
    const { t } = useTranslation();
    const { data: leavesData, isLoading } = useGetMyLeavesQuery();

    const headers = [
        { label: t("Date"), width: "33%" },
        { label: t("Start Time"), width: "33%" },
        { label: t("End Time"), width: "33%" },
    ];

    const rows = leavesData?.map((record) => [
        <div key={`date-${record._id}`} className="text-cell-primary font-medium">
            {record.date ? format(parse(record.date, "yyyy-MM-dd", new Date()), "dd MMM, yyyy") : "N/A"}
        </div>,
        <div key={`start-${record._id}`} className="text-cell-secondary">
            {record.start_time || "-"}
        </div>,
        <div key={`end-${record._id}`} className="text-cell-secondary">
            {record.end_time || "-"}
        </div>,
    ]) || [];

    return (
        <Page title={t("My Short Leaves")}>
            <Table
                title={t("Short Leaves History")}
                headers={headers}
                rows={rows}
                isActions={false}
                isCheckInput={false}
                isLoading={isLoading}
                hideSearchInput={false}
            />
        </Page>
    );
}

export default MyLeavesPage;
