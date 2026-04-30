import { useFormik } from "formik";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import DefaultSelect from "@/components/Form/DefaultSelect.jsx";
import FileUpload from "@/components/Form/FileUpload.jsx";
import DateInput from "@/components/Form/DateInput.jsx";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status.jsx";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";
import { defaultPhoto } from "@/Root.Route";
import TagInput from "@/components/Form/TagInput";

function TemplateMainInfo({
    template,
    type = "template",
    values,
    handleChange,
    setFieldValue,
}) {
    const { t } = useTranslation();

    // Fetch real employees
    const { data: employeesData, isLoading: isLoadingEmployees } = useGetEmployeesQuery();
    const employees = employeesData || [];

    // Fetch real departments
    const { data: departmentsData, isLoading: isLoadingDepartments } = useGetDepartmentsQuery();
    const departments = departmentsData || [];

    // Map employees to dropdown options
    const optionsManager = employees.map((emp) => ({
        id: emp.user_id,
        value: emp.user?.name || emp.name || t("Unknown"),
    }));

    // Department options
    const optionsDepartment = departments.map(dept => ({
        id: dept._id,
        value: dept.name
    }));

    // Category options
    const optionsCategory = [
        { id: "Software Development", value: t("Software Development") },
        { id: "Marketing", value: t("Marketing") },
        { id: "Design", value: t("Design") },
        { id: "General", value: t("General") },
    ];

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

    // Assignees options (mapped from real employees)
    const optionsAssignees = employees.map(emp => ({
        id: emp.user_id,
        value: emp.user?.name || emp.name || t("Unknown"),
    }));

    // Formik
    const formik = useFormik({
        initialValues: {
            projectName: template?.name || "",
            category: template?.category || "",
            assignTasks: template?.assignTasks || "",
            description: template?.description || "",
            department: template?.department || "",
            manager: template?.manager?._id || "",
            assignees: template?.assignees || "",
            assignedDate: template?.assignedDate
                ? new Date(template.assignedDate).toISOString().split("T")[0]
                : "",
            dueDate: template?.dueDate
                ? new Date(template.dueDate).toISOString().split("T")[0]
                : "",
            rating: template?.rating || "",
            status: template?.status || optionsStatus[0].id,
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
            // If it's an array (from DefaultSelect), extract IDs
            if (Array.isArray(value)) {
                if (name === "assignees") {
                    // For multi-select, send array of IDs
                    setFieldValue(name, value.map(v => v.id));
                } else {
                    // For single-select, send the first ID
                    setFieldValue(name, value[0]?.id || "");
                }
            } else {
                setFieldValue(name, value);
            }
        } else {
            formik.setFieldValue(name, value);
        }
    };

    const getSingleValue = (val, options) => {
        if (!val) return [];
        // If val is already an object/array, we might need to handle it, 
        // but usually it's the ID string from Formik
        const found = options.find(o => o.id === val);
        return found ? [found] : [];
    };

    const getMultiValue = (val, options) => {
        if (!val || !Array.isArray(val)) return [];
        return options.filter(o => val.includes(o.id));
    };

    return (
        <div className={"flex flex-col gap-4 max-h-full"}>
            <p
                className={
                    "w-full py-[6px] bg-weak-100 text-start text-xs dark:bg-weak-800 text-weak-800 dark:text-weak-100"
                }
            >
                {t("Project info")}:
            </p>

            {/* Project Name */}
            <InputAndLabel
                value={valuesInputs.projectName}
                onChange={handleChangeFunc}
                name="projectName"
                type="text"
                title={"Project Name"}
                placeholder="Project Name..."
            />

            {/* Category */}
            <DefaultSelect
                title="Category"
                options={optionsCategory}
                multi={false}
                value={getSingleValue(valuesInputs.category, optionsCategory)}
                onChange={(value) => handleSelectChange("category", value)}
                name="category"
                placeholder="Select Category..."
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
                multi={false}
                value={getSingleValue(valuesInputs.department, optionsDepartment)}
                onChange={(value) => handleSelectChange("department", value)}
                name="department"
                placeholder="Select Department..."
            />

            {/* Manager and Assignees */}
            <div className={"flex items-center justify-center gap-2"}>
                <DefaultSelect
                    title="Manager"
                    options={optionsManager}
                    multi={false}
                    value={getSingleValue(valuesInputs.manager, optionsManager)}
                    onChange={(value) => handleSelectChange("manager", value)}
                    name="manager"
                    placeholder="Select Manager..."
                    className={"flex-1"}
                />
                <DefaultSelect
                    title={t("Assignees")}
                    options={optionsAssignees}
                    multi={true}
                    value={getMultiValue(valuesInputs.assignees, optionsAssignees)}
                    onChange={(value) => handleSelectChange("assignees", value)}
                    name="assignees"
                    className="flex-1"
                />
            </div>

            {/* Assigned Date & Due Date */}
            <div className={"flex items-center justify-center gap-2"}>
                <DateInput
                    value={valuesInputs.assignedDate}
                    onChange={handleChangeFunc}
                    name="assignedDate"
                    title="Assigned Date"
                    className={"flex-1"}
                    placeholder="DD / MM / YYYY"
                />
                <DateInput
                    value={valuesInputs.dueDate}
                    onChange={handleChangeFunc}
                    name="dueDate"
                    title="Due Date"
                    className={"flex-1"}
                    placeholder="DD / MM / YYYY"
                />
            </div>

            {/* Rating and Status */}
            <div className={"flex items-center justify-center gap-2"}>
                <DefaultSelect
                    title="Rating"
                    options={optionsRating}
                    multi={false}
                    value={valuesInputs.rating}
                    onChange={(value) => handleSelectChange("rating", value)}
                    name="rating"
                    placeholder="Select Rating..."
                    className={"flex-1"}
                />
                <div className={"relative flex-1"}>
                    <ElementsSelect
                        title="Status"
                        options={optionsStatus}
                        defaultValue={[optionsStatus[0]]}
                        onChange={(value) => handleSelectChange("status", value)}
                        name="status"
                        classNameContainer={"w-full"}
                        placeholder="Select Status..."
                    />
                </div>
            </div>

            {/* File Upload */}
            <FileUpload />
        </div>
    );
}

TemplateMainInfo.propTypes = {
    template: PropTypes.object,
    type: PropTypes.string,
    values: PropTypes.object,
    handleChange: PropTypes.func,
    setFieldValue: PropTypes.func,
    optionsManager: PropTypes.array,
    optionsDepartment: PropTypes.array,
};

export default TemplateMainInfo;
