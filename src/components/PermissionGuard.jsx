"use client";

import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectPermissions, selectPermissionsLoaded } from "@/redux/auth/authSlice";
import { ShieldCross } from "iconsax-react";
import Link from "next/link";

const AccessDenied = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
            <div className="p-6 rounded-full bg-red-50">
                <ShieldCross size={64} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-cell-primary">
                {t("Access Denied")}
            </h1>
            <p className="text-cell-secondary max-w-md">
                {t("You don't have permission to view this page. Please contact your administrator if you believe this is a mistake.")}
            </p>
            <Link
                href="/dashboard"
                className="mt-2 px-6 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
                {t("Back to Dashboard")}
            </Link>
        </div>
    );
};

const PermissionGuard = ({ permission, anyOf, allOf, children, fallback }) => {
    const permissions = useSelector(selectPermissions);
    const permissionsLoaded = useSelector(selectPermissionsLoaded);

    if (!permissionsLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
            </div>
        );
    }

    const hasWildcard = Array.isArray(permissions) && permissions.includes("*");
    const list = Array.isArray(permissions) ? permissions : [];

    const allowed = hasWildcard
        || (permission && list.includes(permission))
        || (anyOf && anyOf.some((p) => list.includes(p)))
        || (allOf && allOf.every((p) => list.includes(p)))
        || (!permission && !anyOf && !allOf);

    if (!allowed) {
        return fallback ?? <AccessDenied />;
    }

    return <>{children}</>;
};

PermissionGuard.propTypes = {
    permission: PropTypes.string,
    anyOf: PropTypes.arrayOf(PropTypes.string),
    allOf: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.node.isRequired,
    fallback: PropTypes.node,
};

export { AccessDenied };
export default PermissionGuard;
