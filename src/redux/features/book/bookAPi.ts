import baseApi from "@/redux/baseApi";

// ===== 🔹 Inject book-related endpoints into baseApi =====
const booksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    
    // ===== ✅ Create a new book =====
    createBook: build.mutation({
      query: (body) => ({
        url: "/books",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Books"],
    }),

    // ===== ✅ Get all books (with search, filters, pagination) =====
    getAllBooks: build.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params?.genre) queryParams.append("genre", params.genre);
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        
        return {
          url: `/books?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Books"],
    }),

    // ===== ✅ Get a single book by ID =====
    getBookById: build.query({
      query: (id) => ({
        url: `/books/${id}`,
        method: "GET",
      }),
      providesTags:  ["Books",],
    }),

    // ===== ✅ Update a book =====
    updateBook: build.mutation({
      query: ({ id, body }) => ({
        url: `/books/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Books"],
    }),

    // ===== ✅ Delete a book =====
    deleteBook: build.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Books"],
    }),
  }),
});

// ===== Export auto-generated hooks =====
export const {
  useCreateBookMutation,
  useGetAllBooksQuery,
  useGetBookByIdQuery,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi;

export default booksApi;