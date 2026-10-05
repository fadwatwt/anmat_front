import { getToken } from "@/utils/tokenStorage";

import PropTypes from "prop-types";
import { Children, isValidElement, useState, useRef } from "react";
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
import {
    MdDescription,
    MdPictureAsPdf,
} from "react-icons/md";
import { FaFileExcel } from "react-icons/fa";
import SelectWithoutLabel from "../Form/SelectWithoutLabel.jsx";
import useDropdown from "@/Hooks/useDropdown.js";
import {
    departments,
    defaultStatusOptions,
} from "@/functions/FactoryData.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import { usePermission } from "@/Hooks/usePermission.js";
import { downloadExport } from "@/services/exportService.js";

// Capability required to see/use the data export button anywhere in the app.
export const EXPORT_PERMISSION = "reports.export";

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
    onSelectionChange,
}) {
    const { t, i18n } = useTranslation();
    // Only users granted the export capability may see/use the export button.
    const canExport = usePermission(EXPORT_PERMISSION);
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dropdownOpen, setDropdownOpen] = useDropdown();
    const [dropdownPosition, setDropdownPosition] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [internalStatus, setInternalStatus] = useState("");
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const [exportMenuPosition, setExportMenuPosition] = useState({});
    const exportBtnRef = useRef(null);

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

    // Nested object props that contain display text (e.g. AccountDetails account={{name}} )
    const NESTED_TEXT_KEYS = ["account", "employee", "user", "data", "item"];

    // Tailwind classes that mean an element is never visible on screen
    // (hover panels, sr-only labels, etc.). Responsive `hidden` classes are
    // NOT included here because they can still be visible at some breakpoint.
    const HIDDEN_CLASS_RE = /(?:^|\s)(invisible|opacity-0|sr-only|collapse)(?:\s|$)/;

    const isHiddenElement = (node) => {
        if (!isValidElement(node)) return false;
        const className = node.props?.className;
        return typeof className === "string" && HIDDEN_CLASS_RE.test(className);
    };

    const extractText = (node, separator = " ") => {
        if (node === null || node === undefined || typeof node === "boolean") {
            return "";
        }
        if (typeof node === "string" || typeof node === "number") {
            return String(node);
        }
        if (Array.isArray(node)) {
            return node
                .map((child) => extractText(child, separator))
                .filter(Boolean)
                .join(separator);
        }
        if (isValidElement(node)) {
            // Skip elements that are visually hidden (hover panels, screen-
            // reader-only text) so exports don't contain duplicated UI text.
            if (isHiddenElement(node)) {
                return "";
            }
            const nodeProps = node.props || {};
            const childrenText = extractText(nodeProps.children, separator);
            if (childrenText.trim()) {
                return childrenText;
            }
            // No rendered children text (e.g. lazy component, icon-only badge,
            // star rating): fall back to descriptive text props.
            // Also handle nested objects like account={{name: "HR"}} where AccountDetails is used.
            const propTexts = [];
            for (const key of TEXT_PROPS) {
                const value = nodeProps[key];
                if (typeof value === "string" || typeof value === "number") {
                    propTexts.push(String(value));
                }
            }
            // Check nested objects for inner text (account.name, etc.)
            for (const nestedKey of NESTED_TEXT_KEYS) {
                const nested = nodeProps[nestedKey];
                if (nested && typeof nested === "object") {
                    for (const propKey of TEXT_PROPS) {
                        const v = nested[propKey];
                        if (typeof v === "string" || typeof v === "number") {
                            propTexts.push(String(v));
                        }
                    }
                    // also title-case fallback: account -> accountTitle
                    if (typeof nested.name === "string") propTexts.push(nested.name);
                }
            }
            // Also check generic title prop as tooltip
            if (nodeProps.title && typeof nodeProps.title === "string") {
                propTexts.push(nodeProps.title);
            }
            const filtered = propTexts.filter(Boolean);
            // De-duplicate (title often mirrors a visible label).
            return [...new Set(filtered)].join(" ");
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

    // "Select all" covers every filtered row across all pages.
    const isAllSelected =
        filtered.length > 0 &&
        filtered.every((item) => selectedRows.includes(item.originalIndex));

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));

    const handleHeaderCheckboxChange = () => {
        const newSelectedRows = isAllSelected
            ? []
            : filtered.map((item) => item.originalIndex);

        setSelectedRows(newSelectedRows);
        if (typeof onSelectionChange === "function") {
            onSelectionChange(newSelectedRows);
        }
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
        if (typeof onSelectionChange === "function") {
            onSelectionChange(newSelectedRows);
        }
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
        if (typeof onSelectionChange === "function") {
            onSelectionChange([]);
        }
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    // Page slice over the filtered set; each item carries its original index.
    const currentItems = filtered.slice(startIndex, startIndex + rowsPerPage);
    const isRTL = i18n?.language === "ar";
    const isEmpty = filtered.length === 0;

    // A row has actions only when customActions returns real content.
    // Some pages return an empty <div/> when the user has no permission —
    // in that case the 3-dots button must be hidden entirely.
    const hasRowActions = (rowActions) => {
        if (!rowActions) return false;
        if (Array.isArray(rowActions)) return rowActions.some(hasRowActions);
        if (!isValidElement(rowActions)) return true;
        const kids = Children.toArray(rowActions.props?.children).filter((c) => {
            if (c === null || c === undefined || c === false) return false;
            if (typeof c === "string") return c.trim() !== "";
            return true;
        });
        return kids.length > 0;
    };

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

    const getRowsToExport = () =>
        selectedRows.length > 0
            ? selectedRows
                .slice()
                .sort((a, b) => a - b)
                .map((index) => rows[index])
                .filter(Boolean)
            : filteredRows;

    const getHeaderLabels = () => {
        const columnCount = getRowsToExport().reduce(
            (max, row) => Math.max(max, (row || []).length),
            0
        );
        return (headers || [])
            .filter(Boolean)
            .map((header) =>
                typeof header.label === "string" ? t(header.label) : extractText(header.label)
            )
            .filter((label) => label && label.trim())
            .slice(0, columnCount);
    };

    const handleServerExport = async (format) => {
        setExportMenuOpen(false);
        const rowsToExport = getRowsToExport();
        const headerLabels = getHeaderLabels();
        // For PDF, sibling cell items (e.g. permission badges) are joined with
        // a separator so the backend can render each one as its own badge.
        const cellSeparator = format === "pdf" ? " | " : " ";
        const plainRows = rowsToExport.map((row) =>
            (row || []).map((cell) =>
                extractText(cell, cellSeparator).trim().replace(/\s+/g, " ")
            )
        );
        const token = typeof window !== "undefined" ? getToken() : "";
        try {
            await downloadExport(
                { headers: headerLabels, rows: plainRows, format, fileName: resolveFileName() },
                token
            );
        } catch (err) {
            console.error("Export failed:", err);
        }
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
                                <div className="flex bg-status-bg rounded-lg p-1">
                                    {viewModalList?.map((viewModal, index) => (
                                        <button
                                            key={index}
                                            className={`px-6 rounded-md text-sm ${viewMode === viewModal.id
                                                ? "bg-surface text-cell-primary shadow-sm border border-status-border"
                                                : "bg-transparent text-cell-secondary"
                                                } w-[100px] h-[28px]`}
                                            onClick={() => onViewModeChange(viewModal.id)}
                                        >
                                            {t(viewModal.title)}
                                        </button>
                                    ))}
                                </div>
                                <button disabled className="w-[64px] text-cell-secondary h-[36px] rounded-[8px] border border-status-border opacity-50 pl-[10px] pr-[8px] gap-[4px] bg-surface">
                                    {t("Today")}
                                </button>
                                <div className="text-cell-secondary text-lg ">
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
                        {showExport && canExport && (
                            <div className="relative inline-block" ref={exportBtnRef}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const spaceBelow = window.innerHeight - rect.bottom;
                                        setExportMenuOpen((v) => !v);
                                        setExportMenuPosition({
                                            top: spaceBelow < 200 ? rect.top + window.scrollY : rect.bottom + window.scrollY,
                                            isUpwards: spaceBelow < 200,
                                            left: rect.left + window.scrollX,
                                            right: rect.right + window.scrollX,
                                        });
                                    }}
                                    className="flex text-sm items-baseline p-2 gap-2 rounded-lg border border-status-border hover:bg-status-bg transition-colors"
                                >
                                    <TfiImport size={15} />
                                    {t("Export")}
                                </button>
                                {exportMenuOpen && createPortal(
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setExportMenuOpen(false)}
                                        />
                                        <div
                                            className="bg-surface border border-status-border rounded-lg shadow-lg z-50 py-1 min-w-[160px]"
                                            style={{
                                                position: "absolute",
                                                top: exportMenuPosition.top,
                                                left: i18n?.language === "ar" ? exportMenuPosition.left : exportMenuPosition.right,
                                                transform: `${i18n?.language === "ar" ? "" : "translateX(-100%)"} ${exportMenuPosition.isUpwards ? "translateY(-100%)" : ""}`.trim(),
                                            }}
                                        >
                                            <button
                                                onClick={() => { handleExport(); setExportMenuOpen(false); }}
                                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-cell-primary hover:bg-status-bg transition-colors"
                                            >
                                                <TfiImport size={14} />
                                                {t("CSV")}
                                            </button>
                                            <button
                                                onClick={() => handleServerExport("xlsx")}
                                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-cell-primary hover:bg-status-bg transition-colors"
                                            >
                                                <FaFileExcel size={14} className="text-green-600 dark:text-green-400" />
                                                {t("Excel")}
                                            </button>
                                            <button
                                                onClick={() => handleServerExport("pdf")}
                                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-cell-primary hover:bg-status-bg transition-colors"
                                            >
                                                <MdPictureAsPdf size={14} className="text-red-500" />
                                                {t("PDF")}
                                            </button>
                                            <button
                                                onClick={() => handleServerExport("docx")}
                                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-cell-primary hover:bg-status-bg transition-colors"
                                            >
                                                <MdDescription size={14} className="text-blue-600 dark:text-blue-400" />
                                                {t("Word")}
                                            </button>
                                        </div>
                                    </>,
                                    document.body
                                )}
                            </div>
                        )}
                        {toolbarCustomContent}
                    </div>
                </div>
            )}

            <div className={"flex flex-col gap-5 justify-center bg-surface w-full text-cell-primary"}>
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-14 px-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-status-bg border border-status-border flex items-center justify-center text-2xl" aria-hidden="true">
                            📭
                        </div>
                        <p className="text-table-title font-semibold">{t("No results found")}</p>
                        <p className="text-sm text-cell-secondary max-w-sm">
                            {normalizedQuery || activeStatus
                                ? t("Try adjusting your search or filters.")
                                : t("There is no data to display yet.")}
                        </p>
                        {(normalizedQuery || activeStatus) && (
                            <button
                                type="button"
                                onClick={() => { setSearchQuery(""); setInternalStatus(""); setCurrentPage(1); }}
                                className="mt-1 px-4 py-2 text-sm font-semibold rounded-xl border border-status-border hover:bg-status-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
                            >
                                {t("Clear search and filters")}
                            </button>
                        )}
                    </div>
                ) : (
                <>
                <div className="w-full overflow-x-auto custom-scroll">
                    <table className={"relative table-auto w-full " + className} style={{ borderSpacing: "0 1px" }}>
                        <thead>
                            <tr className="bg-status-bg">
                                {isCheckInput && (
                                    <th className="px-3 py-3 w-10 text-sm rounded-s-lg">
                                        <input
                                            className="checkbox-custom"
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleHeaderCheckboxChange}
                                            aria-label={t("Select all")}
                                        />
                                    </th>
                                )}
                                {headers?.map((header, index) => (
                                    header && <th
                                        key={index}
                                        className={`p-2 md:p-4 text-start text-sm font-bold text-cell-primary whitespace-nowrap ${index === headers.length - 1 ? "rounded-e-lg" : ""}`}
                                        style={{
                                            width: header.width || "auto",
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
                                        className={`hover:bg-status-bg dark:hover:bg-status-bg w-full border-b border-status-border transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
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
                                            <td className="px-3 py-3 text-sm text-center">
                                                <input
                                                    className={"checkbox-custom"}
                                                    type="checkbox"
                                                    checked={selectedRows.includes(actualRowIndex)}
                                                    onChange={() => handleRowCheckboxChange(actualRowIndex)}
                                                    aria-label={t("Select row")}
                                                />
                                            </td>
                                        )}
                                        {row.map((cell, cellIndex) => (
                                            cell && <td
                                                key={cellIndex}
                                                className={"text-sm text-start text-cell-primary min-w-[100px] " + (classNameCell ? classNameCell : "px-4 py-3")}
                                                style={{ borderBottomRightRadius: cellIndex === row.length - 1 ? "8px" : "" }}
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                        {(isActions || customActions) && (() => {
                                            const rowActions = typeof customActions === "function" ? customActions(actualRowIndex) : customActions;
                                            if (!isActions && !hasRowActions(rowActions)) return null;
                                            return (
                                                <td className={"dropdown-container px-2 py-3 text-sm"}>
                                                    <button
                                                        type="button"
                                                        aria-label={t("Row actions")}
                                                        onClick={(e) => handleDropdownToggle(actualRowIndex, e)}
                                                        className="p-1.5 rounded-lg text-cell-secondary hover:bg-status-bg hover:text-cell-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
                                                    >
                                                        <PiDotsThreeVerticalBold className="pointer-events-none" />
                                                    </button>
                                                    {dropdownOpen === actualRowIndex && createPortal(
                                                        <div
                                                            onClick={() => setDropdownOpen(null)}
                                                            className="dropdown-container w-fit text-nowrap"
                                                            style={{
                                                                position: "absolute",
                                                                top: dropdownPosition.top,
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
                                                                    {rowActions}
                                                                </div>
                                                            )}
                                                        </div>,
                                                        document.body
                                                    )}
                                                </td>
                                            );
                                        })()}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className={"pagination flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-status-border"}>
                    <p className={"text-sm text-cell-secondary order-2 sm:order-1"}>
                        {t("Page")} {currentPage} {t("of")} {totalPages}
                    </p>
                    <div className={"flex flex-wrap gap-3 sm:gap-5 items-center justify-center order-1 sm:order-2"}>
                        <div className="flex gap-1 items-center" role="group" aria-label={t("Pagination")}>
                            <button type="button" onClick={() => handlePageChange(1)} disabled={currentPage === 1} aria-label={t("First page")} className="p-1.5 rounded-lg text-cell-secondary hover:text-primary-base hover:bg-status-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
                                {isRTL ? <MdOutlineKeyboardDoubleArrowRight size={20} /> : <MdOutlineKeyboardDoubleArrowLeft size={20} />}
                            </button>
                            <button type="button" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label={t("Previous page")} className="p-1.5 rounded-lg text-cell-secondary hover:text-primary-base hover:bg-status-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
                                {isRTL ? <MdOutlineKeyboardArrowRight size={20} /> : <MdOutlineKeyboardArrowLeft size={20} />}
                            </button>
                        </div>
                        <div className={"flex pages-numbers gap-1 text-sm"}>
                            {Array.from({ length: totalPages }).map((_, index) => {
                                // Only show limited page numbers on very small screens
                                if (totalPages > 5 && Math.abs(currentPage - (index + 1)) > 1 && index !== 0 && index !== totalPages - 1) {
                                    if (index === 1 || index === totalPages - 2) return <span key={index} className="text-cell-secondary">...</span>;
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
                        <div className="flex gap-1 items-center">
                            <button type="button" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label={t("Next page")} className="p-1.5 rounded-lg text-cell-secondary hover:text-primary-base hover:bg-status-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
                                {isRTL ? <MdOutlineKeyboardArrowLeft size={20} /> : <MdOutlineKeyboardArrowRight size={20} />}
                            </button>
                            <button type="button" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} aria-label={t("Last page")} className="p-1.5 rounded-lg text-cell-secondary hover:text-primary-base hover:bg-status-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base">
                                {isRTL ? <MdOutlineKeyboardDoubleArrowLeft size={20} /> : <MdOutlineKeyboardDoubleArrowRight size={20} />}
                            </button>
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
                </>
                )}
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
    onSelectionChange: PropTypes.func,
};

export default Table;