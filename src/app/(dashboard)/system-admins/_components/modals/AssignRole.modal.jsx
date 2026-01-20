"use client"

import Modal from "@/components/Modal/Modal";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetAdminRolesQuery, useAssignRoleMutation } from "@/redux/roles/adminRolesAPI";

function AssignRoleModal({ isOpen, onClose, admin, onShowResult }) {
    const { t } = useTranslation();
    const { data: rolesData, isLoading: isRolesLoading } = useGetAdminRolesQuery();
    const [assignRole, { isLoading: isAssigning }] = useAssignRoleMutation();
    const [selectedRoleId, setSelectedRoleId] = useState("");

    const availableRoles = useMemo(() => {
        if (!rolesData?.data || !admin) return [];
        const adminRoleIds = new Set(admin.admin_system_roles?.map(r => r._id));
        return rolesData.data.filter(role => !adminRoleIds.has(role._id));
    }, [rolesData, admin]);

    const handleAssign = async () => {
        if (!selectedRoleId || !admin) return;
        try {
            const result = await assignRole({
                role_id: selectedRoleId,
                admin_id: admin._id
            }).unwrap();
            onShowResult({ status: "success", message: result.message || t("Role assigned successfully") });
            onClose();
            setSelectedRoleId("");
        } catch (err) {
            onShowResult({
                status: "error",
                message: err.data?.message || t("Failed to assign role")
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Assign Role"
            isBtns={true}
            btnApplyTitle="Assign"
            onClick={handleAssign}
            disabled={isAssigning || !selectedRoleId}
        >
            <div className="p-4">
                <SelectAndLabel
                    title="Select Role"
                    name="role"
                    value={selectedRoleId}
                    options={availableRoles}
                    onChange={setSelectedRoleId}
                    onBlur={() => { }}
                    isRequired={true}
                    placeholder="Choose a role"
                />
            </div>
        </Modal>
    );
}

export default AssignRoleModal;
