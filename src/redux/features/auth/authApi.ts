// ====================================================
// 🧾 Auth API Module - User Authentication & Management
// ====================================================

import baseApi from "@/redux/baseApi";

// ===== 🔹 Inject auth-related endpoints into baseApi =====
const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ===== ✅ Signup user =====
    signUpUser: build.mutation({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
    }),

    // ===== ✅ Login user =====
    loginUser: build.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",

        body,
      }),
    }),

    // ===== ✅ Get current logged-in user info =====
    getMe: build.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // ===== ✅ Get all users (admin access) with filters =====
    getUsers: build.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.searchTerm)
          queryParams.append("searchTerm", params.searchTerm);
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        return {
          url: `users/?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),

    // ===== ✅ Get a single user by ID =====
    getSingleUser: build.query({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // ===== ✅ Update a user (partial update with PATCH) =====
    updateUser: build.mutation({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// =====  Export auto-generated hooks =====
export const {
  useSignUpUserMutation,
  useLoginUserMutation,
  useGetMeQuery,
  useGetUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
} = authApi;

export default authApi;
