import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import DefaultSelect from "@/components/Form/DefaultSelect.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";
import TagInput from "@/components/Form/TagInput";
import { defaultPhoto } from "@/Root.Route";
import Status from "../../TableInfo/Status.jsx";

function TaskMainInfo({ task, values, handleChange, setFieldValue }) {
  const { t } = useTranslation();

  // Fetch real employees
  const { data: employeesData, isLoading: isLoadingEmployees } = useGetEmployeesQuery();
  const employees = employeesData || [];

  // Fetch real departments
  const { data: departmentsData, isLoading: isLoadingDepartments } = useGetDepartmentsQuery();
  const departments = departmentsData || [];

  // Map employees to dropdown options (for Manager)
  const optionsManager = employees.map((emp) => ({
    id: emp.user_id,
    value: emp.user?.name || emp.name || t("Unknown"),
  }));

  // Map employees to TagInput suggestions (for Assignees)
  const employeeSuggestions = employees.map(emp => ({
    id: emp.user_id,
    name: emp.user?.name || emp.name || t("Unknown"),
    image: emp.user?.imageProfile || defaultPhoto
  }));

  // Department options
  const optionsDepartment = departments.map(dept => ({
    id: dept._id,
    value: dept.name
  }));

  // Status options
  const optionsStatus = [
    { id: "open", value: t("Open") },
    { id: "in-progress", value: t("In Progress") },
    { id: "completed", value: t("Completed") },
    { id: "rejected", value: t("Rejected") },
    { id: "cancelled", value: t("Cancelled") },
  ];

  const handleSelectChange = (name, val) => {
    if (setFieldValue) {
      // DefaultSelect with multi={false} returns an array with one object
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
        {t("Project Main Info")}:
      </p>

      {/* Project Name */}
      <InputAndLabel
        value={values?.name || ""}
        onChange={handleChange}
        name="name"
        type="text"
        title={t("Project Name")}
        placeholder={t("Project Name")}
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

      {/* Project Manager */}
      <DefaultSelect
        title={t("Project Manager")}
        options={optionsManager}
        multi={false}
        value={getSingleValue(values?.manager_id, optionsManager)}
        onChange={(val) => handleSelectChange("manager_id", val)}
        name="manager_id"
        placeholder={t("Select Project Manager...")}
      />

      {/* Assignees */}
      <TagInput
        title={t("Assignees")}
        isRequired={false}
        suggestions={employeeSuggestions}
        placeholder={isLoadingEmployees ? t("Loading...") : t("Select Assignees...")}
        value={values?.assignees_ids || []}
        onChange={(val) => setFieldValue("assignees_ids", val)}
      />

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
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
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
