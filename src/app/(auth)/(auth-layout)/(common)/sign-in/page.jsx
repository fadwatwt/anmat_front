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

function SignIn() {
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
                        dispatch(loginFailure("Access Denied: Use Admin Sign In."));
                    } else if (['Subscriber', 'Employee'].includes(userData?.type)) {
                        const loginPayload = {
                            data: {
                                access_token: token,
                                user: userData
                            }
                        };
                        dispatch(loginSuccess(loginPayload));
                        router.push("/dashboard");
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
            const response = await login({ email, password }).unwrap();
            const userData = response.data?.user;

            if (userData?.type === 'Admin') {
                await performLogout(response.data?.access_token);
                dispatch(loginFailure("Access Denied: Use Admin Sign In."));
                setIsSubmitting(false);
            } else if (['Subscriber', 'Employee'].includes(userData?.type)) {
                dispatch(loginSuccess(response));
                router.push("/dashboard");
            } else {
                // If unknown role, logout just in case or show error
                await performLogout(response.data?.access_token);
                dispatch(loginFailure("Access Denied: Unknown user role."));
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
                        dispatch(loginFailure("Access Denied: Use Admin Sign In."));
                        setIsSubmitting(false);
                        return;
                    } else if (['Subscriber', 'Employee'].includes(userData?.type)) {
                        const loginPayload = {
                            data: {
                                access_token: token,
                                user: userData
                            }
                        };
                        dispatch(loginSuccess(loginPayload));
                        router.push("/dashboard");
                        return;
                    } else {
                        await performLogout(token);
                        dispatch(loginFailure("Access Denied: Unknown user role."));
                        setIsSubmitting(false);
                        return;
                    }
                } catch (userErr) {
                    console.error("Failed to recover session:", userErr);
                    dispatch(loginFailure("Session recovery failed. Please try again."));
                    setIsSubmitting(false);
                    return;
                }
            }
            // Standard error handling
            dispatch(loginFailure(err.data?.message || "Login failed"));
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="loginForm flex flex-col gap-3">
            <div className="flex flex-col items-center gap-3">
                <div className="flex w-20 h-20 justify-center items-center rounded-full bg-[#F3F3F4]">
                    <div className="flex w-12 h-12 justify-center items-center rounded-full bg-white shadow-md">
                        <LiaUser size={30} />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <sapn className="text-2xl text-gray-900">
                        {`Sign in to your account`}
                    </sapn>
                    <span className="text-sm text-gray-500">
                        {'Enter your credentials to sign in'}
                    </span>
                </div>

                <div className="w-full">
                    <div className="flex flex-col gap-2 w-full">
                        <label className={`flex bg-white pl-2 px-2 w-full items-center border-2 rounded-xl ${(isLoading || isSubmitting) ? 'opacity-70' : ''}`}>
                            <GoMail className="text-gray-500 w-10" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full py-3 px-2 outline-none"
                                required
                                disabled={isLoading || isSubmitting}
                            />
                        </label>

                        <label className={`flex bg-white pl-2 px-2 w-full items-center border-2 rounded-xl ${(isLoading || isSubmitting) ? 'opacity-70' : ''}`}>
                            <IoIosLock className="text-gray-500 w-10" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="*"
                                className="w-full py-3 px-2 outline-none"
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
                                <p className="text-sm text-black">Remember Me</p>
                            </div>
                            <Link href="/forget-password"
                                className={`text-sm text-primary-base hover:text-primary-600 underline cursor-pointer ${(isLoading || isSubmitting) ? 'pointer-events-none text-gray-400' : ''}`}>
                                Forgot Password?
                            </Link>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading || isSubmitting}
                            className="w-full rounded-lg bg-primary-base text-white py-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {(isLoading || isSubmitting) ? "Loading..." : "Login"}
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
                        <div className="flex flex-wrap items-center justify-end gap-2">
                            <span className="text-md text-gray-700 dark:text-gray-300">
                                Not have an account?
                            </span>
                            <Link href="/register/subscriber/email" className={`text-primary-500 hover:text-primary-600 ${(isLoading || isSubmitting) ? 'pointer-events-none text-gray-400' : ''}`}>
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default SignIn;
