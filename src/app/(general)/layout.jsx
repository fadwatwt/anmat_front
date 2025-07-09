"use server";
import Image from "next/image";

function AuthLayout({ children }) {
    console.log(children)
    return (
        <div className="w-full flex h-screen justify-start py-1 bg-main-900 overflow-y-scroll">
            <div className="flex flex-col w-full gap-16 px-9 py-7">
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
                <div className="flex flex-col items-center justify-center w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
