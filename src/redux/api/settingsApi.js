import { apiSlice } from "./apiSlice";

export const settingsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserPreferences: builder.query({
            query: () => ({
                url: "api/user/settings/preferences",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["UserPreferences"],
        }),
        updateUserPreferences: builder.mutation({
            query: (preferences) => ({
                url: "api/user/settings/preferences",
                method: "PATCH",
                body: preferences,
            }),
            invalidatesTags: ["UserPreferences"],
        }),
        getAttendanceSettings: builder.query({
            query: () => ({
                url: "api/admin/settings/attendance",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["Settings"],
        }),
        updateAttendanceSettings: builder.mutation({
            query: (data) => ({
                url: "api/admin/settings/attendance",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Settings"],
        }),
        getChatSettings: builder.query({
            query: () => ({
                url: "api/chats/settings",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: ["ChatSettings"],
        }),
        updateChatSettings: builder.mutation({
            query: (data) => ({
                url: "api/chats/settings",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["ChatSettings"],
        }),
    }),
});

export const {
    useGetUserPreferencesQuery,
    useUpdateUserPreferencesMutation,
    useGetAttendanceSettingsQuery,
    useUpdateAttendanceSettingsMutation,
    useGetChatSettingsQuery,
    useUpdateChatSettingsMutation,
} = settingsApi;
