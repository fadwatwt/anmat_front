import { useState } from "react";
import TaskMainInfo from "./SubComponents/TaskMainInfo.jsx";
import TaskStage from "./SubComponents/TaskStage.jsx";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function CreateTaskForm({ task, type = "project", values, handleChange, setFieldValue }) {
  const { t } = useTranslation();

  const handleAddStage = () => {
    const currentStages = values?.stages || [];
    setFieldValue("stages", [...currentStages, { name: "", description: "", status: "pending", start_date: "", due_date: "" }]);
  };

  const handleDeleteStage = (index) => {
    const currentStages = values?.stages || [];
    const updatedStages = currentStages.filter((_, i) => i !== index);
    setFieldValue("stages", updatedStages);
  };

  const stages = values?.stages || [];

  return (
    <div className={"flex flex-col gap-1"}>
      <TaskMainInfo task={task} type={type} values={values} handleChange={handleChange} setFieldValue={setFieldValue} />
      <div className={"flex flex-col gap-4"}>
        {stages.map((stage, index) => (
          <TaskStage
            key={index}
            index={index}
            stageNumber={index + 1}
            values={values}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
            handelDelete={handleDeleteStage}
          />
        ))}

        <button
          type="button"
          className={
            "w-full bg-none text-primary-base text-sm dark:text-primary-200 mt-2"
          }
          onClick={handleAddStage}
        >
          {t("Add Task Stage")}
        </button>
      </div>
    </div>
  );
}

CreateTaskForm.propTypes = {
  task: PropTypes.object,
  type: PropTypes.string,
  values: PropTypes.object,
  handleChange: PropTypes.func,
  setFieldValue: PropTypes.func,
};

export default CreateTaskForm;
