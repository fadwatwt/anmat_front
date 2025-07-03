import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import StepsComponent from "@/app/dashboard/projects/_components/CreateProjectForm/StepsComponent.jsx";
import ProjectInfoForm from "@/app/dashboard/projects/_components/CreateProjectForm/ProjectInfoForm.jsx";
import CreateTaskForm from "@/app/dashboard/projects/_components/CreateProjectForm/CreateTaskForm.jsx";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProject } from "@/redux/projects/projectSlice";
import { useTranslation } from "react-i18next";

function EditProjectModal({ isOpen, onClose, project }) {
  const dispatch = useDispatch();
  const [editedProject, setEditedProject] = useState(project || {});
  const [currentStep, setCurrentStep] = useState(1);
  const { t } = useTranslation();

  useEffect(() => {
    if (project) {
      setEditedProject(project);
    }
  }, [project]);

  const handleProjectUpdate = (updatedFields) => {
    console.log({ updatedFields });

    setEditedProject((prev) => ({
      ...prev,
      ...updatedFields,
      // For nested objects
      assignedTo: updatedFields.manager
        ? {
            _id: updatedFields.manager,
            name: users.find((u) => u.id === updatedFields.manager)?.name,
          }
        : prev.assignedTo,
    }));
  };
  const handleSave = () => {
    // Transform data for API
    const payload = {
      ...editedProject,
      startDate: editedProject.assignedDate,
      endDate: editedProject.dueDate,
      priority: editedProject.priority,
      status: editedProject.status,
    };
    console.log({ payload });

    dispatch(updateProject(payload));
    onClose();
  };

  const steps = [
    {
      title: t("Project Info"),
      content: (
        <ProjectInfoForm
          project={editedProject}
          onUpdate={handleProjectUpdate}
        />
      ),
    },
    ...(editedProject.tasks || []).map((task, index) => ({
      title: `${t("Task")} ${index + 1}`,
      content: (
        <CreateTaskForm
          task={task}
          onUpdate={(updatedTask) => {
            const updatedTasks = [...editedProject.tasks];
            updatedTasks[index] = updatedTask;
            handleProjectUpdate({ tasks: updatedTasks });
          }}
        />
      ),
    })),
  ];

  return (
    <Modal
      className="lg:w-5/12 md:w-10/12 sm:w-8/12 w-11/12"
      isOpen={isOpen}
      onClose={onClose}
      customBtns={
        <CustomBtnEditProjectModal
          currentStep={currentStep}
          totalSteps={steps.length}
          handleNext={() =>
            setCurrentStep((prev) => Math.min(prev + 1, steps.length))
          }
          handleSave={handleSave} // Pass handleSave function
        />
      }
      title={t("Edit project")}
    >
      <StepsComponent
        type="edit"
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
    </Modal>
  );
}

function CustomBtnEditProjectModal({
  currentStep,
  totalSteps,
  handleNext,
  handleSave,
}) {
  const { t } = useTranslation();
  return (
    <div className="w-full flex items-center justify-between pt-3">
      <button
        onClick={handleSave}
        className="bg-primary-base text-sm flex justify-center items-center h-full text-center dark:bg-primary-200 dark:text-black w-40 text-white p-[10px] rounded-[10px]"
      >
        {t("Save")}
      </button>
      {currentStep < totalSteps && (
        <button
          onClick={handleNext}
          className="bg-none text-sm border border-primary-base flex justify-center items-center text-primary-base dark:border-soft-400 dark:text-soft-400 h-full text-center w-40 p-[10px] rounded-[10px]"
        >
          {t("Next")}
        </button>
      )}
    </div>
  );
}

EditProjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  project: PropTypes.object,
};

CustomBtnEditProjectModal.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default EditProjectModal;
