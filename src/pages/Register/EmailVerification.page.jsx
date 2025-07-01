import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GoMail } from "react-icons/go"; // Assuming you want this icon
import { useState } from "react";
import axios from "axios"; // Added axios import
import { RootRoute } from "@/Root.Route"; // Added RootRoute import

function EmailVerificationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { initialEmail, companyName: passedCompanyName } = location.state || {};

  // For now, let's use a placeholder or derive from email if companyName is not passed
  const displayEmail = initialEmail || "your.email@company.com";
  const derivedCompanyName = displayEmail.split('@')[1]?.split('.')[0] || "Your Company";
  const companyName = passedCompanyName || derivedCompanyName.charAt(0).toUpperCase() + derivedCompanyName.slice(1);

  const handleVerifyEmail = async () => {
    setError("");
    setIsLoading(true);
    try {
      // Calling the new public backend endpoint for initial company invitation
      console.log(`Attempting to send invitation to: ${displayEmail} via /auth/initial-company-invite`);
      
      await axios.post(`${RootRoute}/auth/initial-company-invite`, {
        email: initialEmail,
        // If you collect company name on the first page, you can pass it here:
        // companyName: companyName, // uncomment and adjust if you have a company name field on Register.page.jsx
      });

      setError(t("Invitation sent successfully! Please check your email to complete registration."));
      // You might want to navigate to a success page or the login page after a successful send
      // navigate("/invitation-sent-confirmation", { state: { email: initialEmail } });

    } catch (err) {
      console.error("Error sending invitation:", err.response?.data || err.message);
      setError(err.response?.data?.message || t("Failed to send invitation. Please ensure your email is valid and try again."));
    } finally {
      setIsLoading(false);
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
        {/* Icon (Mail with sparkles) */}
        <div className="flex w-20 h-20 mx-auto justify-center items-center rounded-full bg-[#F3F3F4]">
          <div className="flex w-12 h-12 justify-center items-center rounded-full bg-blue-600 shadow-md">
            <GoMail size={30} className="text-white" /> {/* Mail icon */}
            {/* Sparkles - could be another icon or SVG for better visual match */}
            <span className="absolute text-white text-xs bottom-3 right-3 transform translate-x-1 translate-y-1">✨</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {t("Welcome to ")}{companyName}{t("!")}
          </h2>
          <p className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            {t("Please verify your company email")}
          </p>
        </div>

        {/* Description */}
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("You've entered ")}
          <span className="font-semibold text-gray-900 dark:text-white">{displayEmail}</span>
          {t(" as the company email address for your account, please verify this email address by clicking button below.")}
        </p>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        {/* Verify Email Button */}
        <div>
          <button
            type="button"
            onClick={handleVerifyEmail}
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? t("Sending...") : t("Verify Email")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationPage; 