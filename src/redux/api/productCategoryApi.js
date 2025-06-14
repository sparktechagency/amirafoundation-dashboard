import { baseApi } from './baseApi';

const productsCategoryAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllproductCategory: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/product-categories?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['productsCategory'],
    }),

    // getAllproductCategory: builder.query({
    //     query: ({ searchtext }) => ({
    //         url: `/product-categories?searchTerm=${searchtext}`,
    //         method: "GET"
    //     })
    // }),
    CreateProductCategory: builder.mutation({
      query: (data) => ({ url: '/product-categories', method: 'POST', body: data }),
      invalidatesTags: ['productsCategory'],
    }),
    deleteProductCategory: builder.mutation({
      query: (id) => ({ url: `/product-categories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['productsCategory'],
    }),
    updateProductcategory: builder.mutation({
      query: ({ id, data }) => ({ url: `/product-categories/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['productsCategory'],
    }),
  }),
});

export const {
  useGetAllproductCategoryQuery,
  useCreateProductCategoryMutation,
  useDeleteProductCategoryMutation,
  useUpdateProductcategoryMutation,
} = productsCategoryAPi;
