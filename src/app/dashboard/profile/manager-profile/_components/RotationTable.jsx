"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/Tables/Table.jsx";
import { fetchAllRotations } from "@/redux/rotation/rotationAPI";

const OffBadge = () => (
  <div className="w-full flex justify-center">
    <div className="flex items-center justify-center gap-1 w-14 h-6 px-1 py-1 bg-weak-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 text-xs">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
      <span>OFF</span>
    </div>
  </div>
);

function RotationTable() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { rotations, loading, error } = useSelector((state) => state.rotation);
  const [viewMode, setViewMode] = useState("week");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    newDate.setUTCDate(newDate.getUTCDate() - 7);
    setCurrentDate(newDate);
  };

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

  const dataRecords = [
    {
      _id: "emp1_id",
      name: "Employer 1",
      department: "Publishing Dep",
      sat: "",
      sun: "10:00 AM - 06:00 PM",
      mon: "10:00 AM - 06:00 PM",
      tue: "10:00 AM - 06:00 PM",
      wed: "10:00 AM - 06:00 PM",
      thu: "10:00 AM - 06:00 PM",
      fri: ""
    }
  ]

  const rows = dataRecords
    ?.filter((rotation) =>
      selectedDepartment === "all"
        ? true
        : rotation.employee.department?.name === selectedDepartment
    )
    .map((rotation) => {
      const { employee, schedule } = rotation;
      // const shifts = weekDates.map((date) => {
      //   const dateStr = date.toISOString().split("T")[0];
      //   const entry = schedule.find((e) => {
      //     const entryDate = new Date(e.date).toISOString().split("T")[0];
      //     return entryDate === dateStr;
      //   });

      //   if (!entry) return <OffBadge />;
      //   return entry.status === "WORKING" ? (
      //     <div className="flex flex-col text-sm dark:text-sub-300 text-center">
      //       <span>{entry.startTime} to</span>
      //       <span>{entry.endTime}</span>
      //     </div>
      //   ) : (
      //     <OffBadge />
      //   );
      // });

      return [
        <div key={rotation._id} className="flex items-center gap-2">
          <img
            src={
              rotation.image ||
              `https://ui-avatars.com/api/?name=${rotation.name}`
            }
            alt={rotation.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-sm text-sub-500 dark:text-sub-300">
              {rotation.name}
            </span>
            <span className="text-gray-500 text-sm">
              {rotation.department || "N/A"}
            </span>
          </div>
        </div>,
        <span className="text-gray-500 text-sm">
          {rotation.sun ? rotation.sun : <OffBadge />}
        </span>,
        <span className="text-gray-500 text-sm">
          {rotation.mon ? rotation.mon : <OffBadge />}
        </span>,
        <span className="text-gray-500 text-sm">
          {rotation.tue ? rotation.tue : <OffBadge />}
        </span>,
        <span className="text-gray-500 text-sm">
          {rotation.wed ? rotation.wed : <OffBadge />}
        </span>,
        <span className="text-gray-500 text-sm">
          {rotation.thu ? rotation.thu : <OffBadge />}
        </span>,
        <span className="text-gray-500 text-sm">
          {rotation.fri ? rotation.fri : <OffBadge />}
        </span>,
        <span className="text-gray-500 text-sm">
          {rotation.sat ? rotation.sat : <OffBadge />}
        </span>
      ];
    });

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

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
          // New props for control bar
          showControlBar={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={(e) => setSelectedDepartment(e.target.value)}
          currentDate={currentDate}
          showListOfDepartments={true}
        />
      </div>
    </div>
  );
}

export default RotationTable;
