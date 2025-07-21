"use client";

import { RiFacebookCircleFill, RiInstagramFill, RiLinkedinBoxFill, RiMailFill, RiTwitterXFill, RiYoutubeFill } from "@remixicon/react";

const MailInvitation = () => {
    return (
        <>
            <div className="relative rounded-xl px-8 py-8 border mb-4">
                <div className="absolute top-0 left-0 w-full">
                    <img src="/images/patterns/pattern_rec_top.png" className="w-full h-[120px]" alt="" />
                </div>
                <div className="flex flex-col items-center justify-center gap-8 w-full h-full">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img src="/images/logo.png" className="w-full h-full rounded-full" alt="logo" />
                    </div>

                    <div className="flex flex-col items-center justify-start gap-8 w-[30rem]">
                        <span className="text-gray-900 dark:text-gray-50 block text-center text-2xl">
                            {"Welcome to [Company Name]! Your New Journey Begins!"}
                        </span>

                        <div className="flex flex-col items-start justify-start gap-1 text-gray-500 text-lg text-wrap text-start">
                            <span>
                                Dear Amr,
                            </span>
                            <span className="block text-gray-500 text-lg text-wrap">
                                We are pleased to welcome you to our team at
                                <span className="text-gray-700 m-1 font-semibold">Visionary Publishing</span>
                                for the position of
                                <span className="text-gray-700 m-1 font-semibold">Content Editor</span>
                                in the
                                <span className="text-gray-700 m-1 font-semibold">Publishing Department</span>.
                            </span>
                        </div>

                        <span className="block text-gray-500 text-lg text-wrap">
                            To complete your onboarding process, please click the button below to finalize your information and activate your account:
                        </span>

                        <button
                            type="submit"
                            className="bg-primary-500 text-primary-50 text-nowrap text-md px-4 py-2 rounded-lg cursor-pointer
                                        hover:bg-primary-600 text-center"
                        >
                            {"Complete Your Profile"}
                        </button>

                        <div className="flex flex-col gap-2">
                            <span className="text-lg text-gray-500 text-wrap">
                                If you have any questions or need assistance during the process, don’t hesitate to contact us.<br />
                                Looking forward to working with you!
                            </span>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500 text-lg">
                                    Contact Information:
                                </span>
                                <span className="text-gray-700 text-lg">
                                    HR Email: hr@domain.com
                                </span>
                                <span className="text-gray-700 text-lg">
                                    Phone: + 90 312 213 2965
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-wrap lg:flex-nowrap gap-6 items-center justify-center">
                        <RiMailFill size={25} className="text-gray-700" />
                        <RiYoutubeFill size={25} className="text-gray-700" />
                        <RiInstagramFill size={25} className="text-gray-700" />
                        <RiTwitterXFill size={25} className="text-gray-700" />
                        <RiLinkedinBoxFill size={25} className="text-gray-700" />
                        <RiFacebookCircleFill size={25} className="text-gray-700" />
                    </div>

                </div>
            </div>
        </>
    );
};

export default MailInvitation;