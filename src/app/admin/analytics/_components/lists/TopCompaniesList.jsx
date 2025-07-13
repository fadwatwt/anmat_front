const { default: ContentCard } = require("@/app/_components/ContentCard");
const { default: DefaultSelect } = require("@/components/Form/DefaultSelect");

const TopCompaniesList = () => {

    const companies = [
        {
            logo: "/images/logo.png",
            name: "Company Name",
            url: "company.io"
        },
        {
            logo: "/images/logo.png",
            name: "Company Name",
            url: "company.io"
        },
        {
            logo: "/images/logo.png",
            name: "Company Name",
            url: "company.io"
        },
        {
            logo: "/images/logo.png",
            name: "Company Name",
            url: "company.io"
        }
    ];

    return (
        <ContentCard
            title={"Top 4 Companies"}
            toolbar={
                <div className="w-32 flex flex-wrap lg:flex-nowrap gap-2 items-center justify-end">
                    <DefaultSelect placeholder="Industry" options={[{ id: 1, value: "Design" }]} />
                </div>
            }
            main={
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    {companies.map(company => {
                        return (
                            <div className="flex gap-2 items-start justify-start w-full">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <img src={company.logo} alt="Logo" className="w-full" />
                                </div>
                                <div className="flex flex-col items-start justify-start gap-1">
                                    <span className="text-md text-gray-900">
                                        {company.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {company.url}
                                    </span>
                                </div>
                            </div>)})
                    }
                </div>
            }
        />
    );
};

export default TopCompaniesList;