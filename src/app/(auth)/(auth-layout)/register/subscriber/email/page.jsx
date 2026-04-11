"use client";

import { useState } from "react";
import { LiaUser } from "react-icons/lia";
import { GoMail } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useRegisterSubscriberEmailMutation } from "@/redux/auth/authAPI";
import Link from "next/link";

function RegisterForm() {
    const [email, setEmail] = useState("");
    const [registerSubscriberEmail, { isLoading }] = useRegisterSubscriberEmailMutation();
    const [error, setError] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await registerSubscriberEmail({ email }).unwrap();
            setIsRedirecting(true);
            router.push("/register/subscriber/email/verify");
        } catch (err) {
            setError(err.data?.message || err.message || "Registration failed");
            setIsRedirecting(false);
        }
    };

    const isBusy = isLoading || isRedirecting;

    return (
        <form onSubmit={handleSubmit} className="loginForm flex flex-col gap-3">
            <div className="flex flex-col items-center gap-6">
                <div className="flex w-20 h-20 justify-center items-center rounded-full bg-status-bg">
                    <div className="flex w-12 h-12 justify-center items-center rounded-full bg-surface shadow-md">
                        <LiaUser size={30} className="text-cell-primary" />
                    </div>
                </div>

                {/* Intro Title */}
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-2xl text-cell-primary">
                        {`Register Your Email`}
                    </span>
                    <span className="text-sm text-cell-secondary">
                        {'Enter your email for registration.'}
                    </span>
                </div>

                {error && (
                    <div className="w-full p-3 text-sm text-red-500 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="sign_up_email_input" className="text-cell-primary">
                        {'Email Address'}
                    </label>
                    <div className="flex bg-surface pl-2 px-2 w-full items-center border border-status-border rounded-xl">
                        <GoMail className="text-cell-secondary w-10" size={18} />
                        <input
                            id="sign_up_email_input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full py-3 px-2 outline-none disabled:bg-status-bg bg-transparent text-cell-primary"
                            required
                            disabled={isBusy}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full">

                    <button
                        type="submit"
                        disabled={isBusy}
                        className="bg-primary-500 text-primary-50 text-md w-full py-3 rounded-xl cursor-pointer
                        hover:bg-primary-600 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isBusy ? "Loading..." : "Sign Up"}
                    </button>

                    {/*Return to Sign-in*/}
                    <div className="flex flex-wrap items-center justify-end gap-2 mt-4">
                        <span className="text-md text-cell-secondary">
                            Already have an account?
                        </span>
                        {isBusy ? (
                            <span className="text-gray-400 cursor-not-allowed">
                                Login
                            </span>
                        ) : (
                            <Link href="/sign-in" className="text-primary-500 hover:text-primary-600">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}

export default RegisterForm;
