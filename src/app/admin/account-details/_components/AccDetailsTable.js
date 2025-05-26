'use client';

import { Input, Table } from 'antd';
import { Tooltip } from 'antd';
import { ConfigProvider } from 'antd';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Eye } from 'lucide-react';
import { UserX } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import CustomConfirm from '@/components/CustomConfirm/CustomConfirm';
import ProfileModal from '@/components/SharedModals/ProfileModal';
import { Tag } from 'antd';
import { useBlockUnblockUserMutation, useGetAllusersQuery } from '@/redux/api/userApi';
import moment from 'moment';
import { toast } from 'sonner';

export default function AccDetailsTable() {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedUser, SetSelecteduser] = useState('');

  // User data with query parameterss
  const { data, isLoading } = useGetAllusersQuery({
    limit: 10,
    page: currentPage,
    searchText,
  });

  // status change api handaler----------------

  const [updateStatus, { isLoading: updating }] = useBlockUnblockUserMutation();

  // Table Data transformation
  const tabledata =
    data?.data?.map((item, inx) => ({
      key: inx + 1 + (currentPage - 1) * 10,
      name: item?.name,
      userImg: item?.photoUrl,
      email: item?.email,
      contact: item?.contactNumber,
      date: moment(item?.createdAt).format('DD-MM-YYYY'),
      status: item?.status,
      _id: item?._id,
    })) || [];

  // Block user handler
  const handleBlockUser = async (values) => {
    const payload = {
      userId: values._id,
      status: values?.status == 'active' ? 'blocked' : 'active',
    };
    try {
      const res = await updateStatus(payload).unwrap();
      if (res.success) {
        toast.success(
          `${values.name} ${values?.status == 'blocked' ? 'unblocked' : 'Blcoked'} successfully!`
        );
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  // Page change handler
  const handlePageChange = (page) => {
    // Ensure page stays within valid bounds
    const totalPages = data?.meta?.totalPage || 1;
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  // Table Columns (unchanged)
  const columns = [
    { title: 'Serial', dataIndex: 'key', render: (value) => `#${value}` },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (value, record) => {
        // Helper function to validate URL
        const isValidUrl = (url) => {
          if (!url) return false;
          return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
        };

        // Get the first letter of the name (uppercase)
        const firstLetter = value ? value.charAt(0).toUpperCase() : '';

        // Determine if the image is valid
        const hasValidImage = isValidUrl(record?.userImg);

        return (
          <div className="flex-center-start gap-x-2">
            {hasValidImage ? (
              <Image
                src={record?.userImg}
                alt="User avatar"
                width={40}
                height={40}
                className="rounded-full w-10 h-auto aspect-square"
              />
            ) : (
              <div className="flex items-center justify-center rounded-full w-10 h-10 bg-[#A57EA5] text-white text-lg font-medium">
                {firstLetter}
              </div>
            )}
            <p className="font-medium">{value}</p>
          </div>
        );
      },
    },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Contact', dataIndex: 'contact' },
    { title: 'Date', dataIndex: 'date' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => (
        <div>
          <Tag color={value === 'active' ? '#32CD32' : '#F16365'}>{value}</Tag>
        </div>
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <div className="flex-center-start gap-x-3">
          <Tooltip title="Show Details">
            <button
              onClick={() => {
                SetSelecteduser(record);
                setProfileModalOpen(true);
              }}
            >
              <Eye color="#1B70A6" size={22} />
            </button>
          </Tooltip>
          <Tooltip title="Block User">
            <CustomConfirm
              title={`${record?.status == 'blocked' ? 'Unblock User' : 'Blocked User'}`}
              description={`Are you sure to ${record?.status == 'blocked' ? 'Unblock' : 'Blocked'} this user?`}
              loading={updating}
              onConfirm={() => handleBlockUser(record)}
            >
              <button>
                <UserX color="#F16365" size={22} />
              </button>
            </CustomConfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Calculate total pages safely
  const totalPages = data?.meta?.totalPage || 1;
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1B70A6', colorInfo: '#1B70A6' } }}>
      <div className="w-1/3 ml-auto gap-x-5 mb-3">
        <Input
          placeholder="Search by name or email"
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !border !rounded-lg !text-base"
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <Table
        style={{ overflowX: 'auto' }}
        columns={columns}
        dataSource={tabledata}
        scroll={{ x: '100%' }}
        pagination={false}
        loading={isLoading}
      />

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

      <ProfileModal open={profileModalOpen} setOpen={setProfileModalOpen} user={selectedUser} />
    </ConfigProvider>
  );
}
