import { useFormik } from "formik";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import DefaultSelect from "@/components/Form/DefaultSelect.jsx";
import FileUpload from "@/components/Form/FileUpload.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import Priority from "../../TableInfo/Priority.jsx";
import Status from "../../TableInfo/Status.jsx";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function TaskMainInfo({ task, type = "task", values, handleChange, setFieldValue, optionsManager: propsOptionsManager, optionsDepartment: propsOptionsDepartment }) {
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
  const mockOptionsManager = users.map((user) => ({
    id: user.id,
    value: user.name,
  }));

  const optionsManager = propsOptionsManager || mockOptionsManager;

  // Department options
  const mockOptionsDepartment = [
    { id: "", value: `${t("Select Department")}...` },
    { id: "1", value: "UI / UX Design" },
    { id: "2", value: "Design" },
  ];

  const optionsDepartment = propsOptionsDepartment || mockOptionsDepartment;

  // Status options
  const optionsStatus = [
    { id: "1", element: <Status type={"Scheduled"} title={"Scheduled"} /> },
    { id: "2", element: <Status type={"Delayed"} title={"Delayed"} /> },
    { id: "3", element: <Status type={"Inactive"} title={"Inactive"} /> },
    { id: "4", element: <Status type={"Active"} title={"Active"} /> },
  ];

  // Rating options
  const optionsRating = [
    { id: "1", value: "1" },
    { id: "2", value: "2" },
    { id: "3", value: "3" },
    { id: "4", value: "4" },
    { id: "5", value: "5" },
  ];

  // Projects options (Mock)
  const optionsProjects = [
    { id: "1", value: "Project A" },
    { id: "2", value: "Project B" },
  ];

  // Project Templates options (Mock)
  const optionsTemplates = [
    { id: "1", value: "Template A" },
    { id: "2", value: "Template B" },
  ];

  console.log(values)

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

  // Formik
  const formik = useFormik({
    initialValues: {
      taskName: task?.name || "",
      assignedProject: task?.assignedProject || "",
      projectTemplate: task?.projectTemplate || "",
      description: task?.description || "",
      department: task?.department || "",
      assignedEmployee: task?.assignedTo?._id || "",
      assignedDate: task?.startDate
        ? new Date(task.startDate).toISOString().split("T")[0]
        : "",
      dueDate: task?.endDate
        ? new Date(task.endDate).toISOString().split("T")[0]
        : "",
      startedAt: task?.startedAt || "",
      endedAt: task?.endedAt || "",
      status: task?.status || optionsStatus[0].id,
      priority: task?.priority || optionsPriority[0].id,
      dependentDepartment: task?.dependentDepartment || "",
      rating: task?.rating || "",
      comment: task?.comment || "",
    },
    onSubmit: (values) => {
      console.log("Submitted Values:", values);
    },
  });

  const valuesInputs = values || formik.values;
  const handleChangeFunc = handleChange || formik.handleChange;

  // Handle dropdown selection
  const handleSelectChange = (name, value) => {
    if (setFieldValue) {
      setFieldValue(name, value);
    } else {
      formik.setFieldValue(name, value);
    }
  };

  return (
    <div
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
      <InputAndLabel
        value={valuesInputs.taskName}
        onChange={handleChangeFunc}
        name="taskName"
        type="text"
        title={type === "task" ? "Task Name" : "Project Name"}
        placeholder="Task Name..."
      />

      {/* Assigned Project */}
      <DefaultSelect
        title="Assigned Project"
        options={optionsProjects}
        defaultValue={valuesInputs.assignedProject}
        onChange={(value) => handleSelectChange("assignedProject", value)}
        name="assignedProject"
        placeholder="Select project..."
      />

      {/* Project Template */}
      <DefaultSelect
        title="Project Template"
        options={optionsTemplates}
        defaultValue={valuesInputs.projectTemplate}
        onChange={(value) => handleSelectChange("projectTemplate", value)}
        name="projectTemplate"
        placeholder="Select project..."
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
        placeholder="Select Department..."
      />

      {/* Assigned Employee */}
      <DefaultSelect
        title="Assigned Employee *"
        options={optionsManager}
        defaultValue={valuesInputs.assignedEmployee}
        onChange={(value) => handleSelectChange("assignedEmployee", value)}
        name="assignedEmployee"
        placeholder="Select Employees..."
      />


      {/* Assigned Date & Due Date */}
      <div className={"flex items-center justify-center gap-2"}>
        <DateInput
          value={valuesInputs.assignedDate}
          onChange={handleChangeFunc}
          name="assignedDate"
          title="Assigned Date *"
          className={"flex-1"}
          placeholder="DD / MM / YYYY"
        />
        <DateInput
          value={valuesInputs.dueDate}
          onChange={handleChangeFunc}
          name="dueDate"
          title="Due Date *"
          className={"flex-1"}
          placeholder="DD / MM / YYYY"
        />
      </div>

      {/* Started At & Ended At */}
      <div className={"flex items-center justify-center gap-2"}>
        <DateInput
          value={valuesInputs.startedAt}
          onChange={handleChangeFunc}
          name="startedAt"
          title="Started at *"
          className={"flex-1"}
          placeholder="DD / MM / YYYY"
        />
        <DateInput
          value={valuesInputs.endedAt}
          onChange={handleChangeFunc}
          name="endedAt"
          title="Ended At *"
          className={"flex-1"}
          placeholder="DD / MM / YYYY"
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
            placeholder="Select Status..."
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
            placeholder="Select Priority..."
          />
        </div>
      </div>

      {/* Dependent Department */}
      <DefaultSelect
        title={"Department Department"}
        defaultValue={valuesInputs.dependentDepartment}
        onChange={(value) => handleSelectChange("dependentDepartment", value)}
        name="dependentDepartment"
        options={optionsDepartment}
        placeholder="Select Department.."
      />

      {/* Rating */}
      <DefaultSelect
        title="Rating"
        options={optionsRating}
        defaultValue={valuesInputs.rating}
        onChange={(value) => handleSelectChange("rating", value)}
        name="rating"
        placeholder="Select rate.."
      />

      {/* File Upload */}
      <FileUpload />

      {/* Comment */}
      <TextAreaWithLabel
        value={valuesInputs.comment}
        onChange={handleChangeFunc}
        name="comment"
        title="Comment"
        placeholder="Add a comment"
      />
    </div>
  );
}

TaskMainInfo.propTypes = {
  task: PropTypes.object,
  type: PropTypes.string,
  values: PropTypes.array,
  handleChange: PropTypes.func,
};

export default TaskMainInfo;
