'use client';

import { ConfigProvider, Table } from 'antd';
import clsx from 'clsx';
import { ArrowRightLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import userImage from '@/assets/images/user-avatar-lg.png';
import { Tooltip } from 'antd';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { Tag } from 'antd';
import EarningModal from './EarningModal';
import { useGetAllEarningsQuery } from '@/redux/api/earningsApi';
import moment from 'moment';

export default function EarningsTable() {
  const [showEarningModal, setShowEarningModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, SetSelecteduser] = useState('');
  const { data, isLoading } = useGetAllEarningsQuery({ currentPage });

  // stats data
  const earningStats = [
    { key: 'today', title: "Today's Earning", amount: data?.data?.todaysEarnings },
    { key: 'monthly', title: 'This Month', amount: data?.data?.thisMonthEarnings },
    { key: 'yearly', title: 'This Year', amount: data?.data?.thisYearEarnings },
    { key: 'total', title: 'Total Earnings', amount: data?.data?.totalEarnings },
  ];

  // Dummy table data
  const tabledata = data?.data?.earnings?.map((item, inx) => ({
    key: inx + 1,
    name: item?.account?.name,
    userImg: userImage,
    status: item?.status,
    contact: item?.account?.contactNumber,
    date: moment(item?.createdAt).format('DD-MM-YYY'),
    amount: item?.amount,
    accNumber: '1234567890',
    subsciptiontype: item?.modelType,
    tId: item?.transactionId,
  }));

  // Page change handler
  const handlePageChange = (page) => {
    // Ensure page stays within valid bounds
    const totalPages = data?.meta?.totalPage || 1;
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  // ================== Table Columns ================
  const columns = [
    { title: 'User', dataIndex: 'name' },
    {
      title: 'Subscription Type',
      dataIndex: 'subsciptiontype',
      render: (value) => (
        <Tag color="#A57EA5" className="!text-base font-semibold">
          {value}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (value) => (
        <Tag color="blue" className="!text-base font-semibold">
          ₦ {value}
        </Tag>
      ),
    },
    // {
    //   title: "ACC Number",
    //   dataIndex: "accNumber",
    // },
    { title: ' Date', dataIndex: 'date' },

    // {
    //   title: "Pricing Plan",
    //   dataIndex: "pricingPlan",

    //   filters: [
    //     {
    //       text: "Monthly",
    //       value: "monthly",
    //     },
    //     {
    //       text: "Quarterly",
    //       value: "quarterly",
    //     },
    //     {
    //       text: "Yearly",
    //       value: "yearly",
    //     },
    //   ],
    //   filterIcon: () => (
    //     <Filter
    //       size={18}
    //       color="#fff"
    //       className="flex justify-start items-start"
    //     />
    //   ),
    //   onFilter: (value, record) => record.pricingPlan.indexOf(value) === 0,
    // },

    {
      title: 'Action',
      render: (_, record) => (
        <Tooltip title="Show Details">
          <button
            onClick={() => {
              SetSelecteduser(record);
              setShowEarningModal(true);
            }}
          >
            <Eye color="#1B70A6" size={22} />
          </button>
        </Tooltip>
      ),
    },
  ];
  // Calculate total pages safely
  const totalPages = data?.meta?.totalPage || 1;
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1B70A6', colorInfo: '#1B70A6' } }}>
      {/* Earning stats */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {earningStats?.map((stat) => (
          <div
            key={stat.key}
            className={clsx(
              'text-white text-lg flex-center-start gap-x-4 rounded-lg py-4 px-5',
              stat.key === 'today' ? 'bg-primary-pink' : 'bg-foundation-accent-800'
            )}
          >
            <ArrowRightLeft size={24} />
            <p>
              {stat.title}
              <span className="font-semibold text-xl pl-3">₦ {stat.amount}</span>
            </p>
          </div>
        ))}
      </section>

      {/* Earning table */}
      <section className="my-10">
        <Table
          style={{ overflowX: 'auto' }}
          columns={columns}
          dataSource={tabledata}
          scroll={{ x: '100%' }}
          pagination={false}
          loading={isLoading}
        ></Table>
      </section>

      <div className="mt-10 flex justify-end gap-5 items-center">
        {/* Pagination Controls */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className={`cursor-pointer text-2xl ${!hasPrevious ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ChevronLeft />
        </button>

        <span className="border px-2 py-1">
          {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNext}
          className={`cursor-pointer text-2xl ${!hasNext ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Show earning modal */}
      <EarningModal open={showEarningModal} setOpen={setShowEarningModal} earning={selectedUser} />
    </ConfigProvider>
  );
}
