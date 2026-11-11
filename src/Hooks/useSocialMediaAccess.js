"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, setSocialMediaGrants } from "@/redux/auth/authSlice";
import { useGetMySocialMediaAccessQuery } from "@/redux/socialMedia/socialMediaAccessApi";
import { hasSocialMediaGrant } from "@/functions/socialMediaAccess";

const EMPTY_GRANTS = [];

export default function useSocialMediaAccess() {
    const { user, token } = useSelector(selectAuth);
    const dispatch = useDispatch();
    const requiresGrant = user?.type === "Subscriber" || user?.type === "Employee";
    const query = useGetMySocialMediaAccessQuery(user?._id, {
        skip: !token || !requiresGrant,
        pollingInterval: 15000,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });
    const grants = query.isError ? EMPTY_GRANTS : query.data?.social_media_grants;
    useEffect(() => {
        if (!requiresGrant) return;
        dispatch(setSocialMediaGrants(Array.isArray(grants) ? grants : []));
    }, [dispatch, grants, requiresGrant]);
    return {
        loading: requiresGrant && (query.isLoading || query.isUninitialized),
        allowed: user?.type === "Admin" || (!query.isError && hasSocialMediaGrant(user?.type, grants)),
    };
}
