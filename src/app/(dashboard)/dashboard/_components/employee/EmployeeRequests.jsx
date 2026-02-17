'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Table from '@/components/Tables/Table';
import useAuthStore from '@/store/authStore';
import { useGetEmployeeRequestsQuery } from '@/redux/employees/employeeRequestsApi';
import { statusCell } from '@/components/StatusCell';
import ViewRequestModal from '@/app/(dashboard)/hr/employees/modals/ViewRequestModal';
import StatusActions from '@/components/Dropdowns/StatusActions';
import { RiEditLine } from '@remixicon/react';

export default function EmployeeRequests() {
  const { t } = useTranslation();
  const { authUserType } = useAuthStore();
  const [activeTab, setActiveTab] = useState("DAY_OFF"); // "DAY_OFF", "SALARY_ADVANCE", "WORK_DELAY"
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: requests = [], isLoading } = useGetEmployeeRequestsQuery();

  const filteredData = requests.filter(req => req.type === activeTab);

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const getHeaders = () => {
    const commonHeaders = [
      (authUserType === 'Subscriber') && { label: t('Employee Name'), width: '25%' },
      { label: t('Request Date'), width: '20%' },
    ];

    if (activeTab === "DAY_OFF") {
      return [
        ...commonHeaders,
        { label: t('Vacation Date'), width: '20%' },
        { label: t('Reason'), width: '20%' },
        { label: t('Status'), width: '10%' },
        (authUserType === 'Subscriber') && { label: '', width: '5%' },
      ].filter(Boolean);
    } else if (activeTab === "SALARY_ADVANCE") {
      return [
        ...commonHeaders,
        { label: t('Advance By'), width: '15%' },
        { label: t('Old Salary'), width: '15%' },
        { label: t('Status'), width: '10%' },
        (authUserType === 'Subscriber') && { label: '', width: '5%' },
      ].filter(Boolean);
    } else {
      return [
        ...commonHeaders,
        { label: t('Work Due At'), width: '20%' },
        { label: t('Reason'), width: '20%' },
        { label: t('Status'), width: '10%' },
        (authUserType === 'Subscriber') && { label: '', width: '5%' },
      ].filter(Boolean);
    }
  };

  const rows = filteredData.map((request, index) => {
    const commonCells = [
      (authUserType === 'Subscriber') && (
        <div key={`emp-${index}`} className="flex gap-2 items-center text-left py-1">
          <img
            className='rounded-full w-8 h-8 object-cover'
            src={request.employee?.image || `https://ui-avatars.com/api/?name=${request.employee?.name || "User"}`}
            alt={request.employee?.name}
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-gray-800">{request.employee?.name || 'N/A'}</span>
            <span className="text-xs text-gray-400">{request.department?.name || ''}</span>
          </div>
        </div>
      ),
      <span key={`date-${index}`} className="text-gray-500 text-sm">
        {request.created_at ? format(new Date(request.created_at), "dd MMM, yyyy") : 'N/A'}
      </span>,
    ];

    let specificCells = [];
    if (activeTab === "DAY_OFF") {
      specificCells = [
        <span key={`vacation-${index}`} className="text-gray-600 dark:text-gray-400 text-sm">
          {request.vacation_date ? format(new Date(request.vacation_date), "dd MMM, yyyy") : "N/A"}
        </span>,
        <div key={`reason-${index}`} className="text-gray-500 text-sm truncate max-w-[150px]" title={request.reason}>
          {request.reason || "N/A"}
        </div>
      ];
    } else if (activeTab === "SALARY_ADVANCE") {
      specificCells = [
        <span key={`advance-${index}`} className="text-gray-600 dark:text-gray-400 text-sm">{request.advance_salary_by || "N/A"}</span>,
        <span key={`old_salary-${index}`} className="text-gray-600 dark:text-gray-400 text-sm">{request.old_salary_amount || "N/A"}</span>
      ];
    } else {
      specificCells = [
        <span key={`due-${index}`} className="text-gray-600 dark:text-gray-400 text-sm">
          {request.work_due_at ? format(new Date(request.work_due_at), "dd MMM, yyyy HH:mm") : "N/A"}
        </span>,
        <div key={`reason-${index}`} className="text-gray-500 text-sm truncate max-w-[150px]" title={request.reason}>
          {request.reason || "N/A"}
        </div>
      ];
    }

    return [
      ...commonCells,
      ...specificCells,
      statusCell(request.status, request._id),
      (authUserType === 'Subscriber') && !['accepted', 'rejected', 'cancelled'].includes(request.status) && (
        <div key={`actions-${index}`} className="flex justify-end pr-4">
          <StatusActions
            states={[
              {
                text: t("Update Status"),
                icon: <RiEditLine size={18} className="text-primary-400" />,
                onClick: () => handleEdit(request),
              }
            ]}
          />
        </div>
      )
    ].filter(Boolean);
  });

  return (
    <>
      <Table
        customTitle={
          <div className="flex space-x-2 border border-gray-100 bg-gray-50 p-1 rounded-xl">
            <button
              className={`px-4 py-2 text-sm rounded-xl transition-all ${activeTab === "DAY_OFF" ? "bg-white shadow text-primary-600 font-medium" : "bg-transparent text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("DAY_OFF")}
            >
              {t("Leave Requests")}
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-xl transition-all ${activeTab === "SALARY_ADVANCE" ? "bg-white shadow text-primary-600 font-medium" : "bg-transparent text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("SALARY_ADVANCE")}
            >
              {t("Financial Requests")}
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-xl transition-all ${activeTab === "WORK_DELAY" ? "bg-white shadow text-primary-600 font-medium" : "bg-transparent text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("WORK_DELAY")}
            >
              {t("Delay Requests")}
            </button>
          </div>
        }
        headers={getHeaders()}
        hideSearchInput={true}
        rows={rows}
        isActions={false}
        isCheckInput={false}
        showStatusFilter={true}
        isLoading={isLoading}
        toolbarCustomContent={
          <button className="bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 text-sm items-baseline p-2 gap-2 rounded-lg border border-gray-200 dark:border-gray-600">
            {t("See All")}
          </button>
        }
      />

      {selectedRequest && (
        <ViewRequestModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
        />
      )}
    </>
  );
}