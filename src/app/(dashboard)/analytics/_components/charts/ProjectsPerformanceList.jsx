
const ProjectRow = ({ name, completedTasks, totalTasks, daysLeft }) => {
    const percentage = (completedTasks / totalTasks) * 100;

    return (
        <div className="flex items-center gap-4 w-full group">
            <div className="w-24 shrink-0">
                <p className="text-sm font-semibold text-gray-700 truncate">{name}</p>
            </div>

            <div className="flex-1 flex flex-col gap-1">
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium">
                    <span>{completedTasks} / {totalTasks} tasks completed</span>
                    <span>{daysLeft} days left</span>
                </div>
            </div>
        </div>
    );
};

const ProjectsPerformanceList = ({ projects }) => {
    return (
        <div className="flex flex-col gap-8 mt-4 mb-4">
            {projects.map((project, index) => (
                <ProjectRow key={index} {...project} />
            ))}
        </div>
    );
};

export default ProjectsPerformanceList;