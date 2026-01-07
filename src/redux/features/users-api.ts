import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "@lib/base-url";

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => `/`
        }),

        getUserById: builder.query({
            query: (id) => `/${id}`
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserByIdQuery,
} = usersApi;
