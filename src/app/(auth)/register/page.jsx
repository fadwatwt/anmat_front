"use client";

import { useState } from "react";
import { LiaUser } from "react-icons/lia";
import { GoMail } from "react-icons/go";
import { IoIosLock } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/auth/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure } from "@/redux/auth/authSlice";

function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [login, { isLoading }] = useLoginMutation();
    const { error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email, password }).unwrap();
            dispatch(loginSuccess(response));
            if (typeof window !== 'undefined') {
                localStorage.setItem("token", response.token);
            }
            router.push("/dashboard");
        } catch (err) {
            dispatch(loginFailure(err.data?.message || "Login failed"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="loginForm flex flex-col gap-3">
            <div className="flex flex-col items-center gap-6">
                <div className="flex w-20 h-20 justify-center items-center rounded-full bg-[#F3F3F4]">
                    <div className="flex w-12 h-12 justify-center items-center rounded-full bg-white shadow-md">
                        <LiaUser size={30} />
                    </div>
                </div>

                {/* Intro Title */}
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <sapn className="text-2xl text-gray-900">
                        {`Sign up to your account`}
                    </sapn>
                    <span className="text-sm text-gray-500">
                        {'Enter your details to sign up'}
                    </span>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="sign_up_email_input">
                        {'Email Address'}
                    </label>
                    <div className="flex bg-white pl-2 px-2 w-full items-center border-2 rounded-xl">
                        <GoMail className="text-gray-500 w-10" size={18} />
                        <input
                            id="sign_up_email_input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full py-3 px-2 outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full">

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary-500 text-primary-50 text-md w-full py-3 rounded-xl cursor-pointer
                        hover:bg-primary-600 text-center"
                    >
                        {isLoading ? "Loading..." : "Sign Up"}
                    </button>

                    <div class="flex items-center justify-center my-4">
                        <div class="flex-grow border-t border-gray-300"></div>
                        <span class="mx-4 text-gray-500">Or</span>
                        <div class="flex-grow border-t border-gray-300"></div>
                    </div>

                    <button
                        type="button"
                        className="w-full rounded-xl border border-gray-400 py-2 flex gap-2 justify-center items-center hover:bg-gray-50"
                    >
                        <FcGoogle />
                        <span className="text-sm">Sign up with Google</span>
                    </button>
                </div>
            </div>
        </form>
    );
}

export default RegisterForm;
