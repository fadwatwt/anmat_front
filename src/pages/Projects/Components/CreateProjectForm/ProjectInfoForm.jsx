import TaskMainInfo from "./SubComponents/TaskMainInfo.jsx";
import PropTypes from "prop-types";

function ProjectInfoForm({ project }) {
  return (
    <div className={"w-full"}>
      <TaskMainInfo type={"project"} task={project && project} />
    </div>
  );
}

ProjectInfoForm.propTypes = {
  project: PropTypes.object,
};

export default ProjectInfoForm;
