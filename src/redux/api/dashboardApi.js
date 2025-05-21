import { baseApi } from './baseApi';

const dashBoardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: ({ currentYear }) => ({ url: `/meta?earning_year=${currentYear}`, method: 'GET' }),
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashBoardApi;
