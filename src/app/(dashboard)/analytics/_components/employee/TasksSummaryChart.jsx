"use client";

import DonutChartComponent from "@/components/containers/chart/DonutChartComponent";
import DefaultSelect from "@/components/Form/DefaultSelect";

const TasksSummaryChart = ({ data }) => {

    const defaultChartData = {
        total: 0,
        records: []
    };

    const displayData = data || defaultChartData;

    return (
        <DonutChartComponent
            title={"Tasks Summary"}
            toolbar={
                <div className="w-32">
                    <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            subtitle={"TASKS"}
            data={displayData}
        />
    );
};

export default TasksSummaryChart;