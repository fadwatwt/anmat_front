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
import useDropdown from "../../Hooks/useDropdown.js";

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
  isFilter,
}) {
  const { t, i18n } = useTranslation();
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState(rows.map(() => false));
  const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
  const [rowsPerPage, setRowsPerPage] = useState(5); // عدد الصفوف لكل صفحة
  const [dropdownOpen, setDropdownOpen] = useDropdown();

  const totalPages = Math.ceil(rows.length / rowsPerPage); // إجمالي عدد الصفحات

  const handleHeaderCheckboxChange = () => {
    setIsAllSelected((prev) => !prev);
    setSelectedRows((prev) =>
      prev.map((_, index) =>
        index >= (currentPage - 1) * rowsPerPage &&
        index < currentPage * rowsPerPage
          ? !isAllSelected
          : prev[index]
      )
    );
  };

  const handleDropdownToggle = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleRowCheckboxChange = (rowIndex) => {
    const newSelectedRows = [...selectedRows];
    newSelectedRows[rowIndex] = !newSelectedRows[rowIndex];
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
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = rows.slice(startIndex, startIndex + rowsPerPage); // صفوف الصفحة الحالية

  return (
    <div
      className={
        "rounded-lg md:w-full pb-10 dark:bg-gray-800 border border-gary-200 dark:border-gray-700 p-3 flex flex-col gap-4 bg-white " +
        (classContainer ? classContainer : "w-[48rem]")
      }
    >
      {isTitle && (
        <div className={"flex justify-between items-baseline"}>
          <p
            className={
              "text-gray-800 text-start text-sm dark:text-gray-400 w-7/12"
            }
          >
            {t(title)}
          </p>
          <div className={"flex gap-2 w-full justify-end "}>
            <SearchInput />
            <div className={"flex gap-2"}>
              {isFilter && (
                <SelectWithoutLabel
                  title={"Filter by"}
                  className={"w-[94px] h-[36px]"}
                />
              )}
              <button
                className={
                  "flex dark:text-gray-400 text-sm items-baseline p-2  gap-2 rounded-lg border border-gray-200 dark:border-gray-600"
                }
              >
                <TfiImport size={15} />
                {t("Export")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={
          "flex flex-col gap-5 justify-center dark:bg-gray-800 w-full dark:text-gray-400"
        }
      >
        <table
          className={" relative table-auto w-full" + className}
          style={{ borderSpacing: "0 1px" }}
        >
          <thead>
            <tr className="bg-weak-100 dark:bg-gray-800">
              {isCheckInput && (
                <th className="px-1 pt-1 w-5 rounded-tl-lg rounded-bl-lg dark:bg-gray-900">
                  <input
                    className={"checkbox-custom"}
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleHeaderCheckboxChange}
                  />
                </th>
              )}
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="p-2 font-normal text-start text-sm dark:bg-gray-900"
                  style={{
                    width: header.width || "auto",
                    borderTopRightRadius:
                      index === headers.length - 1 ? "8px" : "0px",
                    borderBottomRightRadius:
                      index === headers.length - 1 ? "8px" : "0px",
                  }}
                >
                  {t(header.label)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, rowIndex) => (
              <tr
                key={rowIndex + startIndex}
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
                      checked={selectedRows[rowIndex + startIndex]}
                      onChange={() =>
                        handleRowCheckboxChange(rowIndex + startIndex)
                      }
                    />
                  </td>
                )}

                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-2 text-sm py-6 text-start max-w-10 sm:max-w-24 text-nowrap truncate overflow-hidden"
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
                      onClick={() => handleDropdownToggle(rowIndex)}
                    />
                    {dropdownOpen === rowIndex && (
                      <ActionsBtns
                        handleEdit={() => handelEdit(rowIndex)}
                        handleDelete={() => handelDelete(rowIndex)}
                        className={`${
                          i18n.language === "ar" ? "left-0" : "right-0"
                        }`}
                      />
                    )}
                  </td>
                )}
              </tr>
            ))}
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
};

export default Table;
