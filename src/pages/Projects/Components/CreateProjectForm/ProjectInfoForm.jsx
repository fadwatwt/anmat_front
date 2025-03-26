import TaskMainInfo from "./SubComponents/TaskMainInfo.jsx";
import PropTypes from "prop-types";

function ProjectInfoForm({ project, values, handelChange }) {
  return (
    <div className={"w-full"}>
      <TaskMainInfo
        handleChange={handelChange}
        type={"project"}
        values={project}
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
