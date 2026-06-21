import PropTypes from "prop-types";
import { isValidElement, useState } from "react";
import { createPortal } from "react-dom";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import ActionsBtns from "../ActionsBtns.jsx";
import { useTranslation } from "react-i18next";
import SearchInput from "../Form/SearchInput.jsx";
import { TfiImport } from "react-icons/tfi";
import SelectWithoutLabel from "../Form/SelectWithoutLabel.jsx";
import useDropdown from "@/Hooks/useDropdown.js";
import {
    departments,
    defaultStatusOptions,
} from "@/functions/FactoryData.jsx";
import DateInput from "@/components/Form/DateInput.jsx";

function Table({
    customTitle = null,
    title,
    classContainer,
    className,
    headers,
    rows,
    isTitle = true,
    isActions,
    isCheckInput = true,
    customActions,
    handelEdit,
    handelDelete,
    showControlBar = false,
    viewMode,
    onViewModeChange,
    selectedDepartment,
    onDepartmentChange,
    currentDate,
    showListOfDepartments = false,
    showStatusFilter = false,
    statusOptions = [],
    selectedStatus,
    onStatusChange,
    showDatePicker = false,
    selectedDate,
    onDateChange,
    classNameCell,
    viewModalList,
    showIndustryFilter = false,
    industryOptions = [],
    selectedIndustry,
    onIndustryChange,
    hideSearchInput = false,
    toolbarCustomContent = null,
    headerActions = null,
    onRowClick,
    showExport = true,
    onExport,
    exportFileName,
}) {
    const { t, i18n } = useTranslation();
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dropdownOpen, setDropdownOpen] = useDropdown();
    const [dropdownPosition, setDropdownPosition] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [internalStatus, setInternalStatus] = useState("");

    // Recursively pull plain text out of a cell which may be a string,
    // number, array, or a React element (badge, button, link, etc.).
    // Cells are often custom/lazy components whose text lives in props
    // (name, title, type, ...) rather than in children, so we look there too.
    const TEXT_PROPS = [
        "name",
        "description",
        "label",
        "text",
        "value",
        "type",
        "status",
        "rating",
        "rate",
        "score",
        "title",
        "alt",
        "aria-label",
    ];

    const extractText = (node) => {
        if (node === null || node === undefined || typeof node === "boolean") {
            return "";
        }
        if (typeof node === "string" || typeof node === "number") {
            return String(node);
        }
        if (Array.isArray(node)) {
            return node.map(extractText).filter(Boolean).join(" ");
        }
        if (isValidElement(node)) {
            const nodeProps = node.props || {};
            const childrenText = extractText(nodeProps.children);
            if (childrenText.trim()) {
                return childrenText;
            }
            // No rendered children text (e.g. lazy component, icon-only badge,
            // star rating): fall back to descriptive text props.
            const propTexts = TEXT_PROPS.map((key) => {
                const value = nodeProps[key];
                return typeof value === "string" || typeof value === "number"
                    ? String(value)
                    : "";
            }).filter(Boolean);
            // De-duplicate (title often mirrors a visible label).
            return [...new Set(propTexts)].join(" ");
        }
        return "";
    };

    const rowText = (row) =>
        (row || [])
            .map((cell) => extractText(cell))
            .join(" ")
            .toLowerCase();

    // Filter rows by the search box and, when the status filter is used in
    // uncontrolled mode, by the selected status. Keep a reference to each
    // row's original index so action/checkbox callbacks stay correct.
    const isStatusControlled = typeof onStatusChange === "function";
    const activeStatus = isStatusControlled ? selectedStatus : internalStatus;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    // Build the set of text variants to match a selected status against the
    // visible row text: the raw value and the option's translated display name.
    const statusMatchTerms = (() => {
        if (isStatusControlled || !showStatusFilter || !activeStatus || activeStatus === "all") {
            return [];
        }
        const options = statusOptions.length ? statusOptions : defaultStatusOptions;
        const matched = options.find(
            (opt) => String(opt._id ?? opt.id ?? opt.value) === String(activeStatus)
        );
        const terms = [String(activeStatus)];
        if (matched?.name) {
            terms.push(t(matched.name));
        }
        return terms.map((term) => term.toLowerCase()).filter(Boolean);
    })();

    const filtered = rows
        .map((row, originalIndex) => ({ row, originalIndex }))
        .filter(({ row }) => {
            const text = rowText(row);
            if (normalizedQuery && !text.includes(normalizedQuery)) {
                return false;
            }
            // Status filtering happens here only in uncontrolled mode
            // (controlled parents filter their own data).
            if (statusMatchTerms.length && !statusMatchTerms.some((term) => text.includes(term))) {
                return false;
            }
            return true;
        });

    const filteredRows = filtered.map((item) => item.row);

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));

    const handleHeaderCheckboxChange = () => {
        const pageItems = filtered.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
        );
        const newSelectedRows = isAllSelected
            ? []
            : pageItems.map((item) => item.originalIndex);

        setIsAllSelected(!isAllSelected);
        setSelectedRows(newSelectedRows);
    };

    const handleDropdownToggle = (index, event) => {
        if (dropdownOpen === index) {
            setDropdownOpen(null);
        } else {
            const rect = event.currentTarget.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const isUpwards = spaceBelow < 200; // if less than 200px below, show above
            setDropdownPosition({
                top: isUpwards ? rect.top + window.scrollY : rect.bottom + window.scrollY,
                isUpwards,
                left: rect.left + window.scrollX,
                right: rect.right + window.scrollX,
                width: rect.width
            });
            setDropdownOpen(index);
        }
    };

    const handleRowCheckboxChange = (rowIndex) => {
        const newSelectedRows = selectedRows.includes(rowIndex)
            ? selectedRows.filter((id) => id !== rowIndex)
            : [...selectedRows, rowIndex];
        setSelectedRows(newSelectedRows);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
        setSelectedRows([]);
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    // Page slice over the filtered set; each item carries its original index.
    const currentItems = filtered.slice(startIndex, startIndex + rowsPerPage);

    const escapeCsv = (value) => {
        const text = String(value ?? "").replace(/"/g, '""');
        return `"${text}"`;
    };

    // Build a descriptive file name, e.g. "tasks-table".
    const resolveFileName = () => {
        if (exportFileName) {
            return exportFileName;
        }
        const rawTitle =
            (typeof title === "string" && title) ||
            extractText(customTitle) ||
            "";
        const slug = String(t(rawTitle) || rawTitle)
            .trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, "-")
            .replace(/^-+|-+$/g, "");
        return slug ? `${slug}-table` : "table";
    };

    const handleExport = () => {
        // Export the selected rows when any are checked; otherwise export the
        // currently filtered set (search / status applied), falling back to all.
        const rowsToExport =
            selectedRows.length > 0
                ? selectedRows
                    .slice()
                    .sort((a, b) => a - b)
                    .map((index) => rows[index])
                    .filter(Boolean)
                : filteredRows;

        if (onExport) {
            onExport(rowsToExport);
            return;
        }

        // Map headers to labels, but keep only as many columns as the data has
        // so an empty trailing "actions" header doesn't shift columns. Blank
        // header labels (e.g. the actions placeholder) are dropped.
        const columnCount = rowsToExport.reduce(
            (max, row) => Math.max(max, (row || []).length),
            0
        );
        const headerLabels = (headers || [])
            .filter(Boolean)
            .map((header) =>
                typeof header.label === "string" ? t(header.label) : extractText(header.label)
            )
            .filter((label) => label && label.trim())
            .slice(0, columnCount);

        const csvLines = [
            headerLabels.map(escapeCsv).join(","),
            ...rowsToExport.map((row) =>
                (row || [])
                    .map((cell) => escapeCsv(extractText(cell).trim().replace(/\s+/g, " ")))
                    .join(",")
            ),
        ];

        // Prepend UTF-8 BOM so Excel renders Arabic text correctly.
        const csvContent = "﻿" + csvLines.join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${resolveFileName()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={"rounded-2xl md:w-full pb-10 tab-content bg-surface border border-status-border p-3 flex flex-col gap-4 " + (classContainer ? classContainer : "")}>
            {isTitle && (
                <div className={"flex flex-wrap justify-between items-center gap-4 mb-2"}>
                    <div className="flex flex-wrap items-center gap-4">
                        {customTitle || <p className={"text-table-title text-start text-lg"}>{t(title)}</p>}

                        {headerActions && (
                            <div className="flex items-center gap-2">
                                {headerActions}
                            </div>
                        )}

                        {showControlBar && (
                            <div className="flex items-center gap-6">
                                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                                    {viewModalList?.map((viewModal, index) => (
                                        <button
                                            key={index}
                                            className={`px-6 rounded-md text-sm dark:text-gray-200 text-gray-900 ${viewMode === viewModal.id
                                                ? "bg-white text-gray-200 dark:bg-gray-800 shadow-sm"
                                                : "bg-transparent"
                                                } w-[100px] h-[28px]`}
                                            onClick={() => onViewModeChange(viewModal.id)}
                                        >
                                            {t(viewModal.title)}
                                        </button>
                                    ))}
                                </div>
                                <button disabled className="w-[64px] text-gray-200 h-[36px] rounded-[8px] border-[1px] border-gray-200 dark:border-gray-600 opacity-50 pl-[10px] pr-[8px] gap-[4px]">
                                    {t("Today")}
                                </button>
                                <div className="text-gray-600 dark:text-gray-300 text-lg ">
                                    {currentDate.toLocaleString("default", { month: "long" })}{" "}
                                    {currentDate.getFullYear()}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {!hideSearchInput && (
                            <SearchInput
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        )}
                        {showDatePicker && (
                            <div className={"flex items-center justify-center"}>
                                <DateInput
                                    className="w-fit justify-start"
                                    classNameLabel={""}
                                    classNameInput={"p-2"}
                                    id="date-picker"
                                    name="selectedDate"
                                    value={selectedDate}
                                    onChange={onDateChange}
                                />
                            </div>
                        )}
                        {showIndustryFilter && (
                            <SelectWithoutLabel
                                options={industryOptions.length ? industryOptions : defaultStatusOptions}
                                value={selectedIndustry}
                                onChange={onIndustryChange}
                                placeholder={t("Industry")}
                                className="w-fit"
                            />
                        )}
                        {showStatusFilter && (
                            <SelectWithoutLabel
                                options={statusOptions.length ? statusOptions : defaultStatusOptions}
                                value={activeStatus}
                                onChange={(selectedValue) => {
                                    setCurrentPage(1);
                                    if (isStatusControlled) {
                                        // SelectWithoutLabel passes the raw value.
                                        onStatusChange(selectedValue);
                                    } else {
                                        setInternalStatus(selectedValue);
                                    }
                                }}
                                placeholder={t("Status")}
                                className="w-28"
                            />
                        )}
                        {showListOfDepartments && (
                            <SelectWithoutLabel
                                className={"w-32"}
                                options={departments}
                                value={selectedDepartment}
                                onChange={onDepartmentChange}
                                placeholder={t("Department")}
                            />
                        )}
                        {showExport && (
                            <button
                                type="button"
                                onClick={handleExport}
                                className="flex dark:text-gray-400 text-sm items-baseline p-2 gap-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <TfiImport size={15} />
                                {t("Export")}
                            </button>
                        )}
                        {toolbarCustomContent}
                    </div>
                </div>
            )}

            <div className={"flex flex-col gap-5 justify-center bg-surface w-full text-cell-primary"}>
                <div className="w-full overflow-x-auto">
                    <table className={"relative table-auto w-full " + className} style={{ borderSpacing: "0 1px" }}>
                        <thead>
                            <tr className="bg-status-bg">
                                {isCheckInput && (
                                    <th className="px-1 pt-1 w-5 rounded-tl-lg rounded-bl-lg">
                                        <input
                                            className="checkbox-custom"
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleHeaderCheckboxChange}
                                        />
                                    </th>
                                )}
                                {headers?.map((header, index) => (
                                    header && <th
                                        key={index}
                                        className="p-2 md:p-4 text-start text-sm font-semibold text-cell-primary whitespace-nowrap"
                                        style={{
                                            width: header.width || "auto",
                                            borderTopRightRadius: index === headers.length - 1 ? "8px" : "0px",
                                            borderBottomRightRadius: index === headers.length - 1 ? "8px" : "0px",
                                        }}
                                    >
                                        {typeof header.label === "string" ? t(header.label) : header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems?.map(({ row, originalIndex }) => {
                                // Use the row's original index so action / checkbox
                                // callbacks line up with the unfiltered data set.
                                const actualRowIndex = originalIndex;
                                return (
                                    <tr 
                                        key={actualRowIndex} 
                                        className={`hover:bg-gray-50 dark:hover:bg-status-bg w-full border-b border-status-border transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                        onClick={(e) => {
                                            if (e.target.closest('.checkbox-custom') || e.target.closest('.dropdown-container')) {
                                                return;
                                            }
                                            if (onRowClick) {
                                                onRowClick(actualRowIndex);
                                            }
                                        }}
                                    >
                                        {isCheckInput && (
                                            <td className="px- py-6 text-center" style={{ borderBottomLeftRadius: "8px" }}>
                                                <input
                                                    className={"checkbox-custom"}
                                                    type="checkbox"
                                                    checked={selectedRows.includes(actualRowIndex)}
                                                    onChange={() => handleRowCheckboxChange(actualRowIndex)}
                                                />
                                            </td>
                                        )}
                                        {row.map((cell, cellIndex) => (
                                            cell && <td
                                                key={cellIndex}
                                                className={"text-sm text-start whitespace-nowrap text-cell-primary " + (classNameCell ? classNameCell : "px-4 py-4 md:py-6")}
                                                style={{ borderBottomRightRadius: cellIndex === row.length - 1 ? "8px" : "" }}
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                        {(isActions || customActions) && (
                                            <td className={"dropdown-container px-2 py-4 md:py-6"}>
                                                <PiDotsThreeVerticalBold
                                                    className="cursor-pointer"
                                                    onClick={(e) => handleDropdownToggle(actualRowIndex, e)}
                                                />
                                                {dropdownOpen === actualRowIndex && createPortal(
                                                    <div
                                                        onClick={() => setDropdownOpen(null)}
                                                        className="dropdown-container w-fit text-nowrap"
                                                        style={{
                                                            position: "absolute",
                                                            top: dropdownPosition.top,
                                                            // LTR: Align right edge of menu with right edge of button
                                                            // RTL: Align left edge of menu with left edge of button
                                                            left: i18n?.language === "ar" ? dropdownPosition.left : dropdownPosition.right,
                                                            transform: `${i18n?.language === "ar" ? "" : "translateX(-100%)"} ${dropdownPosition.isUpwards ? "translateY(-100%)" : ""}`.trim(),
                                                            zIndex: 9999,
                                                        }}
                                                    >
                                                        {isActions ? (
                                                            <ActionsBtns
                                                                handleEdit={() => handelEdit(actualRowIndex)}
                                                                handleDelete={() => handelDelete(actualRowIndex)}
                                                                className="!static !mt-0"
                                                            />
                                                        ) : (
                                                            <div className="!static !mt-0 w-fit [&>div]:!static [&>div]:!mt-0">
                                                                {typeof customActions === "function" ? customActions(actualRowIndex) : customActions}
                                                            </div>
                                                        )}
                                                    </div>,
                                                    document.body
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className={"pagination flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t dark:border-gray-700"}>
                    <p className={"dark:text-gray-400 text-sm order-2 sm:order-1"}>
                        {t("Page")} {currentPage} {t("of")} {totalPages}
                    </p>
                    <div className={"flex flex-wrap gap-3 sm:gap-5 items-center justify-center order-1 sm:order-2"}>
                        <div className="flex gap-2 items-center">
                            <MdOutlineKeyboardDoubleArrowLeft onClick={() => handlePageChange(1)} className="cursor-pointer text-cell-secondary hover:text-primary-base transition-colors" />
                            <MdOutlineKeyboardArrowLeft onClick={() => handlePageChange(currentPage - 1)} className="cursor-pointer text-cell-secondary hover:text-primary-base transition-colors" />
                        </div>
                        <div className={"flex pages-numbers gap-1 text-sm"}>
                            {Array.from({ length: totalPages }).map((_, index) => {
                                // Only show limited page numbers on very small screens
                                if (totalPages > 5 && Math.abs(currentPage - (index + 1)) > 1 && index !== 0 && index !== totalPages - 1) {
                                    if (index === 1 || index === totalPages - 2) return <span key={index} className="text-gray-400">...</span>;
                                    return null;
                                }
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-3 py-1 border rounded-lg border-status-border text-cell-secondary transition-all ${currentPage === index + 1 ? "bg-primary-base text-white font-bold border-primary-base shadow-sm" : "hover:border-primary-300"}`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex gap-2 items-center">
                            <MdOutlineKeyboardArrowRight onClick={() => handlePageChange(currentPage + 1)} className="cursor-pointer text-cell-secondary hover:text-primary-base transition-colors" />
                            <MdOutlineKeyboardDoubleArrowRight onClick={() => handlePageChange(totalPages)} className="cursor-pointer text-cell-secondary hover:text-primary-base transition-colors" />
                        </div>
                    </div>
                    <div className={"flex rounded-lg border border-status-border text-cell-secondary px-2 py-1 items-center order-3"}>
                        <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="bg-transparent outline-none cursor-pointer text-sm font-medium">
                            {[5, 10, 15, 20].map((value) => (
                                <option className={"bg-surface text-cell-secondary text-sm"} key={value} value={value}>
                                    {value}/{t("page")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div >
    );
}

Table.propTypes = {
    customTitle: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string,
    classContainer: PropTypes.string,
    isActions: PropTypes.bool,
    handelEdit: PropTypes.func,
    handelDelete: PropTypes.func,
    headers: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.node.isRequired, width: PropTypes.string })).isRequired,
    rows: PropTypes.arrayOf(PropTypes.array).isRequired,
    isFilter: PropTypes.bool,
    isCheckInput: PropTypes.bool,
    isTitle: PropTypes.bool,
    showControlBar: PropTypes.bool,
    viewMode: PropTypes.oneOf(["week", "month", "id"]),
    onViewModeChange: PropTypes.func,
    selectedDepartment: PropTypes.string,
    onDepartmentChange: PropTypes.func,
    currentDate: PropTypes.instanceOf(Date),
    showListOfDepartments: PropTypes.bool,
    showStatusFilter: PropTypes.bool,
    statusOptions: PropTypes.array,
    selectedStatus: PropTypes.string,
    onStatusChange: PropTypes.func,
    showDatePicker: PropTypes.bool,
    selectedDate: PropTypes.string,
    onDateChange: PropTypes.func,
    classNameCell: PropTypes.string,
    viewModalList: PropTypes.array,
    showIndustryFilter: PropTypes.bool,
    industryOptions: PropTypes.array,
    selectedIndustry: PropTypes.string,
    onIndustryChange: PropTypes.func,
    customActions: PropTypes.func,
    hideSearchInput: PropTypes.bool,
    toolbarCustomContent: PropTypes.node,
    headerActions: PropTypes.node,
    onRowClick: PropTypes.func,
    showExport: PropTypes.bool,
    onExport: PropTypes.func,
    exportFileName: PropTypes.string,
};

export default Table;