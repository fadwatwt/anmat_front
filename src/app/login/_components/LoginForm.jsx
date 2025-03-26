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

function LoginForm() {
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
            localStorage.setItem("token", response.token);
            router.push("/");
        } catch (err) {
            dispatch(loginFailure(err.data?.message || "Login failed"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="loginForm flex flex-col gap-3 w-11/12">
            <div className="flex flex-col items-center gap-3">
                <div className="flex w-20 h-20 justify-center items-center rounded-full bg-[#F3F3F4]">
                    <div className="flex w-12 h-12 justify-center items-center rounded-full bg-white shadow-md">
                        <LiaUser size={30} />
                    </div>
                </div>

                <div className="w-full px-12">
                    <div className="flex flex-col gap-2 w-full">
                        <label className="flex bg-white pl-2 px-2 w-full items-center border-2 rounded-xl">
                            <GoMail className="text-gray-500 w-10" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full py-3 px-2 outline-none"
                                required
                            />
                        </label>

                        <label className="flex bg-white pl-2 px-2 w-full items-center border-2 rounded-xl">
                            <IoIosLock className="text-gray-500 w-10" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="*********"
                                className="w-full py-3 px-2 outline-none"
                                required
                            />
                        </label>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <p className="text-sm text-black">Remember Me</p>
                            </div>
                            <p className="text-sm text-gray-500 underline cursor-pointer">Forgot Password?</p>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-primary-base text-white py-1.5">
                            {isLoading ? "Loading..." : "Login"}
                        </button>

                        <button type="button" className="w-full rounded-lg border border-gray-400 py-1.5 flex gap-2 justify-center items-center hover:bg-gray-50">
                            <FcGoogle />
                            <span className="text-sm">Login with Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default LoginForm;
