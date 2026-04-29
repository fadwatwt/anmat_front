import Modal from "@/components/Modal/Modal";
import DefaultSelect from "@/components/Form/DefaultSelect";
import StarRatingInput from "@/components/Form/StarRatingInput";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const EditPerformanceRatingModal = ({ isOpen, onClose, employee, onUpdate }) => {
    const { t } = useTranslation();
    const [method, setMethod] = useState(employee?.evaluation_method || "AUTO");
    const [rating, setRating] = useState(employee?.manual_rating || 0);

    useEffect(() => {
        if (employee) {
            setMethod(employee.evaluation_method || "AUTO");
            setRating(employee.manual_rating || 0);
        }
    }, [employee, isOpen]);

    const handleSave = () => {
        onUpdate({
            evaluation_method: method,
            manual_rating: method === "MANUAL" ? rating : null
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t("Edit Performance Rating")}>
            <div className="flex flex-col gap-6 p-4">
                <DefaultSelect
                    key={`method-${isOpen}`}
                    title={t("Evaluation Method")}
                    multi={false}
                    options={[
                        { id: "AUTO", value: t("Auto (Based on calculations)") },
                        { id: "MANUAL", value: t("Manual Override") }
                    ]}
                    value={[{ id: method, value: method === "MANUAL" ? t("Manual Override") : t("Auto (Based on calculations)") }]}
                    onChange={(val) => {
                        const newMethod = val[0].id;
                        setMethod(newMethod);
                        if (newMethod === "AUTO") {
                            setRating(0);
                        }
                    }}
                />

                {method === "MANUAL" && (
                    <div className="flex flex-col gap-3">
                        <DefaultSelect
                            key={`rating-${isOpen}-${rating}`}
                            title={t("Manual Rating")}
                            multi={false}
                            options={[
                                { id: 1, value: "1 " + t("Star") },
                                { id: 2, value: "2 " + t("Stars") },
                                { id: 3, value: "3 " + t("Stars") },
                                { id: 4, value: "4 " + t("Stars") },
                                { id: 5, value: "5 " + t("Stars") }
                            ]}
                            value={[{ id: rating, value: rating + " " + (rating === 1 ? t("Star") : t("Stars")) }]}
                            onChange={(val) => setRating(val[0].id)}
                        />
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        {t("Cancel")}
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="px-6 py-2.5 text-sm font-medium text-white bg-primary-base rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        {t("Save Changes")}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditPerformanceRatingModal;
