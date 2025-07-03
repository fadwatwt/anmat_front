import PropTypes from "prop-types";
import { useState } from "react";
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
  title,
  classContainer,
  className,
  headers,
  rows,
  isTitle = true,
  isActions,
  isCheckInput = true,
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
  classNameCell,
  viewModalList,
}) {
  const { t, i18n } = useTranslation();
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dropdownOpen, setDropdownOpen] = useDropdown();

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handleHeaderCheckboxChange = () => {
    const newSelectedRows = isAllSelected
      ? []
      : rows
          .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
          .map((_, index) => index + (currentPage - 1) * rowsPerPage);

    setIsAllSelected(!isAllSelected);
    setSelectedRows(newSelectedRows);
  };

  const handleDropdownToggle = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
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
    setSelectedRows([]); // Reset selected rows when changing rows per page
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = rows.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div
      className={
        "rounded-lg md:w-full pb-10 overflow-hidden overflow-x-auto tab-content dark:bg-gray-800 border border-gary-200 dark:border-gray-700 p-3 flex flex-col gap-4 bg-white " +
        (classContainer ? classContainer : "")
      }
    >
      {isTitle && (
        <div className={"flex justify-between items-baseline"}>
          <div className="flex items-center gap-4">
            <p
              className={"text-gray-800 text-start text-sm dark:text-gray-400"}
            >
              {t(title)}
            </p>
            {showControlBar && (
              <div className="flex items-center gap-6">
                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                  {viewModalList?.map((viewModal, index) => (
                    <button
                      key={index}
                      className={`px-6 rounded-md text-sm dark:text-gray-200 text-gray-900 ${
                        viewMode === viewModal.id
                          ? "bg-white text-gray-200 dark:bg-gray-800 shadow-sm"
                          : "bg-transparent"
                      } w-[100px] h-[28px]`}
                      onClick={() => onViewModeChange(viewModal.id)}
                    >
                      {t(viewModal.title)}
                    </button>
                  ))}
                </div>
                <button
                  disabled
                  className="w-[64px] text-gray-200 h-[36px] rounded-[8px] border-[1px] border-gray-200 dark:border-gray-600 opacity-50 pl-[10px] pr-[8px] gap-[4px]"
                >
                  {t("Today")}
                </button>
                <div className="text-gray-600 dark:text-gray-300 text-lg ">
                  {currentDate.toLocaleString("default", { month: "long" })}{" "}
                  {currentDate.getFullYear()}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SearchInput />
            {showDatePicker && (
              <div className={"flex items-center justify-center"}>
                <DateInput
                  className="w-fit justify-start"
                  classNameLabel={""}
                  classNameInput={"p-2"}
                  id="date-picker"
                  name="selectedDate"
                  value={selectedDate}
                />
              </div>
            )}
            {showStatusFilter && (
              <SelectWithoutLabel
                options={
                  statusOptions.length ? statusOptions : defaultStatusOptions
                }
                value={selectedStatus}
                onChange={onStatusChange}
                placeholder={t("Select Status")}
                className="w-fit"
              />
            )}
            {showListOfDepartments && (
              <SelectWithoutLabel
                className={"w-32"}
                options={departments}
                value={selectedDepartment}
                onChange={onDepartmentChange}
                placeholder={t("Select Department")}
              />
            )}
            <button className="flex dark:text-gray-400 text-sm items-baseline p-2 gap-2 rounded-lg border border-gray-200 dark:border-gray-600">
              <TfiImport size={15} />
              {t("Export")}
            </button>
          </div>
        </div>
      )}
      <div
        className={
          "flex flex-col min-w-[48rem] gap-5 justify-center dark:bg-gray-800 w-full dark:text-gray-400"
        }
      >
        <table
          className={"relative table-auto w-full " + className}
          style={{ borderSpacing: "0 1px" }}
        >
          <thead>
            <tr className="bg-weak-100 dark:bg-gray-800">
              {isCheckInput && (
                <th className="px-1 pt-1 w-5 rounded-tl-lg rounded-bl-lg dark:bg-gray-900">
                  <input
                    className="checkbox-custom"
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleHeaderCheckboxChange}
                  />
                </th>
              )}
              {headers?.map((header, index) => (
                <th
                  key={index}
                  className="p-2 text-start text-sm font-normal dark:bg-gray-900 dark:text-gray-300 "
                  style={{
                    width: header.width || "auto",
                    borderTopRightRadius:
                      index === headers.length - 1 ? "8px" : "0px",
                    borderBottomRightRadius:
                      index === headers.length - 1 ? "8px" : "0px",
                  }}
                >
                  {typeof header.label === "string"
                    ? t(header.label)
                    : header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows?.map((row, rowIndex) => {
              const actualRowIndex = rowIndex + startIndex; // Calculate the actual index of the row
              return (
                <tr
                  key={actualRowIndex}
                  className="hover:bg-gray-100 w-full dark:hover:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
                >
                  {isCheckInput && (
                    <td
                      className="px-1 py-6 w-2 "
                      style={{ borderBottomLeftRadius: "8px" }}
                    >
                      <input
                        className={"checkbox-custom"}
                        type="checkbox"
                        checked={selectedRows.includes(actualRowIndex)}
                        onChange={() => handleRowCheckboxChange(actualRowIndex)}
                      />
                    </td>
                  )}
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={
                        "text-sm text-start max-w-10 sm:max-w-24 text-nowrap truncate overflow-hidden dark:text-gray-300 " +
                        (classNameCell ? classNameCell : "px-2 py-6")
                      }
                      style={{
                        borderBottomRightRadius:
                          cellIndex === row.length - 1 ? "8px" : "",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                  {isActions && (
                    <td className={"dropdown-container"}>
                      <PiDotsThreeVerticalBold
                        className="cursor-pointer"
                        onClick={() => handleDropdownToggle(actualRowIndex)}
                      />
                      {dropdownOpen === actualRowIndex && (
                        <ActionsBtns
                          handleEdit={() => handelEdit(actualRowIndex)}
                          handleDelete={() => handelDelete(actualRowIndex)}
                          className={`${
                            i18n.language === "ar" ? "left-0" : "right-0"
                          }`}
                        />
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={"pagination flex items-center justify-between"}>
          <p className={"dark:text-gray-400 text-sm"}>
            {t("Page")} {currentPage} {t("of")} {totalPages}
          </p>
          <div className={"flex gap-5 items-center"}>
            <MdOutlineKeyboardDoubleArrowLeft
              onClick={() => handlePageChange(1)}
              className="cursor-pointer dark:text-gray-400"
            />
            <MdOutlineKeyboardArrowLeft
              onClick={() => handlePageChange(currentPage - 1)}
              className="cursor-pointer dark:text-gray-400"
            />
            <div className={"flex pages-numbers gap-1 text-sm"}>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 border rounded-lg dark:border-gray-700 dark:text-gray-400 ${
                    currentPage === index + 1
                      ? "bg-primary-100 dark:text-gray-800"
                      : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <MdOutlineKeyboardArrowRight
              onClick={() => handlePageChange(currentPage + 1)}
              className="cursor-pointer dark:text-gray-400"
            />
            <MdOutlineKeyboardDoubleArrowRight
              onClick={() => handlePageChange(totalPages)}
              className="cursor-pointer dark:text-gray-400"
            />
          </div>
          <div
            className={
              "flex rounded-lg border border-gray-300 dark:border-gray-700 dark:text-gray-400 px-2 py-1 items-center"
            }
          >
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="bg-transparent outline-none cursor-pointer"
            >
              {[5, 10, 15, 20].map((value) => (
                <option
                  className={"dark:bg-gray-800 dark:text-gray-400 text-sm"}
                  key={value}
                  value={value}
                >
                  {value}/{t("page")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

Table.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  classContainer: PropTypes.string,
  isActions: PropTypes.bool,
  handelEdit: PropTypes.func,
  handelDelete: PropTypes.func,
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      width: PropTypes.string,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.array).isRequired,
  isFilter: PropTypes.bool,
  isCheckInput: PropTypes.bool,
  isTitle: PropTypes.bool,
  showControlBar: PropTypes.bool,
  viewMode: PropTypes.oneOf(["week", "month"]),
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
};

export default Table;