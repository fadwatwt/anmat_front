"use client"
import TaskMainInfo from "./SubComponents/TaskMainInfo.jsx";
import PropTypes from "prop-types";

function ProjectInfoForm({ project, values, handleChange, setFieldValue }) {
  return (
    <div className={"w-full"}>
      <TaskMainInfo
        values={values}
        handleChange={handleChange}
        setFieldValue={setFieldValue}
        type={"project"}
        task={project}
      />
    </div>
  );
}

ProjectInfoForm.propTypes = {
  project: PropTypes.object,
  values: PropTypes.object,
  handelChange: PropTypes.func,
};

export default ProjectInfoForm;
