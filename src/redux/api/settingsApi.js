import { baseApi } from './baseApi';

const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTerms: build.query({
      query: () => ({ url: '/terms', method: 'GET' }),
      providesTags: ['settings'],
    }),
    updateTerms: build.mutation({
      query: (data) => ({ url: '/terms/update', method: 'PATCH', body: data }),
      invalidatesTags: ['settings'],
    }),
    getPrivecy: build.query({
      query: () => ({ url: '/privacy', method: 'GET' }),
      providesTags: ['settings'],
    }),
    updatePrivecy: build.mutation({
      query: (data) => ({ url: '/privacy/update', method: 'PATCH', body: data }),
      invalidatesTags: ['settings'],
    }),
  }),
});

export const {
  useGetTermsQuery,
  useUpdateTermsMutation,
  useGetPrivecyQuery,
  useUpdatePrivecyMutation,
} = settingsApi;
