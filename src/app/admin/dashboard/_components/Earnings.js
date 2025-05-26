'use client';

import { DatePicker } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import moment from 'moment';

const EarningSummary = ({ earnigData, onYearChange }) => {
  const [selectedYear, setSelectedYear] = useState(null);

  const data = earnigData?.data?.earningOverview?.map((item, inx) => ({
    key: inx + 1,
    month: item?.month,
    user: item?.amount,
  }));

  const handleChange = (date, dateString) => {
    // Date string will contain the selected year
    setSelectedYear(dateString); // DatePicker returns the year in 'YYYY' format
    onYearChange(dateString);
  };

  return (
    <div className="rounded-xl p-6 w-full xl:w-full bg-white shadow-md h-[400px]">
      <div className="flex lg:flex-wrap xl:flex-nowrap justify-between items-center mb-10 gap-2">
        <h1 className="text-xl font-medium">Earning summary</h1>

        <div className="space-x-3">
          <DatePicker
            value={selectedYear ? moment(selectedYear, 'YYYY') : null}
            onChange={handleChange}
            picker="year"
            placeholder="Select Year"
            style={{ width: 120 }}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
          barSize={20}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A57EA51A" stopOpacity={1} />
              <stop offset="100%" stopColor="#A57EA5" stopOpacity={1} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="month"
            scale="point"
            padding={{ left: 10, right: 10 }}
            tickMargin={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis axisLine={false} tickLine={false} tickMargin={20} />

          <Tooltip
            formatter={(value) => [`Monthly Earnings: ${value}`]}
            contentStyle={{
              color: 'var(--primary-green)',
              fontWeight: '500',
              borderRadius: '5px',
              border: '0',
            }}
          />

          <CartesianGrid
            opacity={0.2}
            horizontal={true}
            vertical={false}
            stroke="#080E0E"
            strokeDasharray="3 3"
          />

          <Bar
            barSize={18}
            radius={5}
            background={false}
            dataKey="user"
            fill="url(#colorGradient)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningSummary;
