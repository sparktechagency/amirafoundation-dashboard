import { baseApi } from './baseApi';

const therapistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTherapist: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/users?limit=${limit}&page=${page}&searchTerm=${searchText}&role=therapist`,
        method: 'GET',
      }),
      providesTags: ['therapist', 'user'],
    }),
    addNewTherapist: builder.mutation({
      query: (data) => ({ url: '/therapists', method: 'POST', body: data }),
      invalidatesTags: ['therapist'],
    }),
  }),
});

export const { useGetAllTherapistQuery, useAddNewTherapistMutation } = therapistApi;
