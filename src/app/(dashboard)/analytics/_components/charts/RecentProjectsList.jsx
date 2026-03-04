
const RecentProjectItem = ({ rank, name, department }) => (
    <div className="flex items-center gap-4 py-2">
        <div className="w-10 h-10 rounded-full border border-status-border bg-status-bg flex items-center justify-center shrink-0">
            <span className="text-cell-secondary text-lg font-light">{rank}</span>
        </div>

        <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-table-title leading-none mb-1">{name}</h4>
            <span className="text-xs text-cell-secondary font-medium">{department}</span>
        </div>
    </div>
);

const RecentProjectsList = ({ projects }) => {
    return (
        <div className="flex flex-col gap-6 mt-2 mb-4">
            {projects.map((project, index) => (
                <RecentProjectItem
                    key={index}
                    rank={index + 1}
                    name={project.name}
                    department={project.department}
                />
            ))}
        </div>
    );
};

export default RecentProjectsList;