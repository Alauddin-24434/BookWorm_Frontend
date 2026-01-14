// src/redux/api/libraryApi.ts
import baseApi from "@/redux/baseApi";
import { Shelf } from "@/types";

export const libraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User er library fetch korar jonno query
    getUserLibrary: builder.query<Shelf[], void>({
      query: () => "/user-library",
      // Response theke data extract kora
      transformResponse: (response: { data: Shelf[] }) => response.data,
      // Caching er jonno tag
      providesTags: ["Library"],
    }),

    // Jodi shelf type update (e.g., Reading theke Read) korar mutation lage
    updateShelfType: builder.mutation({
      query: ({ bookId, shelfType }) => ({
        url: `/user-library/${bookId}`,
        method: "PATCH",
        body: { shelfType },
      }),
      invalidatesTags: ["Library"],
    }),

    // Library theke book remove korar mutation
    removeFromLibrary: builder.mutation({
      query: (bookId) => ({
        url: `/user-library/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Library"],
    }),
  }),
});

export const {
  useGetUserLibraryQuery,
  useUpdateShelfTypeMutation,
  useRemoveFromLibraryMutation,
} = libraryApi;