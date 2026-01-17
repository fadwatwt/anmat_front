"use client";
import { RiGlobalLine } from "@remixicon/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useLazyGetUserQuery } from "@/redux/auth/authAPI";
import { loginSuccess } from "@/redux/auth/authSlice";

function AuthLayout({ children }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [triggerGetUser] = useLazyGetUserQuery();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const result = await triggerGetUser(token).unwrap();
                // Reconstruct the payload expected by loginSuccess
                const payload = {
                    data: {
                        access_token: token,
                        user: result.data || result
                    }
                };
                dispatch(loginSuccess(payload));
                router.push("/dashboard");
            } catch (error) {
                console.error("Auth check failed", error);
                localStorage.removeItem("token");
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, [dispatch, router, triggerGetUser]);

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12">
                    <Image
                        className="w-12 h-12 rounded-full"
                        src="/images/logo.png"
                        alt="Company Logo"
                        width={48}
                        height={48}
                    />
                </div>
                <span className="text-md text-gray-700 dark:text-gray-50">{"Loading ..."}</span>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-start py-1 bg-white">
            <div className="flex flex-col w-[40%] h-screen overflow-hidden gap-8 px-9 py-7">
                {/* Logo Section */}
                <div className="flex items-center justify-start gap-3 mb-8">
                    <Image
                        className="w-12 h-12 rounded-full"
                        src="/images/logo.png"
                        alt="Company Logo"
                        width={48}
                        height={48}
                    />
                    <div className="text-sm text-sub-500 text-start dark:text-sub-300">
                        <h1 className="font-bold text-xl">ANMAT</h1>
                        <h3 className="">Organizations Management</h3>
                        {/*<h3 className="font-semibold">Management System</h3>*/}
                    </div>
                </div>

                {/* Placeholder for login form (this should be a Client Component) */}
                <div className="w-full flex flex-col items-center gap-8 justify-between h-full overflow-auto">
                    <div className="w-full px-12">{children}</div>
                </div>

                <div className="w-full flex flex-wrap gap-4 items-center justify-between">
                    <button className="flex gap-2 items-center bg-transparent">
                        <RiGlobalLine size={20} />
                        <span className="text-md text-gray-700">عربي</span>
                    </button>
                </div>
            </div>

            {/* Right Side Image/Placeholder */}
            <div className="flex flex-col justify-center flex-1 rounded-xl bg-main-900 relative overflow-hidden m-2">
                <div className="absolute top-12 left-36 w-full">
                    <img
                        src="/images/LandingPage/dashboardImage.png"
                        alt="image"
                        className="w-full"
                    />
                </div>
                <div className="h-[75vh]"></div>
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-2xl text-gray-900">
                        {"The Ultimate Management Dashboard"}
                    </span>
                    <span className="text-lg text-gray-500">
                        {
                            "Everything you require for teamwork, analysis, and making decisions all in a single location."
                        }
                    </span>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
