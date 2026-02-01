import InputAndLabel from "@/components/Form/InputAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import { useTranslation } from "react-i18next";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";
import { useMemo } from "react";

function WorkAndRatingInfoForm({ formData, updateFormData }) {
    const { t } = useTranslation();

    const { data: departmentsData, isLoading: isDeptsLoading } = useGetDepartmentsQuery();

    const departmentOptions = useMemo(() => {
        const depts = departmentsData?.map(dept => ({ id: dept._id, element: dept.name })) || [];
        return [{ id: "none", element: t("No Department") }, ...depts];
    }, [departmentsData, t]);

    const positionOptions = useMemo(() => {
        if (!formData.employee_detail.department_id || formData.employee_detail.department_id === "none") {
            return [];
        }
        const selectedDept = departmentsData?.find(d => d._id === formData.employee_detail.department_id);
        return selectedDept?.positions_ids?.map(pos => ({ id: pos._id, element: pos.title })) || [];
    }, [departmentsData, formData.employee_detail.department_id]);

    const weekendOptions = [
        { id: "Monday", element: t("Monday") },
        { id: "Tuesday", element: t("Tuesday") },
        { id: "Wednesday", element: t("Wednesday") },
        { id: "Thursday", element: t("Thursday") },
        { id: "Friday", element: t("Friday") },
        { id: "Saturday", element: t("Saturday") },
        { id: "Sunday", element: t("Sunday") },
    ];

    return (
        <div className={"flex flex-col gap-6 max-h-full pb-3"}>
            <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-700/50 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1 border-l-4 border-primary-base pl-2">{t("Employment Details")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ElementsSelect
                        title={t("Department")}
                        options={departmentOptions}
                        placeholder={isDeptsLoading ? t("Loading...") : t("Select Department")}
                        defaultValue={departmentOptions.find(opt => opt.id === (formData.employee_detail.department_id || "none"))}
                        onChange={(val) => {
                            const deptId = val[0]?.id;
                            updateFormData("department_id", deptId === "none" ? null : deptId, true);
                            updateFormData("position_id", null, true); // Reset position if department changes
                        }}
                        name="department"
                        classNameContainer={"w-full"}
                    />
                    <ElementsSelect
                        title={t("Position")}
                        options={positionOptions}
                        placeholder={(!formData.employee_detail.department_id || formData.employee_detail.department_id === "none") ? t("Select department first") : t("Select Position")}
                        defaultValue={positionOptions.find(opt => opt.id === formData.employee_detail.position_id)}
                        onChange={(val) => updateFormData("position_id", val[0]?.id || null, true)}
                        name="position"
                        classNameContainer={"w-full"}
                    />
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-700/50 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1 border-l-4 border-primary-base pl-2">{t("Financial & Schedule")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputAndLabel
                        type="number"
                        title={t("Salary")}
                        isRequired={true}
                        placeholder={t("1200")}
                        value={formData.employee_detail.salary}
                        onChange={(e) => updateFormData("salary", Number(e.target.value), true)}
                    />
                    <InputAndLabel
                        type="number"
                        title={t("Work Hours")}
                        isRequired={true}
                        placeholder={t("8")}
                        value={formData.employee_detail.work_hours}
                        onChange={(e) => updateFormData("work_hours", Number(e.target.value), true)}
                    />
                    <InputAndLabel
                        type="number"
                        title={t("Yearly Days-Off")}
                        isRequired={true}
                        placeholder={t("14")}
                        value={formData.employee_detail.yearly_day_offs}
                        onChange={(e) => updateFormData("yearly_day_offs", Number(e.target.value), true)}
                    />
                    <ElementsSelect
                        title={t("Weekend Days")}
                        isMultiple={true}
                        options={weekendOptions}
                        placeholder={t("Select weekend days")}
                        defaultValue={weekendOptions.filter(opt => formData.employee_detail.weekend_days.includes(opt.id))}
                        onChange={(vals) => updateFormData("weekend_days", vals.map(v => v.id), true)}
                        name="weekend_days"
                        classNameContainer={"w-full"}
                    />
                </div>
            </div>
        </div>
    );
}

export default WorkAndRatingInfoForm;