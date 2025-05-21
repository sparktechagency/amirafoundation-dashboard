import { baseApi } from './baseApi';

const sessoionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllsession: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/sessions?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['sessions'],
    }),
    addNewSession: builder.mutation({
      query: (data) => ({ url: '/sessions', method: 'POST', body: data }),
      invalidatesTags: ['sessions'],
    }),
    deleteSession: builder.mutation({
      query: (id) => ({ url: `/sessions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['sessions'],
    }),

    // session status change
    updateSessionStatus: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/sessions/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['sessions'],
    }),

    // ============================= Slots Api enpoints =======================

    getSingleSessionSlots: builder.query({
      query: (id) => ({ url: `/session-slots/session/${id}`, method: 'GET' }),
    }),
  }),
});

export const {
  useGetAllsessionQuery,
  useAddNewSessionMutation,
  useGetSingleSessionSlotsQuery,
  useDeleteSessionMutation,
  useUpdateSessionStatusMutation,
} = sessoionApi;
