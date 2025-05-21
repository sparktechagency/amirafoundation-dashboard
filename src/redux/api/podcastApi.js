import { baseApi } from './baseApi';

const podcasteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllpodcast: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/podcasts?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['podcasts'],
    }),
    CreatePodcast: builder.mutation({
      query: (data) => ({ url: '/podcasts', method: 'POST', body: data }),
      invalidatesTags: ['podcasts'],
    }),
    deletePodcast: builder.mutation({
      query: (id) => ({ url: `/podcasts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['podcasts'],
    }),
    updatePodcast: builder.mutation({
      query: ({ formData, id }) => ({ url: `/podcasts/${id}`, method: 'PUT', body: formData }),
      invalidatesTags: ['podcasts'],
    }),
    // change podcast status
    updatePodcastStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/podcasts/change-status/${id}`,
        method: 'PATCH',
        body: { status: status },
      }),
      invalidatesTags: ['podcasts'],
    }),
  }),
});

export const {
  useGetAllpodcastQuery,
  useCreatePodcastMutation,
  useDeletePodcastMutation,
  useUpdatePodcastMutation,
  useUpdatePodcastStatusMutation,
} = podcasteApi;
