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
import ElementsSelect from "../../../components/Form/ElementsSelect.jsx";
import UserSelect from "../../../components/Form/UserSelect.jsx";

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
      btnApplyTitle={formik.isSubmitting ? "Updating..." : "Update Task"}
      onClick={formik.handleSubmit}
      btnApplyDisabled={formik.isSubmitting}
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

        <ElementsSelect
            title="Department"
            options={departments.map((dep) => ({
              id: dep._id,
              element: <span>{dep.name}</span>,
            }))}
            onChange={(selected) =>
                formik.setFieldValue("department", selected[0]?.id || "")
            }
            isMultiple={false}
            defaultValue={departments
                .filter((dep) => dep._id === formik.values.department)
                .map((dep) => ({
                  id: dep._id,
                  element: <span>{dep.name}</span>,
                }))}
            placeholder="Select Department"
        />
        {formik.touched.department && formik.errors.department && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.department}
            </p>
        )}

        <UserSelect
            title="Assigned To"
            users={employees}
            onChange={(selectedUsers) => {
              const assignedToIds = selectedUsers.map((user) => user._id);
              formik.setFieldValue("assignedTo", assignedToIds);
            }}
            isMultiSelect={true}
            defaultSelectedUsers={employees.filter((emp) =>
                formik.values.assignedTo.includes(emp._id)
            )}
        />
        {formik.touched.assignedTo && formik.errors.assignedTo && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.assignedTo}
            </p>
        )}
        <div className={"relative flex-1"}>
          <ElementsSelect
              title="Manager"
              options={employees.map((emp) => ({
                id: emp._id,
                element: <span>{emp.name}</span>,
              }))}
              onChange={(selected) =>
                  formik.setFieldValue("manager", selected[0]?.id || "")
              }
              isMultiple={false}
              defaultValue={employees
                  .filter((emp) => emp._id === formik.values.manager)
                  .map((emp) => ({
                    id: emp._id,
                    element: <span>{emp.name}</span>,
                  }))}
              placeholder="Select Manager"
          />
          {formik.touched.manager && formik.errors.manager && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.manager}</p>
          )}
        </div>

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
          <div className={"relative flex-1"}>
            <ElementsSelect
                title="Status"
                options={[
                  {id: "Active", element: <span>Active</span>},
                  {id: "Inactive", element: <span>Inactive</span>},
                  {id: "Delayed", element: <span>Delayed</span>},
                  {id: "Scheduled", element: <span>Scheduled</span>},
                ]}
                onChange={(selected) =>
                    formik.setFieldValue("status", selected[0]?.id || "")
                }
                isMultiple={false}
                defaultValue={[
                  {
                    id: formik.values.status,
                    element: <span>{formik.values.status}</span>,
                  },
                ]}
                placeholder="Select Status"
            />
          </div>

          {formik.touched.status && formik.errors.status && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.status}</p>
          )}

          <div className={"relative flex-1"}>
            <ElementsSelect
                title="Priority"
                options={[
                  {id: "Urgent", element: <span>Urgent</span>},
                  {id: "High", element: <span>High</span>},
                  {id: "Medium", element: <span>Medium</span>},
                  {id: "Low", element: <span>Low</span>},
                ]}
                onChange={(selected) =>
                    formik.setFieldValue("priority", selected[0]?.id || "")
                }
                isMultiple={false}
                defaultValue={
                  formik.values.priority
                      ? [
                        {
                          id: formik.values.priority,
                          element: <span>{formik.values.priority}</span>,
                        },
                      ]
                      : []
                }
                placeholder="Select Priority"
            />
          </div>

          {formik.touched.priority && formik.errors.priority && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.priority}</p>
          )}

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
