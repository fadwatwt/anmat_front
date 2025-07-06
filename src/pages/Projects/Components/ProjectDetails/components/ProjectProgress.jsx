import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import {translateDate} from "../../../../../functions/Days.js";

function ProjectProgress({ progress, lastUpdate }) {
    const {t} = useTranslation()
    return (
        <div className="flex flex-col items-start">
            <h4 className="text-sm dark:text-gray-200">{t("Project Progress")}:</h4>
            <div className="relative w-full h-2 bg-gray-300 rounded-full mt-2">
                <div
                    className="absolute top-0 start-0 h-full bg-green-600 dark:bg-green-success rounded-full"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-sub-500 dark:text-sub-300 text-xs mt-2">{t("Last update")}: {translateDate(lastUpdate)}</p>
        </div>
    );
}
ProjectProgress.propTypes = {
    progress:PropTypes.string,
    lastUpdate:PropTypes.string
}

export default ProjectProgress;
