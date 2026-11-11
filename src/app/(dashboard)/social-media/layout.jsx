"use client";
import PropTypes from "prop-types";
import useSocialMediaAccess from "@/Hooks/useSocialMediaAccess";
import { AccessDenied } from "@/components/PermissionGuard";

export default function SocialMediaLayout({ children }) {
    const { loading, allowed } = useSocialMediaAccess();
    if (loading) return <div className="flex min-h-[40vh] items-center justify-center" role="status"><div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary-500" /></div>;
    return allowed ? children : <AccessDenied />;
}
SocialMediaLayout.propTypes = { children: PropTypes.node.isRequired };
