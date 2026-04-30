"use client"
import TemplateMainInfo from "./TemplateMainInfo.jsx";
import PropTypes from "prop-types";

function TemplateInfoForm({ template, values, handleChange, setFieldValue }) {
    return (
        <div className={"w-full"}>
            <TemplateMainInfo
                values={values}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                type={"template"}
                template={template && template}
            />
        </div>
    );
}

TemplateInfoForm.propTypes = {
    template: PropTypes.object,
    values: PropTypes.object,
    handleChange: PropTypes.func,
    setFieldValue: PropTypes.func,
};

export default TemplateInfoForm;
