'use client';

import { useState } from 'react';
import RecentUserTable from './RecentUserTable';
import CustomCountUp from '@/components/CustomCountUp/CustomCountUp';
import EarningSummary from './Earnings';
import ProductCard from './TotalProduct';
import { useGetDashboardDataQuery } from '@/redux/api/dashboardApi';
import { FaUsers, FaChartBar, FaMoneyBill } from 'react-icons/fa';

export default function DashboardContainer() {
  const [currentYear, setCurrentYear] = useState(null);
  const { data } = useGetDashboardDataQuery({ currentYear });

  const userStats = [
    {
      key: 'users',
      title: 'Total Users',
      icon: <FaUsers className="w-12 h-12 text-[#A57EA5]" />,
      count: data?.data?.totalUserCount,
    },
    {
      key: 'activeSession',
      title: 'Active Session',
      icon: <FaChartBar className="w-12 h-12 text-[#A57EA5]" />,
      count: data?.data?.activeSession,
    },
    {
      key: 'deactivateSession',
      title: 'Deactivate Session',
      icon: <FaChartBar className="w-12 h-12 text-[#A57EA5]" />,
      count: data?.data?.deactivateSession,
    },
    {
      key: 'earning',
      title: 'Total Revenue',
      icon: <FaMoneyBill className="w-12 h-12 text-[#A57EA5]" />,
      count: data?.data?.totalRevenue,
    },
  ];

  const handleYearChange = (year) => {
    setCurrentYear(year);
  };

  return (
    <div className="space-y-20">
      <div className="flex gap-10">
        <div className="flex-1">
          <EarningSummary earnigData={data} onYearChange={handleYearChange} />
        </div>

        <div className="flex-1">
          {/* User Stats Section */}
          <section className="grid grid-cols-2 gap-5 md:grid-cols-2 2xl:grid-cols-2 gap-y-[90px]">
            {userStats?.map((stat) => (
              <div
                key={stat.key}
                className="gap-x-4 rounded-2xl bg-[#FFFFFF]  text-black shadow-sm flex justify-between items-center p-10"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-dmSans text-lg font-medium">{stat.title}</p>
                    <h5 className="mt-0.5 text-3xl font-semibold text-black">
                      {stat.key !== 'earning' ? (
                        <CustomCountUp end={stat.count} />
                      ) : (
                        <span>
                          ₦
                          <CustomCountUp end={stat.count} />
                        </span>
                      )}
                    </h5>
                  </div>
                </div>
                <div>{stat.icon}</div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* Charts */}
      <section className="">
        <ProductCard product={data} />
      </section>

      {/* Recent Users Table */}
      <section>
        <RecentUserTable />
      </section>
    </div>
  );
}
