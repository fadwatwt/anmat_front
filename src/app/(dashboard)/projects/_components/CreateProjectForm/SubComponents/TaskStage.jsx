import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import PropTypes from "prop-types";
import { RiDeleteBin7Line } from "react-icons/ri";
import Status from "../../TableInfo/Status.jsx";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import DefaultSelect from "@/components/Form/DefaultSelect.jsx";
import { useTranslation } from "react-i18next";

function TaskStage({ stageNumber, index, values, handleChange, setFieldValue, handelDelete }) {
    const { t } = useTranslation()
    const optionsStatus = [
        { id: "open", element: <Status type={"Open"} /> },
        { id: "pending", element: <Status type={"Pending"} /> },
        { id: "in-progress", element: <Status type={"In-Progress"} /> },
        { id: "completed", element: <Status type={"Completed"} /> },
        { id: "rejected", element: <Status type={"Rejected"} /> },
        { id: "cancelled", element: <Status type={"Cancelled"} /> },
    ]

    const baseKey = `stages[${index}]`;

    const handleSelectChange = (name, val) => {
        if (setFieldValue) {
            const valueToSet = Array.isArray(val) ? (val[0]?.id || "") : val;
            setFieldValue(name, valueToSet);
        }
    };

    const getSingleValue = (val, options) => {
        if (!val) return [];
        const found = options.find(o => o.id === val);
        return found ? [found] : [];
    };

    return (
        <div className={"flex flex-col gap-4 max-h-full"}>
            <div className={"flex bg-weak-100 dark:bg-gray-900 justify-between items-center w-full"}>
                <p className={"w-full py-[6px] text-start text-xs dark:text-gray-200"}>{`${t("Task Stage")} (${stageNumber})`}</p>
                {handelDelete && (
                    <RiDeleteBin7Line className={"cursor-pointer text-red-500 mr-2"} onClick={() => handelDelete(index)}
                        size={18} />
                )}
            </div>
            <InputAndLabel
                name={`${baseKey}.name`}
                value={values?.stages?.[index]?.name || ""}
                onChange={handleChange}
                type={"text"}
                title={t("Stage Name")}
                placeholder={t("Stage Name...")}
            />
            <TextAreaWithLabel
                name={`${baseKey}.description`}
                value={values?.stages?.[index]?.description || ""}
                onChange={handleChange}
                title={t("Description")}
                placeholder={t("Placeholder text...")}
            />
            <div className={"flex items-center justify-center gap-2"}>
                <ElementsSelect
                    title={t("Status")}
                    placeholder={t("Select Status...")}
                    options={optionsStatus}
                    classNameContainer={"flex-1"}
                    defaultValue={getSingleValue(values?.stages?.[index]?.status, optionsStatus)}
                    onChange={(val) => handleSelectChange(`${baseKey}.status`, val)}
                />
            </div>
            <div className={"flex items-center justify-center gap-2"}>
                <DateInput
                    name={`${baseKey}.start_date`}
                    value={values?.stages?.[index]?.start_date || ""}
                    onChange={handleChange}
                    title={t("Start Date")}
                    className={"flex-1"}
                    placeholder="DD / MM / YYYY"
                />
                <DateInput
                    name={`${baseKey}.due_date`}
                    value={values?.stages?.[index]?.due_date || ""}
                    onChange={handleChange}
                    title={t("Due Date")}
                    className={"flex-1"}
                    placeholder="DD / MM / YYYY"
                />
            </div>
        </div>
    );
}

TaskStage.propTypes = {
    stageNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    index: PropTypes.number,
    values: PropTypes.object,
    handleChange: PropTypes.func,
    setFieldValue: PropTypes.func,
    handelDelete: PropTypes.func,
}

export default TaskStage;