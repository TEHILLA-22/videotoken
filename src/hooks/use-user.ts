import { useGetAllUsersQuery, useGetUserByIdQuery } from "@/redux/features/users-api";

export default function useGetUser() {
    // Fetch all users
    const {
        data: all_users,
        isLoading: isLoadingUsers,
        error: usersError,
        refetch: refetchUser
    } = useGetAllUsersQuery(undefined, {
        refetchOnReconnect: true,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    // Function to fetch a user by ID dynamically
    const getUserById = (userId: string) => {
        const {
            data: user,
            isLoading: isLoadingUser,
            error: userError,
            refetch: refetchUserById
        } = useGetUserByIdQuery(userId, {
            refetchOnReconnect: true,
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true,
        });

        return { user, isLoadingUser, userError, refetchUserById };
    };

    return {
        all_users,
        isLoadingUsers,
        usersError,
        refetchUser,
        getUserById,
    };
}
