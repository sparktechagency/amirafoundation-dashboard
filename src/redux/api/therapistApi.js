import { baseApi } from './baseApi';

const therapistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTherapist: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/therapists?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['therapist', 'user'],
    }),
    addNewTherapist: builder.mutation({
      query: (data) => ({ url: '/therapists', method: 'POST', body: data }),
      invalidatesTags: ['therapist'],
    }),
    // delete therapist
    deleteTherapist: builder.mutation({
      query: (id) => ({ url: `/therapists/${id}`, method: 'DELETE' }),
      invalidatesTags: ['therapist'],
    }),
  }),
});

export const { useGetAllTherapistQuery, useAddNewTherapistMutation, useDeleteTherapistMutation } =
  therapistApi;
