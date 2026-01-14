import baseApi from "@/redux/baseApi";

// ===== 🔹 Inject genre-related endpoints into baseApi =====
const genresApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    
    // ===== ✅ Create a new genre =====
    createGenre: build.mutation({
      query: (body) => ({
        url: "/genres",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Genres"],
    }),

    // ===== ✅ Get all genres (with optional search/pagination) =====
    getAllGenres: build.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params?.limit) queryParams.append("limit", params.limit);
        
        return {
          url: `/genres?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Genres"],
    }),

    // ===== ✅ Update a genre =====
    updateGenre: build.mutation({
      query: ({ id, body }) => ({
        url: `/genres/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Genres"],
    }),

    // ===== ✅ Delete a genre =====
    deleteGenre: build.mutation({
      query: (id) => ({
        url: `/genres/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Genres"],
    }),
  }),
});

// ===== Export auto-generated hooks for use in components =====
export const {
  useCreateGenreMutation,
  useGetAllGenresQuery,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
} = genresApi;

export default genresApi;