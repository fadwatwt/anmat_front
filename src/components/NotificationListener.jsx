"use client";

import { useDispatch, useSelector } from 'react-redux';
import { selectUserId, selectUserType } from '@/redux/auth/authSlice';
import { useNotifications } from '@/Hooks/useNotifications';
import { useGetNotificationsQuery } from '@/redux/api/notificationsApi';
import { setNotifications, clearNotifications } from '@/redux/notifications/notificationsSlice';
import { useEffect } from 'react';

export default function NotificationListener() {
    // We listen to the auth slice for the logged-in user's ID.
    // - On SignIn: user is set -> userId becomes a valid string -> connection opens.
    // - On LogOut: user is cleared -> userId becomes null/undefined -> connection closes gracefully.
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const userType = useSelector(selectUserType);

    useEffect(() => {
        if (userId) {
            // Clear current notifications to let the SSE stream repopulate them
            dispatch(clearNotifications());
        }
    }, [userId, dispatch]);

    useNotifications(userId);

    // This component is purely headless and does not render anything.
    return null;
}
