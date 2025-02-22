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
}) {
  const { t } = useTranslation();
  return (
    <div
      className={
        "max-h-full h-[calc(100vh)] overflow-hidden overflow-x-auto tab-content dark:bg-gray-900 " +
        (className
          ? className
          : "flex flex-col gap-4 box-border mx-auto py-5 md:px-10 px-3")
      }
    >
      {isTitle && (
        <div className="flex justify-between items-center w-full">
          <div className="title-page dark:text-white text-start w-full py-4 text-base sm:text-lg md:text-xl text-gray-600">
            {t(title)}
          </div>

          {isNavs && (
            <div className="ml-auto flex items-center text-sm md:text-base text-gray-500 font-medium whitespace-nowrap px-2">
              Dashboard / Notifications
            </div>
          )}

          {isBtn && (
            <div>
              <button
                onClick={btnOnClick}
                className="bg-primary-base dark:bg-primary-200 flex gap-1 items-center p-[10px] rounded-[10px]"
              >
                <FiPlus className="text-white text-md dark:text-black" />
                <span className="text-white text-md text-nowrap dark:text-black">
                  {t(btnTitle)}
                </span>
              </button>
            </div>
          )}

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
};

export default Page;
