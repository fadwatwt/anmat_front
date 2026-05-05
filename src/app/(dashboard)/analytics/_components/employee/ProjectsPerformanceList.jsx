import ContentCard from '@/components/containers/ContentCard';
import DefaultSelect from '@/components/Form/DefaultSelect';

const ProjectsPerformanceList = ({ projects = [] }) => {
    return (
        <ContentCard
            title={"Projects Performance"}
            toolbar={
                <div className="w-32 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect variant="chart" multi={false} options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            main={
                <div className="flex flex-col gap-8 h-full">
                    {projects.length === 0 && (
                        <span className="text-sm text-gray-500">No projects assigned.</span>
                    )}
                    {projects.map((project, index) => {
                        const completion = project.totalTasks
                            ? Math.round((project.completedTasks / project.totalTasks) * 100)
                            : 0;
                        return (
                            <div key={index} className="flex items-start gap-4 justify-between flex-col md:flex-row">
                                <div>
                                    <h3 className="text-md font-medium text-gray-900 dark:text-gray-300">{project.name}</h3>
                                </div>
                                <div className="flex flex-col gap-1 w-full md:w-3/4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-green-success h-2.5 rounded-full"
                                            style={{ width: `${completion}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 items-start justify-between w-full">
                                        <p className="text-sm text-gray-500">
                                            {project.completedTasks ?? 0}/{project.totalTasks ?? 0} tasks completed
                                        </p>
                                        <span className="text-xs text-gray-500 ml-4">{project.daysLeft ?? 0} days left</span>
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
