// EditProjectModal.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../components/Modal/Modal.jsx";
import StepsComponent from "../Components/CreateProjectForm/StepsComponent.jsx";
import ProjectInfoForm from "../Components/CreateProjectForm/ProjectInfoForm.jsx";
import CreateTaskForm from "../Components/CreateProjectForm/CreateTaskForm.jsx";
import { useTranslation } from "react-i18next";
import { fetchEmployees } from "../../../redux/employees/employeeAPI.js";

function EditProjectModal({ isOpen, onClose, project, onUpdateProject }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [editedProject, setEditedProject] = useState(project);
  const [currentStep, setCurrentStep] = useState(1);
  const { employees, loading, error } = useSelector((state) => state.employees);

  useEffect(() => {
    if (project) {
      setEditedProject(project);
    }
  }, [project]);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);
  const handleProjectUpdate = (updatedFields) => {
    setEditedProject((prev) => ({
      ...prev,
      ...updatedFields,
      manager: employees.find((u) => u._id === updatedFields.managerId),
    }));
  };

  const handleTaskUpdate = (taskIndex, updatedTask) => {
    const updatedTasks = editedProject.tasks.map((task, index) =>
      index === taskIndex ? { ...task, ...updatedTask } : task
    );
    handleProjectUpdate({ tasks: updatedTasks });
  };

  const handleAddTask = () => {
    const newTask = {
      name: t("New Task"),
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: new Date().toISOString(),
      assignedTo: "",
    };
    handleProjectUpdate({ tasks: [...editedProject.tasks, newTask] });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...editedProject,
        managerId: editedProject.manager?._id,
        dueDate: editedProject.dueDate,
        tasks: editedProject.tasks.map((task) => ({
          ...task,
          assignedToId: task.assignedTo?._id,
        })),
      };

      await onUpdateProject(payload);
      onClose();
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const steps = [
    {
      title: t("Project Info"),
      content: (
        <ProjectInfoForm
          project={project}
          employees={employees}
          onChange={handleProjectUpdate}
        />
      ),
    },
    ...editedProject.tasks.map((task, index) => ({
      title: `${t("Task")} ${index + 1}`,
      content: (
        <CreateTaskForm
          task={task}
          employees={employees}
          onChange={(updatedTask) => handleTaskUpdate(index, updatedTask)}
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
        <div className="w-full flex items-center justify-between pt-3">
          <button
            onClick={handleSave}
            className="bg-primary-base text-sm flex justify-center items-center h-full text-center dark:bg-primary-200 dark:text-black w-40 text-white p-[10px] rounded-[10px]"
          >
            {t("Save")}
          </button>
          {currentStep < steps.length && (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="bg-none text-sm border border-primary-base flex justify-center items-center text-primary-base dark:border-soft-400 dark:text-soft-400 h-full text-center w-40 p-[10px] rounded-[10px]"
            >
              {t("Next")}
            </button>
          )}
        </div>
      }
      title={t("Edit project")}
    >
      <StepsComponent
        type="edit"
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onAddTask={handleAddTask}
      />
    </Modal>
  );
}

export default EditProjectModal;
