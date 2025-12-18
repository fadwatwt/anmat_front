"use client";

import { useState } from "react";
import { GoMail } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/auth/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure } from "@/redux/auth/authSlice";
import {RiUserSettingsLine} from "@remixicon/react";

function ForgetPasswordPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            <div className="flex flex-col items-center gap-3">
                <div className="flex w-20 h-20 justify-center items-center rounded-full bg-[#F3F3F4]">
                    <div className="flex w-12 h-12 justify-center items-center rounded-full bg-white shadow-md">
                        <RiUserSettingsLine size={30} />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <sapn className="text-2xl text-gray-900">
                        {`Forget Password`}
                    </sapn>
                    <span className="text-sm text-gray-500">
            {'Enter your details to reset passowrd.'}
          </span>
                </div>

                <div className="w-full">
                    <div className="flex flex-col gap-2 w-full">

                        <div className={"flex flex-col gap-2 w-full"}>
                            <label>Email Address</label>
                            <div className="flex bg-white pl-2 px-2 w-full items-center border-2 rounded-xl">
                                <GoMail className="text-gray-500 w-10" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full py-3 px-2 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-primary-base text-white py-1.5"
                        >
                            {isLoading ? "Loading..." : "Send"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default ForgetPasswordPage;
