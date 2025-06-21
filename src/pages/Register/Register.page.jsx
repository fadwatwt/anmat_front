import { GoMail } from "react-icons/go";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation schema for company email
  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("Invalid email"))
      .required(t("Company email is required"))
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        t("Invalid email format")
      ),
  });

  const initialValues = {
    email: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setError("");
    setIsLoading(true);

    try {
      // Simulate success and navigate to the full company registration page
      console.log("Initial company email captured:", values.email);
      navigate("/email-verification-company", { state: { initialEmail: values.email } }); // Pass email to next page
    } catch (err) {
      setError(err.response?.data?.message || t("Registration failed. Please try again."));
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Logo Section */}
      <div className="absolute top-7 left-9 flex items-center justify-start gap-3">
        <img
          className="w-10 h-10 rounded-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Hov7jcWb4cWae_alBRxB-N1tJiTFrpt1PA&s"
          alt="Company Logo"
        />
        <div className="text-sm text-sub-500 text-start dark:text-sub-300">
          <p>Employees</p>
          <p>Management</p>
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl">
        {/* Icon */}
        <div className="flex w-20 h-20 mx-auto justify-center items-center rounded-full bg-[#F3F3F4]">
          <div className="flex w-12 h-12 justify-center items-center rounded-full bg-white shadow-md">
            <GoMail size={30} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {t("Register your company now")}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t("Let's get your company info set in two minutes")}
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Company Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("Company Email")}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GoMail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={t("Enter your Email")}
                    />
                  </div>
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    (isLoading || isSubmitting) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? t("loading") : t("Register")}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("Already have an account?")}{" "}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            {t("Login")}
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage; 