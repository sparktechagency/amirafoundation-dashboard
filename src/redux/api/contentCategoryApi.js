import { baseApi } from './baseApi';

const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticleCategory: builder.query({
      query: ({ searchText }) => ({
        url: `/content-categories/Article?searchTerm=${searchText}`,
        method: 'GET',
      }),
    }),
    getPodcastCategory: builder.query({
      query: ({ searchText }) => ({
        url: `/content-categories/Podcast?searchTerm=${searchText}`,
        method: 'GET',
      }),
    }),

    createCategory: builder.mutation({
      query: (data) => ({ url: '/content-categories', method: 'POST', body: data }),
    }),
  }),
});

export const { useGetArticleCategoryQuery, useCreateCategoryMutation, useGetPodcastCategoryQuery } =
  contentApi;
