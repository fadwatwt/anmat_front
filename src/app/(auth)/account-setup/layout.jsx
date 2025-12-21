"use server";
import Image from "next/image";

function AuthLayout({children}) {
    return (
        <div className="flex flex-col h-screen bg-main-900">
            <header className="flex items-center justify-between px-9 py-7">
                <div className="flex items-center gap-3">
                    <Image
                        className="w-12 h-12 rounded-full"
                        src="/images/logo.png"
                        alt="Company Logo"
                        width={48}
                        height={48}
                    />
                    <div className="text-sm text-sub-500 text-start dark:text-sub-300">
                        <h1 className="font-bold text-xl">ANMAT</h1>
                        <h3 className="">Organizations Management</h3>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-500">Welcome, Current User</span>
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto px-9 py-7">
                <div className="flex flex-col items-center justify-center w-full">{children}</div>
            </main>
            <footer className="h-5 bg-main-900"/>
        </div>
    );
}

export default AuthLayout;