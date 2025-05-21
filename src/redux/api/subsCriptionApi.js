import { baseApi } from './baseApi';

const SubCriptionAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubCription: builder.query({ query: () => ({ url: `/packages`, method: 'GET' }) }),
    CreateSubCription: builder.mutation({
      query: (data) => ({ url: '/packages', method: 'POST', body: data }),
    }),
    deleteSubCription: builder.mutation({
      query: (id) => ({ url: `/packages/${id}`, method: 'DELETE' }),
    }),
    updateSubCription: builder.mutation({
      query: ({ id, value }) => ({ url: `/packages/${id}`, method: 'PUT', body: value }),
    }),
  }),
});

export const {
  useGetAllSubCriptionQuery,
  useCreateSubCriptionMutation,
  useDeleteSubCriptionMutation,
  useUpdateSubCriptionMutation,
} = SubCriptionAPi;
