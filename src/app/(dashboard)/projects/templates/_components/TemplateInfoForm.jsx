"use client"
import TemplateMainInfo from "./TemplateMainInfo.jsx";
import PropTypes from "prop-types";

function TemplateInfoForm({ template, values, handelChange }) {
    return (
        <div className={"w-full"}>
            <TemplateMainInfo
                values={values}
                handleChange={handelChange}
                type={"template"}
                template={template && template}
            />
        </div>
    );
}

TemplateInfoForm.propTypes = {
    template: PropTypes.object,
    values: PropTypes.object,
    handelChange: PropTypes.func,
};

export default TemplateInfoForm;
