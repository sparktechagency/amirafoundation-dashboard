import { baseApi } from './baseApi';
const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllStudentRequest: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/users/students?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['student'],
    }),
    updateStudentStatus: builder.mutation({
      query: (data) => ({
        url: `/users/verify-student`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['student'],
    }),
  }),
});

export const { useGetAllStudentRequestQuery, useUpdateStudentStatusMutation } = studentApi;
