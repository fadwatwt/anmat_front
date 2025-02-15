import {useTranslation} from "react-i18next";
import DefaultButton from "../../../../../components/Form/DefaultButton.jsx";
import WordTheMiddleAndLine from "../../../../../components/Subcomponents/WordTheMiddleAndLine.jsx";
import InputAndLabel from "../../../../../components/Form/InputAndLabel.jsx";

function TasksSidebar() {
    const {t} = useTranslation()


    return (
        <div className={"w-full md:py-2 flex flex-col gap-5"}>
            <div className={"flex flex-col gap-2"}>
                <div className={"flex flex-col text-start gap-1"}>
                    <p className={"dark:text-gray-200 text-black"}>{t("Tasks Preferences")}</p>
                    <p className={"text-sm dark:text-gray-200 text-gray-500"}>{t("Customize tasks settings")}</p>
                </div>
                <WordTheMiddleAndLine />
                <div className={"flex flex-col gap-2"}>
                    <InputAndLabel className={"rounded-md"} value={"2"} title={"Minimum Number of Tasks When Creating a Project"} />
                </div>
            </div>
            <div className={"flex gap-2"}>
                <DefaultButton type={'button'} title={"Cancel"} className={"font-medium dark:text-gray-200"} />
                <DefaultButton type={'button'} onClick={() => {}} title={"Apply Changes"} className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"} />
            </div>
        </div>
    );
}

export default TasksSidebar;