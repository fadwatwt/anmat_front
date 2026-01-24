'use client';

import DropdownMenu from '@/components/Dropdowns/DropdownMenu';
import Table from '@/components/Tables/Table';
import EmployeeRequestStatus from '@/components/tags/EmpoyeeRequestStatus';
import useAuthStore from '@/store/authStore';
import { RiCalendar2Line } from '@remixicon/react';

export default function EmployeeRequests() {

  const { authUserType } = useAuthStore();

  const headers = [
    (authUserType === 'Subscriber') && { label: 'Employee Name', width: '25%' },
    { label: 'Request Date', width: '20%' },
    { label: 'Days Requested', width: '10%' },
    { label: 'Days Left', width: '10%' },
    { label: 'Status', width: '10%' },
    (authUserType === 'Subscriber') && { label: '', width: '15%' },
  ];

  const data = [
    {
      user: {
        name: 'Fatma Ahmed Mohamed',
        department: 'Publishing Dep',
        avatar_url: 'https://example.com/avatar-fatma-ahmed-mohamed.jpg'
      },
      date: '15 Nov, 2024',
      days: [
        '15 Nov, 2024',
        '16 Nov, 2024',
        '17 Nov, 2024',
        '18 Nov, 2024'
      ],
      left: 3,
      status: 'Pending'
    },
    {
      user: {
        name: 'Sophia Williams',
        department: 'Sales Dep',
        avatar_url: 'https://example.com/avatar-sophia-williams.jpg'
      },
      date: '15 Nov, 2024',
      days: [
        '15 Nov, 2024',
        '16 Nov, 2024'
      ],
      left: 1,
      status: 'Approved'
    },
    {
      user: {
        name: 'James Brown',
        department: 'HR Dep',
        avatar_url: 'https://example.com/avatar-james-brown.jpg'
      },
      date: '15 Nov, 2024',
      days: [
        '15 Nov, 2024',
        '16 Nov, 2024',
        '17 Nov, 2024',
        '18 Nov, 2024',
        '19 Nov, 2024'
      ],
      left: 2,
      status: 'Pending'
    },
    {
      user: {
        name: 'Matthew Johnson',
        department: 'Marketing Dep',
        avatar_url: 'https://example.com/avatar-matthew-johnson.jpg'
      },
      date: '15 Nov, 2024',
      days: [
        '15 Nov, 2024',
        '16 Nov, 2024',
        '17 Nov, 2024',
        '18 Nov, 2024',
        '19 Nov, 2024',
        '20 Nov, 2024',
        '21 Nov, 2024',
        '22 Nov, 2024',
        '23 Nov, 2024',
        '24 Nov, 2024'
      ],
      left: 5,
      status: 'Rejected'
    }
  ];

  const customActions = (rowIndex) => (
    <div className="flex gap-2">
      <button key={`approve_req_${rowIndex}`} className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg">
        Approve
      </button>
      <button key={`reject_req_${rowIndex}`} className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
        Reject
      </button>
    </div>
  );

  const rows = data.map((request, index) => ([
    (authUserType === 'Subscriber') && <div className="flex gap-1">
      <img className='rounded-full w-8 h-8'
        src={request.user.avatar_url} />
      <div className="flex flex-col">
        <span className="font-semibold text-md text-gray-800">{request.user.name}</span>
        <span className="text-sm text-gray-500">{request.user.department}</span>
      </div>
    </div>,
    <span className="text-gray-500">{request.date}</span>,
    <DropdownMenu
      button={`${request.days.length} Days`}
      content={
        <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 border-b border-gray-500 px-4 py-2">
            <RiCalendar2Line size={25} className='text-gray-800' />
            <div className="flex flex-col">
              <span className="text-gray-800 text-md">
                Dates of the requested days:
              </span>
              <span className="text-gray-500 text-sm">
                {request.user.name}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-4 py-2">
            {request.days.map((day, i) => (
              <span className="text-gray-700 border-b border-gray-100">
                {`${i + 1}. ${day}`}
              </span>
            ))}
          </div>
        </div>
      } />,
    <span className="text-gray-500">{request.left}</span>,
    <EmployeeRequestStatus type={request.status} />,
    (authUserType === 'Subscriber') && (request.status === "Pending") && customActions(index)
  ]))

  return (
    <Table
      customTitle={
        <div className="flex space-x-2 border border-gray-100 bg-gray-50 p-1 rounded-xl">
          <button
            className="px-4 py-2 bg-gray-50 hover:bg-white hover:shadow text-sm rounded-xl"
            onClick={() => {/* Handle Employee Requests click */ }}
          >
            Leave Requests
          </button>
          <button
            className="px-4 py-2 bg-gray-50 hover:bg-white hover:shadow text-sm rounded-xl"
            onClick={() => {/* Handle Financial Requests click */ }}
          >
            Financial Requests
          </button>
        </div>
      }
      headers={headers}
      hideSearchInput={true}
      rows={rows}
      isActions={false}
      isCheckInput={false}
      showStatusFilter={true}
      statusOptions={[{ value: 'Pending', name: 'Pending' }, { value: 'Approved', name: 'Approved' }, { value: 'Rejected', name: 'Rejected' }]}
      selectedStatus="Pending"
      className="min-w-full"
      toolbarCustomContent={
        <button className="bg-white text-gray-700 hover:bg-gray-50 px-4 py-2flex dark:text-gray-400 text-sm items-baseline p-2 gap-2 rounded-lg border border-gray-200 dark:border-gray-600">
          See All
        </button>
      }
    />
  );
}