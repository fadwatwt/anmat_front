"use client";

import { useState } from "react";
import { LiaUser } from "react-icons/lia";
import { GoMail } from "react-icons/go";
import { IoIosLock } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminLoginMutation, useLazyGetUserQuery, useLazyLogoutQuery } from "@/redux/auth/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure, logout } from "@/redux/auth/authSlice";
import Link from "next/link";

import { useEffect, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { getToken, clearToken } from "@/utils/tokenStorage";

function SignIn() {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [adminLogin, { isLoading }] = useAdminLoginMutation();
    const { error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    // الوجهة التي طُرد منها الأدمن عبر Middleware (?next=...) — نعود إليها
    // فقط إذا كانت مساراً داخلياً آمناً وليست شاشة auth.
    const getSafeNext = () => {
        const next = searchParams?.get("next");
        if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
        if (
            next === "/sign-in" ||
            next.startsWith("/sign-in?") ||
            next.startsWith("/admin/sign-in") ||
            next.startsWith("/register") ||
            next.startsWith("/forget-password") ||
            next.startsWith("/verify")
        )
            return null;
        return next;
    };

    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const [triggerGetUser] = useLazyGetUserQuery();
    const [triggerLogout] = useLazyLogoutQuery();

    const performLogout = async (tokenToUse) => {
        const token = tokenToUse || getToken();
        if (token) {
            try {
                await triggerLogout(token);
            } catch (err) {
                console.error("Logout API failed", err);
            }
        }
        dispatch(logout());
        setIsCheckingAuth(false);
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();

            if (token) {
                try {
                    const userResponse = await triggerGetUser(token).unwrap();
                    const userData = userResponse.data || userResponse;

                    if (userData?.type === 'Admin') {
                        const loginPayload = {
                            data: {
                                access_token: token,
                                user: userData
                            }
                        };
                        dispatch(loginSuccess(loginPayload));
                        router.push(getSafeNext() || "/dashboard");
                    } else {
                        console.warn("User is not admin, logging out.");
                        await performLogout(token);
                        dispatch(loginFailure(t("Access Denied: You do not have administrator privileges.")));
                    }
                } catch (err) {
                    console.error("Token validation failed:", err);
                    clearToken();
                    setIsCheckingAuth(false);
                }
            } else {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [router, dispatch, triggerGetUser, triggerLogout]);



    // Prevent rendering the login form while we check for an existing session
    if (isCheckingAuth) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await adminLogin({ email, password }).unwrap();
            const userData = response.data?.user;

            if (userData?.type === 'Admin') {
                dispatch(loginSuccess({ ...response, data: { ...response.data, remember: rememberMe } }));
                router.push(getSafeNext() || "/dashboard");
            } else {
                // Logout immediately using the new token
                await performLogout(response.data?.access_token);
                dispatch(loginFailure(t("Access Denied: You do not have administrator privileges.")));
                setIsSubmitting(false);
            }
        } catch (err) {
            // Check for "Already logged in" case in error response
            if (err.data?.status === 'failed' && err.data?.message === 'Already logged in' && err.data?.data?.access_token) {
                try {
                    const token = err.data.data.access_token;
                    const userResponse = await triggerGetUser(token).unwrap();
                    const userData = userResponse.data || userResponse;

                    if (userData?.type === 'Admin') {
                        const loginPayload = {
                            data: {
                                access_token: token,
                                user: userData,
                                remember: rememberMe
                            }
                        };
                        dispatch(loginSuccess(loginPayload));
                        router.push(getSafeNext() || "/dashboard");
                        return;
                    } else {
                        await performLogout(token);
                        dispatch(loginFailure(t("Access Denied: You do not have administrator privileges.")));
                        setIsSubmitting(false);
                        return;
                    }
                } catch (userErr) {
                    console.error("Failed to recover session:", userErr);
                    dispatch(loginFailure(t("Session recovery failed. Please try again.")));
                    setIsSubmitting(false);
                    return;
                }
            }
            // Standard error handling
            dispatch(loginFailure(err.data?.message || t("Login failed")));
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="loginForm flex flex-col gap-3">
            <div className="flex flex-col items-center gap-3">
                <div className="flex w-20 h-20 justify-center items-center rounded-full bg-status-bg">
                    <div className="flex w-12 h-12 justify-center items-center rounded-full bg-surface shadow-md">
                        <LiaUser size={30} className="text-cell-primary" />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-2xl text-cell-primary">
                        {t("Sign in to your account")}
                    </span>
                    <span className="text-sm text-cell-secondary">
                        {t("Enter your credentials to sign in")}
                    </span>
                </div>

                <div className="w-full">
                    <div className="flex flex-col gap-2 w-full">
                        <label className={`flex bg-surface border-status-border pl-2 px-2 w-full items-center border-2 rounded-xl ${(isLoading || isSubmitting) ? 'opacity-70' : ''}`}>
                            <GoMail className="text-cell-secondary w-10" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("Enter your email")}
                                className="w-full py-3 px-2 outline-none bg-transparent dark:bg-gray-800 text-cell-primary dark:text-gray-100 dark:placeholder-gray-400"
                                required
                                disabled={isLoading || isSubmitting}
                            />
                        </label>

                        <label className={`flex bg-surface border-status-border pl-2 px-2 w-full items-center border-2 rounded-xl ${(isLoading || isSubmitting) ? 'opacity-70' : ''}`}>
                            <IoIosLock className="text-cell-secondary w-10" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t("Enter your password")}
                                className="w-full py-3 px-2 outline-none bg-transparent dark:bg-gray-800 text-cell-primary dark:text-gray-100 dark:placeholder-gray-400"
                                required
                                disabled={isLoading || isSubmitting}
                                aria-label={t("Password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="p-2 text-cell-secondary hover:text-cell-primary transition-colors"
                                aria-label={showPassword ? t("Hide password") : t("Show password")}
                                tabIndex={-1}
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </label>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isLoading || isSubmitting}
                                />
                                <p className="text-sm text-cell-primary">{t("Remember Me")}</p>
                            </div>
                            <Link href="/forget-password"
                                className={`text-sm text-primary-base hover:text-primary-600 underline dark:text-primary-400 cursor-pointer ${(isLoading || isSubmitting) ? 'pointer-events-none text-gray-400 dark:text-gray-500' : ''}`}>
                                {t("Forgot Password?")}
                            </Link>
                        </div>

                        {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading || isSubmitting}
                            className="w-full rounded-lg bg-primary-base dark:bg-primary-200 text-white dark:text-black py-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {(isLoading || isSubmitting) ? t("Loading...") : t("Login")}
                        </button>

                        {/*Google Login Button*/}
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    className="w-full rounded-lg border border-status-border py-1.5 flex gap-2 justify-center items-center hover:bg-status-bg transition-colors"*/}
                        {/*>*/}
                        {/*    <FcGoogle/>*/}
                        {/*    <span className="text-sm">Login with Google</span>*/}
                        {/*</button>*/}

                        {/*Return to Sign-in*/}
                        <div className="flex flex-wrap items-center justify-end gap-2">
                            <span className="text-md text-cell-secondary">
                                {t("Not have an account?")}
                            </span>
                            <Link href="/register/subscriber/email" className={`text-primary-500 dark:text-primary-400 hover:text-primary-600 ${(isLoading || isSubmitting) ? 'pointer-events-none text-gray-400 dark:text-gray-500' : ''}`}>
                                {t("Register")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default function AdminSignInPage() {
    return (
        <Suspense fallback={null}>
            <SignIn />
        </Suspense>
    );
}
