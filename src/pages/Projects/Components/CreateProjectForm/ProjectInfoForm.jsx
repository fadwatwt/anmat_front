import TaskMainInfo from "./SubComponents/TaskMainInfo.jsx";
import PropTypes from "prop-types";

function ProjectInfoForm({ project,values,handelChange }) {
  return (
    <div className={"w-full"}>
      <TaskMainInfo values={values} handleChange={handelChange} type={"project"} task={project && project} />
    </div>
  );
}

ProjectInfoForm.propTypes = {
  project: PropTypes.object,
};

export default ProjectInfoForm;
