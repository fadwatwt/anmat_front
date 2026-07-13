"use client";
import { useState, useCallback } from "react";
import {
  RiBuilding4Line,
  RiCheckboxCircleFill,
  RiCheckLine,
  RiCopperDiamondLine,
  RiFacebookCircleFill,
  RiFlashlightLine,
  RiLinkedinBoxFill,
  RiTwitterXLine,
} from "@remixicon/react";
import Collapse from "@/components/LandingPage/Collapse.jsx";
import FloatingAiButton from "@/components/FloatingAiButton";
import Link from "next/link";
import { useGetPublicSubscriptionPlansQuery } from "@/redux/plans/subscriptionPlansApi";
import { useTranslation } from "react-i18next";

function Desktop2Page() {
  const { i18n, t } = useTranslation();
  const [isOnSwitch, setIsOnSwitch] = useState(false);
  const { data: plans, isLoading } = useGetPublicSubscriptionPlansQuery();

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  return (
    <div
      className={
        "flex flex-col w-full items-center max-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900"
      }
    >
      <div
        id="home"
        className={
          "w-full flex justify-center bg-gradient-to-t to-primary-500 from-primary-900 via-primary-600 pt-5 px-4"
        }
      >
        <div className={"flex flex-col gap-8 w-full max-w-[87rem]"}>
          <div className={"flex justify-between items-center"}>
            <div className={"flex gap-4 md:gap-6 items-center"}>
              <div className={"flex items-center gap-2"}>
                <img
                  src="/images/LandingPage/logoBlue.png"
                  alt={t("logo")}
                  className={"w-8 h-8"}
                />
                <p className={"text-white"}>{t("Anmaat")}</p>
              </div>
              <nav className={"hidden md:flex gap-6 text-white"}>
                <button onClick={() => scrollToSection("home")} className={"list-none cursor-pointer hover:text-primary-200 transition-colors"}>{t("Home")}</button>
                <button onClick={() => scrollToSection("features")} className={"list-none cursor-pointer hover:text-primary-200 transition-colors"}>{t("Features")}</button>
                <button onClick={() => scrollToSection("pricing")} className={"list-none cursor-pointer hover:text-primary-200 transition-colors"}>{t("Pricing")}</button>
                <button onClick={() => scrollToSection("faq")} className={"list-none cursor-pointer hover:text-primary-200 transition-colors"}>{t("FAQ")}</button>
              </nav>
            </div>
            <div className={"flex items-center gap-3"}>
              <button
                onClick={() => i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar")}
                className="text-white text-sm md:text-base px-2 py-1 rounded-md border border-white/30 hover:bg-white/10 transition-colors"
                title={i18n.language === "ar" ? "English" : "العربية"}
              >
                {i18n.language === "ar" ? "EN" : "AR"}
              </button>
              <p className={"text-white text-sm md:text-base"}>
                {" "}
                <Link href="sign-in"> {t("Login")}</Link>
              </p>
              <Link href={"/register/subscriber/email"} className={"bg-white dark:bg-surface dark:text-gray-100 py-1.5 px-3 rounded-md text-sm md:text-base"}>
                {t("Sign up")}
              </Link>
            </div>
          </div>
          <div className={"w-full flex flex-col items-center gap-3 px-4 text-center"}>
            <p
              className={
                "text-3xl sm:text-4xl md:text-5xl max-w-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-400 via-primary-100 bg-clip-text text-transparent text-wrap "
              }
            >
              {t("Your Ultimate Management Dashboard")}
            </p>
            <p className={"text-primary-200 max-w-3xl text-sm sm:text-base"}>
              {t("All the tools you need for collaboration, analytics, and decision-making in one place.")}
            </p>
          </div>
          <div className={"flex justify-center items-center gap-3"}>
            <button className={"bg-white dark:bg-surface dark:text-gray-100 py-2 px-3 rounded-md text-sm"}>
              <a href="/dashboard"> {t("Get started")}</a>
            </button>
            <p className={"text-primary-200"}>
              <a href="/sign-in"> {t("Login")}</a>{" "}
            </p>
          </div>
          <div className={"flex justify-center w-full px-4"}>
            <img
              src="/images/LandingPage/dashboardImage.png"
              alt={t("dashboard image")}
              className={"w-full sm:w-10/12 md:w-8/12 rounded-xl dark:shadow-2xl dark:shadow-primary-900/30"}
            />
          </div>
        </div>
      </div>
      <div
        id="features"
        className={
          "w-full max-w-[87rem] flex flex-col justify-center items-center gap-10 px-4 py-8"
        }
      >
        <div className={"flex flex-col py-10 text-center"}>
          <p className={"text-blue-500 dark:text-blue-400 text-sm"}>{t("Main Features")}</p>
          <p className={"text-3xl sm:text-4xl font-bold text-black dark:text-white "}>{t("Key Features")}</p>
        </div>
        <div className={"w-full grid grid-cols-1 md:grid-cols-2 gap-6"}>
          <div
            className={
              "bg-gradient-to-tr from-[#FED2CC] to-[#FFDFDB80] dark:from-[#3a2020] dark:to-[#2a181880] py-0 w-full rounded-xl"
            }
          >
            <div className={"flex flex-col gap-2 items-start "}>
              <div
                className={
                  " pt-10 px-10 pb-4 flex-col items-start gap-2 text-start"
                }
              >
                <p className={"text-lg font-bold text-black dark:text-white"}>
                  {t("Performance Analytics")}
                </p>
                <p className={"text-black dark:text-gray-300 text-wrap"}>
                  {t("Track performance across tasks, employees, and departments.")}
                </p>
              </div>
              <div
                className={
                  "relative w-full h-56 sm:h-72 flex justify-center sm:justify-end px-4 sm:pr-10 py-0 overflow-hidden"
                }
              >
                <img
                  src="/images/LandingPage/pioChart.png"
                  alt={t("chart1")}
                  className={"w-48 sm:w-72 absolute sm:right-10 top-11"}
                />
                <img
                  src="/images/LandingPage/chart1.png"
                  alt={t("chart1")}
                  className={"w-48 sm:w-72 absolute sm:right-64 -top-4 hidden sm:block"}
                />
              </div>
            </div>
          </div>
          <div
            className={
              "bg-gradient-to-tr from-[#D2C3FE] to-[#E2D6FF80] dark:from-[#2a2040] dark:to-[#1e183080] w-full rounded-md"
            }
          >
            <div className={"flex flex-col gap-2 items-start "}>
              <div
                className={
                  " pt-10 px-6 sm:px-10 pb-4 flex-col items-start gap-2 text-start"
                }
              >
                <p className={"text-lg font-bold text-black dark:text-white"}>
                  {t("Performance Analytics")}
                </p>
                <p className={"text-black dark:text-gray-300 text-wrap"}>
                  {t("Track performance across tasks, employees, and departments.")}
                </p>
              </div>
              <div
                className={
                  "relative w-full h-56 sm:h-72 flex justify-center px-4 sm:pr-10 py-0 overflow-hidden"
                }
              >
                <img
                  src="/images/LandingPage/notifications.png"
                  alt={t("notifications image")}
                  className={"w-64 sm:w-96 absolute -top-3"}
                />
              </div>
            </div>
          </div>
          <div
            className={
              "bg-gradient-to-tr from-[#BFDDD1] to-[#D6EAE180] dark:from-[#1e2e28] dark:to-[#18282080] w-full rounded-xl"
            }
          >
            <div className={"flex flex-col gap-2 items-start "}>
              <div
                className={
                  " pt-10 px-6 sm:px-10 pb-4 flex-col items-start gap-2 text-start"
                }
              >
                <p className={"text-lg font-bold text-black dark:text-white"}>
                  {t("Performance Analytics")}
                </p>
                <p className={"text-black dark:text-gray-300 text-wrap"}>
                  {t("Track performance across tasks, employees, and departments.")}
                </p>
              </div>
              <div
                className={
                  "relative w-full h-56 sm:h-72 flex justify-center sm:justify-end px-4 sm:pr-10 py-0 overflow-hidden"
                }
              >
                <img
                  src="/images/LandingPage/fileInputImage.png"
                  alt={t("chart1")}
                  className={"w-48 sm:w-72 absolute sm:right-64 -top-4 hidden sm:block"}
                />
                <img
                  src="/images/LandingPage/followAndUnfollowModalImage.png"
                  alt={t("chart1")}
                  className={"w-48 sm:w-72 absolute sm:right-10 top-11"}
                />
              </div>
            </div>
          </div>
          <div
            className={
              "bg-gradient-to-tr from-[#C7D5FF] to-[#E5EBFF80] dark:from-[#1e2240] dark:to-[#181e3080] w-full rounded-xl"
            }
          >
            <div className={"flex flex-col gap-2 items-start "}>
              <div
                className={
                  " pt-10 px-6 sm:px-10 pb-4 flex-col items-start gap-2 text-start"
                }
              >
                <p className={"text-lg font-bold text-black dark:text-white"}>
                  {t("Performance Analytics")}
                </p>
                <p className={"text-black dark:text-gray-300 text-wrap"}>
                  {t("Track performance across tasks, employees, and departments.")}
                </p>
              </div>
              <div
                className={
                  "relative w-full h-56 sm:h-72 flex justify-center sm:justify-end px-4 sm:pr-10 py-0 overflow-hidden"
                }
              >
                <img
                  src="/images/LandingPage/taskStagesImage.png"
                  alt={t("chart1")}
                  className={"w-64 sm:w-96 absolute sm:right-52 top-11"}
                />
                <img
                  src="/images/LandingPage/projectDetailsImage.png"
                  alt={t("chart1")}
                  className={"w-48 sm:w-72 absolute sm:right-0 -top-4 hidden sm:block"}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            "bg-primary-700 w-full rounded-xl flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-3 px-6"
          }
        >
          <div
            className={
              "flex flex-col items-center md:items-start justify-start gap-6 py-8 md:py-10 px-4 md:px-10 text-center md:text-start"
            }
          >
            <p className={"text-white text-2xl md:text-3xl font-bold"}>
              {t("Connect with your team")}
            </p>
            <div className={"flex flex-col gap-6"}>
              <div className={"flex gap-1 items-center md:items-start"}>
                <RiCheckboxCircleFill size={"24"} className={"text-white shrink-0"} />
                <p className={"text-base md:text-lg text-white"}>
                  {t("Seamless Communication & Collaboration")}
                </p>
              </div>
              <div className={"flex gap-1 items-center md:items-start"}>
                <RiCheckboxCircleFill size={"24"} className={"text-white shrink-0"} />
                <p className={"text-base md:text-lg text-white"}>{t("Real-time messaging")}</p>
              </div>
              <div className={"flex gap-1 items-center md:items-start"}>
                <RiCheckboxCircleFill size={"24"} className={"text-white shrink-0"} />
                <p className={"text-base md:text-lg text-white"}>
                  {t("Effortless meeting scheduling")}
                </p>
              </div>
              <div className={"flex gap-1 items-center md:items-start"}>
                <RiCheckboxCircleFill size={"24"} className={"text-white shrink-0"} />
                <p className={"text-base md:text-lg text-white"}>
                  {t("Stay organized & on track")}
                </p>
              </div>
              <div className={"w-full md:w-1/2"}>
                <Link
                  href="/register/subscriber/email"
                  className={
                    "py-2 rounded-xl w-full bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-50 block text-center"
                  }
                >
                  {t("Get started")}
                </Link>
              </div>
            </div>
          </div>
          <div className={"py-8 px-4 md:px-0"}>
            <img
              src="/images/LandingPage/companyImag1.png"
              alt={t("company")}
              className={"w-full max-w-[320px] md:max-w-[480px]"}
            />
          </div>
        </div>
        <div id="pricing" className={"flex flex-col w-full "}>
          <div className={"flex flex-col py-10 gap-12"}>
            <div className={"flex flex-col items-center w-full"}>
              <p className={"text-blue-500 dark:text-blue-400 text-sm"}>{t("Main Features")}</p>
              <p className={"text-4xl font-bold text-black dark:text-white "}>
                {t("Plans tailored for your team")}
              </p>
            </div>
            <div className={"flex items-center justify-center gap-3 relative"}>
              <p className={!isOnSwitch ? "font-bold text-primary-600 dark:text-primary-300" : "dark:text-gray-300"}>{t("Pay Monthly")}</p>
              <button
                type={"button"}
                onClick={() => setIsOnSwitch(!isOnSwitch)}
                className={`w-10 h-5 flex items-center dark:shadow-inner dark:drop-shadow shadow-gray-500 dark:border border-gray-700 rounded-full p-0.5 transition-colors ${isOnSwitch
                  ? "bg-primary-500 dark:bg-primary-200"
                  : "bg-[#E2E4E9] dark:bg-gray-800"
                  }`}
              >
                <div
                  className={`relative bg-white dark:bg-gray-400 dark:shadow-inner dark:shadow-gray-500 w-3.5 h-3.5 rounded-full transform transition-transform flex items-center justify-center ${isOnSwitch ? (i18n?.language === "ar" ? "-translate-x-5" : "translate-x-5") : ""}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full dark:shadow-inner drop-shadow shadow-gray-500 `}
                  />
                </div>
              </button>
              <p className={isOnSwitch ? "font-bold text-primary-600 dark:text-primary-300" : "dark:text-gray-300"}>{t("Pay Yearly")}</p>
              <img
                src="/images/LandingPage/arrowSwitchImage.png"
                alt={t("arrow")}
                className={"absolute w-[120px] md:w-[185px] h-[50px] md:h-[87px] right-[8rem] md:right-[24rem] -top-7 hidden md:block"}
              />
            </div>
            <div className={"w-full flex justify-center items-center gap-6 flex-wrap px-4"}>
              {isLoading ? (
                <div className="w-full flex justify-center items-center gap-6 flex-wrap px-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full md:w-[45%] lg:w-[30%] xl:w-[28%] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col gap-6 py-10 px-8 bg-white dark:bg-surface">
                      <div className="flex flex-col gap-3 justify-center items-center text-center">
                        <div className="rounded-full w-14 h-14 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                      <div className="flex-1 w-full mt-4 flex flex-col gap-4">
                        {[1, 2, 3, 4, 5].map((j) => (
                          <div key={j} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                      <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : plans?.filter(p => p.is_active)?.length > 0 ? (
                plans?.filter(plan => plan.is_active).map((plan) => {
                  const currentInterval = isOnSwitch ? "year" : "month";
                  const pricing = plan.pricing?.find(p => p.interval === currentInterval && p.is_active);
                  const Icon = plan.name?.toLowerCase().includes('enterprise') ? RiBuilding4Line :
                    plan.name?.toLowerCase().includes('pro') ? RiCopperDiamondLine : RiFlashlightLine;

                  const isHighlighted = plan.name?.toLowerCase().includes('pro');

                  return (
                    <div
                      key={plan._id}
                      className={`
                        w-full md:w-[45%] lg:w-[30%] xl:w-[28%] rounded-2xl border shadow-lg flex flex-col gap-6 py-10 px-8 transition-all duration-300 hover:-translate-y-2
                        ${isHighlighted ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 transform scale-105 shadow-primary-200' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-surface hover:shadow-xl'}
                      `}
                    >
                      <div className={"flex flex-col gap-3 justify-center items-center text-center"}>
                        <div className={`rounded-full w-14 h-14 flex items-center justify-center ${isHighlighted ? 'bg-primary-500' : 'bg-primary-100 dark:bg-primary-800'}`}>
                          <span className={`rounded-full p-2 flex items-center justify-center ${isHighlighted ? 'bg-primary-400' : 'bg-primary-200 dark:bg-primary-700'}`}>
                            <Icon size={"28"} className={isHighlighted ? "text-white" : "text-primary-700 dark:text-primary-200"} />
                          </span>
                        </div>
                        <h3 className={"text-primary-800 dark:text-primary-200 text-2xl font-extrabold mt-2"}>{plan.name}</h3>
                        <div className={"flex items-end justify-center gap-1"}>
                          <span className={"text-5xl font-black text-gray-900 dark:text-gray-100"}>
                            ${pricing ? pricing.price : '-'}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                            /{currentInterval === 'month' ? t('mo') : t('yr')}
                          </span>
                        </div>
                        <p className={"text-gray-500 dark:text-gray-400 text-sm h-12 line-clamp-2 mt-2"}>
                          {plan.description || t("Everything you need to manage your business efficiently.")}
                        </p>
                      </div>

                      <div className={"flex-1 w-full mt-4"}>
                        <div className={"flex flex-col items-start gap-4"}>
                          {plan.features?.slice(0, 6).map((feature, fIdx) => (
                            <div key={fIdx} className={"flex items-center gap-3 w-full"}>
                              <div className={`w-6 h-6 flex justify-center items-center rounded-full shrink-0 ${isHighlighted ? 'bg-primary-500' : 'bg-primary-100 dark:bg-primary-800'}`}>
                                <RiCheckLine size={"16"} className={isHighlighted ? "text-white" : "text-primary-700 dark:text-primary-200"} />
                              </div>
                              <p className={"text-sm font-medium text-gray-700 dark:text-gray-300"}>
                                {feature.plan_feature?.title || feature.feature_type?.title}
                                {feature.properties?.[0] && <span className="text-gray-500 dark:text-gray-400"> ({feature.properties[0].value})</span>}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Link
                        href={pricing ? `/register/subscriber/email?plan=${plan._id}&interval=${currentInterval}` : '#'}
                        className={`
                          rounded-xl w-full py-3.5 text-center font-bold text-lg transition-all
                          ${!pricing
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-100 cursor-not-allowed'
                            : isHighlighted
                              ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                              : 'bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 text-primary-800 dark:text-primary-50'}
                        `}
                      >
                        {pricing ? t('Get started') : t('Not available')}
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center py-20 w-full text-gray-500 dark:text-gray-400 text-lg">{t("No active plans available at the moment.")}</div>
              )}
            </div>

          </div>
        </div>
        <div className={"flex flex-col gap-5 justify-center items-center w-full px-4 py-8"}>
          <p className={"text-base sm:text-lg text-gray-400 dark:text-gray-500"}>{t("Trusted by X companies")}</p>
          <div className={"flex flex-wrap items-center justify-center max-w-full px-4 sm:px-10 gap-6 sm:gap-8 opacity-60 dark:opacity-40"}>
            <img
              src="/images/LandingPage/Companys/company1.png"
              alt={""}
              className={"w-28 sm:w-36 md:w-44 dark:brightness-0 dark:invert"}
            />
            <img
              src="/images/LandingPage/Companys/company2.png"
              alt={""}
              className={"w-28 sm:w-36 md:w-44 dark:brightness-0 dark:invert"}
            />
            <img
              src="/images/LandingPage/Companys/company3.png"
              alt={""}
              className={"w-28 sm:w-36 md:w-44 dark:brightness-0 dark:invert"}
            />
            <img
              src="/images/LandingPage/Companys/company4.png"
              alt={""}
              className={"w-28 sm:w-36 md:w-44 dark:brightness-0 dark:invert"}
            />
            <img
              src="/images/LandingPage/Companys/company5.png"
              alt={""}
              className={"w-28 sm:w-36 md:w-44 dark:brightness-0 dark:invert"}
            />
          </div>
        </div>
        <div id="faq" className={"flex flex-col gap-5 w-full md:w-3/4 lg:w-1/2 px-4"}>
          <div className={"flex flex-col gap-5 text-center md:text-start items-center"}>
            <p className={"text-black text-xl sm:text-2xl font-bold dark:text-white"}>
              {t("Frequently asked questions")}
            </p>
            <p className={"text-gray-500 dark:text-gray-400 text-sm sm:text-base"}>
              {t("Everything you need to know about managing your dashboard.")}
            </p>
          </div>
          <div className={"flex flex-col px-0 md:px-10 lg:px-20 gap-5 "}>
            <Collapse
              title={t("Can I customize permissions for my team?")}
              text={t("Yes, the dashboard allows you to set and customize permissions based on roles, ensuring secure and efficient task delegation.")}
            />
            <Collapse
              title={t("Can I switch to a different plan later?")}
              text={t("Yes, the dashboard allows you to set and customize permissions based on roles, ensuring secure and efficient task delegation.")}
            />
            <Collapse
              title={t("What happens to data if I cancel my subscription?")}
              text={t("Yes, the dashboard allows you to set and customize permissions based on roles, ensuring secure and efficient task delegation.")}
            />
            <Collapse
              title={t("Can I integrate third-party tools with the dashboard?")}
              text={t("Yes, the dashboard allows you to set and customize permissions based on roles, ensuring secure and efficient task delegation.")}
            />
            <Collapse
              title={t("How does the analytics feature work?")}
              text={t("Yes, the dashboard allows you to set and customize permissions based on roles, ensuring secure and efficient task delegation.")}
            />
            <Collapse
              title={t("How do I update my contact email?")}
              text={t("Yes, the dashboard allows you to set and customize permissions based on roles, ensuring secure and efficient task delegation.")}
            />
            <div className={"flex flex-col items-center gap-5 pt-10 pb-16 text-center"}>
              <div className={"flex justify-center"}>
                <div className={"p-1 rounded-full"}>
                  <img
                    src="/images/users/user1.png"
                    alt={t("user1")}
                    className={"rounded-full w-10 h-10"}
                  />
                </div>
                <div className={"p-1 rounded-full -ml-2"}>
                  <img
                    src="/images/users/user2.png"
                    alt={t("user2")}
                    className={"rounded-full w-10 h-10"}
                  />
                </div>
                <div className={"p-1 rounded-full -ml-2"}>
                  <img
                    src="/images/users/user3.png"
                    alt={t("user3")}
                    className={"rounded-full w-10 h-10"}
                  />
                </div>
              </div>
              <div className={"flex flex-col gap-2"}>
                <p className={"text-xl text-black dark:text-white"}>{t("Connect with us")}</p>
                <p className={"text-gray-600 dark:text-gray-400 text-sm"}>
                  {t("Quickly get started by exploring our product today!")}
                </p>
              </div>
              <Link
                href="/register/subscriber/email"
                className={"bg-primary-base dark:bg-primary-600 text-white rounded-xl py-2 px-3 inline-block"}
              >
                {t("Get started")}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={"w-full bg-gray-700 dark:bg-gray-800"}>
        <div className={"max-w-[87rem] mx-auto px-4 sm:px-7 py-12 sm:py-16"}>
          <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"}>
            <div className={"flex flex-col gap-4"}>
              <div className={"flex gap-2 items-center"}>
                <img src="/images/LandingPage/logoBlue.png" alt={""} className={"w-8"} />
                <p className={"text-white font-bold text-lg"}>{t("Anmaat")}</p>
              </div>
              <p className={"text-gray-300 text-sm leading-relaxed"}>
                {t("All the tools you need for collaboration, analytics, and decision-making in one place.")}
              </p>
              <div className={"flex items-center gap-3 mt-2"}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={"text-gray-300 hover:text-white transition-colors"}>
                  <RiFacebookCircleFill size={"22"} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={"text-gray-300 hover:text-white transition-colors"}>
                  <RiLinkedinBoxFill size={"22"} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={"text-gray-300 hover:text-white transition-colors"}>
                  <RiTwitterXLine size={"22"} />
                </a>
              </div>
            </div>
            <div className={"flex flex-col gap-3"}>
              <p className={"text-gray-100 font-semibold mb-2"}>{t("Product")}</p>
              <button onClick={() => scrollToSection("features")} className={"text-gray-300 hover:text-white text-sm text-start transition-colors"}>{t("Features")}</button>
              <button onClick={() => scrollToSection("pricing")} className={"text-gray-300 hover:text-white text-sm text-start transition-colors"}>{t("Pricing")}</button>
              <Link href="/sign-in" className={"text-gray-300 hover:text-white text-sm transition-colors"}>{t("Login")}</Link>
              <Link href="/register/subscriber/email" className={"text-gray-300 hover:text-white text-sm transition-colors"}>{t("Sign up")}</Link>
            </div>
            <div className={"flex flex-col gap-3"}>
              <p className={"text-gray-100 font-semibold mb-2"}>{t("Company")}</p>
              <button onClick={() => scrollToSection("home")} className={"text-gray-300 hover:text-white text-sm text-start transition-colors"}>{t("About")}</button>
              <button onClick={() => scrollToSection("faq")} className={"text-gray-300 hover:text-white text-sm text-start transition-colors"}>{t("FAQ")}</button>
            </div>
            <div className={"flex flex-col gap-3"}>
              <p className={"text-gray-100 font-semibold mb-2"}>{t("Support")}</p>
              <a href="mailto:support@anmat.com" className={"text-gray-300 hover:text-white text-sm transition-colors"}>{t("Contact Us")}</a>
              <a href="mailto:help@anmat.com" className={"text-gray-300 hover:text-white text-sm transition-colors"}>{t("Help Center")}</a>
            </div>
          </div>
        </div>
        <div className={"border-t border-gray-600 dark:border-gray-700"}>
          <div className={"max-w-[87rem] mx-auto px-4 sm:px-7 py-6 flex flex-col sm:flex-row justify-between items-center gap-3"}>
            <p className={"text-gray-400 text-sm"}>
              {t("© 2025 Anmaat. All rights reserved.")}
            </p>
            <div className={"flex gap-6 text-sm"}>
              <a href="/privacy" className={"text-gray-400 hover:text-gray-200 transition-colors"}>{t("Privacy Policy")}</a>
              <a href="/terms" className={"text-gray-400 hover:text-gray-200 transition-colors"}>{t("Terms of Service")}</a>
            </div>
          </div>
        </div>
      </div>
      <FloatingAiButton />
    </div>
  );
}

export default Desktop2Page;
