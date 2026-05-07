import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';
import DefaultSelect from '../Form/DefaultSelect';
import { useGetSubscriptionFeatureTypesQuery } from '@/redux/plans/subscriptionsFeatureTypesApi';

const IncreaseFeaturesModal = ({ isOpen, onClose, onSubmit, isSubmitting = false, currentFeatures = [] }) => {
    const { t } = useTranslation();
    const { data: featureTypes, isLoading: isFeatureTypesLoading } = useGetSubscriptionFeatureTypesQuery();
    
    const [selectedFeatureType, setSelectedFeatureType] = useState(null);
    const [value, setValue] = useState("");
    const [extraFeatures, setExtraFeatures] = useState(currentFeatures || []);

    useEffect(() => {
        if (isOpen) {
            setExtraFeatures(currentFeatures || []);
        }
    }, [currentFeatures, isOpen]);

    const featureOptions = (featureTypes || []).map(ft => ({
        id: ft._id,
        value: ft.title || ft.type,
        type: ft.type,
        attributes_definitions: ft.attributes_definitions
    }));

    const handleAddFeature = () => {
        if (!selectedFeatureType || !value) return;

        const featureType = featureOptions.find(f => f.id === selectedFeatureType[0].id);
        const attributeKey = featureType.attributes_definitions?.[0]?.key || 'limit';

        const newFeature = {
            feature_type_id: featureType.id,
            title: featureType.value,
            properties: [
                { key: attributeKey, value: value }
            ]
        };

        // Check if feature type already exists in extraFeatures, if so update it, otherwise add it
        setExtraFeatures(prev => {
            const index = prev.findIndex(f => f.feature_type_id === newFeature.feature_type_id);
            if (index > -1) {
                const updated = [...prev];
                updated[index] = newFeature;
                return updated;
            }
            return [...prev, newFeature];
        });

        setSelectedFeatureType(null);
        setValue("");
    };

    const handleRemoveFeature = (id) => {
        setExtraFeatures(prev => prev.filter(f => f.feature_type_id !== id));
    };

    const handleSubmit = () => {
        onSubmit(extraFeatures);
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t("Increase Subscription Features")}
            isBtns={true}
            btnApplyTitle={t("Save Changes")}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="lg:w-[600px] md:w-8/12 sm:w-10/12 w-11/12 p-6"
        >
            <div className="flex flex-col gap-6 py-2">
                <div className="flex flex-col gap-4 p-4 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-status-border">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-cell-secondary">{t("Select Feature Type")}</label>
                        <DefaultSelect 
                            value={selectedFeatureType}
                            onChange={(val) => setSelectedFeatureType(val)}
                            options={featureOptions}
                            placeholder={t("Select Feature")}
                            multi={false}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-cell-secondary">{t("New Limit/Value")}</label>
                        <div className="flex gap-2">
                            <input 
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={t("e.g. 50")}
                                type="text"
                                className="flex-1 py-3 px-2 text-sm bg-status-bg border-status-border border-2 rounded-xl focus:outline-none focus:border-primary-400 text-cell-primary placeholder:text-cell-secondary/50"
                            />
                            <button 
                                onClick={handleAddFeature}
                                disabled={!selectedFeatureType || !value}
                                className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                {t("Add/Update")}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="text-md font-semibold text-cell-primary">{t("Applied Overrides")}</h4>
                    <div className="flex flex-col gap-2">
                        {extraFeatures.length > 0 ? (
                            extraFeatures.map((f, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-surface border border-status-border rounded-lg shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-cell-primary">
                                            {f.title || (featureOptions.find(opt => opt.id === f.feature_type_id)?.value) || f.feature_type_id}
                                        </span>
                                        <span className="text-xs text-cell-secondary">
                                            {f.properties?.map(p => `${p.key}: ${p.value}`).join(', ')}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveFeature(f.feature_type_id)}
                                        className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"
                                    >
                                        {t("Remove")}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-cell-secondary italic">{t("No overrides applied yet.")}</p>
                        )}
                    </div>
                </div>

                {isSubmitting && (
                    <div className="flex items-center justify-center py-2">
                        <span className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default IncreaseFeaturesModal;
