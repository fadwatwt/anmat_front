'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Table from '@/components/Tables/Table';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectUserType } from '@/redux/auth/authSlice';
import { useGetEmployeeRequestsQuery } from '@/redux/employees/employeeRequestsApi';
import { useGetEmployeeAuthRequestsQuery, useCancelEmployeeRequestMutation } from '@/redux/employees/employeeAuthRequestsApi';
import { statusCell } from '@/components/StatusCell';
import ViewRequestModal from '@/app/(dashboard)/hr/employees/modals/ViewRequestModal';
import StatusActions from '@/components/Dropdowns/StatusActions';
import { RiEditLine, RiCloseCircleLine } from '@remixicon/react';
import ApprovalAlert from '@/components/Alerts/ApprovalAlert';
import ApiResponseAlert from '@/components/Alerts/ApiResponseAlert';
import ProcessingOverlay from '@/components/Feedback/ProcessingOverlay';

export default function EmployeeRequests() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const dateLocale = i18n.language === 'ar' ? ar : undefined;
  const authUserType = useSelector(selectUserType);
  const [activeTab, setActiveTab] = useState("DAY_OFF");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelAlert, setCancelAlert] = useState({ isOpen: false, requestId: null });
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  const isEmployee = authUserType === 'Employee';

  const { data: subscriberRequests = [], isLoading: isSubscriberLoading, isError: isSubscriberError, refetch: refetchSubscriberRequests } = useGetEmployeeRequestsQuery(undefined, { skip: isEmployee });
  const { data: employeeRequests = [], isLoading: isEmployeeLoading, isError: isEmployeeError, refetch: refetchEmployeeRequests } = useGetEmployeeAuthRequestsQuery(undefined, { skip: !isEmployee });
  const [cancelRequest, { isLoading: isCancelling }] = useCancelEmployeeRequestMutation();

  const requests = isEmployee ? employeeRequests : subscriberRequests;
  const isLoading = isEmployee ? isEmployeeLoading : isSubscriberLoading;
  const hasLoadError = isEmployee ? isEmployeeError : isSubscriberError;

  const retryRequests = () => {
    if (isEmployee) refetchEmployeeRequests();
    else refetchSubscriberRequests();
  };

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
        { label: '', width: '5%' },
      ].filter(Boolean);
    } else if (activeTab === "SALARY_ADVANCE") {
      return [
        ...commonHeaders,
        { label: t('Advance By'), width: '15%' },
        { label: t('Old Salary'), width: '15%' },
        { label: t('Status'), width: '10%' },
        { label: '', width: '5%' },
      ].filter(Boolean);
    } else if (activeTab === "SHORT_LEAVE") {
      return [
        ...commonHeaders,
        { label: t('Leave Date'), width: '15%' },
        { label: t('From Time'), width: '10%' },
        { label: t('To Time'), width: '10%' },
        { label: t('Status'), width: '10%' },
        { label: '', width: '5%' },
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

  const customActions = (index) => {
    const request = filteredData[index];
    if (!request) return null;

    const actions = [];
    if (authUserType === 'Subscriber' && !['accepted', 'rejected', 'cancelled'].includes(request.status)) {
      actions.push({
        text: t("Update Status"),
        icon: <RiEditLine size={18} className="text-primary-400" />,
        onClick: () => handleEdit(request),
      });
    }

    if (authUserType === 'Employee' && (['open', 'pending'].includes(request.status))) {
      actions.push({
        text: t("Cancel Request"),
        icon: <RiCloseCircleLine size={18} className="text-red-500" />,
        onClick: () => handleCancelClick(request.id || request._id),
      });
    }

    if (actions.length === 0) return null;

    return <StatusActions states={actions} className="!top-0 !right-0 !static shadow-none border-none" />;
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
            <span className="text-sm text-table-title">{request.employee?.name || 'N/A'}</span>
            <span className="text-xs text-cell-secondary">{request.department?.name || ''}</span>
          </div>
        </div>
      ),
      <span key={`date-${index}`} className="text-cell-secondary text-sm">
        {request.created_at ? format(new Date(request.created_at), "dd MMM, yyyy", { locale: dateLocale }) : 'N/A'}
      </span>,
    ];

    let specificCells = [];
    if (activeTab === "DAY_OFF") {
      specificCells = [
        <span key={`vacation-${index}`} className="text-cell-secondary text-sm">
          {request.vacation_date ? format(new Date(request.vacation_date), "dd MMM, yyyy", { locale: dateLocale }) : "N/A"}
        </span>,
        <div key={`reason-${index}`} className="text-cell-secondary text-sm truncate max-w-[150px]" title={request.reason}>
          {request.reason || "N/A"}
        </div>
      ];
    } else if (activeTab === "SALARY_ADVANCE") {
      specificCells = [
        <span key={`advance-${index}`} className="text-cell-secondary text-sm">{request.advance_salary_by || "N/A"}</span>,
        <span key={`old_salary-${index}`} className="text-cell-secondary text-sm">{request.old_salary_amount || "N/A"}</span>
      ];
    } else if (activeTab === "SHORT_LEAVE") {
      specificCells = [
        <span key={`leave-date-${index}`} className="text-cell-secondary text-sm whitespace-nowrap">
          {request.leave_date ? format(new Date(request.leave_date), "dd MMM, yyyy", { locale: dateLocale }) : "N/A"}
        </span>,
        <span key={`leave-start-${index}`} dir="ltr" className="text-cell-secondary text-sm whitespace-nowrap">
          {request.leave_start_time || "N/A"}
        </span>,
        <span key={`leave-end-${index}`} dir="ltr" className="text-cell-secondary text-sm whitespace-nowrap">
          {request.leave_end_time || "N/A"}
        </span>
      ];
    } else {
      specificCells = [
        <span key={`due-${index}`} className="text-cell-secondary text-sm">
          {request.work_due_at ? format(new Date(request.work_due_at), "dd MMM, yyyy HH:mm", { locale: dateLocale }) : "N/A"}
        </span>,
        <div key={`reason-${index}`} className="text-cell-secondary text-sm truncate max-w-[150px]" title={request.reason}>
          {request.reason || "N/A"}
        </div>
      ];
    }

    return [
      ...commonCells,
      ...specificCells,
      statusCell(request.status === "open" && activeTab === "SHORT_LEAVE" ? "Under Review" : request.status, request._id),
    ].filter(Boolean);
  });
  const headerActions = (
    <div className="flex max-w-full overflow-x-auto bg-status-bg border border-status-border rounded-lg p-1 custom-scroll">
      {[
        { id: "DAY_OFF", label: t("Leave Requests") },
        { id: "SHORT_LEAVE", label: t("Short Leave Requests") },
        { id: "SALARY_ADVANCE", label: t("Financial Requests") },
        { id: "WORK_DELAY", label: t("Delay Requests") }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-shrink-0 whitespace-nowrap px-3 sm:px-4 py-1 text-sm rounded-md transition-colors ${activeTab === tab.id ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 font-medium" : "text-cell-secondary hover:text-table-title"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <ProcessingOverlay isOpen={isLoading || isCancelling} message={t("Processing Requests...")} />
      {hasLoadError && (
        <div role="alert" className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <span className="text-sm font-medium">{t("Employee requests could not be loaded")}</span>
          <button type="button" onClick={retryRequests} className="self-start sm:self-auto rounded-xl border border-current px-4 py-2 text-sm font-semibold">
            {t("Try Again")}
          </button>
        </div>
      )}
      <Table
        title={t("Employee Requests")}
        headers={getHeaders()}
        hideSearchInput={true}
        rows={rows}
        rowStatusValues={filteredData.map((request) => request.status)}
        isActions={false}
        customActions={customActions}
        isCheckInput={false}
        showStatusFilter={true}
        statusOptions={["open", "accepted", "rejected", "cancelled"].map((value) => ({ id: value, value, name: t(value.charAt(0).toUpperCase() + value.slice(1)) }))}
        isLoading={isLoading}
        headerActions={headerActions}
        toolbarCustomContent={
          <button
            type="button"
            onClick={() => router.push(isEmployee ? "/requests" : "/hr/requests")}
            className="bg-status-bg text-cell-secondary hover:bg-gray-50 px-4 py-2 text-sm items-baseline p-2 gap-2 rounded-lg border border-status-border dark:border-gray-600"
          >
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
