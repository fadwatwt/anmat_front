import ContentCard from "@/components/containers/ContentCard";
import ChartSelect from "@/app/(dashboard)/analytics/_components/admin/ChartSelect";

const LastProjectsList = ({ projects = [] }) => {
    return (
        <ContentCard
            title={"Last 4 Projects"}
            toolbar={
                <div className="flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
                    <ChartSelect 
                        options={[{ id: 1, value: "Performance" }]} 
                        defaultValue="Performance"
                        className="w-full sm:w-32"
                    />
                </div>
            }
            main={
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    {projects.length === 0 && (
                        <span className="text-sm text-cell-secondary">No projects yet.</span>
                    )}
                    {projects.map((project, index) => {
                        return (
                            <div key={index} className="flex gap-2 items-start justify-start w-full">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-status-border bg-status-bg text-center flex items-center justify-center">
                                    <span className="text-xl text-table-title">
                                        {index + 1}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start justify-start gap-1">
                                    <span className="text-md text-table-title">
                                        {project.name}
                                    </span>
                                    <span className="text-sm text-cell-secondary">
                                        {project.desc}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            }
        />
    );
};

export default LastProjectsList;
