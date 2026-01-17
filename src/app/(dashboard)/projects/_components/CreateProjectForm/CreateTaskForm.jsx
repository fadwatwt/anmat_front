import { useState } from "react";
import TaskMainInfo from "./SubComponents/TaskMainInfo.jsx";
import TaskStage from "./SubComponents/TaskStage.jsx";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function CreateTaskForm({ task, values, handleChange, setFieldValue }) {
  const [taskStageNumber, setTaskStageNumber] = useState([1]);
  const { t } = useTranslation();

  const incrementTaskStage = () => {
    const nextStage = Math.max(...taskStageNumber) + 1;
    setTaskStageNumber([...taskStageNumber, nextStage]);
  };

  const decrementTaskStage = (stage) => {
    const updatedStages = taskStageNumber.filter((number) => number !== stage);
    const reorderedStages = updatedStages.map((_, index) => index + 1);
    setTaskStageNumber(reorderedStages);
  };
  return (
    <div className={"flex flex-col gap-1"}>
      <TaskMainInfo task={task} values={values} handleChange={handleChange} setFieldValue={setFieldValue} />
      <div className={"flex flex-col gap-4"}>
        {taskStageNumber.map((taskStageNumber) => (
          <TaskStage
            key={taskStageNumber}
            handelDelete={decrementTaskStage}
            stageNumber={taskStageNumber}
          />
        ))}

        <button
          className={
            "w-full bg-none text-primary-base text-sm dark:text-primary-200"
          }
          onClick={incrementTaskStage}
        >
          {t("Add Task Stage")}
        </button>
      </div>
    </div>
  );
}

CreateTaskForm.propTypes = {
  task: PropTypes.object,
};

export default CreateTaskForm;
