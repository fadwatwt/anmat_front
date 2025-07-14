import WordTheMiddleAndLine from "@/components/Subcomponents/WordTheMiddleAndLine.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import DefaultButton from "@/components/Form/DefaultButton.jsx";
import { useTranslation } from "react-i18next";
import BtnAddOutline from "@/components/Form/BtnAddOutline.jsx";
import { useState } from "react";

function Rating() {
    const { t } = useTranslation();

    // المصفوفة التي تحتوي على أنواع التقييم
    const [ratingTypes, setRatingTypes] = useState(["Time Evaluation"]);

    // دالة لإضافة نوع جديد من التقييم
    const addRatingTypeInput = () => {
        setRatingTypes([...ratingTypes, "New Rating Type"]);
    };

    return (
        <div className="w-full md:py-2 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col text-start gap-1">
                    <p className="dark:text-gray-200 text-black">{t("Adding Rating Categories")}</p>
                    <p className="text-sm dark:text-gray-400 text-gray-500">{t("Customize Rating settings")}</p>
                </div>
                <WordTheMiddleAndLine />

                <div className="flex flex-col gap-2">
                    {ratingTypes.map((type, i) => (
                        <InputAndLabel key={i} className="rounded-md" value={type} onChange={() => {}} title={`${t("Rating type")} ${i + 1}`} />
                    ))}
                    <BtnAddOutline title={"Add Rating type"} onClick={addRatingTypeInput} />
                </div>
            </div>

            <div className="flex gap-2">
                <DefaultButton type="button" title="Cancel" className="font-medium dark:text-gray-200" />
                <DefaultButton type="button" onClick={() => {}} title="Apply Changes"
                               className="bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white" />
            </div>
        </div>
    );
}

export default Rating;
