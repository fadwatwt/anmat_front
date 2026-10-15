"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/Modal/Modal.jsx";
import PropTypes from "prop-types";
import ElementsSelect from "@/components/Form/ElementsSelect";
import { useTranslation } from "react-i18next";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import InitialsAvatar from "@/components/InitialsAvatar";

function AddMember({ isOpen, onClose, onSubmit, excludedIds = [], isSubmitting = false }) {
    const { t } = useTranslation();
    const [selectedMember, setSelectedMember] = useState(null);
    const { data: employees = [], isLoading, isError, refetch } = useGetEmployeesQuery(undefined, { skip: !isOpen });

    const options = useMemo(() => employees
        .map((employee) => {
            const id = employee.user_id || employee.user?._id || employee._id;
            const name = employee.user?.name || employee.name || employee.email || t("Unknown");
            return {
                id,
                element: name,
                name,
                email: employee.user?.email || employee.email || "",
                image: employee.user?.imageProfile || employee.imageProfile || employee.avatar,
            };
        })
        .filter((employee) => employee.id && !excludedIds.map(String).includes(String(employee.id))), [employees, excludedIds, t]);

    const handleClose = () => {
        if (isSubmitting) return;
        setSelectedMember(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!selectedMember || isSubmitting) return;
        try {
            await onSubmit(selectedMember.id);
            setSelectedMember(null);
            onClose();
        } catch {
            // The parent displays the API error and the selection stays available for retry.
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            isBtns
            title={t("Add Member")}
            btnApplyTitle={isSubmitting ? t("Adding...") : t("Add")}
            onClick={handleSubmit}
            disabled={!selectedMember || isSubmitting || isLoading || isError}
        >
            <div className="flex flex-col gap-4">
                <ElementsSelect
                    title={t("Member Name")}
                    placeholder={isLoading ? t("Loading employees...") : t("Select Member")}
                    options={options}
                    onChange={(value) => setSelectedMember(value[0] || null)}
                    defaultValue={selectedMember ? [selectedMember] : []}
                    isMultiple={false}
                    classNameContainer="w-full"
                    renderOption={(option) => (
                        <div className="flex items-center gap-3">
                            {option.image ? (
                                <img src={option.image} alt="" className="h-[34px] w-[34px] rounded-full object-cover border border-status-border" />
                            ) : (
                                <InitialsAvatar name={option.name} size="34px" fontSize="text-xs" />
                            )}
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-cell-primary truncate">{option.name}</p>
                                {option.email && <p className="text-xs text-cell-secondary truncate">{option.email}</p>}
                            </div>
                        </div>
                    )}
                />

                {!isLoading && !isError && options.length === 0 && (
                    <p className="rounded-xl bg-status-bg p-3 text-center text-sm text-cell-secondary">{t("No employees available to add")}</p>
                )}
                {isError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center dark:border-red-900 dark:bg-red-950/30">
                        <p className="text-sm text-red-600 dark:text-red-300">{t("Employees could not be loaded")}</p>
                        <button type="button" onClick={refetch} className="mt-2 text-sm font-semibold text-primary-base">{t("Try Again")}</button>
                    </div>
                )}
            </div>
        </Modal>
    );
}

AddMember.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    excludedIds: PropTypes.array,
    isSubmitting: PropTypes.bool,
};

export default AddMember;
