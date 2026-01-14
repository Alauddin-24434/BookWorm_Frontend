import baseApi from "@/redux/baseApi";

const tutorialsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all tutorials
    getTutorials: build.query({
      query: () => ({
        url: "/tutorials",
        method: "GET",
      }),
      providesTags: ["Tutorials"],
  
    
    }),

    // Create a tutorial
    createTutorial: build.mutation({
      query: (body) => ({
        url: "/tutorials",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tutorials"],
    }),

    // Update a tutorial
    updateTutorial: build.mutation({
      query: ({ id, body }) => ({
        url: `/tutorials/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tutorials"],
    }),

    // Delete a tutorial
    deleteTutorial: build.mutation({
      query: (id) => ({
        url: `/tutorials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tutorials"],
    }),
  }),
});

export const {
  useGetTutorialsQuery,
  useCreateTutorialMutation,
  useUpdateTutorialMutation,
  useDeleteTutorialMutation,
} = tutorialsApi;

export default tutorialsApi;