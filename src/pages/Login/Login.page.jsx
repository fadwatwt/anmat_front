import { LiaUser } from "react-icons/lia";
import { useTranslation } from "react-i18next";
import { GoMail } from "react-icons/go";
import { IoIosLock } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/auth/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure } from "../../redux/auth/authSlice";
import WordTheMiddleAndLine from "../../components/Subcomponents/WordTheMiddleAndLine.jsx";

function LoginPage() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const { error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigateTo = (path) => {
    window.location.href = path;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      console.log("Login Response:", response); // Debugging
      dispatch(loginSuccess(response)); // Dispatch loginSuccess with the full response

      // Store the token in local storage
      localStorage.setItem("token", response.token); // Store the token

      navigate("/"); // Redirect to the home page
    } catch (err) {
      console.error("Login Error:", err); // Debugging
      dispatch(loginFailure(err.data?.message || "Login failed")); // Handle error
    }
  };

  return (
    <div className="w-full flex h-screen justify-start py-1">
      <div className="flex flex-col w-[40%] justify-between px-9 py-7">
        {/* Logo Section */}
        <div className="flex items-center justify-start gap-3">
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

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="loginForm flex flex-col gap-3 w-11/12"
        >
          <div className="flex flex-col items-center gap-3">
            {/* User Icon */}
            <div className="flex w-20 h-20 justify-center items-center rounded-full bg-[#F3F3F4]">
              <div className="flex w-12 h-12 justify-center items-center rounded-full bg-white shadow-md">
                <LiaUser size={30} />
              </div>
            </div>

            {/* Title */}
            <div className="text-sm text-sub-500 flex flex-col justify-center items-center text-start dark:text-sub-300">
              <p className="text-2xl text-black">{t("login_title")}</p>
              <p className="text-gray-500">{t("login_subtitle")}</p>
            </div>

            {/* Form Fields */}
            <div className="w-full px-12">
              <div className="flex flex-col gap-2 w-full">
                {/* Email Input */}
                <div className="flex flex-col items-start gap-2 w-full">
                  <p className="text-sm text-black dark:text-white">
                    {t("email_address")}
                  </p>
                  <label
                    className="flex bg-white pl-2 px-2 w-full items-center text-xs dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl focus:outline-none focus:border-blue-500 dark:text-gray-200"
                    htmlFor="email"
                  >
                    <GoMail className="text-gray-500 w-10" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("enter_email")}
                      className={`custom-date-input dark:bg-white-0 w-full py-3 px-2 outline-none appearance-none focus:outline-none peer ${
                        i18n.language === "ar" ? "text-end" : ""
                      }`}
                      required
                    />
                  </label>
                </div>

                {/* Password Input */}
                <div className="flex flex-col items-start gap-2 w-full">
                  <p className="text-sm dark:text-white text-black">
                    {t("password")}
                  </p>
                  <label
                    className="flex bg-white pl-2 px-2 w-full items-center text-xs dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl focus:outline-none focus:border-blue-500 dark:text-gray-200"
                    htmlFor="password"
                  >
                    <IoIosLock className="text-gray-500 w-10" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="*********"
                      className={`custom-date-input dark:bg-white-0 w-full py-3 px-2 outline-none appearance-none focus:outline-none peer ${
                        i18n.language === "ar" ? "text-end" : ""
                      }`}
                      required
                    />
                  </label>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <p className="text-sm text-black">{t("remember_me")}</p>
                  </div>
                  <p className="text-sm text-gray-500 underline cursor-pointer">
                    {t("forgot_password")}
                  </p>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full rounded-lg bg-primary-base text-white py-1.5 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? t("loading") : t("login_button")}
                </button>

                {/* Social Login Divider */}
                <WordTheMiddleAndLine word={t("or")} classNameText="text-xs" />

                {/* Google Login */}
                <button
                  type="button"
                  className="w-full rounded-lg border border-gray-400 py-1.5 flex gap-2 justify-center items-center hover:bg-gray-50 transition-colors"
                >
                  <FcGoogle />
                  <span className="text-sm">{t("login_with_google")}</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Language Selector */}
        <div className="flex justify-start">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>

      {/* Right Side Image/Placeholder */}
      <div className="flex flex-col h-full justify-center flex-1 rounded-md bg-gray-200">
        {/* Add your login illustration/image here */}
      </div>
    </div>
  );
}

export default LoginPage;
