"use client";
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/notifications/notificationsSlice';
import { RootRoute } from '@/Root.Route';

export const useNotifications = (userId) => {
    const dispatch = useDispatch();
    // Keep a reference to the AbortController so we can close the connection on unmount
    const abortControllerRef = useRef(null);

    useEffect(() => {
        // Only establish connection if userId is provided
        if (!userId) return;

        // Ensure user is authenticated by checking for the token
        const token = localStorage.getItem('token');
        if (!token) return;

        // Use environment variable for base URL, remove trailing slash if present
        const baseUrl = RootRoute ? RootRoute : 'http://localhost:3000';
        const eventSourceUrl = `${baseUrl}/api/notifications/stream/${userId}`;

        // Set up abortion logic for React unmount
        abortControllerRef.current = new AbortController();

        const connectToStream = async () => {
            try {
                // Using fetch allows us to specify custom headers like Authorization
                const response = await fetch(eventSourceUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Sent via Header!
                        'Accept': 'text/event-stream',
                    },
                    signal: abortControllerRef.current.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                console.log('🟢 SSE Connection established');

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let buffer = "";

                // Read chunks of data as they continuously stream from the server
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        console.log('🔴 SSE Stream finished.');
                        break;
                    }

                    // Decode the chunk (as text) and add it to our buffer
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');

                    // The last part is left in the buffer because it might be incomplete
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        // SSE pushes data prefixed with 'data:'
                        if (trimmedLine.startsWith('data:')) {
                            const dataStr = trimmedLine.substring(5).trim();
                            if (dataStr) {
                                try {
                                    const data = JSON.parse(dataStr);
                                    
                                    // Dispatch to Redux store
                                    dispatch(addNotification({
                                        id: data.id,
                                        title: data.title,
                                        content: data.message,
                                        time: new Date(data.created_at).toLocaleTimeString(),
                                        priority: data.priority,
                                        isRead: false,
                                        action_url: data.action_url,
                                        model_type: data.model_type,
                                        model_id: data.model_id
                                    }));

                                    console.log('📨 Notification added to Redux:', data.title);
                                } catch (error) {
                                    console.error('❌ Error parsing notification data:', error, dataStr);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    // Safe to ignore, we aborted it intentionally on unmount
                    console.log('🔴 SSE connection closed.');
                } else {
                    console.error('🔴 SSE Connection returned an error.', error);
                }
            }
        };

        connectToStream();

        // Cleanup on unmount
        return () => {
            if (abortControllerRef.current) {
                // This aborts the exact ongoing fetch connection
                abortControllerRef.current.abort();
                console.log('🔴 SSE Connection closed and cleaned up');
            }
        };
    }, [userId]);
};
