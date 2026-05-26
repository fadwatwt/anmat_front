"use client"
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import InputAndLabel from "@/components/Form/InputAndLabel";
import PasswordInput from "@/components/Form/PasswordInput";
import TagInput from "@/components/Form/TagInput";
import Switch2 from "@/components/Form/Switch2";
import { useState } from "react";
import { useCreateAdminMutation, useGetAdminRolesQuery } from "@/redux/system-admins/systemAdminsAPI";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useTranslation } from "react-i18next";

function CreateAdminModal({ isOpen, onClose, onShowSuccess }) {
    const { t } = useTranslation();
    const [createAdmin, { isLoading }] = useCreateAdminMutation();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        rules: [],
        is_active: true
    });
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const { data: rolesResponse } = useGetAdminRolesQuery();
    const suggestions = rolesResponse?.data?.map(role => ({
        id: role._id,
        name: role.name
    })) || [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (tags) => {
        setFormData(prev => ({ ...prev, rules: tags }));
    };

    const handleSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            setApiResponse({ isOpen: true, status: "error", message: t("Passwords do not match!") });
            return;
        }
        try {
            await createAdmin({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                admin_system_roles: formData.rules.map(tag => tag.id),
                is_active: formData.is_active
            }).unwrap();
            onShowSuccess();
            onClose();
            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                rules: [],
                is_active: true
            });
        } catch (error) {
            console.error("Failed to create admin:", error);
            setApiResponse({
                isOpen: true,
                status: "error",
                message: error?.data?.message || "Failed to create admin",
            });
        }
    };

    return (
        <>
        <Modal isOpen={isOpen} onClose={onClose} isBtns={true} title={t("Add User")}
            btnApplyTitle={isLoading ? t("Adding...") : t("Add")}
            classNameBtns={"mt-5"}
            onClick={handleSubmit}
        >
            <div className={"w-full flex flex-col gap-5"}>
                <InputAndLabel
                    title={t("Name")}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <InputAndLabel
                    title={t("Email")}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <InputAndLabel
                    title={t("Phone")}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <PasswordInput
                    title={t("Password")}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <PasswordInput
                    title={t("Confirm Password")}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                <TagInput
                    suggestions={suggestions}
                    title={t("Roles")}
                    value={formData.rules}
                    onChange={handleRoleChange}
                />

                <div className="flex items-center gap-2">
                    <span className="text-sm text-cell-primary">{t("Active Status")}</span>
                    <Switch2
                        isOn={formData.is_active}
                        handleToggle={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                    />
                </div>

            </div>
        </Modal>

        <ApiResponseAlert
            isOpen={apiResponse.isOpen}
            status={apiResponse.status}
            message={apiResponse.message}
            onClose={() => setApiResponse({ isOpen: false, status: "", message: "" })}
        />
        </>
    )
}

CreateAdminModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onShowSuccess: PropTypes.func
}


export default CreateAdminModal;