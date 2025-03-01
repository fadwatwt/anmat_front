import DefaultSelect from "../components/Form/DefaultSelect.jsx";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer, Scatter, ScatterChart, Tooltip,
    XAxis,
    YAxis,
    ZAxis
} from "recharts";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import Page from "./Page.jsx";
import {RiUser3Line} from "@remixicon/react";
import Table from "../components/Tables/Table.jsx";
import departmentBrand1 from "../assets/images/Department Brands/departmentBrand1.png"
const DonutChart = ({ data, total }) => {
    let cumulativePercent = 0;

    const createCoordinatesForPercent = (percent) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };


    const paths = data.map((segment) => {
        const percent = segment.value / total;
        const [startX, startY] = createCoordinatesForPercent(cumulativePercent);
        cumulativePercent += percent;
        const [endX, endY] = createCoordinatesForPercent(cumulativePercent);
        const largeArcFlag = percent > 0.5 ? 1 : 0;

        return (
            <path
                key={segment.color}
                d={`
          M ${startX} ${startY}
          A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}
        `}
                stroke={segment.color}
                strokeWidth="0.2"
                fill="none"
            />
        );
    });

    return (
        <svg viewBox="-1.1 -1.1 2.2 2.2" style={{ transform: "rotate(-90deg)" }}>
            <circle
                cx="0"
                cy="0"
                r="1"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="0.1"
            />
            {paths}
        </svg>
    );
};

DonutChart.propTypes = {
    data: PropTypes.array,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
const HalfDonutChart = ({ data, total }) => {
    let cumulativePercent = 0;

    const createCoordinatesForPercent = (percent) => {
        const angle = Math.PI * (1 - percent); // تعديل الزاوية لتبدأ من اليسار وتتحرك باتجاه عقارب الساعة
        const x = Math.cos(angle);
        const y = -Math.sin(angle); // استخدام سالب sin لجعل القوس علويًا
        return [x, y];
    };

    const paths = data.map((segment) => {
        const percent = segment.value / total;
        const [startX, startY] = createCoordinatesForPercent(cumulativePercent);
        cumulativePercent += percent;
        const [endX, endY] = createCoordinatesForPercent(cumulativePercent);
        const largeArcFlag = percent > 0.5 ? 1 : 0;

        return (
            <path
                key={segment.color}
                d={`M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`}
                stroke={segment.color}
                strokeWidth="0.2"
                fill="none"
            />
        );
    });

    // Background semicircle
    const [startXbg, startYbg] = createCoordinatesForPercent(0);
    const [endXbg, endYbg] = createCoordinatesForPercent(1);
    const backgroundPath = `M ${startXbg} ${startYbg} A 1 1 0 0 1 ${endXbg} ${endYbg}`;
    const theme = localStorage.getItem("theme")

    return (
        <svg viewBox="-1.1 -1.1 2.2 2.2">
            <path
                d={backgroundPath}
                stroke={ theme === "dark" ? "#31353F" :"#E5E7EB"}
                strokeWidth="0.2"
                fill="none"
            />
            {paths}
        </svg>
    );
};

HalfDonutChart.propTypes = {
    data: PropTypes.array,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
const ProgressBar = ({title, ratio, progressText, remainingTime}) => {
    return (
        <div className={"flex gap-5 items-center w-full"}>
            <p className={"text-sm dark:text-gray-200 w-[20%]"}>{title}</p>
            <div className={"flex flex-col w-full gap-2"}>
                <div className={"relative flex rounded-xl overflow-hidden h-4  w-full"}>
                    <div className={"absolute w-[100%] h-4 bg-gray-100 dark:bg-[#253EA7]"}></div>
                    <div className={`absolute  h-4 bg-[#38C793]`} style={{width:ratio}}></div>
                </div>
                <div className={"flex justify-between items-center"}>
                    <p className={"text-xs dark:text-gray-200"}>{progressText}</p>
                    <p className={"text-xs text-end dark:text-gray-200"}>{remainingTime}</p>
                </div>
            </div>
        </div>
    )
}

const CustomLegend = (props) => {
    const { payload } = props;
    return (
        <ul style={{ listStyle: 'none',display:"flex",justifyContent:"center",alignItems:"center",gap:"16px", padding: 0, margin: 0, fontSize: "10px" }}>
            {payload.map((entry, index) => (
                <li key={`item-${index}`} style={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
                    {/* تصغير الدائرة */}
                    <svg width="8" height="8" style={{ marginRight: "5px" }}>
                        <circle cx="4" cy="4" r="4" fill={entry.color} />
                    </svg>
                    <span className={"text-xs"} style={{color:entry.color}}>{entry.value}</span>
                </li>
            ))}
        </ul>
    );
};

const LastProjectItem = ({index, title, department}) => {
    return (
        <div className={"flex items-center gap-3"}>
            <div className={"rounded-full w-10 h-10 border text-xl dark:text-gray-200 flex justify-center items-center"}>{index}</div>
            <div className={"flex flex-col gap-1"}>
                <p className={"text-sm dark:text-gray-200"}>{title}</p>
                <p className={"text-xs text-gray-600 dark:text-gray-400"}>{department}</p>
            </div>
        </div>
    )
}

function AnalyticsPage() {
    const {t,i18n} = useTranslation()
    const theme = localStorage.getItem("theme")
    const monthlyData = [
        { name: "Jan", onTime: 45, late: 35 },
        { name: "Feb", onTime: 65, late: 55 },
        { name: "Mar", onTime: 35, late: 30 },
        { name: "Apr", onTime: 60, late: 85 },
        { name: "May", onTime: 55, late: 30 },
        { name: "Jun", onTime: 50, late: 45 },
    ];

    const taskSummaryData = {
        total: 200,
        active: 50,
        completed: 50,
        late: 50,
        overdue: 50,
    };

    const tasksRatingData = {
        total: 200,
        highRating: 150,
        lowRating: 50,
    };

    const data = [
        { name: '', "Expected Time": 1, "Actual Time": 3 },
        { name: '', "Expected Time": 4, "Actual Time": 2 },
        { name: '', "Expected Time": 6, "Actual Time": 5 },
        { name: '', "Expected Time": 8, "Actual Time": 7 },
        { name: '', "Expected Time": 10, "Actual Time": 12 },
        { name: '', "Expected Time": 5, "Actual Time": 9 },
        { name: '', "Expected Time": 3, "Actual Time": 10 },
        { name: '', "Expected Time": 7, "Actual Time": 11 },
        { name: '', "Expected Time": 12, "Actual Time": 8 },
        { name: '', "Expected Time": 15, "Actual Time": 10 },
    ];
    const data01 = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 3 },
        { x: 4, y: 5 },
        { x: 5, y: 3.5 },
        { x: 6, y: 4 },
    ];


    const headersDeparmentsRanking = [
        {label: t("Department"), width: "400px"},
        {label: t("Rank"), width: ""},
        {label: t("Rating"), width: ""},
        {label: t("Head Points"), width: ""},
        {label: t("Performance"), width: ""},
        {label: t("Attendance"), width: ""},
    ];
    const departments = [1,2,3,4]

    const departmentRowTable = () => {
        return departments.map((department) => [
            <>
                <div className={"flex justify-start items-center gap-2"}>
                    <div className={"flex justify-center items-center rounded-full w-9 h-9 border border-gray-400 dark:border-gray-700"}>
                        <img src={departmentBrand1} className={"w-6 h-6 rounded-full"}/>
                    </div>
                    <div className={"flex flex-col items-start gap-1"}>
                        <p className={"text-sm dark:text-gray-200"}>Design</p>
                        <p className={"text-sm text-gray-500"}>Manager: Ahmed Ali</p>
                    </div>
                </div>
            </>,
            "1",
            "3.5",
            "4",
            "95%",
            "100%"
        ]);
    };
    const rows = departmentRowTable()

    return (
        <Page isTitle={true} title={"All Analytics Overview"}>
            <div className={"flex flex-col justify-center items-center gap-5"}>
                <p className={"w-full text-start text-sm dark:text-gray-200"}>{t("Tasks Analytics")}</p>
                <div className={"flex justify-center items-center gap-3"}>
                    <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Tasks Summary")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-28"} options={[{id: "", value: "Last Month"}]}/>
                            </div>
                        </div>

                        <div className="flex justify-center mb-6">
                            <div className="relative w-48 h-48">
                                <DonutChart
                                    data={[
                                        {value: taskSummaryData.active, color: "#375DFB"},
                                        {value: taskSummaryData.completed, color: "#38C793"},
                                        {value: taskSummaryData.late, color: "#F17B2C"},
                                        {value: taskSummaryData.overdue, color: "#DF1C41"},
                                    ]}
                                    total={taskSummaryData.total}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500 dark:text-gray-200">{t("TASKS")}</div>
                                        <div className="text-3xl font-bold dark:text-white">
                                            {taskSummaryData.total}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-center items-center">
                            <div>
                                <div className="text-indigo-600 font-semibold">
                                    {taskSummaryData.active}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-200">{t("Active")}</div>
                            </div>
                            <div>
                                <div className="text-green-600 text-sm ">
                                    {taskSummaryData.completed}
                                </div>
                                <div
                                    className="text-sm text-nowrap text-gray-500 dark:text-gray-200">{t("On - Time Completed")}</div>
                            </div>
                            <div>
                                <div className="text-yellow-600 font-semibold">
                                    {taskSummaryData.late}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-200">{t("Late Completed")}</div>
                            </div>
                            <div>
                                <div className="text-red-600 font-semibold">
                                    {taskSummaryData.overdue}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-200">{t("Overdue")}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Departments analytics")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-28"} options={[{id: "", value: "Department"}]}/>
                                <DefaultSelect classNameContainer={"w-32"}
                                               options={[{id: "", value: "Last 6 months"}]}/>
                            </div>
                        </div>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} barGap={4}>
                                    {" "}
                                    {/* Reduce barGap */}
                                    <CartesianGrid className={"bg-gary-800 text-gray-800"}
                                                   stroke={theme === "dark" ? "rgb(78,90,110)" : "rgb(166,167,169)"}
                                                   strokeDasharray="3 3" vertical={false}/>
                                    <XAxis
                                        dataKey="name"
                                        className={"text-gray-700 dark:text-gray-400"}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={theme === "dark" ? {fill: "#d1d2d3", fontSize: 12} : {
                                            fill: "#6B7280",
                                            fontSize: 12
                                        }}
                                    />
                                    <YAxis
                                        domain={[0, 125]}
                                        ticks={[0, 25, 50, 75, 100, 125]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={theme === "dark" ? {fill: "#d1d2d3", fontSize: 12} : {
                                            fill: "#6B7280",
                                            fontSize: 12
                                        }}
                                    />
                                    <Bar
                                        dataKey="onTime"
                                        fill="#38C793"
                                        name={t("On-Time Completed")}
                                        radius={[15, 15, 0, 0]}
                                        barSize={15} // Reduce bar size
                                    />
                                    <Bar
                                        dataKey="late"
                                        fill="#F17B2C"
                                        name={t("Late Completed")}
                                        radius={[15, 15, 0, 0]}
                                        barSize={15} // Reduce bar size
                                    />
                                    <Legend content={<CustomLegend/>}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className={"flex justify-center items-center gap-3 w-full"}>
                    <div className={"bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1"}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Tasks Timeline")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-32"}
                                               options={[{id: "", value: "Last 6 months"}]}/>
                            </div>
                        </div>
                        <div className={"h-64"}>
                            <LineChart width={500} height={300} data={data}>
                                <YAxis ticks={[1, 5, 10, 15]} axisLine={false}
                                       tickLine={false} tick={theme === "dark" ? {fill: "#d1d2d3", fontSize: 12} : {
                                    fill: "#6B7280",
                                    fontSize: 12
                                }}/>
                                <Line type="monotone" dataKey="Expected Time" stroke="#35B9E9" allowReorder={"no"}
                                      dot={false}/>
                                <Line type="monotone" strokeDasharray="5 5" dataKey="Actual Time" dot={false}
                                      stroke="#38C793"/>
                            </LineChart>
                        </div>

                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1">
                        <div className="flex justify-between items-center mb-6 ">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Tasks Rating")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-28"} options={[{id: "", value: "Last Month"}]}/>
                            </div>
                        </div>

                        <div className="flex justify-center mb-6 w-full">
                            <div className="relative w-48 h-48 ">
                                <DonutChart
                                    data={[
                                        {value: tasksRatingData.highRating, color: "#375DFB"},
                                        {value: tasksRatingData.lowRating, color: "#38C793"},
                                    ]}
                                    total={tasksRatingData.total}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500 dark:text-gray-200">{t("TASKS")}</div>
                                        <div className="text-3xl font-bold dark:text-white">
                                            {tasksRatingData.total}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-3 text-center items-center">
                            <div>
                                <div className="text-indigo-600 font-semibold">
                                    {tasksRatingData.highRating}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-200">{t("High Rating")}</div>
                            </div>
                            <div>
                                <div className="text-green-600 text-sm ">
                                    {tasksRatingData.lowRating}
                                </div>
                                <div
                                    className="text-sm text-nowrap text-gray-500 dark:text-gray-200">{t("Low Rating")}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"flex flex-col justify-center items-center gap-5"}>
                <p className={"w-full text-start text-sm dark:text-gray-200"}>{t("Projects Analytics")}</p>
                <div className={"flex justify-center items-center gap-3 w-full"}>
                    <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Projects Performance")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-28"}
                                               options={[{id: "", value: "Department"}]}/>
                                <DefaultSelect classNameContainer={"w-32"}
                                               options={[{id: "", value: "Last 6 months"}]}/>
                            </div>
                        </div>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} barGap={4}>
                                    {" "}
                                    {/* Reduce barGap */}
                                    <CartesianGrid className={"bg-gary-800 text-gray-800"}
                                                   stroke={theme === "dark" ? "rgb(78,90,110)" : "rgb(166,167,169)"}
                                                   strokeDasharray="3 3" vertical={false}/>
                                    <XAxis
                                        dataKey="name"
                                        className={"text-gray-700 dark:text-gray-400"}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={theme === "dark" ? {fill: "#d1d2d3", fontSize: 12} : {
                                            fill: "#6B7280",
                                            fontSize: 12
                                        }}
                                    />
                                    <YAxis
                                        domain={[0, 125]}
                                        ticks={[0, 25, 50, 75, 100, 125]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={theme === "dark" ? {fill: "#d1d2d3", fontSize: 12} : {
                                            fill: "#6B7280",
                                            fontSize: 12
                                        }}
                                    />
                                    <Bar
                                        dataKey="onTime"
                                        fill="#38C793"
                                        name={t("On-Time Completed")}
                                        radius={[15, 15, 0, 0]}
                                        barSize={15} // Reduce bar size
                                    />
                                    <Bar
                                        dataKey="late"
                                        fill="#F17B2C"
                                        name={t("Late Completed")}
                                        radius={[15, 15, 0, 0]}
                                        barSize={15} // Reduce bar size
                                    />
                                    <Legend
                                        iconType="circle"
                                        content={<CustomLegend/>}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={"bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1"}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Project Timeline")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-32"}
                                               options={[{id: "", value: "Last 6 months"}]}/>
                            </div>
                        </div>
                        <div className={"h-64"}>
                            <LineChart width={500} height={300} data={data}>
                                <YAxis ticks={[1, 5, 10, 15]} axisLine={false}
                                       tickLine={false} tick={theme === "dark" ? {fill: "#d1d2d3", fontSize: 12} : {
                                    fill: "#6B7280",
                                    fontSize: 12
                                }}/>
                                <Line type="monotone" dataKey="Expected Time" stroke="#C2D6FF" allowReorder={"no"}
                                      dot={false}/>
                                <Line type="monotone" strokeDasharray="5 5" dataKey="Actual Time" dot={false}
                                      stroke="#38C793"/>
                            </LineChart>
                        </div>
                    </div>
                </div>
                <div className={"flex justify-center items-center gap-3 w-full"}>
                    <div className={"bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1"}>
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Projects Performance")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-28"}
                                               options={[{id: "", value: "Department"}]}/>
                                <DefaultSelect classNameContainer={"w-32"}
                                               options={[{id: "", value: "Last 6 months"}]}/>
                            </div>
                        </div>
                        <div className={"flex flex-col justify-center gap-8 w-full"}>
                            <ProgressBar title={"Alpha Project"} ratio={"70%"} progressText={"75 / 100 tasks completed"}
                                         remainingTime={"2 days left"}/>
                            <ProgressBar title={"Alpha Project"} ratio={"70%"} progressText={"75 / 100 tasks completed"}
                                         remainingTime={"2 days left"}/>
                            <ProgressBar title={"Alpha Project"} ratio={"70%"} progressText={"75 / 100 tasks completed"}
                                         remainingTime={"2 days left"}/>
                            <ProgressBar title={"Alpha Project"} ratio={"70%"} progressText={"75 / 100 tasks completed"}
                                         remainingTime={"2 days left"}/>

                        </div>
                    </div>
                    <div className={"bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 w-[35%] h-full"}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Last 4 Projects")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-32"}
                                               options={[{id: "", value: "Performance"}]}/>
                            </div>
                        </div>
                        <div className={"flex flex-col justify-center gap-6 w-full"}>
                            <LastProjectItem index={1} title={"Alpha Project"} department={"Publishing Dep"}/>
                            <LastProjectItem index={2} title={"Alpha Project"} department={"Publishing Dep"}/>
                            <LastProjectItem index={3} title={"Alpha Project"} department={"Publishing Dep"}/>
                            <LastProjectItem index={4} title={"Alpha Project"} department={"Publishing Dep"}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"flex flex-col justify-center items-center gap-5 w-full"}>
                <p className={"w-full text-start text-sm dark:text-gray-200"}>{t("Employee Attendance")}</p>
                <div className={"flex justify-center items-center gap-3 w-full"}>
                    <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1">
                        <div className="flex justify-between items-center mb-6 ">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Employee Attendance")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-28"} options={[{id: "", value: "Last Month"}]}/>
                            </div>
                        </div>

                        <div className="flex justify-center mb-6 w-full">
                            <div className="relative w-48 h-48 ">
                                <DonutChart
                                    data={[
                                        {value: tasksRatingData.highRating, color: "#375DFB"},
                                        {value: tasksRatingData.lowRating, color: "#38C793"},
                                    ]}
                                    total={tasksRatingData.total}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500 dark:text-gray-200">{t("TASKS")}</div>
                                        <div className="text-3xl font-bold dark:text-white">
                                            {tasksRatingData.total}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-3 text-center items-center">
                            <div>
                                <div className="text-indigo-600 font-semibold">
                                    {tasksRatingData.highRating}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-200">{t("High Rating")}</div>
                            </div>
                            <div>
                                <div className="text-green-600 text-sm ">
                                    {tasksRatingData.lowRating}
                                </div>
                                <div
                                    className="text-sm text-nowrap text-gray-500 dark:text-gray-200">{t("Low Rating")}</div>
                            </div>
                        </div>
                    </div>
                    <div className={"bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1"}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Employee Performance")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-32"}
                                               options={[{id: "", value: "Last 6 months"}]}/>
                            </div>
                        </div>
                        <div className={"h-64"}>
                            <ResponsiveContainer width="100%">
                                <ScatterChart
                                    margin={{
                                        top: 80,
                                        right: 0,
                                        bottom: 0,
                                        left: 0,
                                    }}
                                >
                                    <YAxis ticks={[0, 2, 3, 4, 5, 6]} type="number" dataKey="y" name="weight"/>
                                    <ZAxis type="number" range={[50]}/>
                                    <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                                    <Legend content={<CustomLegend/>}/>
                                    <Scatter symbolSize={5}
                                             name="Employee has improved from 2 points to 4 points this month"
                                             data={data01} fill="#FCAA0B" line shape="circle"/>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                </div>
                <div className={"flex justify-center items-center gap-3 w-full"}>
                    <div className={"bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1"}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Employee Accomplishment")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-32"}
                                               options={[{id: "", value: "Last 6 months"}]}/>
                            </div>
                        </div>
                        <div className={"h-64"}>
                            <LineChart width={500} height={300} data={data}>
                                <YAxis ticks={[1, 5, 10, 15]} axisLine={false}
                                       tickLine={false} tick={theme === "dark" ? {fill: "#d1d2d3", fontSize: 12} : {
                                    fill: "#6B7280",
                                    fontSize: 12
                                }}/>
                                <Line type="monotone" dataKey="Expected Time" stroke="#C2D6FF" allowReorder={"no"}
                                      dot={false}/>
                                <Line type="monotone" strokeDasharray="5 5" dataKey="Actual Time" dot={false}
                                      stroke="#38C793"/>
                            </LineChart>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1">
                        <div className="flex justify-between items-center mb-6 ">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Employee Adherence")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-28"} options={[{id: "", value: "Last Month"}]}/>
                            </div>
                        </div>

                        <div className="flex justify-center mb-6 w-full">
                            <div className="relative w-48 h-48 ">
                                <DonutChart
                                    data={[
                                        {value: tasksRatingData.highRating, color: "#375DFB"},
                                        {value: tasksRatingData.lowRating, color: "#38C793"},
                                    ]}
                                    total={tasksRatingData.total}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500 dark:text-gray-200">{t("TASKS")}</div>
                                        <div className="text-3xl font-bold dark:text-white">
                                            {tasksRatingData.total}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-3 text-center items-center">
                            <div>
                                <div className="text-indigo-600 font-semibold">
                                    {tasksRatingData.highRating}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-200">{t("High Rating")}</div>
                            </div>
                            <div>
                                <div className="text-green-600 text-sm ">
                                    {tasksRatingData.lowRating}
                                </div>
                                <div
                                    className="text-sm text-nowrap text-gray-500 dark:text-gray-200">{t("Low Rating")}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"flex justify-center items-center gap-3 w-full"}>
                    <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1">
                        <div className="flex justify-between items-center mb-6 ">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Department Performance")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-28"} options={[{id: "", value: "Last Month"}]}/>
                            </div>
                        </div>

                        <div className="flex justify-center w-full">
                            <div className="relative w-48 h-32 ">
                                    <HalfDonutChart
                                        data={[
                                            {value: 20, color: '#F17B2C'}
                                        ]}
                                        total={100}
                                    />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500 dark:text-gray-200">{t("TASKS")}</div>
                                        <div className="text-3xl font-bold dark:text-white">
                                            {tasksRatingData.total}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-3 text-center items-center ">
                            <div className={"flex justify-center items-center gap-2 w-1/2"}>
                                <div className="text-indigo-600 w-2.5 h-2.5 rounded-full bg-[#F17B2C]"></div>
                                <div
                                    className="text-xs text-gray-500 dark:text-gray-200">{t("Employee has completed their task in 67 hours")}</div>
                            </div>
                            <div className={"flex justify-start items-center gap-2 w-1/2"}>
                                <div className="text-indigo-600 w-2.5 h-2.5 rounded-full bg-[#31353F]"></div>
                                <div
                                    className="text-xs text-gray-500 dark:text-gray-200">{t("Expected Time was 55 Hours")}</div>
                            </div>
                        </div>
                    </div>
                    <div className={"bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1 h-full"}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Top 3 Employees")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-32"}
                                               options={[{id: "", value: "Performance"}]}/>
                            </div>
                        </div>
                        <div className={"flex flex-col justify-center gap-6 w-full"}>
                            <div className={"flex items-center gap-3"}>
                                <div
                                    className={"rounded-full w-10 h-10 border text-xl dark:text-gray-200 flex justify-center items-center"}>
                                    <RiUser3Line className="dark:text-gray-200" size={"18"}/></div>
                                <div className={"flex flex-col gap-1 items-start"}>
                                    <p className={"text-sm dark:text-gray-200"}>Ali Ali</p>
                                    <p className={"text-xs text-gray-600 dark:text-gray-400"}>Publishing Dep</p>
                                </div>
                            </div>
                            <div className={"flex items-center gap-3"}>
                                <div
                                    className={"rounded-full w-10 h-10 border text-xl dark:text-gray-200 flex justify-center items-center"}>
                                    <RiUser3Line className="dark:text-gray-200" size={"18"}/></div>
                                <div className={"flex flex-col gap-1 items-start"}>
                                    <p className={"text-sm dark:text-gray-200"}>Rawan Ahmed</p>
                                    <p className={"text-xs text-gray-600 dark:text-gray-400"}>Publishing Dep</p>
                                </div>
                            </div>
                            <div className={"flex items-center gap-3"}>
                                <div
                                    className={"rounded-full w-10 h-10 border text-xl dark:text-gray-200 flex justify-center items-center"}>
                                    <RiUser3Line className="dark:text-gray-200" size={"18"}/></div>
                                <div className={"flex flex-col gap-1 items-start"}>
                                    <p className={"text-sm dark:text-gray-200"}>Yara Ahmed</p>
                                    <p className={"text-xs text-gray-600 dark:text-gray-400"}>Publishing Dep</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"flex flex-col justify-center items-center gap-5 w-full"}>
                <p className={"w-full text-start text-sm dark:text-gray-200"}>{t("Department Analytics")}</p>
                <div className={"flex justify-center items-center gap-3 w-full"}>
                    <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1">
                        <div className="flex justify-between items-center mb-6 ">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Department Adherence")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-28"} options={[{id: "", value: "Last Month"}]}/>
                            </div>
                        </div>

                        <div className="flex justify-center mb-6 w-full">
                            <div className="relative w-48 h-48 ">
                                <DonutChart
                                    data={[
                                        {value: tasksRatingData.highRating, color: "#375DFB"},
                                        {value: tasksRatingData.lowRating, color: "#F2AE40"},
                                    ]}
                                    total={tasksRatingData.total}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500 dark:text-gray-200">{t("TASKS")}</div>
                                        <div className="text-3xl font-bold dark:text-white">
                                            {tasksRatingData.total}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-3 text-center items-center">
                            <div>
                                <div className="text-indigo-600 font-semibold">
                                    {tasksRatingData.highRating}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-200">{t("High Rating")}</div>
                            </div>
                            <div>
                                <div className="text-green-600 text-sm ">
                                    {tasksRatingData.lowRating}
                                </div>
                                <div
                                    className="text-sm text-nowrap text-gray-500 dark:text-gray-200">{t("Low Rating")}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 flex-1">
                        <div className="flex justify-between items-center mb-6 ">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                                {t("Department Performance")}
                            </h2>
                            <div className="flex gap-2">
                                <DefaultSelect classNameContainer={"w-28"} options={[{id: "", value: "Last Month"}]}/>
                            </div>
                        </div>

                        <div className="flex justify-center mb-6 w-full">
                            <div className="relative w-48 h-48 ">
                                <DonutChart
                                    data={[
                                        {value: tasksRatingData.highRating, color: "#38C793"},
                                        {value: tasksRatingData.lowRating, color: "#DF1C41"},
                                    ]}
                                    total={tasksRatingData.total}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                    <div className="text-sm text-gray-500 dark:text-gray-200">{t("TASKS")}</div>
                                        <div className="text-3xl font-bold dark:text-white">
                                            {tasksRatingData.total}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-3 text-center items-center">
                            <div>
                                <div className="text-indigo-600 font-semibold">
                                    {tasksRatingData.highRating}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-200">{t("High Rating")}</div>
                            </div>
                            <div>
                                <div className="text-green-600 text-sm ">
                                    {tasksRatingData.lowRating}
                                </div>
                                <div
                                    className="text-sm text-nowrap text-gray-500 dark:text-gray-200">{t("Low Rating")}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <Table isTitle={true} title={"Deparments Ranking"}
                       headers={headersDeparmentsRanking} rows={rows}
                       isActions={false}   />
            </div>
        </Page>
    );
}

export default AnalyticsPage;