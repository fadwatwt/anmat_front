"use server";
import DropdownMenu from "@/components/Dropdowns/DropdownMenu";
import { RiGlobalLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";

function AuthLayout({ children }) {
  console.log(children)
  return (
    <div className="w-full flex justify-start py-1 bg-white">
      <div className="flex flex-col w-[40%] h-screen overflow-y-auto gap-16 px-9 py-7">
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
        <div className="w-full flex flex-col items-center gap-8 justify-between h-full">
          <div className="w-full px-12">
            {children}
          </div>
          <div className="w-full flex flex-wrap gap-4 items-center justify-between">
            <button className="flex gap-2 items-center bg-transparent">
              <RiGlobalLine size={20} />
              <span className="text-md text-gray-700">عربي</span>
            </button>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="text-md text-gray-700 dark:text-gray-300">
                Already have an account?
              </span>
              <Link href="/sign-in" className="text-primary-500 hover:text-primary-600">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Image/Placeholder */}
      <div className="flex flex-col justify-center flex-1 rounded-xl bg-main-900 relative overflow-hidden m-2">
        <div className="absolute top-12 left-36 w-full">
          <img src="/images/LandingPage/dashboardImage.png" alt="image" className="w-full" />
        </div>
        <div className="h-[75vh]"></div>
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <span className="text-2xl text-gray-900">
            {"The Ultimate Management Dashboard"}
          </span>
          <span className="text-lg text-gray-500">
            {"Everything you require for teamwork, analysis, and making decisions all in a single location."}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
