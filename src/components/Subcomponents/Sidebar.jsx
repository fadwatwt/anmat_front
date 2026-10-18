import { MdArrowForwardIos } from "react-icons/md";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

function Sidebar({ list, onClick, activeItem }) {
  const { t } = useTranslation();
  return (
    <div className={"flex flex-col gap-2"}>
      {list.map((item) => (
        <div
          key={item.id}
          onClick={() => onClick(item.id)}
          className={`flex group py-2.5 px-3 cursor-pointer rounded-xl justify-between items-center transition-colors ${
            activeItem === item.id
              ? "bg-primary-base text-white"
              : "text-cell-secondary hover:bg-status-bg hover:text-cell-primary"
          }`}
        >
          <div className={"flex gap-2 items-center"}>
            {item.icon &&
              React.cloneElement(item.icon, {
                size: 24,
                className:
                  activeItem === item.id
                    ? "text-white"
                    : "text-cell-secondary group-hover:text-cell-primary",
              })}
            <p
              className={`text-sm ${
                activeItem === item.id
                  ? "text-white font-semibold"
                  : "text-cell-secondary group-hover:text-cell-primary"
              }`}
            >
              {t(item.title)}
            </p>
          </div>
          {activeItem === item.id ? (
            <div className={"p-1 bg-white/15 text-white rounded-full"}>
              <MdArrowForwardIos size={10} className="rtl:rotate-180" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

Sidebar.propTypes = {
  list: PropTypes.array.isRequired,
  activeItem: PropTypes.string,
  onClick: PropTypes.func,
};

export default Sidebar;
