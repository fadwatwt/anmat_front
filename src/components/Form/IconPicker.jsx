import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    SearchNormal1, Building, Building3, Building4, Briefcase, Shop, Money, Card,
    Health, Global, Cpu, Monitor, Flash, Cloud, Video, Gallery,
    Truck, Wallet, Bill, Graph, Activity, Chart, Messages1, People,
    Security, Setting, Category, Lamp, Music, Camera, Ticket,
    Heart, Star, Verify, SafeHome, ShopAdd, Personalcard, Archive,
    Book, Call, Direct, Notification, SecurityUser, User, Flash1
} from 'iconsax-react';

const ICONS = {
    Building, Building3, Building4, Briefcase, Shop, Money, Card,
    Health, Global, Cpu, Monitor, Flash, Cloud, Video, Gallery,
    Truck, Wallet, Bill, Graph, Activity, Chart, Messages1, People,
    Security, Setting, Category, Lamp, Music, Camera, Ticket,
    Heart, Star, Verify, SafeHome, ShopAdd, Personalcard, Archive,
    Book, Call, Direct, Notification, SecurityUser, User, Flash1
};

const ICON_LIST = Object.keys(ICONS);


const IconPicker = ({ title, value, onChange }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredIcons = ICON_LIST.filter(icon =>
        icon.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-3 w-full">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</label>

            <div className="border rounded-2xl dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 p-4">
                <div className="relative mb-4">
                    <SearchNormal1
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder={t("Search icons...")}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1 custom-scroll">
                    {filteredIcons.map((iconName) => {
                        const IconComponent = ICONS[iconName];
                        if (!IconComponent) return null;

                        const isSelected = value === iconName;

                        return (
                            <button
                                key={iconName}
                                type="button"
                                onClick={() => onChange(iconName)}
                                className={`flex items-center justify-center p-2 rounded-xl transition-all hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm ${isSelected
                                    ? "bg-primary-500 text-white shadow-md ring-2 ring-primary-100 dark:ring-primary-900"
                                    : "bg-transparent text-gray-500 dark:text-gray-400"
                                    }`}
                                title={iconName}
                            >
                                <IconComponent
                                    size={24}
                                    variant={isSelected ? "Bold" : "Linear"}
                                    color="currentColor"
                                />
                            </button>
                        );
                    })}
                </div>
            </div>

            {value && (
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{t("Selected:")}</span>
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full capitalize">
                        {value}
                    </span>
                </div>
            )}
        </div>
    );
};

export default IconPicker;
