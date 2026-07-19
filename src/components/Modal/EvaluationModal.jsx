import React, { useState, useEffect, useMemo } from 'react';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';
import StarRatingInput from '../Form/StarRatingInput';
import DefaultSelect from '../Form/DefaultSelect';
import DefaultButton from '../Form/DefaultButton';
import FileUpload from '../Form/FileUpload';
import TextAreaWithLabel from '../Form/TextAreaWithLabel';
import { useGetSubscriberOrganizationQuery } from '@/redux/organizations/organizationsApi';

const DEFAULT_CATEGORIES = [
    { key: 'quality', title: 'Quality of Deliverables' },
    { key: 'speed', title: 'Adherence to Deadlines' },
    { key: 'communication', title: 'Team Collaboration' },
];

const toKey = (str) => str.toLowerCase().replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_]/gu, '');

const EvaluationModal = ({ isOpen, onClose, onSubmit, type = 'task', hasStages = false, isSubmitting = false, uploadFile }) => {
    const { t } = useTranslation();
    const { data: orgData } = useGetSubscriberOrganizationQuery(undefined, { skip: !isOpen });

    const categories = useMemo(() => {
        const types = orgData?.rating_types;
        if (Array.isArray(types) && types.length > 0) {
            return types.map((item) => {
                if (typeof item === 'string') return { key: toKey(item), title: item };
                return { key: item._id || toKey(item.title), title: item.title };
            });
        }
        return DEFAULT_CATEGORIES;
    }, [orgData]);

    const [evaluationMethod, setEvaluationMethod] = useState('MANUAL');
    const [ratings, setRatings] = useState({});
    const [comment, setComment] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const initial = {};
        categories.forEach((cat) => { initial[cat.key] = 0; });
        setRatings(initial);
    }, [categories]);

    const handleRatingChange = (key, value) => {
        setRatings(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (type === 'project' && evaluationMethod === 'AUTO_FROM_TASKS') {
            onSubmit({ evaluation_method: 'AUTO_FROM_TASKS' });
            return;
        }

        if (type === 'task' && evaluationMethod === 'AUTO_FROM_STAGES') {
            onSubmit({ evaluation_method: 'AUTO_FROM_STAGES' });
            return;
        }

        if (type === 'employee' && (evaluationMethod === 'AUTO_FROM_TASKS' || evaluationMethod === 'AUTO')) {
            onSubmit({ evaluation_method: 'AUTO' });
            return;
        }

        const values = Object.values(ratings);
        const avgRating = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

        let uploadedAttachment = null;
        if (attachment && uploadFile) {
            setIsUploading(true);
            try {
                uploadedAttachment = await uploadFile(attachment);
            } catch (err) {
                console.error("Failed to upload attachment:", err);
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        if (type === 'task') {
            onSubmit({ 
                evaluation_method: 'MANUAL',
                evaluation_rating: avgRating,
                evaluation_criteria: ratings,
                comment: comment,
                attachment: uploadedAttachment
            });
        } else {
            onSubmit({
                evaluation_method: 'MANUAL',
                overall_rating: avgRating,
                evaluation_criteria: ratings,
                comment: comment,
                attachment: uploadedAttachment
            });
        }
    };

    const evaluationOptions = [
        { id: 'MANUAL', value: t("Manual Evaluation") }
    ];

    if (type === 'project') {
        evaluationOptions.push({ id: 'AUTO_FROM_TASKS', value: t("Auto (Average of internal tasks)") });
    } else if (type === 'task' && hasStages) {
        evaluationOptions.push({ id: 'AUTO_FROM_STAGES', value: t("Auto (Average of internal stages)") });
    } else if (type === 'employee') {
        evaluationOptions.push({ id: 'AUTO', value: t("Auto (Average of employee performance)") });
    }

    const allZero = Object.values(ratings).every(v => v === 0);
    const isManualValid = !allZero;

    const handleMethodChange = (val) => {
        if (val && val.length > 0) {
            const newMethod = val[0].id;
            setEvaluationMethod(newMethod);
            if (newMethod !== 'MANUAL') {
                const reset = {};
                categories.forEach((cat) => { reset[cat.key] = 0; });
                setRatings(reset);
            }
        } else {
            setEvaluationMethod('MANUAL');
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={type === 'project' ? t("Evaluate Project") : type === 'employee' ? t("Evaluate Employee") : t("Evaluate Task")}
            isBtns={true}
            btnApplyTitle={t("Submit Evaluation")}
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading || (evaluationMethod === 'MANUAL' && !isManualValid)}
            className="lg:w-[500px] md:w-8/12 sm:w-10/12 w-11/12 p-6"
        >
            <div className="flex flex-col gap-6 py-2">
                {(type === 'project' || (type === 'task' && hasStages) || type === 'employee') && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-cell-secondary">{t("Evaluation Method")}</label>
                        <DefaultSelect 
                            value={evaluationOptions.filter(opt => opt.id === evaluationMethod)}
                            onChange={handleMethodChange}
                            options={evaluationOptions}
                            placeholder={t("Select Method")}
                            multi={false}
                        />
                    </div>
                )}

                {evaluationMethod === 'MANUAL' && (
                    <div className="space-y-6 bg-gray-50/50 dark:bg-white/5 p-4 rounded-xl border border-status-border">
                        {categories.map((cat) => (
                            <StarRatingInput 
                                key={cat.key}
                                title={t(cat.title)} 
                                value={ratings[cat.key] || 0} 
                                onChange={(val) => handleRatingChange(cat.key, val)} 
                            />
                        ))}
                    </div>
                )}
                
                <div className="flex flex-col gap-4">
                    <TextAreaWithLabel 
                        label={`${t("Add a Comment")} (${t("Optional")})`}
                        placeholder={t("Write your comments here...")}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                    />
                    
                    <div>
                        <label className="text-sm font-medium text-cell-secondary mb-2 block">{t("Attachments")} ({t("Optional")})</label>
                        <FileUpload 
                            onFileChange={(file) => setAttachment(file)}
                        />
                    </div>
                </div>

                {(isSubmitting || isUploading) && (
                    <div className="flex items-center justify-center py-2">
                        <span className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default EvaluationModal;
