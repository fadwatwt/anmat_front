import { useFormik } from "formik";
import Modal from "@/components/Modal/Modal.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel.jsx";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import PropTypes from "prop-types";

const validationSchema = Yup.object({
    name: Yup.string().required("required"),
    description: Yup.string(),
});

function CreatePositionModal({ isOpen, onClose, onSubmit }) {
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            if (onSubmit) {
                await onSubmit(values);
            }
            formik.resetForm();
            onClose();
        },
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            btnApplyTitle={t("Save")}
            btnCancelTitle={t("Cancel")}
            className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"}
            title={t("Create a Position")}
            onClick={formik.handleSubmit}
        >
            <div className="px-1">
                <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
                    <InputAndLabel
                        title={t("Position Name")}
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={t("Enter position name")}
                        isRequired={true}
                        error={
                            formik.touched.name && formik.errors.name
                                ? t(formik.errors.name)
                                : ""
                        }
                    />
                    <TextAreaWithLabel
                        title={t("Description")}
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={t("Enter Description")}
                        rows={4}
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

CreatePositionModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
};

export default CreatePositionModal;
