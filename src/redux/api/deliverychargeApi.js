import { baseApi } from './baseApi';

const DeliveryChargeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDeliveryCharge: builder.query({
      query: () => ({
        url: `/delivery-charge`,
        method: 'GET',
      }),
      providesTags: ['delivery-charge'],
    }),
    createDeliveryCharge: builder.mutation({
      query: (data) => ({
        url: `/delivery-charge`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['delivery-charge'],
    }),
    deleteDeliveryCharge: builder.mutation({
      query: (id) => ({
        url: `/delivery-charge/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['delivery-charge'],
    }),
    updateDeliveryCharge: builder.mutation({
      query: ({ id, value }) => ({
        url: `/delivery-charge/${id}`,
        method: 'PUT',
        body: value,
      }),
      invalidatesTags: ['delivery-charge'],
    }),
  }),
});

export const {
  useGetAllDeliveryChargeQuery,
  useCreateDeliveryChargeMutation,
  useDeleteDeliveryChargeMutation,
  useUpdateDeliveryChargeMutation,
} = DeliveryChargeApi;
