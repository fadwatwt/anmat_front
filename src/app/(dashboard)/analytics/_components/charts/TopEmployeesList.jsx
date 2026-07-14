
import { RiUserLine } from '@remixicon/react';
import { useTranslation } from 'react-i18next';

const EmployeeItem = ({ name, department }) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-4 py-3">
            <div className="w-11 h-11 rounded-full border border-status-border flex items-center justify-center bg-status-bg shrink-0">
                <RiUserLine className="text-cell-secondary size-5" />
            </div>

            <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-table-title leading-tight">{name}</h4>
                <span className="text-xs text-cell-secondary mt-1">{t(department)}</span>
            </div>
        </div>
    );
};

const TopEmployeesList = ({ employees }) => {
    return (
        <div className="flex flex-col gap-2 mt-2 mb-4">
            {employees.map((emp, index) => (
                <EmployeeItem
                    key={index}
                    name={emp.name}
                    department={emp.department}
                />
            ))}
        </div>
    );
};

export default TopEmployeesList;
