"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
// import { format, parseISO } from "date-fns";
import Table from "@/components/Tables/Table.jsx";
import { fetchAllRotations } from "@/redux/rotation/rotationAPI";
import { HiPlus, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import AddRotationModal from "@/app/(dashboard)/hr/_modals/AddRotationModal.jsx";
import { fetchDepartments } from "@/redux/departments/departmentAPI";
import { useGetLeavesQuery } from "@/redux/leaves/leavesApi";

const OffBadge = () => (
  <div className="w-full flex justify-center">
    <div className="flex items-center justify-center gap-1 w-14 h-6 px-1 py-1 bg-weak-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 text-xs">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
      <span>OFF</span>
    </div>
  </div>
);

function RotationTap() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { rotations, loading, error } = useSelector((state) => state.rotation);
  const { departments: systemDepartments } = useSelector(
    (state) => state.departments
  );
  const [viewMode, setViewMode] = useState("week");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRotationModalOpen, setIsAddRotationModalOpen] = useState(false);

  // Fetch leaves for the current period
  const { data: leavesData } = useGetLeavesQuery();
  const leaves = leavesData || [];

  const generateDates = (date, mode) => {
    const start = new Date(date);
    const dates = [];
    if (mode === "week") {
      start.setUTCDate(start.getUTCDate() - start.getUTCDay());
      start.setUTCHours(0, 0, 0, 0);
      for (let i = 0; i < 7; i++) {
        dates.push(new Date(start));
        start.setUTCDate(start.getUTCDate() + 1);
      }
    } else if (mode === "month") {
      start.setUTCDate(1);
      start.setUTCHours(0, 0, 0, 0);
      const year = start.getUTCFullYear();
      const month = start.getUTCMonth();
      while (start.getUTCMonth() === month) {
        dates.push(new Date(start));
        start.setUTCDate(start.getUTCDate() + 1);
      }
    }
    return dates;
  };

  const displayDates = generateDates(currentDate, viewMode);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (displayDates.length > 0) {
      const dateRange = {
        start_date: displayDates[0].toISOString().split("T")[0],
        end_date: displayDates[displayDates.length - 1].toISOString().split("T")[0],
      };
      dispatch(fetchAllRotations(dateRange));
    }
  }, [dispatch, currentDate, viewMode]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setUTCDate(newDate.getUTCDate() - 7);
    } else {
      newDate.setUTCMonth(newDate.getUTCMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setUTCDate(newDate.getUTCDate() + 7);
    } else {
      newDate.setUTCMonth(newDate.getUTCMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const departments = [
    "all",
    ...new Set(systemDepartments.map((dept) => dept.name).filter(Boolean)),
  ];

  const viewModalList = [
    { id: "week", title: "Week" },
    { id: "month", title: "Month" },
  ];

  const headers = [
    { label: t("Employee"), width: "200px" },
    ...displayDates.map((date) => {
      const days = [
        t("Sunday"),
        t("Monday"),
        t("Tuesday"),
        t("Wednesday"),
        t("Thursday"),
        t("Friday"),
        t("Saturday"),
      ];
      const dayName = days[date.getUTCDay()];
      const dayNum = date.getUTCDate();
      return {
        label: (
          <div className="flex flex-col items-center">
            <span className="dark:text-gray-400">{dayName}</span>
            <span className="text-start text-sm dark:bg-gray-900 text-gray-400">
              {dayNum}
            </span>
          </div>
        ),
        width: "150px",
      };
    }),
  ];

  const rows = rotations
    ?.filter((rotation) => {
      const matchesDept =
        selectedDepartment === "all" ||
        rotation.employee.department?.name === selectedDepartment;
      const matchesSearch =
        rotation.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rotation.employee.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDept && matchesSearch;
    })
    .map((rotation) => {
      const { employee, attendances } = rotation;
      const shifts = displayDates.map((date) => {
        const dateStr = date.toISOString().split("T")[0];
        const entry = attendances[dateStr];

        if (!entry) return (
          <div key={dateStr} className="flex flex-col gap-1 items-center">
            <OffBadge />
            {leaves.filter(l => (l.employee_id === employee.id || l.employee?._id === employee.id) && l.date === dateStr).map(l => (
              <div key={l._id} className="text-[9px] bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1 rounded border border-orange-200 dark:border-orange-800/50">
                {t("Permit")}: {l.start_time}-{l.end_time}
              </div>
            ))}
          </div>
        );

        return (
          <div key={dateStr} className="flex flex-col gap-1 items-center">
            <div className="flex flex-col text-xs dark:text-sub-300 text-center text-blue-600 dark:text-blue-400 font-medium">
              <span>{entry.start_time} to</span>
              <span>{entry.end_time || "..."}</span>
            </div>
            {leaves.filter(l => l.employee_id === employee.id && l.date === dateStr).map(l => (
              <div key={l._id} className="text-[9px] bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1 rounded border border-orange-200 dark:border-orange-800/50">
                {t("Permit")}: {l.start_time}-{l.end_time}
              </div>
            ))}
          </div>
        );
      });

      return [
        <div key={employee.id} className="flex items-center gap-2">
          <img
            src={
              employee.profilePicture ||
              `https://ui-avatars.com/api/?name=${employee.name}`
            }
            alt={employee.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-sm text-sub-500 dark:text-sub-300">
              {employee.name}
            </span>
            <span className="text-gray-500 text-sm">
              {employee.department?.name || "N/A"}
            </span>
          </div>
        </div>,
        ...shifts,
      ];
    });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  const headerActions = (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={handlePrev}
          className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <HiChevronLeft size={20} className="dark:text-gray-300" />
        </button>
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-3 py-1 text-xs font-medium hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors dark:text-gray-300"
        >
          {t("Today")}
        </button>
        <button
          onClick={handleNext}
          className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <HiChevronRight size={20} className="dark:text-gray-300" />
        </button>
      </div>

      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {viewModalList?.map((viewModal, index) => (
          <button
            key={index}
            className={`px-4 rounded-md text-xs dark:text-gray-200 text-gray-900 ${
              viewMode === viewModal.id
                ? "bg-white text-gray-900 dark:bg-gray-700 shadow-sm"
                : "bg-transparent"
            } h-[28px]`}
            onClick={() => setViewMode(viewModal.id)}
          >
            {t(viewModal.title)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder={t("Search by name...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-500 transition-all w-48"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-500 transition-all"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept === "all" ? t("All Departments") : dept}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setIsAddRotationModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm"
      >
        <HiPlus size={16} />
        {t("Add")}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 h-full">
        <Table
          headers={headers}
          rows={rows}
          isCheckInput={false}
          isActions={false}
          isTitle={true}
          classContainer="w-full"
          showControlBar={true}
          currentDate={currentDate}
          headerActions={headerActions}
          hideSearchInput={true}
          showListOfDepartments={false}
          viewModalList={[]}
        />
      </div>

      <AddRotationModal
        isOpen={isAddRotationModalOpen}
        onClose={() => setIsAddRotationModalOpen(false)}
      />
    </div>
  );
}

export default RotationTap;
