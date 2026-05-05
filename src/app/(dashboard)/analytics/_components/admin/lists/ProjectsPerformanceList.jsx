import ContentCard from '@/components/containers/ContentCard';
import DefaultSelect from '@/components/Form/DefaultSelect';

const ProjectsPerformanceList = ({ projects = [] }) => {
    return (
        <ContentCard
            title={"Projects Performance"}
            toolbar={
                <div className="w-32 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            main={
                <div className="space-y-4">
                    {projects.length === 0 && (
                        <span className="text-sm text-cell-secondary">No projects yet.</span>
                    )}
                    {projects.map((project, index) => {
                        const completed = project.completedTasks ?? 0;
                        const total = project.totalTasks ?? 0;
                        const percent = total ? Math.round((completed / total) * 100) : 0;
                        return (
                            <div key={index} className="flex items-start gap-4 justify-between flex-col md:flex-row">
                                <div>
                                    <h3 className="text-md font-medium text-table-title">{project.name}</h3>
                                </div>
                                <div className="flex flex-col gap-1 w-full md:w-3/4">
                                    <div className="w-full bg-status-bg rounded-full h-2.5 border border-status-border">
                                        <div
                                            className="bg-green-success h-2.5 rounded-full"
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 items-start justify-between w-full">
                                        <p className="text-sm text-cell-secondary">
                                            {completed}/{total} tasks completed
                                        </p>
                                        <span className="text-xs text-cell-secondary ml-4">{project.daysLeft ?? 0} days left</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            }
        />
    );
};

export default ProjectsPerformanceList;
