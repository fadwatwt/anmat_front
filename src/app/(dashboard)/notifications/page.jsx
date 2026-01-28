"use client";
import { useState } from "react";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import { useTranslation } from "react-i18next";
import { RiEyeLine, RiDeleteBin7Line } from "react-icons/ri";
import CreateNotificationModal from "@/app/(dashboard)/notifications/_components/modals/CreateNotification.modal.jsx";
import NotificationDetailsModal from "@/app/(dashboard)/notifications/_components/modals/NotificationDetails.modal.jsx";
import { FiPlus } from "react-icons/fi";

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();

  const statusStyles = {
    "Read": "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    "Delivered": "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    "Deleted": "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    "Pending": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700"
  };

  const style = statusStyles[status] || statusStyles["Pending"];

  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${style}`}>
      {t(status)}
    </span>
  );
};

const NotificationsPage = () => {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const path = [
    { title: "Dashboard", path: "/" },
    { title: "Notifications", path: "/notifications" }
  ];

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      title: "Name 1",
      subTitle: "Developing a dashboard for...",
      message: "Lorem ipsum dolor sit amet...",
      deliveredAt: "15 Nov, 2024",
      readAt: "16 Jan, 2025",
      createdAt: "16 Jan, 2025",
      sentTo: {
        name: "Fatma Ahmed",
        role: "Product Manager",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      modelName: "Lorem",
      modelType: "Lorem",
      status: "Delivered"
    },
    {
      id: 2,
      title: "Name 1",
      subTitle: "Developing a dashboard for...",
      message: "Lorem ipsum dolor sit amet...",
      deliveredAt: "15 Nov, 2024",
      readAt: "16 Jan, 2025",
      createdAt: "16 Jan, 2025",
      sentTo: {
        name: "Fatma Ahmed",
        role: "Product Manager",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      modelName: "Lorem",
      modelType: "Lorem",
      status: "Read"
    },
    {
      id: 3,
      title: "Name 1",
      subTitle: "Developing a dashboard for...",
      message: "Lorem ipsum dolor sit amet...",
      deliveredAt: "15 Nov, 2024",
      readAt: "16 Jan, 2025",
      createdAt: "16 Jan, 2025",
      sentTo: {
        name: "Fatma Ahmed",
        role: "Product Manager",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      modelName: "Lorem",
      modelType: "Lorem",
      status: "Deleted"
    },
    {
      id: 4,
      title: "Name 1",
      subTitle: "Developing a dashboard for...",
      message: "Lorem ipsum dolor sit amet...",
      deliveredAt: "15 Nov, 2024",
      readAt: "16 Jan, 2025",
      createdAt: "16 Jan, 2025",
      sentTo: {
        name: "Fatma Ahmed",
        role: "Product Manager",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      modelName: "Lorem",
      modelType: "Lorem",
      status: "Delivered"
    },
    {
      id: 5,
      title: "Name 1",
      subTitle: "Developing a dashboard for...",
      message: "Lorem ipsum dolor sit amet...",
      deliveredAt: "15 Nov, 2024",
      readAt: "16 Jan, 2025",
      createdAt: "16 Jan, 2025",
      sentTo: {
        name: "Fatma Ahmed",
        role: "Product Manager",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      modelName: "Lorem",
      modelType: "Lorem",
      status: "Read"
    }
  ];

  const headers = [
    { label: "Title", width: "15%" },
    { label: "Message", width: "20%" },
    { label: "Delivered - Read at Date", width: "15%" },
    { label: "Created At", width: "10%" },
    { label: "Sent To", width: "13%" },
    { label: "Model Name", width: "10%" },
    { label: "Model Type", width: "10%" },
    { label: "Status", width: "5%" },
    { label: "", width: "50px" },
  ];

  const rows = notifications.map((notification) => [
    <div key="title" className="flex flex-col">
      <span className="font-medium dark:text-gray-200">{notification.title}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-32">{notification.subTitle}</span>
    </div>,
    <span key="message" className="text-gray-600 dark:text-gray-400 truncate block w-40">{notification.message}</span>,
    <div key="dates" className="flex flex-col">
      <span className="text-gray-900 dark:text-gray-200">{notification.deliveredAt} -</span>
      <span className="text-gray-900 dark:text-gray-200">{notification.readAt}</span>
    </div>,
    <span key="createdAt" className="text-gray-900 dark:text-gray-200">{notification.createdAt}</span>,
    <div key="sentTo" className="flex items-center gap-2">
      <img
        src={notification.sentTo.avatar}
        alt={notification.sentTo.name}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium dark:text-gray-200">{notification.sentTo.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{notification.sentTo.role}</span>
      </div>
    </div>,
    <span key="modelName" className="text-gray-900 dark:text-gray-200">{notification.modelName}</span>,
    <span key="modelType" className="text-gray-900 dark:text-gray-200">{notification.modelType}</span>,
    <StatusBadge key="status" status={notification.status} />
  ]);

  const handleView = (index) => {
    setSelectedNotification(notifications[index]);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (index) => {
    console.log("Delete notification at index:", index);
    // Implement delete logic here
  };

  const CustomActions = (index) => (
    <div className="flex flex-col w-32 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 py-1">
      <button
        onClick={() => handleView(index)}
        className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
      >
        <RiEyeLine className="text-blue-500" />
        {t("View")}
      </button>
      <button
        onClick={() => handleDelete(index)}
        className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-900"
      >
        <RiDeleteBin7Line />
        {t("Delete")}
      </button>
    </div>
  );

  const HeaderActions = (
    <button
      onClick={() => setIsCreateModalOpen(true)}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
    >
      <FiPlus size={16} />
      {t("Create Notification")}
    </button>
  );

  return (
    <Page title={"Notifications"} isBreadcrumbs={true} breadcrumbs={path}>
      <div className="w-full">
        <Table
          isTitle={true}
          title="All Notifications"
          headers={headers}
          rows={rows}
          isActions={false}
          customActions={CustomActions}
          isCheckInput={true}
          classContainer="w-full"
          headerActions={HeaderActions}
          showStatusFilter={true}
          statusOptions={[
            { name: "Delivered", value: "Delivered" },
            { name: "Read", value: "Read" },
          ]}
        />
      </div>

      <CreateNotificationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onClick={() => { }}
      />

      <NotificationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        notification={selectedNotification}
        onUpdate={() => { }}
      />
    </Page>
  );
};

export default NotificationsPage;
