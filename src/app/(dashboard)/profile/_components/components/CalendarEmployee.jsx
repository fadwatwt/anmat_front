import {useTranslation} from "react-i18next";
import {useState} from "react";
import Table from "@/components/Tables/Table.jsx";
import {employees} from "@/functions/FactoryData.jsx";

function CalendarEmployee() {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState("rotation");
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [currentDate] = useState(new Date());
    const viewModalList = [
        {id:"rotation",title:"Rotation"},
        {id:"attendance",title:"Attendance"}
    ]

    // Generate day headers
    const daysOfWeek = [
        { day: t("Sunday")},
        { day: t("Monday") },
        { day: t("Tuesday")},
        { day: t("Wednesday")},
        { day: t("Thursday") },
        { day: t("Friday") },
        { day: t("Saturday") },
    ];

    const headers = [
        ...daysOfWeek.map(({ day }) => ({
            label: (
                <div className="flex flex-col items-center">
                    <span className="dark:text-gray-400">{day}</span>
                    <span className="text-start text-sm dark:bg-gray-900 text-gray-400">
          </span>
                </div>
            ),
            width: "150px",
        })),
    ];

    const OffBadge = () => (
        <div className="w-full flex justify-start">

        </div>
    );
    // Mock shift data generator
    const generateShifts = () => {
        return daysOfWeek.map(() => {
            const random = Math.random();
            return random > 0.3 ? (
                <div className="flex flex-col text-sm dark:text-sub-300 text-star">
                    <span>10:00 AM to</span>
                    <span>6:00 PM</span>
                </div>
            ) : (
                <OffBadge />
            );
        });
    };

    const filteredEmployees = employees.filter((employee) =>
        selectedDepartment === "all"
            ? true
            : employee.department === selectedDepartment
    );
    let i = 1
    const rows = filteredEmployees.map(() => [
        ...generateShifts().map((shift, index) => (
            <div key={index} className={"relative h-full"}>
                <div  className="text-sm dark:text-sub-300 px-2 py-6 ">
                    {shift}
                </div>
                <span className={"absolute top-0 right-1 dark:text-gray-200"}>{i++}</span>
            </div>
        )),
    ]);

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
                    classNameCell={"border h-10 dark:border-gray-700"}
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

export default CalendarEmployee;