"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
// import { format, parseISO } from "date-fns";
import Table from "@/components/Tables/Table.jsx";
import { fetchAllRotations } from "@/redux/rotation/rotationAPI";
import { HiPlus } from "react-icons/hi";
import AddRotationModal from "@/app/(dashboard)/hr/_modals/AddRotationModal.jsx";

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
  const [viewMode, setViewMode] = useState("week");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddRotationModalOpen, setIsAddRotationModalOpen] = useState(false);

  const generateWeekDates = (date) => {
    const start = new Date(date);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());
    start.setUTCHours(0, 0, 0, 0);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(start);
      dates.push(newDate);
      start.setUTCDate(start.getUTCDate() + 1);
    }
    return dates;
  };

  const weekDates = generateWeekDates(currentDate);

  useEffect(() => {
    const dateRange = {
      startDate: weekDates[0].toISOString(),
      endDate: weekDates[6].toISOString(),
    };
    dispatch(fetchAllRotations(dateRange));
  }, [dispatch, currentDate, viewMode]);

  // const handlePrev = () => {
  //   const newDate = new Date(currentDate);
  //   newDate.setUTCDate(newDate.getUTCDate() - 7);
  //   setCurrentDate(newDate);
  // };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setUTCDate(newDate.getUTCDate() + 7);
    setCurrentDate(newDate);
  };

  const departments = [
    "all",
    ...new Set(
      rotations
        .map((rotation) => rotation.employee.department?.name)
        .filter(Boolean)
    ),
  ];

  const viewModalList = [
    { id: "week", title: "Week" },
    { id: "month", title: "Month" },
  ];

  const daysOfWeek = [
    { day: t("Sunday"), number: weekDates[0].getUTCDate() },
    { day: t("Monday"), number: weekDates[1].getUTCDate() },
    { day: t("Tuesday"), number: weekDates[2].getUTCDate() },
    { day: t("Wednesday"), number: weekDates[3].getUTCDate() },
    { day: t("Thursday"), number: weekDates[4].getUTCDate() },
    { day: t("Friday"), number: weekDates[5].getUTCDate() },
    { day: t("Saturday"), number: weekDates[6].getUTCDate() },
  ];

  const headers = [
    { label: t("Employee"), width: "200px" },
    ...daysOfWeek.map(({ day, number }) => ({
      label: (
        <div className="flex flex-col items-center">
          <span className="dark:text-gray-400">{day}</span>
          <span className="text-start text-sm dark:bg-gray-900 text-gray-400">
            {number}
          </span>
        </div>
      ),
      width: "150px",
    })),
  ];

  const rows = rotations
    ?.filter((rotation) =>
      selectedDepartment === "all"
        ? true
        : rotation.employee.department?.name === selectedDepartment
    )
    .map((rotation) => {
      const { employee, schedule } = rotation;
      const shifts = weekDates.map((date) => {
        const dateStr = date.toISOString().split("T")[0];
        const entry = schedule.find((e) => {
          const entryDate = new Date(e.date).toISOString().split("T")[0];
          return entryDate === dateStr;
        });

        if (!entry) return <OffBadge />;
        return entry.status === "WORKING" ? (
          <div className="flex flex-col text-sm dark:text-sub-300 text-center">
            <span>{entry.startTime} to</span>
            <span>{entry.endTime}</span>
          </div>
        ) : (
          <OffBadge />
        );
      });

      return [
        <div key={employee._id} className="flex items-center gap-2">
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
        ...shifts.map((shift, i) => (
          <div key={i} className="text-sm dark:text-sub-300">
            {shift}
          </div>
        )),
      ];
    });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  const headerActions = (
    <button
      onClick={() => setIsAddRotationModalOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
    >
      <HiPlus size={16} />
      {t("Add a Rotation")}
    </button>
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
          viewModalList={viewModalList}
          showControlBar={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={(e) => setSelectedDepartment(e.target.value)}
          currentDate={currentDate}
          showListOfDepartments={true}
          headerActions={headerActions}
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
