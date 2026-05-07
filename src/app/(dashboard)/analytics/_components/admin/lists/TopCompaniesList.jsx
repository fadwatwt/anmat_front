import ContentCard from "@/components/containers/ContentCard";
import ChartSelect from "@/app/(dashboard)/analytics/_components/admin/ChartSelect";

const TopCompaniesList = ({ companies = [] }) => {
    return (
        <ContentCard
            title={"Top 4 Companies"}
            toolbar={
                <div className="flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end w-full sm:w-auto">
                    <ChartSelect 
                        options={[{ id: 1, value: "Industry" }]} 
                        defaultValue="Industry"
                        className="w-full sm:w-32"
                    />
                </div>
            }
            main={
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    {companies.length === 0 && (
                        <span className="text-sm text-cell-secondary">No companies yet.</span>
                    )}
                    {companies.map((company, index) => {
                        return (
                            <div key={index} className="flex gap-2 items-start justify-start w-full">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <img src={company.logo || "/images/logo.png"} alt="Logo" className="w-full" />
                                </div>
                                <div className="flex flex-col items-start justify-start gap-1">
                                    <span className="text-md text-table-title">
                                        {company.name}
                                    </span>
                                    <span className="text-sm text-cell-secondary">
                                        {company.url}
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

export default TopCompaniesList;
