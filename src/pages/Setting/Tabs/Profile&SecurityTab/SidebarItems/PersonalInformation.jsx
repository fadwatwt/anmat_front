import userProfile from "../../../../../assets/images/userProfile.png";
import WordTheMiddleAndLine from "../../../../../components/Subcomponents/WordTheMiddleAndLine.jsx";
import { Form, Formik } from "formik";
import InputAndLabel from "../../../../../components/Form/InputAndLabel.jsx";
import InlineAlert from "../../../../../components/InlineAlert.jsx";
import DefaultButton from "../../../../../components/Form/DefaultButton.jsx";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

function PersonalInformation() {
  const uploadFileInput = useRef(null);
  const { t } = useTranslation();

  const initialValues = {
    name: "Rawan Ahmed",
    age: "28",
    education: "Bachelor’s Degree in Journalism",
    email: "Rawan@email.com",
  };

  const handelClickUploadBtn = () => {
    uploadFileInput.current.click();
  };

  return (
    <div className="flex flex-col justify-start gap-1 items-center p-3">
      <div className="w-full flex flex-col justify-start items-center gap-2">
        <div className="w-full flex justify-start items-start gap-4">
          <img
            className="rounded-full w-16 h-16 transition-all duration-300"
            src={userProfile}
            alt="user-profile-image"
          />
          <div className="flex flex-col gap-2 items-start">
            <div className="flex flex-col items-start gap-1">
              <p className="text-md text-main-100 dark:text-white">
                {t("Upload Image")}
              </p>
              <p className="text-sm text-sub-500 dark:text-gray-300">
                {t("Min 400x400px, PNG or JPEG")}
              </p>
            </div>
            <button
              onClick={handelClickUploadBtn}
              className="p-1.5 bg-white dark:bg-gray-800 rounded-md text-sm text-sub-500 dark:text-white border border-soft-200 dark:border-gray-700 transition-all duration-300"
            >
              {t("Upload")}
            </button>
            <input type="file" className="hidden" ref={uploadFileInput} />
          </div>
        </div>
      </div>
      <WordTheMiddleAndLine />
      <div className="w-full form">
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          {({ values, handleChange, handleSubmit }) => (
            <Form
              className="w-full flex flex-col gap-3"
              onSubmit={handleSubmit}
            >
              <div className="w-full flex flex-col gap-2">
                <InputAndLabel
                  title="Name"
                  name="name"
                  isRequired={true}
                  onChange={handleChange}
                  value={values.name}
                />
                <InputAndLabel
                  title="Age"
                  name="age"
                  onChange={handleChange}
                  value={values.age}
                />
                <InputAndLabel
                  title="Education"
                  name="education"
                  onChange={handleChange}
                  value={values.education}
                />
                <InputAndLabel
                  title="Email Address:"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                />
              </div>
              <div className="w-full flex flex-col items-start gap-4">
                <InlineAlert
                  type="info"
                  text="This information will appear in your profile."
                />
                <div className="w-full justify-start flex gap-2">
                  <DefaultButton
                    type="button"
                    title="Cancel"
                    className="font-medium dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 transition-all duration-300"
                  />
                  <DefaultButton
                    type="button"
                    onClick={() => {}}
                    title="Apply Changes"
                    className="bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white transition-all duration-300"
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default PersonalInformation;
