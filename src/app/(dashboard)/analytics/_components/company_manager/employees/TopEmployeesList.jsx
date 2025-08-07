const { default: ContentCard } = require("@/components/containers/ContentCard");
const { default: DefaultSelect } = require("@/components/Form/DefaultSelect");

const TopEmployeesList = () => {

    const employees = [
        {
            name: "Employee Name",
            desc: "Publishing Dep"
        },
        {
            name: "Employee Name",
            desc: "Publishing Dep"
        },
        {
            name: "Employee Name",
            desc: "Publishing Dep"
        }
    ];

    return (
        <ContentCard
            title={"Top 3 Employees"}
            toolbar={
                <div className="w-32 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect placeholder="Performance" options={[{ id: 1, value: "Higher" }]} />
                </div>
            }
            main={
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    {employees.map((employee, index) => {
                        return (
                            <div className="flex gap-2 items-start justify-start w-full">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-white text-center flex items-center justify-center">
                                    <span className="text-xl">
                                        {index + 1}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start justify-start gap-1">
                                    <span className="text-md text-gray-900 dark:text-gray-300">
                                        {employee.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {employee.desc}
                                    </span>
                                </div>
                            </div>)
                    })
                    }
                </div>
            }
        />
    );
};

export default TopEmployeesList;