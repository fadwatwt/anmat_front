import Modal from "@/components/Modal/Modal";
import InputAndLabel from "@/components/Form/InputAndLabel";
import ElementsSelect from "@/components/Form/ElementsSelect";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";

function CreateTeamModal({ isOpen, onClose, onSubmit, editData, isSaving }) {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [department, setDepartment] = useState([]); // [{id, element}]
    const [leader, setLeader] = useState([]);
    const [members, setMembers] = useState([]);

    const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !isOpen });
    const { data: departments = [] } = useGetDepartmentsQuery(undefined, { skip: !isOpen });

    const employeeOptions = useMemo(
        () =>
            employees.map((e) => ({
                id: e.user?._id || e._id,
                element: e.user?.name || t("Unknown Employee"),
            })),
        [employees, t],
    );

    const departmentOptions = useMemo(
        () =>
            departments.map((d) => ({
                id: d._id,
                element: d.name || t("Unknown Department"),
            })),
        [departments, t],
    );

    useEffect(() => {
        if (!isOpen) return;
        setName(editData?.name || "");
        // Pre-select for edit when ids are available
        const leaderId = editData?.leader_id?._id || editData?.leader_id;
        setLeader(leaderId ? [{ id: leaderId, element: editData?.leader_id?.name || "" }] : []);
        const memberObjs = Array.isArray(editData?.members_ids)
            ? editData.members_ids.map((m) => ({ id: m?._id || m, element: m?.name || "" }))
            : [];
        setMembers(memberObjs);
        const relId = editData?.related_model_id?._id || editData?.related_model_id;
        setDepartment(relId ? [{ id: relId, element: "" }] : []);
    }, [isOpen, editData]);

    const handleSave = () => {
        if (!name.trim()) return;
        const payload = {
            name,
            related_model_type: department.length ? "Department" : undefined,
            related_model_id: department[0]?.id || undefined,
            leader_id: leader[0]?.id || undefined,
            members_ids: members.map((m) => m.id),
        };
        if (onSubmit) {
            onSubmit(payload);
        } else {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isBtns={true}
            btnApplyTitle={editData ? t("Save") : t("Create Team")}
            onClick={handleSave}
            isLoading={isSaving}
            className={"lg:w-4/12 md:w-8/12 sm:w-6/12 w-11/12 px-3"}
            title={editData ? t("Edit Team") : t("Create New Team")}
        >
            <div className="px-4">
                <div className="flex flex-col gap-4">
                    <InputAndLabel
                        title={t("Team Name")}
                        type={"text"}
                        placeholder={t("Enter team name")}
                        isRequired={true}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <ElementsSelect
                        title={t("Department")}
                        options={departmentOptions}
                        defaultValue={department}
                        onChange={setDepartment}
                        placeholder={t("Select Department")}
                        isMultiple={false}
                    />

                    <ElementsSelect
                        title={t("Team Leader")}
                        options={employeeOptions}
                        defaultValue={leader}
                        onChange={setLeader}
                        placeholder={t("Select Team Leader")}
                        isMultiple={false}
                    />

                    <ElementsSelect
                        title={t("Team Members")}
                        isMultiple={true}
                        options={employeeOptions}
                        defaultValue={members}
                        onChange={setMembers}
                        placeholder={t("Select members")}
                    />
                </div>
            </div>
        </Modal>
    );
}

CreateTeamModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    editData: PropTypes.object,
    isSaving: PropTypes.bool,
};

export default CreateTeamModal;
