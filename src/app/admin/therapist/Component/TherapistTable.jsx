'use client';

import { Button, Input, Table, Tag } from 'antd';
import { Tooltip } from 'antd';
import { ConfigProvider } from 'antd';
import { ChevronLeft, ChevronRight, PlusCircle, Search, Trash } from 'lucide-react';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import CustomConfirm from '@/components/CustomConfirm/CustomConfirm';
import Image from 'next/image';
import AddTherapistModal from '@/components/SharedModals/AddTherapistModal';
import { useDeleteTherapistMutation, useGetAllTherapistQuery } from '@/redux/api/therapistApi';
import TherapistProfileModal from '@/components/SharedModals/TherapistProfile';

import { toast } from 'sonner';

export default function TherapistTable() {
  const [searchText, setSearchText] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [addtherapistModal, setAddTherapistModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, SetSelecteduser] = useState('');

  // User data with query parameterss
  const { data, isLoading } = useGetAllTherapistQuery({
    limit: 10,
    page: currentPage,
    searchText,
  });

  // status change api handaler----------------

  const [updateStatus, { isLoading: updating }] = useDeleteTherapistMutation();

  // Dummy table Data
  const tabledata = data?.data?.map((item, inx) => ({
    key: inx + 1,
    name: item?.user?.name,
    userImg: item?.user?.photoUrl,
    email: item?.user?.email,
    contact: item?.user?.contactNumber,
    bio: item?.bio,
    status: item?.isDeleted === true ? 'blocked' : 'active',
    id: item?._id,
  }));

  // delete user handler

  const handleBlockUser = async (values) => {
    const payload = values?.id;
    try {
      const res = await updateStatus(payload).unwrap();
      if (res.success) {
        toast.success('Therapist deleted successfully!');
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
  const isValidUrl = (url) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
  };

  // ================== Table Columns ================
  const columns = [
    { title: 'Therapist Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Profile',
      dataIndex: 'profile',
      render: (_, record) => {
        // Get the first letter of the name (uppercase)
        const firstLetter = record?.name ? record?.name.charAt(0).toUpperCase() : '';
        // Determine the image source
        const imageSrc = isValidUrl(record?.userImg);
        return (
          <div className="flex items-center gap-x-3">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt="user image"
                height={2400}
                width={2400}
                className="w-10  border h-10 rounded-full aspect-square"
              />
            ) : (
              <div className="flex items-center justify-center rounded-full w-10 h-10 bg-[#A57EA5] text-white text-lg font-medium">
                {firstLetter}
              </div>
            )}
          </div>
        );
      },
    },
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
        <div className="flex justify-center gap-x-3">
          <Tooltip title="Show Details">
            <button
              onClick={() => {
                SetSelecteduser(record);
                setProfileModalOpen(true);
              }}
            >
              <Eye color="#A57EA5" size={22} />
            </button>
          </Tooltip>

          <Tooltip title="Block User">
            <CustomConfirm
              title={'Delete Therapist '}
              description={`Are you sure to delete ${record?.name}?`}
              loading={updating}
              onConfirm={() => handleBlockUser(record)}
            >
              <button>
                <Trash color="#F16365" size={22} />
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
      <div className="mb-3 ml-auto flex w-1/2 gap-x-5">
        <Input
          placeholder="Search by name or email"
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          style={{ backgroundColor: '#A57EA5', color: '#fff' }}
          size="large"
          icon={<PlusCircle size={20} />}
          iconPosition="start"
          className="!py-4"
          onClick={() => setAddTherapistModal(true)}
        >
          Add Therapist
        </Button>
      </div>

      <Table
        style={{ overflowX: 'auto' }}
        columns={columns}
        dataSource={tabledata}
        scroll={{ x: '100%' }}
        pagination={false}
        loading={isLoading}
      ></Table>
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
      <TherapistProfileModal
        user={selectedUser}
        open={profileModalOpen}
        setOpen={setProfileModalOpen}
      />
      <AddTherapistModal open={addtherapistModal} setOpen={setAddTherapistModal} />
    </ConfigProvider>
  );
}
