import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import DefaultSelect from "@/components/Form/DefaultSelect.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";
import { useGetSubscriberProjectsQuery } from "@/redux/projects/subscriberProjectsApi";
import TagInput from "@/components/Form/TagInput";
import { defaultPhoto } from "@/Root.Route";

function TaskMainInfo({ task, type = "project", values, handleChange, setFieldValue }) {
  const { t } = useTranslation();

  // Fetch real employees
  const { data: employeesData, isLoading: isLoadingEmployees } = useGetEmployeesQuery();
  const employees = employeesData || [];

  // Fetch real departments
  const { data: departmentsData, isLoading: isLoadingDepartments } = useGetDepartmentsQuery();
  const departments = departmentsData || [];

  // Fetch real projects (for task creation)
  const { data: projectsData, isLoading: isLoadingProjects } = useGetSubscriberProjectsQuery();
  const projects = projectsData || [];

  // Map employees to dropdown options
  const optionsManager = employees.map((emp) => ({
    id: emp.user_id,
    value: emp.user?.name || emp.name || t("Unknown"),
  }));

  // Map employees to TagInput suggestions (for Project Assignees)
  const employeeSuggestions = employees.map(emp => ({
    id: emp.user_id,
    name: emp.user?.name || emp.name || t("Unknown"),
    image: emp.user?.imageProfile || defaultPhoto
  }));

  // Map projects to dropdown options
  const optionsProjects = projects.map(proj => ({
    id: proj._id,
    value: proj.name
  }));

  // Department options
  const optionsDepartment = departments.map(dept => ({
    id: dept._id,
    value: dept.name
  }));

  // Status options
  const optionsStatus = [
    { id: "open", value: t("Open") },
    { id: "pending", value: t("Pending") },
    { id: "in-progress", value: t("In Progress") },
    { id: "completed", value: t("Completed") },
    { id: "rejected", value: t("Rejected") },
    { id: "cancelled", value: t("Cancelled") },
  ];

  // Priority options
  const optionsPriority = [
    { id: "low", value: t("Low") },
    { id: "medium", value: t("Medium") },
    { id: "high", value: t("High") },
    { id: "urgent", value: t("Urgent") },
  ];

  const handleSelectChange = (name, val) => {
    if (setFieldValue) {
      const valueToSet = Array.isArray(val) ? (val[0]?.id || "") : val;
      setFieldValue(name, valueToSet);
    }
  };

  const getSingleValue = (val, options) => {
    if (!val) return [];
    const found = options.find(o => o.id === val);
    return found ? [found] : [];
  };

  return (
    <div className={"flex flex-col gap-4 max-h-full"}>
      <p className={"w-full py-[6px] bg-weak-100 text-start text-xs dark:bg-weak-800 text-weak-800 dark:text-weak-100"}>
        {type === "project" ? t("Project Main Info") : t("Task Main Info")}:
      </p>

      {/* Project Selection (only for Task) */}
      {type === "task" && (
        <DefaultSelect
          title={t("Project")}
          options={optionsProjects}
          multi={false}
          value={getSingleValue(values?.project_id, optionsProjects)}
          onChange={(val) => handleSelectChange("project_id", val)}
          name="project_id"
          placeholder={isLoadingProjects ? t("Loading...") : t("Select Project...")}
          isRequired
        />
      )}

      {/* Name / Title */}
      <InputAndLabel
        value={type === "project" ? (values?.name || "") : (values?.title || "")}
        onChange={handleChange}
        name={type === "project" ? "name" : "title"}
        type="text"
        title={type === "project" ? t("Project Name") : t("Task Title")}
        placeholder={type === "project" ? t("Project Name") : t("Task Title")}
        isRequired
      />

      {/* Description */}
      <TextAreaWithLabel
        value={values?.description || ""}
        onChange={handleChange}
        name="description"
        title={t("Description")}
        placeholder={t("Add a description")}
      />

      <div className={"grid grid-cols-2 gap-4"}>
        {/* Department */}
        <DefaultSelect
          title={t("Department")}
          options={optionsDepartment}
          multi={false}
          value={getSingleValue(values?.department_id, optionsDepartment)}
          onChange={(val) => handleSelectChange("department_id", val)}
          name="department_id"
          placeholder={t("Select Department...")}
        />

        {/* Priority (only for Task) */}
        {type === "task" ? (
          <DefaultSelect
            title={t("Priority")}
            options={optionsPriority}
            multi={false}
            value={getSingleValue(values?.priority, optionsPriority)}
            onChange={(val) => handleSelectChange("priority", val)}
            name="priority"
            placeholder={t("Select Priority...")}
          />
        ) : (
          /* Project Manager (only for Project) */
          <DefaultSelect
            title={t("Project Manager")}
            options={optionsManager}
            multi={false}
            value={getSingleValue(values?.manager_id, optionsManager)}
            onChange={(val) => handleSelectChange("manager_id", val)}
            name="manager_id"
            placeholder={t("Select Project Manager...")}
          />
        )}
      </div>

      {/* Assignees / Assignee_id */}
      {type === "task" ? (
        <DefaultSelect
          title={t("Assignee")}
          options={optionsManager}
          multi={false}
          value={getSingleValue(values?.assignee_id, optionsManager)}
          onChange={(val) => handleSelectChange("assignee_id", val)}
          name="assignee_id"
          placeholder={t("Select Assignee...")}
          isRequired
        />
      ) : (
        <TagInput
          title={t("Assignees")}
          isRequired={false}
          suggestions={employeeSuggestions}
          placeholder={isLoadingEmployees ? t("Loading...") : t("Select Assignees...")}
          value={values?.assignees_ids || []}
          onChange={(val) => setFieldValue("assignees_ids", val)}
        />
      )}

      {/* Dates Section */}
      <div className={"grid grid-cols-2 gap-4"}>
        <DateInput
          value={values?.start_date || ""}
          onChange={handleChange}
          name="start_date"
          title={t("Start Date")}
          placeholder="DD / MM / YYYY"
        />
        <DateInput
          value={values?.due_date || ""}
          onChange={handleChange}
          name="due_date"
          title={t("Due Date")}
          placeholder="DD / MM / YYYY"
        />
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        {type === "project" ? (
          <>
            <DateInput
              value={values?.started_in || ""}
              onChange={handleChange}
              name="started_in"
              title={t("Started at")}
              placeholder="DD / MM / YYYY"
            />
            <DateInput
              value={values?.finished_in || ""}
              onChange={handleChange}
              name="finished_in"
              title={t("Finished at")}
              placeholder="DD / MM / YYYY"
            />
          </>
        ) : (
          <DateInput
            value={values?.end_date || ""}
            onChange={handleChange}
            name="end_date"
            title={t("End Date")}
            placeholder="DD / MM / YYYY"
          />
        )}
      </div>

      <div className={"grid grid-cols-2 gap-4 items-end"}>
        {/* Status */}
        <DefaultSelect
          title={t("Status")}
          options={optionsStatus}
          multi={false}
          value={getSingleValue(values?.status, optionsStatus)}
          onChange={(val) => handleSelectChange("status", val)}
          name="status"
          placeholder={t("Select Status...")}
        />

        {/* Progress */}
        <InputAndLabel
          value={values?.progress || 0}
          onChange={handleChange}
          name="progress"
          type="number"
          title={t("Progress (%)")}
          placeholder="0"
          min="0"
          max="100"
        />
      </div>

      {/* is_template (only for Task) */}
      {type === "task" && (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="is_template"
            name="is_template"
            checked={values?.is_template || false}
            onChange={(e) => setFieldValue("is_template", e.target.checked)}
            className="w-4 h-4 text-primary-base border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="is_template" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("Is Template")}
          </label>
        </div>
      )}
    </div>
  );
}

TaskMainInfo.propTypes = {
  task: PropTypes.object,
  type: PropTypes.string,
  values: PropTypes.object,
  handleChange: PropTypes.func,
  setFieldValue: PropTypes.func,
};

export default TaskMainInfo;
