import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { 
    RiMailFill, 
    RiYoutubeFill, 
    RiInstagramFill, 
    RiTwitterXFill, 
    RiLinkedinFill, 
    RiFacebookFill 
} from "@remixicon/react";
import Orandis from "../assets/images/Orandis.png";
const EmailInvitation = ({
  userName,
  companyName,
  position,
  department,
  organization,
  hrEmail,
  phoneNumber,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // Check if Arabic

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-gray-900 lg:w-[600px] md:w-[90%] sm:w-[95%] overflow-hidden shadow-lg dark:shadow-gray-800">
        {/* Company Logo */}
        {/* use this  Orandis its in assets */}

        <div className="mb-4">
          <img
            src={Orandis}
            alt="Company Logo"
            className="w-20 h-20 rounded-full object-cover object-center"
          />
        </div>

        {/* Welcome Header */}
        {/* Welcome Header */}
        <h1 className="text-center text-[#0A0D14] dark:text-gray-200 font-[400] text-[24px] leading-[32px] tracking-[0%] font-[Almarai]">
          {t("Welcome to {{companyName}}! Your New Journey Begins!", {
            companyName,
          })}
        </h1>

        {/* Greeting Text */}
        <div
          className={`text-left w-full mb-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          <p className="text-sm text-[#525866] dark:text-gray-300 mb-2">
            {t("Dear")} {userName},
          </p>
          <p className="text-sm text-[#525866] dark:text-gray-300">
            {t(`We are pleased to welcome you to our team at `)}
            <span className="font-medium">{organization}</span>
            {t(` for the position of ${position} in the ${department}.`)}
          </p>
        </div>

        {/* Instructions */}
        <div
          className={`text-left w-full mb-6 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          <p className="text-sm text-[#525866] dark:text-gray-300">
            {t(
              "To complete your onboarding process, please click the button below to finalize your information and activate your account."
            )}
          </p>
        </div>

        {/* Action Button */}
        <button
          className="bg-[#375DFB] dark:bg-[#C2D6FF] text-white dark:text-[#0A0D14] transition-all mt-3 flex items-center justify-center"
          style={{
            width: "176px",
            height: "44px",
            borderRadius: "10px",
            padding: "10px",
            gap: "4px",
            fontFamily: "Almarai",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "-1.1%",
            textAlign: "center",
          }}
        >
          {t("Complete Your Profile")}
        </button>

        {/* Contact Info */}
        <div className={`w-full mt-4 ${isRTL ? "text-right" : "text-left"}`}>
          <p className="text-sm text-[#525866] dark:text-gray-300">
            {t(
              "If you have any questions or need assistance during the process, don't hesitate to contact us."
            )}
          </p>
          <p className="text-sm text-[#525866] dark:text-gray-300 mb-0">
            {t("Looking forward to working with you!")}
          </p>

          <p
            className="text-sm font-medium text-[#0A0D14] dark:text-gray-100 mt-4"
            style={{
              fontFamily: "Almarai",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "-1.1%",
            }}
          >
            {t("Contact Information:")}
          </p>
          <p
            className="text-sm text-[#0A0D14] dark:text-gray-200"
            style={{
              fontFamily: "Almarai",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "-1.1%",
            }}
          >
            {t("HR Email:")} {hrEmail}
          </p>
          <p
            className="text-sm text-[#0A0D14] dark:text-gray-200"
            style={{
              fontFamily: "Almarai",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "-1.1%",
            }}
          >
            {t("Phone")} {phoneNumber}
          </p>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center w-full gap-4 mt-2">
          <a
            href="#"
            className="text-[#757C8A] hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <RiMailFill size={21} />
          </a>
          <a
            href="#"
            className="text-[#757C8A] hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <RiYoutubeFill size={21} />
          </a>
          <a
            href="#"
            className="text-[#757C8A] hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <RiInstagramFill size={21} />
          </a>
          <a
            href="#"
            className="text-[#757C8A] hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <RiTwitterXFill size={21} />
          </a>
          <a
            href="#"
            className="text-[#757C8A] hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <RiLinkedinFill size={21} />
          </a>
          <a
            href="#"
            className="text-[#757C8A] hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <RiFacebookFill size={21} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmailInvitation;

EmailInvitation.propTypes = {
    userName: PropTypes.string,
    companyName: PropTypes.string,
    position: PropTypes.string,
    department: PropTypes.string,
    organization: PropTypes.string,
    hrEmail: PropTypes.string,
    phoneNumber: PropTypes.string,
  };
  
  EmailInvitation.defaultProps = {
    userName: "Amir",
    companyName: "[Company Name]",
    position: "Content Editor",
    department: "Publishing Department",
    organization: "Visionary Publishing",
    hrEmail: "hr@domain.com",
    phoneNumber: "+90 312 213 2965",
  };