import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import StepsComponent from "@/app/(dashboard)/projects/_components/CreateProjectForm/StepsComponent.jsx";
import ProjectInfoForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/ProjectInfoForm.jsx";
import CreateTaskForm from "@/app/(dashboard)/projects/_components/CreateProjectForm/CreateTaskForm.jsx";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateSubscriberProjectMutation } from "@/redux/projects/subscriberProjectsApi";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";

function EditProjectModal({ isOpen, onClose, project }) {
  const { t } = useTranslation();
  const [updateProject, { isLoading }] = useUpdateSubscriberProjectMutation();
  const [currentStep, setCurrentStep] = useState(1);
  const formikRef = useRef(null);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: null, message: "" });
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  const formatDate = (date) => {
    if (!date) return "";
    return date.split('T')[0];
  };

  const initialValues = {
    name: project?.name || "",
    description: project?.description || "",
    manager_id: project?.manager_id?._id || project?.manager_id || project?.manager?._id || "",
    department_id: project?.department_id?._id || project?.department_id || project?.department?._id || "",
    assignees_ids: project?.assignees?.map(a => ({
      id: a.user_id || a._id,
      name: a.name,
      image: a.imageProfile || a.avatar
    })) || project?.assignees_ids?.map(id => ({ id, name: id })) || [],
    start_date: formatDate(project?.start_date),
    due_date: formatDate(project?.due_date),
    started_in: formatDate(project?.started_in),
    finished_in: formatDate(project?.finished_in),
    progress: project?.progress ?? 0,
    status: project?.status || "open",
  };

  const handleUpdate = (values) => {
    setPendingValues(values);
    setIsApprovalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsApprovalOpen(false);
    if (!pendingValues) return;

    try {
      const payload = {
        name: pendingValues.name,
        description: pendingValues.description,
        manager_id: pendingValues.manager_id || undefined,
        department_id: pendingValues.department_id || undefined,
        assignees_ids: pendingValues.assignees_ids?.map(tag => tag.id) || [],
        start_date: pendingValues.start_date ? new Date(pendingValues.start_date).toISOString() : undefined,
        due_date: pendingValues.due_date ? new Date(pendingValues.due_date).toISOString() : undefined,
        started_in: pendingValues.started_in ? new Date(pendingValues.started_in).toISOString() : undefined,
        finished_in: pendingValues.finished_in ? new Date(pendingValues.finished_in).toISOString() : undefined,
        progress: Number(pendingValues.progress) || 0,
        status: pendingValues.status || "open",
      };

      const response = await updateProject({ id: project?._id || project?.id, data: payload }).unwrap();
      setApiResponse({
        isOpen: true,
        status: "success",
        message: response?.message || t("Project updated successfully"),
      });
      setTimeout(() => {
        onClose();
        setPendingValues(null);
      }, 1500);
    } catch (error) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: error?.data?.message || t("Failed to update project"),
      });
    }
  };

  const handleSave = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const steps = [
    {
      title: t("Project Info"),
      content: <ProjectInfoForm />,
    },
    ...(project?.tasks || []).map((task, index) => ({
      title: `${t("Task")} ${index + 1}`,
      content: <CreateTaskForm task={task} />,
    })),
  ];

  const handleCloseAlert = () => {
    setApiResponse({ ...apiResponse, isOpen: false });
  };

  return (
    <>
      <Modal
        className="lg:w-4/12 md:w-10/12 sm:w-8/12 w-11/12"
        isOpen={isOpen}
        onClose={onClose}
        customBtns={
          <CustomBtnEditProjectModal
            currentStep={currentStep}
            totalSteps={steps.length}
            handleNext={() =>
              setCurrentStep((prev) => Math.min(prev + 1, steps.length))
            }
            handleSave={handleSave}
            disabled={isLoading}
          />
        }
        title={t("Edit project")}
      >
        <div className="p-4">
          <StepsComponent
            type="edit"
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            initialValues={initialValues}
            handelCreateProject={handleUpdate}
            formikRef={formikRef}
            disabled={isLoading}
          />
        </div>
      </Modal>

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={handleCloseAlert}
      />

      <ApprovalAlert
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        onConfirm={handleConfirmUpdate}
        title={t("Confirm Project Update")}
        message={t("Are you sure you want to update this project's information?")}
      />
    </>
  );
}

function CustomBtnEditProjectModal({
  currentStep,
  totalSteps,
  handleNext,
  handleSave,
  disabled
}) {
  const { t } = useTranslation();
  return (
    <div className="w-full flex items-center justify-between p-4 pt-0">
      <button
        onClick={handleSave}
        disabled={disabled}
        className="bg-primary-base text-sm flex justify-center items-center h-full text-center dark:bg-primary-200 dark:text-black w-40 text-white p-[10px] rounded-[10px] disabled:opacity-50"
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
  disabled: PropTypes.bool
};

export default EditProjectModal;
