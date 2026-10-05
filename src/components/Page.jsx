import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

function Page({
  children,
  title,
  isTitle = true,
  isBtn,
  btnOnClick,
  btnTitle,
  className,
  isBreadcrumbs,
  breadcrumbs,
  isNavs,
  otherHeaderActions = null
}) {
  const { t } = useTranslation();
  return (
    <div
      className={
        "tab-content bg-main " +
        (className
          ? className
          : "flex flex-col gap-4 box-border mx-auto py-5 md:px-10 px-3")
      }
    >
      {isTitle && (
        <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-2 w-full">
          <div className="title-page text-page-title text-start flex-1 min-w-0 py-4 text-base sm:text-lg md:text-xl truncate">
            {t(title)}
          </div>

          {isNavs && (
            <div className="ml-auto flex items-center text-sm md:text-base text-cell-secondary font-medium whitespace-nowrap px-2">
              {t("Dashboard / Notifications")}
            </div>
          )}

          {isBtn && (
            <div>
              <button
                onClick={btnOnClick}
                className="bg-primary-base hover:bg-primary-600 flex gap-1.5 items-center px-4 py-2.5 rounded-xl text-sm font-bold text-white active:scale-[0.98] transition-all shadow-lg shadow-primary-500/20 whitespace-nowrap"
              >
                <FiPlus className="text-white text-md" />
                <span className="text-white text-sm text-nowrap">
                  {t(btnTitle)}
                </span>
              </button>
            </div>
          )}

          {
            otherHeaderActions && <>{otherHeaderActions}</>
          }

          {isBreadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
        </div>
      )}
      {children}
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  isBtn: PropTypes.bool,
  isTitle: PropTypes.bool,
  isBreadcrumbs: PropTypes.bool,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      path: PropTypes.string,
    })
  ),
  btnTitle: PropTypes.string,
  className: PropTypes.string,
  btnOnClick: PropTypes.func,
  isNavs: PropTypes.bool,
  otherHeaderActions: PropTypes.node
};

export default Page;
