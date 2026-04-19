"use client";

import { useDispatch, useSelector } from 'react-redux';
import { selectUserId, selectUserType } from '@/redux/auth/authSlice';
import { useNotifications } from '@/Hooks/useNotifications';
import { useGetNotificationsQuery } from '@/redux/api/notificationsApi';
import { setNotifications } from '@/redux/notifications/notificationsSlice';
import { useEffect } from 'react';

export default function NotificationListener() {
    // We listen to the auth slice for the logged-in user's ID.
    // - On SignIn: user is set -> userId becomes a valid string -> connection opens.
    // - On LogOut: user is cleared -> userId becomes null/undefined -> connection closes gracefully.
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const userType = useSelector(selectUserType);

    // Fetch initial notifications
    const { data: historyData, isSuccess } = useGetNotificationsQuery(
        { recipientId: userId, recipientType: userType },
        { skip: !userId || !userType }
    );

    useEffect(() => {
        if (isSuccess && historyData) {
            console.log('📊 [Listener] History data received:', {
                dataLength: historyData.data?.length,
                meta: historyData.meta
            });

            // Map backend structure to frontend structure
            const mappedNotifications = historyData.data.map(n => ({
                id: n._id,
                title: n.title,
                content: n.message,
                time: new Date(n.created_at).toLocaleTimeString(),
                priority: n.priority,
                isRead: n.status === 'read',
                action_url: n.action_url,
                model_type: n.model_type,
                model_id: n.model_id
            }));

            dispatch(setNotifications({
                data: mappedNotifications,
                meta: { unreadCount: historyData.meta?.unreadCount }
            }));
        }
    }, [isSuccess, historyData, dispatch]);

    useNotifications(userId);

    // This component is purely headless and does not render anything.
    return null;
}
