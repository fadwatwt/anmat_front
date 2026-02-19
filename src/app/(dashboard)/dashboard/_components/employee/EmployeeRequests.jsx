'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Table from '@/components/Tables/Table';
import { useSelector } from 'react-redux';
import { selectUserType } from '@/redux/auth/authSlice';
import { useGetEmployeeRequestsQuery } from '@/redux/employees/employeeRequestsApi';
import { useGetEmployeeAuthRequestsQuery, useCancelEmployeeRequestMutation } from '@/redux/employees/employeeAuthRequestsApi';
import { statusCell } from '@/components/StatusCell';
import ViewRequestModal from '@/app/(dashboard)/hr/employees/modals/ViewRequestModal';
import StatusActions from '@/components/Dropdowns/StatusActions';
import { RiEditLine, RiCloseCircleLine } from '@remixicon/react';
import ApprovalAlert from '@/components/Alerts/ApprovalAlert';
import ApiResponseAlert from '@/components/Alerts/ApiResponseAlert';

export default function EmployeeRequests() {
  const { t } = useTranslation();
  const authUserType = useSelector(selectUserType);
  const [activeTab, setActiveTab] = useState("DAY_OFF"); // "DAY_OFF", "SALARY_ADVANCE", "WORK_DELAY"
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelAlert, setCancelAlert] = useState({ isOpen: false, requestId: null });
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  const isEmployee = authUserType === 'Employee';

  const { data: subscriberRequests = [], isLoading: isSubscriberLoading } = useGetEmployeeRequestsQuery(undefined, { skip: isEmployee });
  const { data: employeeRequests = [], isLoading: isEmployeeLoading } = useGetEmployeeAuthRequestsQuery(undefined, { skip: !isEmployee });
  const [cancelRequest, { isLoading: isCancelling }] = useCancelEmployeeRequestMutation();

  const requests = isEmployee ? employeeRequests : subscriberRequests;
  const isLoading = isEmployee ? isEmployeeLoading : isSubscriberLoading;

  const handleCancelClick = (requestId) => {
    setCancelAlert({ isOpen: true, requestId });
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelRequest(cancelAlert.requestId).unwrap();
      setApiResponse({
        isOpen: true,
        status: "success",
        message: t("Request cancelled successfully")
      });
      setCancelAlert({ isOpen: false, requestId: null });
    } catch (error) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: error?.data?.message || t("Failed to cancel request")
      });
    }
  };

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
        { label: '', width: '5%' },
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
      <div key={`actions-${index}`} className="flex justify-end pr-4">
        {authUserType === 'Subscriber' && !['accepted', 'rejected', 'cancelled'].includes(request.status) && (
          <StatusActions
            states={[
              {
                text: t("Update Status"),
                icon: <RiEditLine size={18} className="text-primary-400" />,
                onClick: () => handleEdit(request),
              }
            ]}
          />
        )}
        {authUserType === 'Employee' && (['open', 'pending'].includes(request.status)) && (
          <StatusActions
            states={[
              {
                text: t("Cancel Request"),
                icon: <RiCloseCircleLine size={18} className="text-red-500" />,
                onClick: () => handleCancelClick(request.id),
              }
            ]}
          />
        )}
      </div>
    ].filter(Boolean);
  });
  const headerActions = (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {[
        { id: "DAY_OFF", label: t("Leave Requests") },
        { id: "SALARY_ADVANCE", label: t("Financial Requests") },
        { id: "WORK_DELAY", label: t("Delay Requests") }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-1 text-sm rounded-md transition-colors ${activeTab === tab.id ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 font-medium" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Table
        title={t("Employee Requests")}
        headers={getHeaders()}
        hideSearchInput={true}
        rows={rows}
        isActions={false}
        isCheckInput={false}
        showStatusFilter={true}
        isLoading={isLoading}
        headerActions={headerActions}
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

      <ApprovalAlert
        isOpen={cancelAlert.isOpen}
        onClose={() => setCancelAlert({ isOpen: false, requestId: null })}
        onConfirm={handleConfirmCancel}
        title={t("Cancel Request")}
        message={t("Are you sure you want to cancel this request? This action cannot be undone.")}
        confirmBtnText={t("Confirm")}
        cancelBtnText={t("Cancel")}
      />

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}