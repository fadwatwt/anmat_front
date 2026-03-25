/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import MultiSelect from "@/components/Form/MultiSelect";
import ElementsSelect from "@/components/Form/ElementsSelect";
import { useUpdateEmployeeMutation } from "@/redux/employees/employeesApi.js";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";
import { useGetSubscriberRolesQuery } from "@/redux/roles/subscriberRolesApi";
import { useTranslation } from "react-i18next";
import { useProcessing } from "@/app/providers";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

const daysOfWeek = [
  { id: "Monday", value: "Monday" },
  { id: "Tuesday", value: "Tuesday" },
  { id: "Wednesday", value: "Wednesday" },
  { id: "Thursday", value: "Thursday" },
  { id: "Friday", value: "Friday" },
  { id: "Saturday", value: "Saturday" },
  { id: "Sunday", value: "Sunday" },
];

function EditAnEmployeeModal({ isOpen, onClose, employeeData }) {
  const { t } = useTranslation();
  const { showProcessing, hideProcessing } = useProcessing();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  const { data: departmentsData = [] } = useGetDepartmentsQuery({}, { skip: !isOpen });
  const { data: rolesData = [] } = useGetSubscriberRolesQuery({}, { skip: !isOpen });

  const countryOptions = [
    { id: "Egypt", element: t("Egypt") },
    { id: "Palestine", element: t("Palestine") },
    { id: "Jordan", element: t("Jordan") },
    { id: "Saudi Arabia", element: t("Saudi Arabia") },
  ];

  const cityOptions = [
    { id: "Cairo", element: t("Cairo") },
    { id: "Alexandria", element: t("Alexandria") },
    { id: "Gaza", element: t("Gaza") },
    { id: "Amman", element: t("Amman") },
    { id: "Riyadh", element: t("Riyadh") },
  ];

  const departmentOptions = useMemo(() => {
    return departmentsData?.map(dept => ({ id: dept._id, element: dept.name })) || [];
  }, [departmentsData]);

  const formik = useFormik({
    initialValues: {
      name: employeeData?.user?.name || "",
      phone: employeeData?.user?.phone || "",
      department_id: employeeData?.department_id?._id || employeeData?.department_id || "",
      position_id: employeeData?.position_id?._id || employeeData?.position_id || "",
      roles_ids: employeeData?.roles_ids || [],
      country: employeeData?.country || "",
      city: employeeData?.city || "",
      work_hours: employeeData?.work_hours || 0,
      salary: employeeData?.salary || 0,
      yearly_day_offs: employeeData?.yearly_day_offs || 0,
      weekend_days: employeeData?.weekend_days || [],
      date_of_birth: employeeData?.date_of_birth ? new Date(employeeData.date_of_birth).toISOString().split('T')[0] : "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("Name is required")),
      phone: Yup.string().required(t("Phone is required")),
      country: Yup.string().required(t("Country is required")),
      city: Yup.string().required(t("City is required")),
      work_hours: Yup.number().min(1).required(t("Work hours are required")),
      salary: Yup.number().min(0).required(t("Salary is required")),
      yearly_day_offs: Yup.number().min(0).required(t("Yearly day offs are required")),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setApiResponse({ ...apiResponse, isOpen: false });
        showProcessing(t("Updating Employee..."));
        const payload = {
          name: values.name,
          phone: values.phone,
          employee_details: {
            department_id: values.department_id || undefined,
            position_id: values.position_id || undefined,
            roles_ids: values.roles_ids,
            country: values.country,
            city: values.city,
            work_hours: Number(values.work_hours),
            salary: Number(values.salary),
            yearly_day_offs: Number(values.yearly_day_offs),
            weekend_days: values.weekend_days,
            date_of_birth: values.date_of_birth || undefined,
          }
        };

        if (!payload.employee_details.department_id) delete payload.employee_details.department_id;
        if (!payload.employee_details.position_id) delete payload.employee_details.position_id;
        if (!payload.employee_details.date_of_birth) delete payload.employee_details.date_of_birth;

        await updateEmployee({ id: employeeData.user_id, ...payload }).unwrap();
        
        setApiResponse({
          isOpen: true,
          status: "success",
          message: t("Employee updated successfully")
        });
      } catch (error) {
        setApiResponse({
          isOpen: true,
          status: "error",
          message: error?.data?.message || t("Failed to update employee")
        });
      } finally {
        hideProcessing();
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  const positionOptions = useMemo(() => {
    if (!formik.values.department_id) return [];
    const selectedDept = departmentsData?.find(d => d._id === formik.values.department_id);
    return selectedDept?.positions_ids?.map(pos => ({ id: pos._id, element: pos.title })) || [];
  }, [departmentsData, formik.values.department_id]);

  const roles = (Array.isArray(rolesData) ? rolesData : rolesData?.data || [])?.map(r => ({ id: r._id, value: r.name })) || [];

  useEffect(() => {
    if (isOpen) {
      setApiResponse({ isOpen: false, status: "", message: "" });
    }
  }, [isOpen]);

  const handleCloseResponse = () => {
    setApiResponse(prev => ({ ...prev, isOpen: false }));
    if (apiResponse.status === "success") {
      onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isBtns={true}
        btnApplyTitle={formik.isSubmitting ? t("Saving...") : t("Edit Employee")}
        onClick={formik.handleSubmit}
        className={"lg:w-7/12 md:w-9/12 w-11/12 p-3"}
        title={t("Editing an Employee")}
        disableSubmit={formik.isSubmitting}
      >
        <div className="px-1 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputAndLabel
              title="Name"
              name="name"
              {...formik.getFieldProps("name")}
              error={formik.touched.name && formik.errors.name}
            />

            <InputAndLabel
              title="Phone"
              name="phone"
              {...formik.getFieldProps("phone")}
              error={formik.touched.phone && formik.errors.phone}
            />

            <ElementsSelect
              title={t("Department")}
              options={departmentOptions}
              placeholder={t("Select Department")}
              defaultValue={departmentOptions.find(opt => opt.id === formik.values.department_id)}
              onChange={(val) => {
                formik.setFieldValue("department_id", val[0]?.id || "");
                formik.setFieldValue("position_id", ""); 
              }}
              name="department_id"
              classNameContainer={"w-full"}
            />

            <ElementsSelect
              title={t("Position")}
              options={positionOptions}
              placeholder={!formik.values.department_id ? t("Select department first") : t("Select Position")}
              defaultValue={positionOptions.find(opt => opt.id === formik.values.position_id)}
              onChange={(val) => formik.setFieldValue("position_id", val[0]?.id || "")}
              name="position_id"
              classNameContainer={"w-full"}
            />

            <MultiSelect
              title={t("Roles")}
              multi={true}
              options={roles}
              value={formik.values.roles_ids}
              onChange={(val) => formik.setFieldValue("roles_ids", val)}
              placeholder={t("Select Roles")}
              error={formik.touched.roles_ids && formik.errors.roles_ids}
            />

            <ElementsSelect
              title={t("Country")}
              options={countryOptions}
              placeholder={t("Select Country")}
              defaultValue={countryOptions.find(opt => opt.id === formik.values.country)}
              onChange={(val) => formik.setFieldValue("country", val[0]?.id || "")}
              name="country"
              classNameContainer={"w-full"}
            />

            <ElementsSelect
              title={t("City")}
              options={cityOptions}
              placeholder={t("Select City")}
              defaultValue={cityOptions.find(opt => opt.id === formik.values.city)}
              onChange={(val) => formik.setFieldValue("city", val[0]?.id || "")}
              name="city"
              classNameContainer={"w-full"}
            />

            <InputAndLabel
              title="Work Hours"
              name="work_hours"
              type="number"
              {...formik.getFieldProps("work_hours")}
              error={formik.touched.work_hours && formik.errors.work_hours}
            />

            <InputAndLabel
              title="Salary"
              name="salary"
              type="number"
              {...formik.getFieldProps("salary")}
              error={formik.touched.salary && formik.errors.salary}
            />

            <InputAndLabel
              title="Yearly Day Offs"
              name="yearly_day_offs"
              type="number"
              {...formik.getFieldProps("yearly_day_offs")}
              error={formik.touched.yearly_day_offs && formik.errors.yearly_day_offs}
            />

            <MultiSelect
              title={t("Weekend Days")}
              multi={true}
              options={daysOfWeek}
              value={formik.values.weekend_days}
              onChange={(val) => formik.setFieldValue("weekend_days", val)}
              placeholder={t("Select Days")}
              error={formik.touched.weekend_days && formik.errors.weekend_days}
            />

            <InputAndLabel
              title="Date of Birth"
              name="date_of_birth"
              type="date"
              {...formik.getFieldProps("date_of_birth")}
              error={formik.touched.date_of_birth && formik.errors.date_of_birth}
            />
          </div>
        </div>
      </Modal>

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={handleCloseResponse}
      />
    </>
  );
}

EditAnEmployeeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employeeData: PropTypes.object,
};

export default EditAnEmployeeModal;
