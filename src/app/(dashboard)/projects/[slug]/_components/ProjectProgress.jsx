import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import {translateDate} from "@/functions/Days.js";

function ProjectProgress({ progress, lastUpdate }) {
    const {t} = useTranslation()
    const safeProgress = Math.min(100, Math.max(0, Number(progress) || 0));
    return (
        <div className="flex flex-col items-start rounded-2xl border border-status-border p-4">
            <div className="flex w-full items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-cell-primary">{t("Project Progress")}</h4>
                <span className="text-sm font-bold text-primary-base">{safeProgress}%</span>
            </div>
            <div className="relative w-full h-2.5 bg-status-bg rounded-full mt-3 overflow-hidden">
                <div
                    className="absolute top-0 start-0 h-full bg-gradient-to-r from-primary-base to-cyan-500 rounded-full transition-[width] duration-500"
                    style={{ width: `${safeProgress}%` }}
                ></div>
            </div>
            {lastUpdate && <p className="text-cell-secondary text-xs mt-2">{t("Last update")}: {translateDate(lastUpdate)}</p>}
        </div>
    );
}
ProjectProgress.propTypes = {
    progress:PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lastUpdate:PropTypes.string
}

export default ProjectProgress;
