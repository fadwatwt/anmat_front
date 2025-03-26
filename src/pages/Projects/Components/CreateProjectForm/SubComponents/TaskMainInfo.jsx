import { useFormik } from "formik";
import InputAndLabel from "../../../../../components/Form/InputAndLabel.jsx";
import TextAreaWithLabel from "../../../../../components/Form/TextAreaWithLabel.jsx";
import DefaultSelect from "../../../../../components/Form/DefaultSelect.jsx";
import FileUpload from "../../../../../components/Form/FileUpload.jsx";
import DateInput from "../../../../../components/Form/DateInput.jsx";
import ElementsSelect from "../../../../../components/Form/ElementsSelect.jsx";
import Priority from "../../TableInfo/Priority.jsx";
import Status from "../../TableInfo/Status.jsx";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function TaskMainInfo({ task, type = "task", values, handleChange }) {
  console.log({ ...task });

  const { t } = useTranslation();

  // Mock users (replace with actual API data)
  const users = [
    {
      id: "66f15fb144588bfbce5cb808",
      name: "check-permission-admin",
      username: "Admin",
      image: "https://example.com/admin.jpg",
    },
    {
      id: "2",
      name: "Ahmed Khalil",
      username: "Ahmed",
      image: "https://example.com/ahmed.jpg",
    },
  ];

  // Map users to dropdown options
  const optionsManager = users.map((user) => ({
    id: user.id,
    value: user.name,
  }));

  // Department options
  const optionsDepartment = [
    { id: "", value: `${t("Select Department")}...` },
    { id: "1", value: "UI / UX Design" },
    { id: "2", value: "Design" },
  ];

  // Status options
  const optionsStatus = [
    { id: "1", element: <Status type={"Scheduled"} title={"Scheduled"} /> },
    { id: "2", element: <Status type={"Delayed"} title={"Delayed"} /> },
    { id: "3", element: <Status type={"Inactive"} title={"Inactive"} /> },
    { id: "4", element: <Status type={"Active"} title={"Active"} /> },
  ];

  console.log(values);

  // Priority options
  const optionsPriority = [
    {
      id: "1",
      element: (
        <Priority
          type={"Urgent and Important"}
          title={"Urgent and Important"}
        />
      ),
    },
    { id: "2", element: <Priority type={"Urgent"} title={"Urgent"} /> },
    { id: "3", element: <Priority type={"Not Urgent"} title={"Not Urgent"} /> },
    {
      id: "4",
      element: <Priority type={"Not Important"} title={"Not Important"} />,
    },
  ];

  // Formik setup
  const formik = useFormik({
    initialValues: {
      taskName: task?.name || "",
      description: task?.description || "",
      department: task?.department || "",
      manager: task?.assignedTo?._id || "", // Use _id for manager
      assignedDate: task?.startDate
        ? new Date(task.startDate).toISOString().split("T")[0]
        : "",
      dueDate: task?.endDate
        ? new Date(task.endDate).toISOString().split("T")[0]
        : "",
      employees: task?.employees || [],
      status: task?.status || optionsStatus[0].id, // Use status id instead of element
      priority: task?.priority || optionsPriority[0].id, // Use priority id instead of element
      dependentDepartment: task?.dependentDepartment || "",
    },
    onSubmit: (values) => {
      console.log("Submitted Values:", values);
    },
  });

  const valuesInputs = values || formik.values;
  const handleChangeFunc = handleChange || formik.handleChange;

  // Handle dropdown selection
  const handleSelectChange = (name, value) => {
    formik.setFieldValue(name, value);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={"flex flex-col gap-4 max-h-full"}
    >
      <p
        className={
          "w-full py-[6px] bg-weak-100 text-start text-xs dark:bg-weak-800 text-weak-800 dark:text-weak-100"
        }
      >
        {t("Task main info")}:
      </p>

      {/* Task Name */}
      {console.log(valuesInputs)}
      <InputAndLabel
        value={
          type === "task" ? valuesInputs.taskName : valuesInputs.projectName
        }
        onChange={handleChangeFunc}
        name="taskName"
        type="text"
        title={type === "task" ? "Task Name" : "Project Name"}
        placeholder="Task Name"
      />

      {/* Description */}
      <TextAreaWithLabel
        value={valuesInputs.description}
        onChange={handleChangeFunc}
        name="description"
        title="Description"
        placeholder="Add a description"
      />

      {/* Department */}
      <DefaultSelect
        title="Department"
        options={optionsDepartment}
        defaultValue={valuesInputs.department}
        onChange={(value) => handleSelectChange("department", value)}
        name="department"
      />

      {/* Manager */}
      <DefaultSelect
        title="Manager"
        options={optionsManager}
        defaultValue={formik.values.manager}
        onChange={(value) => handleSelectChange("manager", value)}
        name="manager"
        classNameContainer={"flex-1"}
      />

      {/* Dates */}
      <div className={"flex items-center justify-center gap-2"}>
        <DateInput
          value={valuesInputs.assignedDate}
          onChange={handleChangeFunc}
          name="assignedDate"
          title="Assigned Date"
          className={"flex-1"}
        />
        <DateInput
          value={valuesInputs.dueDate}
          onChange={handleChangeFunc}
          name="dueDate"
          title="Due Date"
          className={"flex-1"}
        />
      </div>

      {/* Status and Priority */}
      <div className={" relative flex items-center justify-center gap-2"}>
        <div className={"relative flex-1"}>
          <ElementsSelect
            title="Status"
            options={optionsStatus}
            defaultValue={[optionsStatus[0]]} // Pass the selected ID directly
            onChange={(value) => handleSelectChange("status", value)}
            name="status"
            classNameContainer={"w-full"}
          />
        </div>
        <div className={"relative flex-1"}>
          <ElementsSelect
            title="Priority"
            options={optionsPriority}
            defaultValue={valuesInputs.priority} // Pass the selected ID directly
            onChange={(value) => handleSelectChange("priority", value)}
            name="priority"
            classNameContainer={"flex-1"}
          />
        </div>
      </div>

      {/* Dependent Department */}
      <DefaultSelect
        title="Dependent Department"
        defaultValue={valuesInputs.dependentDepartment}
        onChange={(value) => handleSelectChange("dependentDepartment", value)}
        name="dependentDepartment"
        options={optionsDepartment}
      />

      {/* File Upload */}
      <FileUpload />
    </form>
  );
}

TaskMainInfo.propTypes = {
  task: PropTypes.object,
  type: PropTypes.string,
  values: PropTypes.array,
  handleChange: PropTypes.func,
};

export default TaskMainInfo;
