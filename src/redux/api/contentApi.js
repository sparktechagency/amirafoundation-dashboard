import { baseApi } from './baseApi';

const ContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContents: builder.query({
      query: () => ({ url: `/contents`, method: 'GET' }),
      providesTags: ['content'],
    }),
    updateContent: builder.mutation({
      query: (data) => ({ url: `/contents`, method: 'PUT', body: data }),
      invalidatesTags: ['content'],
    }),
  }),
});

export const { useGetContentsQuery, useUpdateContentMutation } = ContentApi;
