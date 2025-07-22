import { useFormik } from "formik";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import { useDispatch } from "react-redux";
import { updateDepartment } from "@/redux/departments/departmentAPI";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import PropTypes from "prop-types";

const validationSchema = Yup.object({
  name: Yup.string().required("required"),
  description: Yup.string().required("required"),
});

function EditDepartmentModal({ isOpen, onClose, department, onSuccess }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      name: department?.name || "",
      description: department?.description || "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        updateDepartment({
          id: department._id,
          departmentData: values,
        })
      )
        .then(() => {
          onSuccess();
          onClose();
        })
        .catch((error) => {
          console.error("Update failed:", error);
          // Handle error state here if needed
        });
    },
    enableReinitialize: true,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={t("Save Changes")}
      className="lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"
      title={t("Edit Department")}
      onClick={formik.handleSubmit}
    >
      <div className="px-1">
        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <InputAndLabel
            title={t("Department Name")}
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t("Enter department name")}
            error={
              formik.touched.name && formik.errors.name
                ? t(formik.errors.name)
                : ""
            }
          />
          <InputAndLabel
            title={t("Description")}
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t("Enter description")}
            isTextArea={true}
            error={
              formik.touched.description && formik.errors.description
                ? t(formik.errors.description)
                : ""
            }
          />
        </form>
      </div>
    </Modal>
  );
}

EditDepartmentModal.prototype = {
  isOpen:PropTypes.bool,
  onClose:PropTypes.func,
  department:PropTypes.object,
  onSuccess:PropTypes.func,
}

export default EditDepartmentModal;
