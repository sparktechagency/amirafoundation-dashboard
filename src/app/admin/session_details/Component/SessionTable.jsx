'use client';

import { Button, Input, Table } from 'antd';
import { Tooltip } from 'antd';
import { ConfigProvider } from 'antd';
import { Edit, PlusCircle, Search, Trash2, UserX } from 'lucide-react';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import CustomConfirm from '@/components/CustomConfirm/CustomConfirm';
import { Tag } from 'antd';
import AddSessionModal from '@/components/SharedModals/AddSessionModal';
import EditSessionModal from '@/components/SharedModals/EditSessionModal';
import SessionDetailsModal from '@/components/SharedModals/SessionDetailsModal';
import {
  useDeleteSessionMutation,
  useGetAllsessionQuery,
  useUpdateSessionStatusMutation,
} from '@/redux/api/sessionApi';
import Image from 'next/image';
import { toast } from 'sonner';
import { MdOutlinePublishedWithChanges } from 'react-icons/md';

export default function SessionTable() {
  const [searchText, setSearchText] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [addProductModalOpen, setShowCreateCategoryModal] = useState(false);
  const [editProductModalOpen, setEditProductModalModal] = useState(false);
  const [editdetails, setSessioneditDetails] = useState('');
  const [selectedSession, SetselectedSession] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // User data with query parameterss
  const { data, isLoading } = useGetAllsessionQuery({
    limit: 10,
    page: currentPage,
    searchText,
  });

  // change session status api handaler
  const [updateStatus, { isLoading: updating }] = useUpdateSessionStatusMutation();

  //

  // delete session api handaler
  const [deleteSession, { isLoading: deleting }] = useDeleteSessionMutation();

  // Dummy table Data
  const tabledata = data?.data?.map((item, inx) => ({
    key: inx + 1,
    name: item?.title,
    therapist: item?.therapist?.user?.name,
    fee: item?.fee,
    thumbnail: item?.thumbnail,
    des: item?.description,
    location: item?.location,
    locationLink: item?.locationLink,
    bio: item?.therapist?.user?.bio,
    achievement: item?.therapist?.user?.achievement,
    therapyType: item?.therapyType,
    id: item?._id,
    status: item?.status,
  }));

  // Block user handler
  const handleBlockUser = async (id) => {
    try {
      const res = await deleteSession(id).unwrap();
      if (res.success) {
        toast.success('Session Delete successfully ');
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  // change session status
  // Block user handler
  const handlechangeStatus = async (values) => {
    const payload = {
      status: values?.status == 'active' ? 'deactive' : 'active',
    };
    const id = values?.id;
    try {
      const res = await updateStatus({ id, payload }).unwrap();
      if (res.success) {
        toast.success(
          `${values?.name} ${values?.status == 'active' ? 'deactive' : 'active'} successfully!`
        );
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  // ================== Table Columns ================
  const columns = [
    {
      title: 'Session Id',
      dataIndex: 'key',
      render: (value) => `#${value}`,
    },
    {
      title: 'Session Name',
      dataIndex: 'name',
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thunail',

      render: (_, record) => (
        <div className="flex items-center gap-x-3">
          <Image
            src={record.thumbnail}
            alt="user"
            width={1200}
            height={1200}
            className="rounded-full w-10 h-auto aspect-square"
          />
        </div>
      ),
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
    },
    {
      title: 'Therapist',
      dataIndex: 'therapist',
    },
    {
      title: 'Sessions',
      dataIndex: 'status',
      render: (value, record) => (
        <div className="flex-center-start gap-x-2">
          <Tag className="text-base" color={value === 'active' ? '#32CD32' : '#F16365'}>
            {value}
          </Tag>
          <Tooltip title="change status">
            <CustomConfirm
              title={`${record?.status == 'active' ? 'Deactive this Session' : 'Active this Session'}`}
              description={`Are you sure to ${record?.status == 'active' ? 'Deactive' : 'Active'} this Session?`}
              onConfirm={() => handlechangeStatus(record)}
              loading={updating}
            >
              <button>
                <MdOutlinePublishedWithChanges size={24} />
              </button>
            </CustomConfirm>
          </Tooltip>
        </div>
      ),
    },

    {
      title: 'Action',
      render: (_, record) => (
        <div className="flex-center-start gap-x-3">
          {/* <Tooltip title="Edit Details">
            <button
              onClick={() => {
                setEditProductModalModal(true);
                setSessioneditDetails(record);
              }}
            >
              <Edit color="#A57EA5" size={22} />
            </button>
          </Tooltip> */}
          <Tooltip title="Show Details">
            <button
              onClick={() => {
                setProfileModalOpen(true);
                SetselectedSession(record);
              }}
            >
              <Eye color="#A57EA5" size={22} />
            </button>
          </Tooltip>

          <Tooltip title="Block User">
            <CustomConfirm
              title="Delete Session"
              description="Are you sure to delete this session ?"
              onConfirm={() => handleBlockUser(record.id)}
              loading={deleting}
            >
              <button>
                <Trash2 color="#F16365" size={22} />
              </button>
            </CustomConfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1B70A6',
          colorInfo: '#1B70A6',
        },
      }}
    >
      <div className="mb-3 ml-auto flex w-1/2 gap-x-5">
        <Input
          placeholder="Search by name or email"
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          style={{
            backgroundColor: '#A57EA5',
            color: '#fff',
          }}
          size="large"
          icon={<PlusCircle size={20} />}
          iconPosition="start"
          className="!py-4"
          onClick={() => setShowCreateCategoryModal(true)}
        >
          Add Session
        </Button>
      </div>

      <Table
        style={{ overflowX: 'auto' }}
        columns={columns}
        dataSource={tabledata}
        scroll={{ x: '100%' }}
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: data?.meta?.total,
          onChange: (page) => setCurrentPage(page),
        }}
      ></Table>

      <SessionDetailsModal
        open={profileModalOpen}
        setOpen={setProfileModalOpen}
        session={selectedSession}
      />
      <AddSessionModal open={addProductModalOpen} setOpen={setShowCreateCategoryModal} />
      <EditSessionModal
        open={editProductModalOpen}
        setOpen={setEditProductModalModal}
        session={editdetails}
      />
    </ConfigProvider>
  );
}
