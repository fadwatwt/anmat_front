"use client";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LiaUserShieldSolid } from "react-icons/lia";
import { MdOutlinePendingActions } from "react-icons/md";

const EmployeeAccountSetup = () => {
    const { t } = useTranslation();
    const user = useSelector((state) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            if (user.type !== "Employee") {
                router.push("/dashboard");
            } else if (user.employee_detail && user.is_active) {
                router.push("/dashboard");
            }
        }
    }, [user, router]);

    if (!user || user.type !== "Employee") return null;

    const noDetails = !user.employee_detail;
    const inactive = !user.is_active;

    return (
        <div className="flex flex-col items-center justify-center gap-8 p-8 w-full text-center">
            <div className="flex flex-col items-center gap-6 max-w-2xl">
                <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 shadow-sm">
                    {noDetails ? (
                        <LiaUserShieldSolid size={48} />
                    ) : (
                        <MdOutlinePendingActions size={48} />
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t("Account Processing")}
                    </h1>

                    <div className="space-y-4">
                        {noDetails && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <p className="text-lg text-gray-700 dark:text-gray-300">
                                    {t("No employee details found. Please call the manager to complete your account.")}
                                </p>
                            </div>
                        )}

                        {inactive && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <p className="text-lg text-gray-700 dark:text-gray-300">
                                    {t("Your account is not activated by the manager.")}
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        {t("Once the manager completes the required actions, you will be able to access your dashboard.")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmployeeAccountSetup;
