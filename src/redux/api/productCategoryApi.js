import { baseApi } from './baseApi';

const productsCategoryAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllproductCategory: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/product-categories?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: 'GET',
      }),
    }),

    // getAllproductCategory: builder.query({
    //     query: ({ searchtext }) => ({
    //         url: `/product-categories?searchTerm=${searchtext}`,
    //         method: "GET"
    //     })
    // }),
    CreateProductCategory: builder.mutation({
      query: (data) => ({ url: '/product-categories', method: 'POST', body: data }),
    }),
    deleteProductCategory: builder.mutation({
      query: (id) => ({ url: `/product-categories/${id}`, method: 'DELETE' }),
    }),
    updateProductcategory: builder.mutation({
      query: ({ id, data }) => ({ url: `/product-categories/${id}`, method: 'PUT', body: data }),
    }),
  }),
});

export const {
  useGetAllproductCategoryQuery,
  useCreateProductCategoryMutation,
  useDeleteProductCategoryMutation,
  useUpdateProductcategoryMutation,
} = productsCategoryAPi;
