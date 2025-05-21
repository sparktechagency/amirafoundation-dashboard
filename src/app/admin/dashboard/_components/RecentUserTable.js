'use client';

import { Input, Table } from 'antd';
import { Tooltip } from 'antd';
import { ConfigProvider } from 'antd';
import { ChevronLeft, ChevronRight, Search, User } from 'lucide-react';
import { Eye } from 'lucide-react';
import { UserX } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import CustomConfirm from '@/components/CustomConfirm/CustomConfirm';
import { message } from 'antd';
import ProfileModal from '@/components/SharedModals/ProfileModal';
import { Tag } from 'antd';
import { useGetAllusersQuery } from '@/redux/api/userApi';
import moment from 'moment';

export default function AccDetailsTable() {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedUser, SetSelecteduser] = useState('');

  // User data with query parameterss
  const { data, isError, isLoading } = useGetAllusersQuery({
    limit: 5,
    page: currentPage,
    searchText,
  });

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
    })) || [];

  // Block user handler
  const handleBlockUser = () => {
    message.success('User blocked successfully');
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
              title="Block User"
              description="Are you sure to block this user?"
              onConfirm={handleBlockUser}
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

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1B70A6', colorInfo: '#1B70A6' } }}>
      <h1 className="text-2xl font-medium my-3">Recent Joined user</h1>
      <Table
        style={{ overflowX: 'auto' }}
        columns={columns}
        dataSource={tabledata}
        scroll={{ x: '100%' }}
        pagination={false}
        loading={isLoading}
      />
      <ProfileModal open={profileModalOpen} setOpen={setProfileModalOpen} user={selectedUser} />
    </ConfigProvider>
  );
}
