"use server";
import Image from "next/image";

function AuthLayout({ children }) {
    console.log(children)
    return (
        <div className="w-full flex h-screen justify-start py-1 bg-main-900 overflow-y-scroll">
            <div className="flex flex-col w-full gap-16 px-9 py-7">
                {/* Logo Section */}
                <div className="flex items-center justify-start gap-2">
                    <Image
                        className="w-10 h-10 rounded-full"
                        src="/images/logo.png"
                        alt="Company Logo"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col gap-1 justify-center">
                        <p className="text-sm text-cell-primary dark:text-white">Employees Management</p>
                        <p className="text-xs text-gray-500 dark:text-white">Employees & HR Management</p>
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
