import {CiSearch} from "react-icons/ci";
import {useTranslation} from "react-i18next";


function SearchInput() {
    const {t} = useTranslation()
    return (
        <div className={"search-input"}>
            <div className="w-full max-w-sm min-w-[200px]">
                <div className="relative flex items-center">
                    <div className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600">
                        <CiSearch size={"lg"}/>
                    </div>

                    <input
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 dark:border-gray-700 dark:text-gray-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow "
                        placeholder={t("Search..")}
                    />
                </div>
            </div>
        </div>
    );
}

export default SearchInput;