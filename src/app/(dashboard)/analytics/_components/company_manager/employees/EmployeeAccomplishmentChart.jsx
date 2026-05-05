"use client";

import DefaultSelect from "@/components/Form/DefaultSelect";
import LineChartComponent from "@/components/containers/chart/LineChartComponent";

const EmployeeAccomplishmentChart = ({ data = [] }) => {
    const lines = [
        {
            type: "monotone", dataKey: "Expected Time", stroke: "#C2D6FF", allowReorder: "no", dot: false
        },
        {
            type: "monotone", strokeDasharray: "5 5", dataKey: "Actual Time", dot: "false", stroke: "#35B9E9"
        }
    ];

    return (
        <LineChartComponent
            title={"Employee Accomplishment"}
            toolbar={
                <div className="w-72 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect options={[{ id: 1, value: "Employee" }]} />
                    <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            data={data}
            lines={lines}
            yaxisTitle="Hours"
        />
    );
};

export default EmployeeAccomplishmentChart;
