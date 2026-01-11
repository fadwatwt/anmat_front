"use client";

import { useState, useRef, useEffect } from "react";
import { RiUser3Line, RiLogoutBoxLine } from "@remixicon/react";
import Avatar from "./Avatar";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLazyLogoutQuery } from "@/redux/auth/authAPI";
import { logout } from "@/redux/auth/authSlice";

const HeaderUserMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { t, i18n } = useTranslation();
    const timeoutRef = useRef(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const [triggerLogout] = useLazyLogoutQuery();

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await triggerLogout(token);
            } catch (error) {
                console.error("Logout failed", error);
            }
        }
        dispatch(logout());
        router.push("/sign-in");
    };

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
                className={`flex box-border rounded-lg border-2 dark:border-gray-700 md:py-0.5 md:px-1 px-0.5 py-0.5 items-center gap-1 cursor-pointer space-x-2 p-2 ${isMenuOpen
                    ? "bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-gray-100 dark:bg-gray-900"
                    }`}
            >
                <div className={"p-1"}>
                    <img
                        src={
                            "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        }
                        className={"w-8 h-8 rounded-full"}
                        alt={"image-profile"}
                    />
                </div>
                <p className={"dark:text-gray-400 text-sm sm:block hidden"}>
                    Rawan Ahmed
                </p>
                <MdOutlineKeyboardArrowDown />
            </div>

            {isMenuOpen && (
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={`absolute right-0 mt-2 w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50`}
                >
                    <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <RiUser3Line className="mr-2" size={18} />
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <RiLogoutBoxLine className="mr-2" size={18} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default HeaderUserMenu;
