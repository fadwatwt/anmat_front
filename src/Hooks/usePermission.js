import { useSelector } from "react-redux";
import { selectPermissions } from "@/redux/auth/authSlice";

// '*' is the wildcard granted to Subscribers (org owner) and super-admins.
const hasWildcard = (permissions) =>
    Array.isArray(permissions) && permissions.includes("*");

/**
 * Returns true if the current user has the given permission.
 * Pass null/undefined to mean "no permission required" (always true).
 */
export const usePermission = (permission) => {
    const permissions = useSelector(selectPermissions);
    if (!permission) return true;
    if (hasWildcard(permissions)) return true;
    return Array.isArray(permissions) && permissions.includes(permission);
};

/**
 * Returns true if the current user has at least one of the given permissions.
 */
export const useHasAnyPermission = (requiredPermissions) => {
    const permissions = useSelector(selectPermissions);
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (hasWildcard(permissions)) return true;
    if (!Array.isArray(permissions)) return false;
    return requiredPermissions.some((p) => permissions.includes(p));
};

/**
 * Returns true if the current user has every one of the given permissions.
 */
export const useHasAllPermissions = (requiredPermissions) => {
    const permissions = useSelector(selectPermissions);
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (hasWildcard(permissions)) return true;
    if (!Array.isArray(permissions)) return false;
    return requiredPermissions.every((p) => permissions.includes(p));
};

export default usePermission;
