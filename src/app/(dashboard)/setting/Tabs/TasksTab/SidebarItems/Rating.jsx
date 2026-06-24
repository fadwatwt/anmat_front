import WordTheMiddleAndLine from "@/components/Subcomponents/WordTheMiddleAndLine.jsx";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";
import DefaultButton from "@/components/Form/DefaultButton.jsx";
import { useTranslation } from "react-i18next";
import BtnAddOutline from "@/components/Form/BtnAddOutline.jsx";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetSubscriberOrganizationQuery, useUpdateSubscriberOrganizationMutation } from "@/redux/organizations/organizationsApi";
import { selectUserType, selectPermissions } from "@/redux/auth/authSlice";
import Switch2 from "@/components/Form/Switch2.jsx";
import ElementsSelect from "@/components/Form/ElementsSelect.jsx";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function Rating() {
    const { t } = useTranslation();
    const userType = useSelector(selectUserType);
    const userPermissions = useSelector(selectPermissions);
    const canEdit = userType === "Subscriber" || (Array.isArray(userPermissions) && userPermissions.includes("organizations.manage_settings"));
    const { data: orgData, isLoading } = useGetSubscriberOrganizationQuery();
    const [updateOrg] = useUpdateSubscriberOrganizationMutation();

    const [isPointsActive, setIsPointsActive] = useState(true);
    const [evalMethod, setEvalMethod] = useState('AUTO');
    const [ratingTypes, setRatingTypes] = useState(["Time Evaluation"]);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    useEffect(() => {
        if (orgData) {
            setIsPointsActive(orgData.is_points_system_active ?? true);
            setEvalMethod(orgData.default_evaluation_method || 'AUTO');
            setRatingTypes(orgData.rating_types?.length ? orgData.rating_types : ["Time Evaluation"]);
        }
    }, [orgData]);

    const updateRatingType = (index, value) => {
        const updated = [...ratingTypes];
        updated[index] = value;
        setRatingTypes(updated);
    };

    const addRatingTypeInput = () => {
        setRatingTypes([...ratingTypes, ""]);
    };

    const removeRatingType = (index) => {
        if (ratingTypes.length <= 1) return;
        setRatingTypes(ratingTypes.filter((_, i) => i !== index));
    };

    const handleApplyChanges = async () => {
        try {
            const filtered = ratingTypes.filter(t => t.trim() !== "");
            await updateOrg({
                is_points_system_active: isPointsActive,
                default_evaluation_method: evalMethod,
                rating_types: filtered.length ? filtered : ["Time Evaluation"],
            }).unwrap();
            setApiResponse({ isOpen: true, status: "success", message: t("Rating settings updated successfully") });
        } catch (error) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || t("Failed to update rating settings"),
            });
        }
    };

    const evaluationOptions = [
        { id: 'AUTO', element: t("Auto (Based on calculations)") },
        { id: 'MANUAL', element: t("Manual Override") }
    ];

    if (isLoading) return <div className="p-4">{t("Loading...")}</div>;

    return (
        <div className="w-full md:py-2 flex flex-col gap-5">
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
                    <ElementsSelect
                        defaultValue={evaluationOptions.find(opt => opt.id === evalMethod)}
                        options={evaluationOptions}
                        onChange={(val) => setEvalMethod(val[0]?.id || 'AUTO')}
                        isMultiple={false}
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
                        <div key={i} className="flex items-center gap-2">
                            <InputAndLabel className="rounded-md flex-1" value={type} onChange={(e) => updateRatingType(i, e.target.value)} title={`${t("Rating type")} ${i + 1}`} />
                            {ratingTypes.length > 1 && (
                                <button type="button" onClick={() => removeRatingType(i)}
                                    className="text-red-500 hover:text-red-700 text-sm mt-6">
                                    {t("Remove")}
                                </button>
                            )}
                        </div>
                    ))}
                    <BtnAddOutline title={"Add Rating type"} onClick={addRatingTypeInput} />
                </div>
            </div>

            <div className="flex gap-2">
                <DefaultButton type="button" title="Cancel" className="font-medium dark:text-gray-200" />
                <DefaultButton type="button" disabled={!canEdit} onClick={handleApplyChanges} title={canEdit ? "Apply Changes" : t("You do not have permission")}
                               className={canEdit ? "bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white" : "bg-gray-300 font-medium text-gray-500 cursor-not-allowed"} />
            </div>
            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
            />
        </div>
    );
}

export default Rating;
