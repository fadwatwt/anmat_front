"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRequestVerificationMutation, useLazyGetUserQuery } from "@/redux/auth/authAPI";
import { selectAuth, setUser } from "@/redux/auth/authSlice";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

const VerifyEmail = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(selectAuth);
    const [requestVerification, { isLoading: isRequesting, isSuccess, isError, error, data }] = useRequestVerificationMutation();
    const [triggerGetUser, { isLoading: isFetchingUser }] = useLazyGetUserQuery();
    const [timeLeft, setTimeLeft] = useState(0);
    const [hasRequested, setHasRequested] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const nextSendAt = user?.email_verification?.next_send_at;

    useEffect(() => {
        if (!nextSendAt) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = new Date(nextSendAt).getTime();
            const difference = target - now;

            if (difference <= 0) {
                setTimeLeft(0);
                return true;
            } else {
                setTimeLeft(Math.floor(difference / 1000));
                return false;
            }
        };

        const isFinished = calculateTimeLeft();
        if (isFinished) return;

        const interval = setInterval(() => {
            if (calculateTimeLeft()) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [nextSendAt]);

    const formatTimeSpaced = (seconds) => {
        if (seconds <= 0) return "0 0 : 0 0";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        const m1 = Math.floor(mins / 10);
        const m2 = mins % 10;
        const s1 = Math.floor(secs / 10);
        const s2 = secs % 10;

        return `${m1} ${m2} : ${s1} ${s2}`;
    };

    const handleResend = async () => {
        if (timeLeft > 0 || isRequesting || isRefreshing || isFetchingUser) return;

        try {
            setIsRefreshing(true);
            await requestVerification().unwrap();
            setHasRequested(true);

            // Fetch user data to update next_send_at timer from the latest API state
            const token = localStorage.getItem("token");
            if (token) {
                const userResult = await triggerGetUser(token).unwrap();
                const userData = userResult?.data || userResult;
                if (userData) {
                    dispatch(setUser(userData));
                }
            }
        } catch (err) {
            console.error("Failed to resend verification email:", err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const isLoading = isRequesting || isFetchingUser || isRefreshing;

    return (
        <>
            {isSuccess && <ApiResponseAlert status="success" message={data?.message || "Verification email sent!"} />}
            {isError && <ApiResponseAlert status="error" message={error?.data?.message || "Failed to send verification email."} />}

            <div className="relative rounded-xl px-12 py-16 border">
                <div className="absolute top-0 left-0 w-full">
                    <img src="/images/patterns/pattern_rec_top.png" className="w-full h-[120px]" alt="" />
                </div>
                <div className="flex flex-col items-center justify-center gap-8 w-full h-full">
                    <div>
                        <svg width="126" height="127" viewBox="0 0 126 127" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M94.5 95C111.897 77.603 111.897 49.397 94.5 32C77.103 14.603 48.897 14.603 31.5 32C14.103 49.397 14.103 77.603 31.5 95C48.897 112.397 77.103 112.397 94.5 95Z" fill="#EBF1FF" />
                            <path d="M91.1792 82H34.8206C34.3693 82 34 81.6304 34 81.1787V47.8213C34 47.3696 34.3693 47 34.8206 47H91.1794C91.6307 47 92 47.3696 92 47.8213V81.1787C92 81.6304 91.6307 82 91.1792 82Z" fill="#6494FF" />
                            <path d="M35.7576 53.2276L60.9895 69.4613C62.0984 70.1747 63.474 70.1799 64.5875 69.4748L90.2213 53.2411C93.3677 51.2485 92.0714 46 88.4328 46H37.5672C33.9416 45.9999 32.635 51.2186 35.7576 53.2276Z" fill="#375DFB" />
                            <path d="M96.1099 81.8881C94.8884 81.8362 93.7717 81.2652 92.9048 80.4926C91.9284 79.6225 91.2765 78.4957 90.7821 77.3399C90.4858 76.6473 90.2371 75.9385 89.9894 75.2303C89.8803 74.9186 89.4277 74.928 89.3144 75.2303C88.935 76.2424 88.469 77.2235 87.9174 78.1656C87.4596 78.9474 86.9489 79.7308 86.201 80.3061C86.1695 80.3302 86.1376 80.3536 86.1052 80.3765C85.2856 80.8472 84.3188 81.0805 83.3433 81.0344C82.9553 81.016 82.8584 81.6051 83.2502 81.6702C85.9171 82.1127 88.1528 84.0426 88.965 86.4157C89.1951 87.088 89.3063 87.7827 89.2879 88.488C89.278 88.8722 89.8447 88.9015 89.9754 88.5741C90.8373 86.415 91.8353 84.0089 94.2189 82.9329C94.8081 82.6669 95.454 82.5255 96.1098 82.5355C96.5621 82.5422 96.5583 81.9071 96.1099 81.8881Z" fill="#375DFB" />
                            <path d="M103.759 67.3398C102.892 67.2966 102.098 66.8211 101.483 66.178C100.789 65.4534 100.326 64.5152 99.9749 63.5529C99.7644 62.9763 99.5877 62.3861 99.4118 61.7963C99.3344 61.5368 99.0127 61.5446 98.9322 61.7963C98.6627 62.6391 98.3317 63.456 97.9397 64.2404C97.6146 64.8913 97.2518 65.5436 96.7205 66.0227C96.6982 66.0429 96.6755 66.0623 96.6525 66.0813C96.0703 66.4733 95.3835 66.6675 94.6906 66.629C94.415 66.6138 94.3462 67.1043 94.6245 67.1584C96.519 67.5269 98.1072 69.1337 98.6842 71.1096C98.8477 71.6695 98.9266 72.2479 98.9136 72.8351C98.9066 73.155 99.3091 73.1793 99.402 72.9067C100.014 71.1088 100.723 69.1055 102.416 68.2096C102.835 67.9882 103.294 67.8704 103.759 67.8787C104.081 67.8846 104.078 67.3557 103.759 67.3398Z" fill="#375DFB" />
                        </svg>
                    </div>

                    <div className="flex flex-col items-center justify-start gap-8 text-center w-[30rem]">
                        <div className="flex flex-col gap-1 text-2xl w-full">
                            <span className="text-gray-900 dark:text-gray-50">
                                {"Email Verification"}
                            </span>
                        </div>

                        <span className="block text-gray-500 text-lg text-wrap px-4">
                            {hasRequested || isSuccess
                                ? "We have sent you a link to your email for verifying your account, please check your email and continue."
                                : "To complete your account setup, please verify your email address by clicking the link we sent to your inbox."
                            }
                        </span>

                        <button
                            onClick={handleResend}
                            disabled={timeLeft > 0 || isLoading}
                            className="bg-primary-500 text-primary-50 text-nowrap text-sm px-12 py-2 rounded-lg cursor-pointer
                                        hover:bg-primary-600 text-center disabled:bg-primary-400 disabled:cursor-auto transition-colors"
                        >
                            {isLoading ? "Sending..." : "Send New Email"}
                        </button>
                        <span className="block text-gray-500 text-xs text-wrap px-4">
                            resend after <span className="text-primary-500 text-sm mx-2 uppercase tabular-nums">{formatTimeSpaced(timeLeft)}</span>
                        </span>
                    </div>

                </div>
            </div>
        </>
    );
};

export default VerifyEmail;