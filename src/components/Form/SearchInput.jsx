import PropTypes from "prop-types";
import { CiSearch } from "react-icons/ci";
import { useTranslation } from "react-i18next";


function SearchInput({ value, onChange, placeholder }) {
    const { t } = useTranslation()
    return (
        <div className={"search-input"}>
            <div className="w-full max-w-sm min-w-[200px]">
                <div className="relative flex items-center">
                    <div className="absolute w-5 h-5 top-2.5 start-2.5 text-cell-secondary pointer-events-none" aria-hidden="true">
                        <CiSearch size={16} />
                    </div>

                    <input
                        value={value ?? ""}
                        onChange={onChange}
                        readOnly={!onChange}
                        className="w-full bg-surface placeholder:text-cell-secondary/60 text-cell-primary text-sm border border-status-border rounded-xl ps-10 pe-3 py-2 transition duration-300 ease focus:outline-none focus:border-primary-base focus:ring-2 focus:ring-primary-base/20 hover:border-primary-300 shadow-sm"
                        placeholder={placeholder || t("Search..")}
                        type="search"
                    />
                </div>
            </div>
        </div>
    );
}

SearchInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
};

export default SearchInput;
