import {MdCheckCircle} from "react-icons/md";
import PropTypes from "prop-types";
import {FiClock} from "react-icons/fi";
import {useTranslation} from "react-i18next";

function StateOfTask({type,timeLate}) {
    const {t} = useTranslation()
    switch (type){
        case "Delayed":
            return (
                <div className={"flex items-center rounded-full py-0.5 px-1 gap-0.5 bg-green-50"}>
                    <MdCheckCircle className={"text-green-700"} size={12} />
                    <p className={"text-green-700 text-[11px]"}>{t("Ahead Of deadline")}</p>
                </div>
            );
        case "late":
            return (
                <div className={"flex items-baseline rounded-full py-0.5 px-1 gap-0.5 bg-red-50"}>
                    <div className={"self-center"}>
                        <FiClock  className={"text-red-700"} size={12}/>
                    </div>
                    <p className={"text-red-700 text-[11px]"}>{timeLate}</p>
                </div>
            )
    }

}

StateOfTask.propTypes = {
    type: PropTypes.string,
    timeLate: PropTypes.string
}

export default StateOfTask;