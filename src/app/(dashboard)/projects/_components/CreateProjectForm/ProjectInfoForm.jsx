"use client"
import TaskMainInfo from "./SubComponents/TaskMainInfo.jsx";
import PropTypes from "prop-types";

function ProjectInfoForm({ project, values, handleChange, handleBlur, setFieldValue, errors, touched }) {
  return (
    <div className={"w-full"}>
      <TaskMainInfo
        values={values}
        handleChange={handleChange}
        setFieldValue={setFieldValue}
        handleBlur={handleBlur}
        errors={errors}
        touched={touched}
        type={"project"}
        task={project}
      />
    </div>
  );
}

ProjectInfoForm.propTypes = {
  project: PropTypes.object,
  values: PropTypes.object,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  setFieldValue: PropTypes.func,
  errors: PropTypes.object,
  touched: PropTypes.object,
};

export default ProjectInfoForm;
