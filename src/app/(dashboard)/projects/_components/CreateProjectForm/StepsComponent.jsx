import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";

const StepsComponent = ({
  steps,
  handelAddTask = null,
  type = "create",
  initialValues,
  currentStep: externalCurrentStep = null,
  setCurrentStep: externalSetCurrentStep = null,
  buttonText = "Create the Project",
}) => {
  const { t } = useTranslation();

  // إذا لم يتم تمرير currentStep و setCurrentStep يتم الاعتماد على الحالة الداخلية
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);

  // تحديد الخطوة الحالية والدالة المسؤولة عن تحديثها
  const currentStep = externalCurrentStep ?? internalCurrentStep;
  const setCurrentStep = externalSetCurrentStep ?? setInternalCurrentStep;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const backStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-1 justify-center mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center">
              <div
                className={`flex items-center cursor-pointer ${currentStep >= index + 1 ? "text-blue-500" : "text-gray-400"
                  }`}
                onClick={() =>
                  currentStep >= index + 1 && setCurrentStep(index + 1)
                }
              >
                <div className="flex items-center">
                  <span
                    className={`rounded-full group w-5 h-5 text-xs flex items-center justify-center ${currentStep > index + 1
                        ? "p-0"
                        : currentStep === index + 1
                          ? "bg-primary-base dark:bg-primary-200 dark:text-black text-white"
                          : "border border-gray-300 dark:border-gray-700 dark:text-white"
                      }`}
                  >
                    {currentStep > index + 1 ? (
                      <FaCheckCircle
                        className={"text-green-success dark:text-green-300 "}
                        size={20}
                      />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="ml-2 text-sm dark:text-primary-150 text-nowrap">
                    {t(step.title)}
                  </span>
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <IoIosArrowForward className={`text-lg text-gray-400`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="w-full">
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            console.log("Form submitted", values);
          }}
        >
          {({ values, handleSubmit, handleChange }) => (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {steps.map(
                (step, index) =>
                  currentStep === index + 1 && (
                    <div key={index}>
                      {React.cloneElement(step.content, {
                        values,
                        handleChange,
                      })}
                      {type === "create" && (
                        <div className={"w-full flex justify-between mt-4"}>
                          <div className={"flex  justify-start"}>
                            {index < steps.length - 1 && (
                              <button
                                onClick={nextStep}
                                className="bg-primary-base dark:bg-primary-200 dark:text-black w-40 text-white p-[10px] rounded-[10px] "
                              >
                                {t("Next")}
                              </button>
                            )}
                            {index === steps.length - 1 && (
                              <button
                                type={"submit"}
                                className=" bg-primary-base dark:bg-primary-200 dark:text-black w-40 text-white p-[10px] rounded-[10px] "
                              >
                                {t(buttonText)}
                              </button>
                            )}
                            {index > 0 && (
                              <button
                                type={"button"}
                                onClick={backStep}
                                className=" bg-white dark:bg-white-0 dark:border-gray-700 dark:text-gray-300 w-40 p-[10px] text-md rounded-[10px] border border-gray-400"
                              >
                                {t("Back")}
                              </button>
                            )}
                          </div>

                          <div className={""}>
                            {index === steps.length - 1 && (
                              <button
                                type={"button"}
                                onClick={handelAddTask && handelAddTask}
                                className=" bg-none w-40 p-[10px] text-md rounded-[10px] border border-primary-base dark:border-primary-200  text-primary-base flex gap-2 justify-center items-center"
                              >
                                <span
                                  className={
                                    "text-md text-primary-base dark:text-primary-200 text-nowrap"
                                  }
                                >
                                  {t("Add new task")}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

StepsComponent.propTypes = {
  steps: PropTypes.array.isRequired,
  handelCreateProject: PropTypes.func,
  handelAddTask: PropTypes.func,
  type: PropTypes.string,
  currentStep: PropTypes.number,
  initialValues: PropTypes.object,
  setCurrentStep: PropTypes.func,
  buttonText: PropTypes.string,
};

export default StepsComponent;
