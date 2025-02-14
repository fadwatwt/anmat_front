import { Form, Formik } from "formik";
import Modal from "../../../components/Modal/Modal.jsx";
import InputAndLabel from "../../../components/Form/InputAndLabel.jsx";
import { useDispatch } from "react-redux";
import { updateDepartment } from "../../../redux/departments/departmentAPI";
import { useTranslation } from "react-i18next";

function EditDepartmentModal({ isOpen, onClose, department }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSubmit = (values) => {
    dispatch(
      updateDepartment({
        id: department._id,
        departmentData: values,
      })
    )
      .then(() => onClose())
      .catch((error) => console.error("Update failed:", error));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isBtns={true}
      btnApplyTitle={t("Save Changes")}
      className="lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12"
      title={t("Edit Department")}
    >
      <div className="px-1">
        <Formik
          initialValues={{
            name: department?.name || "",
            description: department?.description || "",
          }}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values }) => (
            <Form className="flex flex-col gap-4">
              <InputAndLabel
                title={t("Department Name")}
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder={t("Enter department name")}
              />
              <InputAndLabel
                title={t("Description")}
                name="description"
                value={values.description}
                onChange={handleChange}
                placeholder={t("Enter description")}
                isTextArea={true}
              />
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}

export default EditDepartmentModal;
