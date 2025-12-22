"use client";

import { useState, useRef, useEffect } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const DropdownMenu = ({button, content, removeDefaultButtonStyling=false}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                isMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isMenuOpen]);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsMenuOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsMenuOpen(false);
        }, 200);
    };

    return (
        <div className="relative" ref={menuRef}>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={removeDefaultButtonStyling ? '' : `flex rounded-lg border-2 dark:border-gray-700 md:py-0.5 md:px-1 px-0.5 py-0.5 items-center justify-between cursor-pointer ${isMenuOpen
                        ? "bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300"
                        : "bg-white dark:bg-gray-900"
                    }`}
            >
                {button}
                {!removeDefaultButtonStyling && <MdOutlineKeyboardArrowDown />}
            </div>

            {isMenuOpen && (
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={`absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[1050]`}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
