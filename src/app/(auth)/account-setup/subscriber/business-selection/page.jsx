"use client";
import {
    RiApps2AiLine,
    RiBox2Line,
    RiCalendarTodoLine,
    RiErrorWarningLine,
    RiMacLine,
    RiPaletteLine,
    RiSettings4Line,
    RiUserSmileLine
} from "@remixicon/react";
import { BoxTick, Category2, ColorSwatch, Happyemoji, InfoCircle, Monitor, Setting2, Stickynote } from "iconsax-react";
import Link from "next/link";

const SelectYourBusiness = () => {
    const username = 'Mai';

    const TYPES = [{
        title: 'Software Development', icon: <Monitor size={24} color="currentColor" variant="Bulk" />
    }, {
        title: 'Product Management', icon: <BoxTick size={24} color="currentColor" variant="Bulk" />
    }, {
        title: 'Marketing', icon: <Happyemoji size={24} color="currentColor" variant="Bulk" />
    }, {
        title: 'Design', icon: <ColorSwatch size={24} color="currentColor" variant="Bulk" />
    }, {
        title: 'Project Management', icon: <Stickynote size={24} color="currentColor" variant="Bulk" />
    }, {
        title: 'Operations', icon: <Setting2 size={24} color="currentColor" variant="Bulk" />
    }, {
        title: 'IT Support', icon: <InfoCircle size={24} color="currentColor" variant="Bulk" />
    }, {
        title: 'Other', icon: <Category2 size={24} color="currentColor" variant="Bulk" />
    }];

    const typeCard = (icon, title) => {
        return (<div className="flex items-center justify-start gap-3 px-4 py-5 bg-white dark:bg-gray-800 text-primary-500 dark:text-gray-50
            cursor-pointer hover:bg-primary-500 hover:text-primary-50 rounded-xl w-[20rem] shadow-sm group">
                {icon}
                <span className="text-xl text-gray-900 group-hover:text-gray-50">
                    {title}
                </span>
            </div>);
    };

    return (<>
            <div className="flex flex-col items-center justify-start gap-8 p-8 w-full overflow-hidden">
                <div className="flex flex-col items-center justify-start gap-6">
                    <div className="flex flex-col items-center justify-start gap-4">
                        <sapn className="text-3xl text-gray-900">
                            {`Welcome, ${username}! What kind of work do you do?`}
                        </sapn>
                        <span className="text-md text-gray-500">
                            Chosse the best fit for your project or team. We&apos;ll help you get started.
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 md:w-[41rem]">
                        {TYPES.map(type => typeCard(type.icon, type.title))}
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="bg-white text-gray-700 text-sm w-32 py-2 border border-gray-200 rounded-xl cursor-pointer
                        hover:bg-gray-100 text-center">
                        Skip
                    </div>

                    <Link href={"/account-setup/subscriber/org-profile-setup"} className="bg-primary-500 text-primary-50 text-sm w-32 py-2 rounded-xl cursor-pointer
                        hover:bg-primary-600 text-center border border-primary-400">
                        Next
                    </Link>
                </div>
            </div>
        </>);

};

export default SelectYourBusiness;