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

function TemplateMainInfo({
    template,
    type = "template",
    values,
    handleChange,
    setFieldValue,
    optionsManager: propsOptionsManager,
    optionsDepartment: propsOptionsDepartment
}) {
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
        { id: "3", value: "Development" },
        { id: "4", value: "Marketing" },
    ];

    const optionsDepartment = propsOptionsDepartment || mockOptionsDepartment;

    // Category options
    const optionsCategory = [
        { id: "", value: `${t("Select Category")}...` },
        { id: "1", value: "Lorem Ipsum" },
        { id: "2", value: "Software Development" },
        { id: "3", value: "Marketing Campaign" },
        { id: "4", value: "Design Project" },
    ];

    // Assign Tasks options
    const optionsAssignTasks = [
        { id: "", value: `${t("Select Tasks")}...` },
        { id: "1", value: "Task 1" },
        { id: "2", value: "Task 2" },
        { id: "3", value: "Task 3" },
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
        { id: "", value: `${t("Select Rating")}...` },
        { id: "1", value: "1" },
        { id: "2", value: "2" },
        { id: "3", value: "3" },
        { id: "4", value: "4" },
        { id: "5", value: "5" },
    ];

    // Assignees options (mock - will be multi-select)
    const optionsAssignees = [
        { id: "", value: `${t("Select Assignees")}...` },
        { id: "1", value: "User 1" },
        { id: "2", value: "User 2" },
        { id: "3", value: "User 3" },
        { id: "4", value: "User 4" },
    ];

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
            setFieldValue(name, value);
        } else {
            formik.setFieldValue(name, value);
        }
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
                defaultValue={valuesInputs.category}
                onChange={(value) => handleSelectChange("category", value)}
                name="category"
                placeholder="Select Category..."
            />

            {/* Assign Tasks */}
            <DefaultSelect
                title="Assign Tasks"
                options={optionsAssignTasks}
                defaultValue={valuesInputs.assignTasks}
                onChange={(value) => handleSelectChange("assignTasks", value)}
                name="assignTasks"
                placeholder="Select Tasks..."
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

            {/* Manager and Assignees */}
            <div className={"flex items-center justify-center gap-2"}>
                <DefaultSelect
                    title="Manager"
                    options={optionsManager}
                    defaultValue={valuesInputs.manager}
                    onChange={(value) => handleSelectChange("manager", value)}
                    name="manager"
                    placeholder="Select Manager..."
                    className={"flex-1"}
                />
                <DefaultSelect
                    title="Assignees"
                    options={optionsAssignees}
                    defaultValue={valuesInputs.assignees}
                    onChange={(value) => handleSelectChange("assignees", value)}
                    name="assignees"
                    placeholder="Select Assignees..."
                    className={"flex-1"}
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
                    defaultValue={valuesInputs.rating}
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
