import { useGetTaskLogsQuery } from "@/redux/activity-logs/activityLogsApi";
import ActivityLogs from "@/components/ActivityLogs";
import PropTypes from "prop-types";

function TaskLogsViewer({ taskId }) {
    const { data: logsData, isLoading } = useGetTaskLogsQuery({ taskId, limit: 5 }, { skip: !taskId });
    
    if (isLoading) {
        return <div className="text-xs text-soft-400 p-2">Loading logs...</div>;
    }

    const rawLogs = logsData?.data || [];

    if (rawLogs.length === 0) {
        return null;
    }

    return (
        <div className="mt-4">
            <ActivityLogs activityLogs={rawLogs} isRawLogs={true} className="max-h-48" />
        </div>
    );
}

TaskLogsViewer.propTypes = {
    taskId: PropTypes.string.isRequired
};

export default TaskLogsViewer;
