import ContentCard from '@/app/_components/ContentCard';
import DefaultSelect from '@/components/Form/DefaultSelect';
import React from 'react';

const ProjectsPerformanceList = () => {

    const projects = [
        { name: "Alpha Project", completion: 75, left: "2 days" },
        { name: "Alpha Project", completion: 75, left: "2 days" },
        { name: "Alpha Project", completion: 75, left: "2 days" },
        { name: "Alpha Project", completion: 75, left: "2 days" },
    ];

    return (
        <ContentCard
            title={"Projects Perfoemance"}
            toolbar={
                <div className="w-32 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect options={[{ id: 1, value: "Last Month" }]} />
                </div>
            }
            main={
                <div className="space-y-4">
                    {projects.map((project, index) => (
                        <div key={index} className="flex items-start gap-4 justify-between flex-col md:flex-row">
                            <div>
                                <h3 className="text-md font-medium text-gray-900">{project.name}</h3>
                            </div>
                            <div className="flex flex-col gap-1 w-full md:w-3/4">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-green-success h-2.5 rounded-full"
                                        style={{ width: `${(project.completion / 100) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex flex-wrap gap-1 items-start justify-between w-full">
                                    <p className="text-sm text-gray-500">
                                        {project.completion}/{100} tasks completed
                                    </p>
                                    <span className="text-xs text-gray-500 ml-4">{project.left} days left</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
        />
    );
};

export default ProjectsPerformanceList;
