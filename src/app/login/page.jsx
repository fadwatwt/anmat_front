"use server";
import Image from "next/image";
import LoginForm from "@/app/login/_components/LoginForm";

function LoginPage() {
    return (
        <div className="w-full flex h-screen justify-start py-1">
            <div className="flex flex-col w-[40%] gap-16 px-9 py-7">
                {/* Logo Section */}
                <div className="flex items-center justify-start gap-3">
                    <Image
                        className="w-10 h-10 rounded-full"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Hov7jcWb4cWae_alBRxB-N1tJiTFrpt1PA&s"
                        alt="Company Logo"
                        width={40}
                        height={40}
                    />
                    <div className="text-sm text-sub-500 text-start dark:text-sub-300">
                        <p>Employees</p>
                        <p>Management</p>
                    </div>
                </div>

                {/* Placeholder for login form (this should be a Client Component) */}
                <LoginForm />

            </div>

            {/* Right Side Image/Placeholder */}
            <div className="flex flex-col h-full justify-center flex-1 rounded-md bg-gray-200">
                {/* Add your login illustration/image here */}
            </div>
        </div>
    );
}

export default LoginPage;