"use client";

import { useState } from "react";
import { LiaUser } from "react-icons/lia";
import { GoMail } from "react-icons/go";
import { IoIosLock } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useLoginMutation, useLazyGetUserQuery, useLazyLogoutQuery } from "@/redux/auth/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure, logout } from "@/redux/auth/authSlice";
import Link from "next/link";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function SignIn() {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [login, { isLoading }] = useLoginMutation();
    const { error, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const [triggerGetUser] = useLazyGetUserQuery();
    const [triggerLogout] = useLazyLogoutQuery();

    const performLogout = async (tokenToUse) => {
        const token = tokenToUse || localStorage.getItem('token');
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
        // Check Redux state or localStorage
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userResponse = await triggerGetUser(token).unwrap();
                    const userData = userResponse.data || userResponse;

                    if (userData?.type === 'Admin') {
                        console.warn("Admin user trying to access non-admin login. Logging out.");
                        await performLogout(token);
                        dispatch(loginFailure(t("Access Denied: Use Admin Sign In.")));
                    } else if (userData?.type === 'Subscriber') {
                        const loginPayload = {
                            data: {
                                access_token: token,
                                user: userData
                            }
                        };
                        dispatch(loginSuccess(loginPayload));
                        router.push("/dashboard");
                    } else if (userData?.type === 'Employee') {
                        const loginPayload = {
                            data: {
                                access_token: token,
                                user: userData
                            }
                        };
                        dispatch(loginSuccess(loginPayload));
                        if (!userData.employee_detail || !userData.is_active) {
                            router.push("/account-setup/employee");
                        } else {
                            router.push("/dashboard");
                        }
                    } else {
                        // Default fallback or other types
                        setIsCheckingAuth(false);
                    }
                } catch (err) {
                    console.error("Token validation failed:", err);
                    localStorage.removeItem('token');
                    setIsCheckingAuth(false);
                }
            } else {
                setIsCheckingAuth(false);
            }
        };

        if (isAuthenticated) {
            router.push("/dashboard");
        } else {
            checkAuth();
        }
    }, [isAuthenticated, router, triggerGetUser, triggerLogout]);

    // Prevent rendering the login form while we check for an existing session
    if (isCheckingAuth) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const loginResponse = await login({ email, password }).unwrap();
            const token = loginResponse.data?.access_token;

            // Get fresh user data after login
            const userResponse = await triggerGetUser(token).unwrap();
            const userData = userResponse.data || userResponse;

            if (userData?.type === 'Admin') {
                await performLogout(token);
                dispatch(loginFailure(t("Access Denied: Use Admin Sign In.")));
                setIsSubmitting(false);
            } else if (userData?.type === 'Subscriber') {
                const loginPayload = {
                    data: {
                        access_token: token,
                        user: userData
                    }
                };
                dispatch(loginSuccess(loginPayload));
                router.push("/dashboard");
            } else if (userData?.type === 'Employee') {
                const loginPayload = {
                    data: {
                        access_token: token,
                        user: userData
                    }
                };
                dispatch(loginSuccess(loginPayload));
                if (!userData.employee_detail || !userData.is_active) {
                    router.push("/account-setup/employee");
                } else {
                    router.push("/dashboard");
                }
            } else {
                // If unknown role, logout just in case or show error
                await performLogout(token);
                dispatch(loginFailure(t("Access Denied: Unknown user role.")));
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
                        await performLogout(token);
                        dispatch(loginFailure(t("Access Denied: Use Admin Sign In.")));
                        setIsSubmitting(false);
                        return;
                    } else if (userData?.type === 'Subscriber') {
                        const loginPayload = {
                            data: {
                                access_token: token,
                                user: userData
                            }
                        };
                        dispatch(loginSuccess(loginPayload));
                        router.push("/dashboard");
                        return;
                    } else if (userData?.type === 'Employee') {
                        const loginPayload = {
                            data: {
                                access_token: token,
                                user: userData
                            }
                        };
                        dispatch(loginSuccess(loginPayload));
                        if (!userData.employee_detail || !userData.is_active) {
                            router.push("/account-setup/employee");
                        } else {
                            router.push("/dashboard");
                        }
                        return;
                    } else {
                        await performLogout(token);
                        dispatch(loginFailure(t("Access Denied: Unknown user role.")));
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
                        <label className={`flex bg-surface pl-2 px-2 w-full items-center border border-status-border rounded-xl ${(isLoading || isSubmitting) ? 'opacity-70' : ''}`}>
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

                        <label className={`flex bg-surface pl-2 px-2 w-full items-center border border-status-border rounded-xl ${(isLoading || isSubmitting) ? 'opacity-70' : ''}`}>
                            <IoIosLock className="text-cell-secondary w-10" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="*"
                                className="w-full py-3 px-2 outline-none bg-transparent dark:bg-gray-800 text-cell-primary dark:text-gray-100"
                                required
                                disabled={isLoading || isSubmitting}
                            />
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
                                className={`text-sm text-primary-base hover:text-primary-600 underline cursor-pointer dark:text-primary-400 ${(isLoading || isSubmitting) ? 'pointer-events-none text-gray-400 dark:text-gray-500' : ''}`}>
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
                        {/*    className="w-full rounded-lg border border-gray-400 py-1.5 flex gap-2 justify-center items-center hover:bg-gray-50"*/}
                        {/*>*/}
                        {/*    <FcGoogle/>*/}
                        {/*    <span className="text-sm">Login with Google</span>*/}
                        {/*</button>*/}

                        {/*Return to Sign-in*/}
                        <div className="flex flex-wrap items-center justify-end gap-2 mt-4">
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

export default SignIn;
