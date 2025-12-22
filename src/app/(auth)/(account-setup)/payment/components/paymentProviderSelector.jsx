
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';


const ProviderItem = ({ logo, name, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center p-4 border-2 rounded-xl transition-all w-full h-16 
      ${isSelected ? 'border-blue-600 bg-blue-50/10' : 'border-gray-100 bg-white hover:border-gray-300'}`}
    >
        <img src={logo} alt={name} className="h-full object-contain" />
    </button>
);

function PaymentProviderSelector({ selectedProvider, onProviderChange }) {
    const { t } = useTranslation();

    const providers = [
        { id: 'mastercard', name: 'Mastercard', logo: '/images/payments/mastercard.png' },
        { id: 'paypal', name: 'PayPal', logo: '/images/payments/paypal.png' },
        { id: 'visa', name: 'Visa', logo: '/images/payments/visacard.png' },
        { id: 'skrill', name: 'Skrill', logo: '/images/payments/skrill.png' },
    ];

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-gray-800">{t('Select Payment method')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {providers.map((provider) => (
                    <ProviderItem
                        key={provider.id}
                        logo={provider.logo}
                        name={provider.name}
                        isSelected={selectedProvider === provider.id}
                        onClick={() => onProviderChange(provider.id)}
                    />
                ))}
            </div>
        </div>
    );
}

PaymentProviderSelector.propTypes = {
    selectedProvider: PropTypes.string,
    onProviderChange: PropTypes.func.isRequired,
};

export default PaymentProviderSelector;