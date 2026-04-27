import WordTheMiddleAndLine from "@/components/Subcomponents/WordTheMiddleAndLine.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import DefaultButton from "@/components/Form/DefaultButton.jsx";
import { useTranslation } from "react-i18next";
import BtnAddOutline from "@/components/Form/BtnAddOutline.jsx";
import { useState, useEffect } from "react";
import { useGetSubscriberOrganizationQuery, useUpdateSubscriberOrganizationMutation } from "@/redux/organizations/organizationsApi";
import Switch2 from "@/components/Form/Switch2.jsx";
import DefaultSelect from "@/components/Form/DefaultSelect.jsx";

function Rating() {
    const { t } = useTranslation();
    const { data: orgData, isLoading } = useGetSubscriberOrganizationQuery();
    const [updateOrg] = useUpdateSubscriberOrganizationMutation();

    const [isPointsActive, setIsPointsActive] = useState(true);
    const [evalMethod, setEvalMethod] = useState('AUTO');
    const [ratingTypes, setRatingTypes] = useState(["Time Evaluation"]);

    useEffect(() => {
        if (orgData) {
            setIsPointsActive(orgData.is_points_system_active ?? true);
            setEvalMethod(orgData.default_evaluation_method || 'AUTO');
        }
    }, [orgData]);

    const addRatingTypeInput = () => {
        setRatingTypes([...ratingTypes, "New Rating Type"]);
    };

    const handleApplyChanges = async () => {
        try {
            await updateOrg({
                is_points_system_active: isPointsActive,
                default_evaluation_method: evalMethod
            }).unwrap();
        } catch (error) {
            console.error("Failed to update organization settings:", error);
        }
    };

    const evaluationOptions = [
        { id: 'AUTO', value: t("Auto (Based on calculations)") },
        { id: 'MANUAL', value: t("Manual Override") }
    ];

    if (isLoading) return <div className="p-4">{t("Loading...")}</div>;

    return (
        <div className="w-full md:py-2 flex flex-col gap-5">
            {/* Points System Toggle */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-status-border">
                    <div className="flex flex-col text-start">
                        <p className="dark:text-gray-200 text-black font-medium">{t("Enable Points System")}</p>
                        <p className="text-sm dark:text-gray-400 text-gray-500">{t("Turn on/off the automatic employee points calculation.")}</p>
                    </div>
                    <Switch2 isOn={isPointsActive} handleToggle={() => setIsPointsActive(!isPointsActive)} />
                </div>

                <div className="flex flex-col text-start gap-2 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-status-border">
                    <p className="dark:text-gray-200 text-black font-medium">{t("Default Evaluation Method")}</p>
                    <DefaultSelect 
                        multi={false}
                        options={evaluationOptions}
                        value={evaluationOptions.filter(opt => opt.id === evalMethod)}
                        onChange={(val) => setEvalMethod(val[0].id)}
                        placeholder={t("Select Evaluation Method")}
                    />
                    <p className="text-xs dark:text-gray-400 text-gray-500 mt-1">
                        {t("Choose how employee ratings are calculated by default across the organization.")}
                    </p>
                </div>
            </div>

            <WordTheMiddleAndLine />

            <div className="flex flex-col gap-2">
                <div className="flex flex-col text-start gap-1">
                    <p className="dark:text-gray-200 text-black">{t("Adding Rating Categories")}</p>
                    <p className="text-sm dark:text-gray-400 text-gray-500">{t("Customize Rating settings")}</p>
                </div>

                <div className="flex flex-col gap-2">
                    {ratingTypes.map((type, i) => (
                        <InputAndLabel key={i} className="rounded-md" value={type} onChange={() => {}} title={`${t("Rating type")} ${i + 1}`} />
                    ))}
                    <BtnAddOutline title={"Add Rating type"} onClick={addRatingTypeInput} />
                </div>
            </div>

            <div className="flex gap-2">
                <DefaultButton type="button" title="Cancel" className="font-medium dark:text-gray-200" />
                <DefaultButton type="button" onClick={handleApplyChanges} title="Apply Changes"
                               className="bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white" />
            </div>
        </div>
    );
}

export default Rating;
