import { baseApi } from './baseApi';

const articleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllArticle: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/articles?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['articles'],
    }),
    CreateArticle: builder.mutation({
      query: (data) => ({ url: '/articles', method: 'POST', body: data }),
      invalidatesTags: ['articles'],
    }),
    deleteArticle: builder.mutation({
      query: (id) => ({ url: `/articles/${id}`, method: 'DELETE' }),
      invalidatesTags: ['articles'],
    }),
    updateArticle: builder.mutation({
      query: ({ formData, id }) => ({ url: `/articles/${id}`, method: 'PUT', body: formData }),
      invalidatesTags: ['articles'],
    }),
    // change article status
    updateArticleStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/articles/change-status/${id}`,
        method: 'PATCH',
        body: { status: status },
      }),
      invalidatesTags: ['articles'],
    }),
  }),
});

export const {
  useGetAllArticleQuery,
  useCreateArticleMutation,
  useDeleteArticleMutation,
  useUpdateArticleMutation,
  useUpdateArticleStatusMutation,
} = articleApi;
