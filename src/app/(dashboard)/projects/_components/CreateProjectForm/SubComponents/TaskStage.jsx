import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import PropTypes from "prop-types";
import { RiDeleteBin7Line } from "react-icons/ri";
import Status from "../../TableInfo/Status.jsx";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import DefaultSelect from "@/components/Form/DefaultSelect.jsx";
import { useTranslation } from "react-i18next";

function TaskStage({ stageNumber, handelDelete }) {
    const { t } = useTranslation()
    const optionsStatus = [
        { id: "1", element: <Status type={"Active"} title={"Active"} /> },
        { id: "2", element: <Status type={"Inactive"} title={"Inactive"} /> },
        { id: "3", element: <Status type={"Delayed"} title={"Delayed"} /> },
        { id: "4", element: <Status type={"Scheduled"} title={"Scheduled"} /> },
    ]
    const optionsRating = [
        { id: "1", value: "1" },
        { id: "2", value: "2" },
        { id: "3", value: "3" },
        { id: "4", value: "4" },
        { id: "5", value: "5" },
    ]
    return (
        <div className={"flex flex-col gap-4 max-h-full"}>
            <div className={"flex bg-weak-100 dark:bg-gray-900 justify-between items-center w-full"}>
                <p className={"w-full py-[6px] text-start text-xs dark:text-gray-200"}>{`${t("Task Stage")} (${stageNumber})`}</p>
                <RiDeleteBin7Line className={"cursor-pointer text-red-500 mr-2"} onClick={() => handelDelete(stageNumber)}
                    size={18} />
            </div>
            <InputAndLabel type={"text"} title={"Stage Name"} placeholder={"Stage Name..."} />
            <TextAreaWithLabel title={"Description"} placeholder={"Placeholder text..."} />
            <div className={"flex items-center justify-center gap-2"}>
                <ElementsSelect title={"Status"} placeholder={"Select Status..."} options={optionsStatus} classNameContainer={"flex-1"} />
                <DefaultSelect title={"Rating"} placeholder={"Select rate.."} options={optionsRating} classNameContainer={"flex-1"} />
            </div>
            <div className={"flex items-center justify-center gap-2"}>
                <DateInput name={"assignedDate"} title={"Assigned Date"} className={"flex-1"} placeholder="DD / MM / YYYY" />
                <DateInput name={"dueDate"} title={"Due Date"} className={"flex-1"} placeholder="DD / MM / YYYY" />
            </div>
        </div>
    );

}

TaskStage.propTypes = {
    stageNumber: PropTypes.string,
    handelDelete: PropTypes.func,
}

export default TaskStage;