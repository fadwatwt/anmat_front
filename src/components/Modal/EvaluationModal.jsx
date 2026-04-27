import React, { useState } from 'react';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';
import StarRatingInput from '../Form/StarRatingInput';
import DefaultSelect from '../Form/DefaultSelect';
import DefaultButton from '../Form/DefaultButton';
import FileUpload from '../Form/FileUpload';
import TextAreaWithLabel from '../Form/TextAreaWithLabel';

const EvaluationModal = ({ isOpen, onClose, onSubmit, type = 'task', hasStages = false, isSubmitting = false }) => {
    const { t } = useTranslation();
    const [evaluationMethod, setEvaluationMethod] = useState('MANUAL');
    const [ratings, setRatings] = useState({
        quality: 0,
        speed: 0,
        communication: 0,
    });
    const [comment, setComment] = useState("");
    const [attachment, setAttachment] = useState(null);

    const handleRatingChange = (key, value) => {
        setRatings(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        if (type === 'project' && evaluationMethod === 'AUTO_FROM_TASKS') {
            onSubmit({ evaluation_method: 'AUTO_FROM_TASKS' });
            return;
        }

        if (type === 'task' && evaluationMethod === 'AUTO_FROM_STAGES') {
            onSubmit({ evaluation_method: 'AUTO_FROM_STAGES' });
            return;
        }

        const avgRating = (ratings.quality + ratings.speed + ratings.communication) / 3;
        
        if (type === 'task') {
            onSubmit({ 
                evaluation_method: 'MANUAL',
                evaluation_rating: avgRating,
                evaluation_criteria: ratings,
                comment: comment,
                attachment: attachment
            });
        } else {
            onSubmit({
                evaluation_method: 'MANUAL',
                overall_rating: avgRating,
                evaluation_criteria: ratings,
                comment: comment,
                attachment: attachment
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
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={type === 'project' ? "Evaluate Project" : "Evaluate Task"}
            isBtns={true}
            btnApplyTitle={t("Submit Evaluation")}
            onClick={handleSubmit}
            disabled={isSubmitting || (evaluationMethod === 'MANUAL' && (ratings.quality === 0 || ratings.speed === 0 || ratings.communication === 0))}
            className="lg:w-[500px] md:w-8/12 sm:w-10/12 w-11/12 p-6"
        >
            <div className="flex flex-col gap-6 py-2">
                {(type === 'project' || (type === 'task' && hasStages)) && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-cell-secondary">{t("Evaluation Method")}</label>
                        <DefaultSelect 
                            value={evaluationOptions.filter(opt => opt.id === evaluationMethod)}
                            onChange={(val) => {
                                if (val && val.length > 0) {
                                    setEvaluationMethod(val[0].id);
                                } else {
                                    setEvaluationMethod('MANUAL');
                                }
                            }}
                            options={evaluationOptions}
                            placeholder={t("Select Method")}
                            multi={false}
                        />
                    </div>
                )}

                {evaluationMethod === 'MANUAL' && (
                    <div className="space-y-6 bg-gray-50/50 dark:bg-white/5 p-4 rounded-xl border border-status-border">
                        <StarRatingInput 
                            title={t("Quality of Deliverables")} 
                            value={ratings.quality} 
                            onChange={(val) => handleRatingChange('quality', val)} 
                        />
                        <StarRatingInput 
                            title={t("Adherence to Deadlines")} 
                            value={ratings.speed} 
                            onChange={(val) => handleRatingChange('speed', val)} 
                        />
                        <StarRatingInput 
                            title={t("Team Collaboration")} 
                            value={ratings.communication} 
                            onChange={(val) => handleRatingChange('communication', val)} 
                        />
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

                {isSubmitting && (
                    <div className="flex items-center justify-center py-2">
                        <span className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default EvaluationModal;
