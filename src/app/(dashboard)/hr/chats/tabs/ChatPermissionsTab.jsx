import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table";
import { useGetChatPermissionsQuery } from "@/redux/conversations/conversationsAPI";

function ChatPermissionsTab() {
    const { t } = useTranslation();

    const { data: permissionsData } = useGetChatPermissionsQuery();
    const permissions = permissionsData?.data || permissionsData || [];

    const headers = [
        { label: t("Permission Title"), width: "60%" },
        { label: t("Description"), width: "40%" },
    ];

    const rows = permissions.map((perm) => [
        <div key={`title-${perm._id}`} className="text-gray-900 dark:text-gray-200 font-medium">
            {t(perm.name)}
        </div>,
        <div key={`desc-${perm._id}`} className="text-gray-500 dark:text-gray-400">
            {perm.description ? t(perm.description) : "—"}
        </div>,
    ]);

    return (
        <Table
            title={t("Chat Permissions")}
            headers={headers}
            rows={rows}
            isActions={false}
            isCheckInput={false}
            showStatusFilter={false}
            showListOfDepartments={false}
        />
    );
}

export default ChatPermissionsTab;
