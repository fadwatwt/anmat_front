import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateTask, fetchTasks } from "../../../redux/tasks/tasksAPI";
import PropTypes from "prop-types";
import Modal from "../../../components/Modal/Modal.jsx";
import InputAndLabel from "../../../components/Form/InputAndLabel.jsx";
import DefaultSelect from "../../../components/Form/DefaultSelect.jsx";
import { fetchDepartments } from "../../../redux/departments/departmentAPI";
import { fetchEmployees } from "../../../redux/employees/employeeAPI";
import MultiSelect from "../../../components/Form/MultiSelect.jsx";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  department: Yup.string().required("Department is required"),
  assignedTo: Yup.array().min(1, "At least one assignee required"),
  manager: Yup.string().required("Manager is required"),
  dueDate: Yup.date().required("Due date is required"),
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
    title: "",
    description: "",
    department: "",
    assignedTo: [],
    manager: "",
    dueDate: "",
    status: "Active",
    priority: "Medium",
    dependentDepartment: null,
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
        ...task,
        title: task.title || "",
        description: task.description || "",
        department: task.department?._id || "",
        manager: task.manager?._id || "",
        assignedTo: task.assignedTo?.map((e) => e._id) || [],
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        status: task.status || "Active",
        priority: task.priority || "Medium",
        dependentDepartment: task.dependentDepartment?._id || "",
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
          ...values,
          dependentDepartment: values.dependentDepartment || null, // Convert empty string to null
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={"Update Task"}
      onClick={formik.handleSubmit}
      className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"}
      title={"Edit Task"}
    >
      <div className="px-1 flex flex-col gap-4">
        <InputAndLabel
          title="Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Task Title"
          error={formik.touched.title && formik.errors.title}
        />

        <DefaultSelect
          title="Department"
          name="department"
          value={formik.values.department}
          onChange={(val) => formik.setFieldValue("department", val)}
          options={departments.map((dep) => ({ id: dep._id, value: dep.name }))}
          error={formik.touched.department && formik.errors.department}
        />

        <MultiSelect
          title="Assigned To"
          multi
          name="assignedTo"
          value={formik.values.assignedTo}
          onChange={(val) => formik.setFieldValue("assignedTo", val)}
          options={employees.map((emp) => ({ id: emp._id, value: emp.name }))}
          error={formik.touched.assignedTo && formik.errors.assignedTo}
        />

        <DefaultSelect
          title="Manager"
          name="manager"
          value={formik.values.manager}
          onChange={(val) => formik.setFieldValue("manager", val)}
          options={employees.map((emp) => ({ id: emp._id, value: emp.name }))}
          error={formik.touched.manager && formik.errors.manager}
        />

        {/* Standard Date Picker */}
        <InputAndLabel
          title="Due Date"
          type="date"
          name="dueDate"
          value={formik.values.dueDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.dueDate && formik.errors.dueDate}
        />

        <DefaultSelect
          title="Status"
          name="status"
          value={formik.values.status}
          onChange={(val) => formik.setFieldValue("status", val)}
          options={[
            { id: "Active", value: "Active" },
            { id: "Inactive", value: "Inactive" },
            { id: "Delayed", value: "Delayed" },
            { id: "Scheduled", value: "Scheduled" },
          ]}
          error={formik.touched.status && formik.errors.status}
        />

        <DefaultSelect
          title="Priority"
          name="priority"
          value={formik.values.priority}
          onChange={(val) => formik.setFieldValue("priority", val)}
          options={[
            { id: "Urgent", value: "Urgent" },
            { id: "High", value: "High" },
            { id: "Medium", value: "Medium" },
            { id: "Low", value: "Low" },
          ]}
          error={formik.touched.priority && formik.errors.priority}
        />

        <InputAndLabel
          title="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Task Description"
          error={formik.touched.description && formik.errors.description}
        />
      </div>
    </Modal>
  );
};

EditTaskModal.propTypes = {
  task: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default EditTaskModal;
