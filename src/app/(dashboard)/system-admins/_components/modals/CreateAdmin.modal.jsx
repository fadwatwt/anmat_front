"use client"
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import InputAndLabel from "@/components/Form/InputAndLabel";
import PasswordInput from "@/components/Form/PasswordInput";
import TagInput from "@/components/Form/TagInput";
import Switch2 from "@/components/Form/Switch2";
import { useState } from "react";
import { useCreateAdminMutation, useGetAdminRolesQuery } from "@/redux/system-admins/systemAdminsAPI";

function CreateAdminModal({ isOpen, onClose, onShowSuccess }) {
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
            alert("Passwords do not match!");
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
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isBtns={true} title={"Add User"}
            btnApplyTitle={isLoading ? "Adding..." : "Add"}
            classNameBtns={"mt-5"}
            onClick={handleSubmit}
        >
            <div className={"w-full flex flex-col gap-5"}>
                <InputAndLabel
                    title={"Name"}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <InputAndLabel
                    title={"Email"}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <InputAndLabel
                    title={"Phone"}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <PasswordInput
                    title={"Password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <PasswordInput
                    title={"Confirm Password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                <TagInput
                    suggestions={suggestions}
                    title={"Roles"}
                    value={formData.rules}
                    onChange={handleRoleChange}
                />

                <div className="flex items-center gap-2">
                    <span className="text-sm dark:text-gray-200 text-gray-900">Active Status</span>
                    <Switch2
                        isOn={formData.is_active}
                        handleToggle={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                    />
                </div>

            </div>
        </Modal>
    )
}

CreateAdminModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onShowSuccess: PropTypes.func
}


export default CreateAdminModal;