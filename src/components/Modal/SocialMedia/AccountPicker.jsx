"use client";

import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ImSpinner2 } from "react-icons/im";
import { IoMdCheckmark } from "react-icons/io";
import { useGetTwitterAccountsQuery } from "@/redux/socialMedia/twitterAccountsApi";

// Multi-select picker used by every method modal. Returns the list of account
// names (not _ids) because tweetAPI's method endpoints look up accounts by name.
function AccountPicker({
    selected = [],
    onChange,
    multiple = true,
    title = "Select Account(s)",
    isRequired = true,
}) {
    const { t } = useTranslation();
    const { data, isLoading } = useGetTwitterAccountsQuery({});
    const [search, setSearch] = useState("");

    const accounts = data?.data || [];

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return accounts;
        return accounts.filter(
            (a) =>
                a.name?.toLowerCase().includes(q) ||
                a?.AccountDataInfo1?.FullName?.toLowerCase().includes(q),
        );
    }, [accounts, search]);

    const toggle = (name) => {
        if (multiple) {
            if (selected.includes(name)) {
                onChange(selected.filter((s) => s !== name));
            } else {
                onChange([...selected, name]);
            }
        } else {
            onChange(selected[0] === name ? [] : [name]);
        }
    };

    const selectAll = () => {
        if (selected.length === filtered.length) {
            onChange([]);
        } else {
            onChange(filtered.map((a) => a.name));
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center">
                <label className="text-cell-primary text-sm font-medium">
                    {t(title)}
                    {isRequired && <span className="text-red-500 ms-1">*</span>}
                </label>
                {multiple && accounts.length > 0 && (
                    <button
                        type="button"
                        onClick={selectAll}
                        className="text-xs text-primary-500 hover:underline"
                    >
                        {selected.length === filtered.length ? t("Clear all") : t("Select all")}
                    </button>
                )}
            </div>

            <input
                type="text"
                placeholder={`${t("Search account")}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="py-2 px-2 text-sm bg-status-bg border-status-border border-2 rounded-xl w-full focus:outline-none focus:border-primary-400 text-cell-primary"
            />

            <div className="max-h-44 overflow-y-auto border border-status-border rounded-xl">
                {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                        <ImSpinner2 className="animate-spin text-primary-500" size={20} />
                    </div>
                ) : filtered.length === 0 ? (
                    <p className="text-cell-secondary text-xs text-center p-4">
                        {accounts.length === 0
                            ? t("No Twitter accounts yet")
                            : t("No accounts match your search")}
                    </p>
                ) : (
                    filtered.map((account) => {
                        const isSelected = selected.includes(account.name);
                        return (
                            <button
                                type="button"
                                key={account._id}
                                onClick={() => toggle(account.name)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-status-bg transition-colors ${
                                    isSelected ? "bg-primary-50 dark:bg-primary-900/20" : ""
                                }`}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="text-cell-primary font-medium">
                                        @{account.name}
                                    </span>
                                    {account?.AccountDataInfo1?.FullName && (
                                        <span className="text-cell-secondary text-xs">
                                            {account.AccountDataInfo1.FullName}
                                        </span>
                                    )}
                                </div>
                                {isSelected && (
                                    <IoMdCheckmark className="text-primary-500" size={18} />
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            {selected.length > 0 && (
                <p className="text-xs text-cell-secondary">
                    {t("Selected")}: {selected.length}
                </p>
            )}
        </div>
    );
}

AccountPicker.propTypes = {
    selected: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    title: PropTypes.string,
    isRequired: PropTypes.bool,
};

export default AccountPicker;
