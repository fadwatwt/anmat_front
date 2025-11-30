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

const SelectYourBusiness = () => {
    const username = 'Mai';

    const TYPES = [{
        title: 'Software Development', icon: <RiMacLine className="text-md"/>
    }, {
        title: 'Product Management', icon: <RiBox2Line className="text-md"/>
    }, {
        title: 'Marketing', icon: <RiUserSmileLine className="text-md"/>
    }, {
        title: 'Design', icon: <RiPaletteLine className="text-md"/>
    }, {
        title: 'Project Management', icon: <RiCalendarTodoLine className="text-md"/>
    }, {
        title: 'Operations', icon: <RiSettings4Line className="text-md"/>
    }, {
        title: 'IT Support', icon: <RiErrorWarningLine className="text-md"/>
    }, {
        title: 'Other', icon: <RiApps2AiLine className="text-md"/>
    }];

    const typeCard = (icon, title) => {
        return (<div className="flex items-center justify-start gap-3 px-4 py-4 bg-white dark:bg-gray-800 text-primary-500 dark:text-gray-50
            cursor-pointer hover:bg-primary-500 hover:text-primary-50 rounded-xl w-[15rem] shadow-sm group">
                {icon}
                <span className="text-md text-gray-900 group-hover:text-gray-50">
                    {title}
                </span>
            </div>);
    };

    return (<>
            <div className="flex flex-col items-center justify-start gap-8 p-8 w-full overflow-hidden">
                <div className="flex flex-col items-center justify-start gap-6">
                    <div className="flex flex-col items-center justify-start gap-4">
                        <sapn className="text-2xl text-gray-900">
                            {`Setup, ${username}! What kind of work do you do?`}
                        </sapn>
                        <span className="text-sm text-gray-500">
                            Chosse the best fit for your project or team. We&apos;ll help you get started.
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 md:w-[31rem]">
                        {TYPES.map(type => typeCard(type.icon, type.title))}
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="bg-white text-gray-700 text-md w-32 py-2 border border-gray-200 rounded-xl cursor-pointer
                        hover:bg-gray-100 text-center">
                        Skip
                    </div>

                    <div className="bg-primary-500 text-primary-50 text-md w-32 py-2 rounded-xl cursor-pointer
                        hover:bg-primary-600 text-center border border-primary-400">
                        Next
                    </div>
                </div>
            </div>
        </>);

};

export default SelectYourBusiness;