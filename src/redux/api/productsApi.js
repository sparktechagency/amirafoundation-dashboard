import { baseApi } from './baseApi';

const productsAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllproduct: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/products?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['products'],
    }),
    getAllproductCategory: builder.query({
      query: ({ searchtext }) => ({
        url: `/product-categories?searchTerm=${searchtext}`,
        method: 'GET',
      }),
      providesTags: ['products'],
    }),
    CreateProduct: builder.mutation({
      query: (data) => ({ url: '/products', method: 'POST', body: data }),
      invalidatesTags: ['products'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['products'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({ url: `/products/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['products'],
    }),
  }),
});

export const {
  useGetAllproductQuery,
  useCreateProductMutation,
  useGetAllproductCategoryQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsAPi;
