import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateTask, fetchTasks } from "@/redux/tasks/tasksAPI";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import { fetchDepartments } from "@/redux/departments/departmentAPI";
import { fetchEmployees } from "@/redux/employees/employeeAPI";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import UserSelect from "@/components/Form/UserSelect.jsx";
import TaskMainInfo from "@/app/(dashboard)/projects/_components/CreateProjectForm/SubComponents/TaskMainInfo.jsx";

const validationSchema = Yup.object({
  taskName: Yup.string().required("Title is required"),
  department: Yup.string().required("Department is required"),
  assignedEmployee: Yup.string().required("Assigned Employee is required"),
  dueDate: Yup.date().required("Due date is required"),
  assignedDate: Yup.date().required("Assigned date is required"),
  status: Yup.string().required("Status is required"),
  priority: Yup.string().required("Priority is required"),
  description: Yup.string(),
  dependentDepartment: Yup.string(),
});

const EditTaskModal = ({ task, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employees);
  const { departments } = useSelector((state) => state.departments);

  const [initialValues, setInitialValues] = useState({
    taskName: "",
    description: "",
    department: "",
    assignedEmployee: "",
    assignedDate: "",
    dueDate: "",
    status: "Active",
    priority: "Medium",
    dependentDepartment: "",
    assignedProject: "",
    projectTemplate: "",
    startedAt: "",
    endedAt: "",
    rating: "",
    comment: "",
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDepartments());
      dispatch(fetchEmployees());
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (task && isOpen) {
      setInitialValues({
        taskName: task.title || "",
        description: task.description || "",
        department: task.department?._id || "",
        assignedEmployee: task.assignedTo?.[0]?._id || task.manager?._id || "",
        assignedDate: task.startDate ? new Date(task.startDate).toISOString().split("T")[0] : "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        status: task.status || "Active",
        priority: task.priority || "Medium",
        dependentDepartment: task.dependentDepartment?._id || "",
        // New fields - map if available in task, else empty
        assignedProject: task?.assignedProject || "",
        projectTemplate: task?.projectTemplate || "",
        startedAt: task?.startedAt || "",
        endedAt: task?.endedAt || "",
        rating: task?.rating || "",
        comment: task?.comment || "",
      });
    }
  }, [task, isOpen]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const taskData = {
          title: values.taskName,
          description: values.description,
          department: values.department,
          assignedTo: [values.assignedEmployee], // Wrap in array
          manager: values.assignedEmployee, // Assuming manager is same as assignee or handled by backend, explicitly sending for legacy
          startDate: values.assignedDate,
          dueDate: values.dueDate,
          status: values.status,
          priority: values.priority,
          dependentDepartment: values.dependentDepartment || null,
          // Send new fields
          assignedProject: values.assignedProject,
          projectTemplate: values.projectTemplate,
          startedAt: values.startedAt,
          endedAt: values.endedAt,
          rating: values.rating,
          comment: values.comment,
        };

        await dispatch(updateTask({ id: task._id, taskData })).unwrap();
        dispatch(fetchTasks());
        onClose();
      } catch (error) {
        console.error("Update failed:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const optionsManager = employees.map((user) => ({
    id: user._id,
    value: user.name,
  }));

  const optionsDepartment = departments.map((dep) => ({
    id: dep._id,
    value: dep.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={formik.isSubmitting ? "Updating..." : "Update Task"}
      onClick={formik.handleSubmit}
      btnApplyDisabled={formik.isSubmitting}
      className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"}
      title={"Edit Task"}
    >
      <TaskMainInfo
        task={task}
        values={formik.values}
        handleChange={formik.handleChange}
        setFieldValue={formik.setFieldValue}
        optionsManager={optionsManager}
        optionsDepartment={optionsDepartment}
      />
    </Modal>
  );
};

EditTaskModal.propTypes = {
  task: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default EditTaskModal;
