import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SavedMethodCard = ({ method, isSelected, onSelect, onEdit }) => {
    const { t } = useTranslation();

    return (
        <div
            className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all flex-1
        ${isSelected ? 'border-blue-600' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
            onClick={() => onSelect(method.id)}
        >
            <div className="flex items-center gap-4 w-full">
                {/* Radio Button */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
          ${isSelected ? 'border-blue-600' : 'border-gray-300'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-gray-100">**** {method.last4}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{method.type}</span>
                        <span>•</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(method.id); }}
                            className="hover:underline text-gray-600 dark:text-gray-400"
                        >
                            {t('Edit')}
                        </button>
                    </div>
                </div>

                {/* Logo */}
                <img src={method.logo} alt={method.type} className="h-6 object-contain" />
            </div>
        </div>
    );
};

function SavedMethodsGroup({ methods, selectedId, onSelect, onEdit, onAddNew }) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-4 w-full">
            <h3 className="text-gray-800 dark:text-gray-200">{t('Payment method')}</h3>

            <div className="flex flex-col sm:flex-row gap-3">
                {methods.map((method) => (
                    <SavedMethodCard
                        key={method.id}
                        method={method}
                        isSelected={selectedId === method.id}
                        onSelect={onSelect}
                        onEdit={onEdit}
                    />
                ))}
            </div>

            <button
                onClick={onAddNew}
                className="w-full py-3 mt-2 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10 border border-transparent rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-colors"
            >
                + {t('Other payment method')}
            </button>
        </div>
    );
}

SavedMethodsGroup.propTypes = {
    methods: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        last4: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        logo: PropTypes.string.isRequired,
    })).isRequired,
    selectedId: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onAddNew: PropTypes.func.isRequired,
};

export default SavedMethodsGroup;