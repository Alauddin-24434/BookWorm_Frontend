import baseApi from "@/redux/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Reviews"],
    }),
    getPendingReviews: builder.query({
      query: () => "/reviews/pending",
      providesTags: ["Reviews"],
      transformResponse: (response: any) => response.data,
    }),
    approveReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
    getApprovedReviews: builder.query({
      query: (bookId) => `/reviews/approved/${bookId}`,
      providesTags: ["Reviews"],
 
    }),
  }),
});

export const {
  useGetPendingReviewsQuery,
  useAddReviewMutation,
  useApproveReviewMutation,
  useDeleteReviewMutation,
  useGetApprovedReviewsQuery
} = reviewApi;
