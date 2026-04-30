import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal/Modal";
import InputAndLabel from "@/components/Form/InputAndLabel";
import TextAreaWithLabel from "@/components/Form/TextAreaWithLabel";
import { useCreateProjectTemplateFromProjectMutation } from "@/redux/projects/subscriberProjectTemplatesApi";
import Loading from "@/components/Loading";

const SaveAsTemplateModal = ({ project, isOpen, onClose }) => {
    const { t } = useTranslation();
    const [createTemplate, { isLoading }] = useCreateProjectTemplateFromProjectMutation();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        estimated_duration: 1,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                description: project.description || "",
                category: "",
                estimated_duration: 1,
            });
            setErrors({});
        }
    }, [project]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        const newErrors = {};
        if (!formData.name) newErrors.name = t("Required");
        if (!formData.category) newErrors.category = t("Required");
        if (!formData.estimated_duration) newErrors.estimated_duration = t("Required");
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await createTemplate({
                projectId: project._id || project.id,
                data: {
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    estimated_duration: Number(formData.estimated_duration),
                    department_id: project.department_id?._id || project.department_id || undefined,
                }
            }).unwrap();
            onClose();
        } catch (err) {
            console.error("Failed to save template", err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t("Save as Template")} size="md">
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <InputAndLabel
                    title={t("Template Name")}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder={t("Enter template name")}
                />
                
                <TextAreaWithLabel
                    title={t("Description")}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder={t("Enter template description")}
                />

                <InputAndLabel
                    title={t("Category")}
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    error={errors.category}
                    placeholder={t("Enter category")}
                />

                <InputAndLabel
                    title={t("Estimated Duration (Days)")}
                    type="number"
                    min="1"
                    name="estimated_duration"
                    value={formData.estimated_duration}
                    onChange={handleChange}
                    error={errors.estimated_duration}
                    placeholder={t("Enter estimated duration")}
                />

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center min-w-[100px] transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loading width="20px" height="20px" /> : t("Save")}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SaveAsTemplateModal;
