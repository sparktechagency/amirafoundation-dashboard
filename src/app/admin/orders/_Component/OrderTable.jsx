'use client';

import { Input, Table, Tag, Dropdown, Menu } from 'antd';
import { Tooltip } from 'antd';
import { ConfigProvider } from 'antd';
import { EllipsisVertical, Search, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import OrderDetailsModal from '@/components/SharedModals/OrderDetailsModal';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '@/redux/api/orderApi';
import moment from 'moment';
import { toast } from 'sonner';

export default function OrderTable() {
  const [searchText, setSearchText] = useState('');
  const [details, setDetails] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);

  // Order API handlers
  const {
    data: order,
    isLoading,
    isFetching,
    isError,
  } = useGetAllOrdersQuery(
    { limit: 10, page: currentPage, searchText },
    { refetchOnMountOrArgChange: true }
  );

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // Available status options
  const statusOptions = ['pending', 'processing', 'onTheWay', 'delivered', 'cancelled'];

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus} successfully`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  // ============Handle pagination change============
  const handlePageChange = (page) => {
    setPaginationLoading(true);
    setCurrentPage(page);
  };

  //================== Reset pagination loading when data fetch completes=========================
  useEffect(() => {
    if (!isLoading && !isFetching) {
      setPaginationLoading(false);
    }
  }, [isLoading, isFetching]);

  // Table data
  const data =
    order?.data?.map((item, inx) => ({
      key: inx + 1,
      order_id: item?.id,
      order_date: moment(item?.createdAt).format('DD-MM-YYYY'),
      customer_name: item?.user?.name || 'No name',
      customer_email: item?.user?.email || 'No email',
      amount: item?.amount,
      product_name:
        item?.items?.map((productItem) => productItem?.product?.name).join(', ') || 'No products',
      status: item?.status,
      customerImage: item?.user?.photoUrl,
      _id: item?._id,
    })) || [];

  // Status dropdown menu
  const getStatusMenu = (orderId, currentStatus) => (
    <Menu>
      {statusOptions.map((status) => (
        <Menu.Item
          key={status}
          disabled={status === currentStatus}
          onClick={() => handleStatusChange(orderId, status)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Menu.Item>
      ))}
    </Menu>
  );

  // Table columns
  const columns = [
    { title: 'Order Id', dataIndex: 'order_id' },
    { title: 'Order Date', dataIndex: 'order_date' },
    { title: 'Customer Name', dataIndex: 'customer_name' },
    { title: 'Amount', dataIndex: 'amount' },
    { title: 'Product Name', dataIndex: 'product_name' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => (
        <Tag color={value === 'processing' ? 'blue' : value === 'pending' ? 'orange' : 'green'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <div className="flex-center-start gap-x-3">
          <Tooltip title="Show Details">
            <button
              onClick={() => {
                setProfileModalOpen(true);
                setDetails(record);
              }}
            >
              <Eye color="#1B70A6" size={22} />
            </button>
          </Tooltip>

          <Tooltip title="Change status">
            <Dropdown overlay={getStatusMenu(record._id, record.status)} trigger={['click']}>
              <button>
                <EllipsisVertical color="#F16365" size={22} />
              </button>
            </Dropdown>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1B70A6', colorInfo: '#1B70A6' } }}>
      <div className="mb-3 ml-auto w-1/3 gap-x-5">
        <Input
          placeholder="Search "
          prefix={<Search className="mr-2 text-black" size={20} />}
          className="h-11 !rounded-lg !border !text-base"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        style={{ overflowX: 'auto' }}
        columns={columns}
        dataSource={data}
        scroll={{ x: '100%' }}
        loading={isLoading || isFetching || paginationLoading}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: order?.meta?.total || 0,
          onChange: handlePageChange,
        }}
      />

      <OrderDetailsModal open={profileModalOpen} setOpen={setProfileModalOpen} details={details} />
    </ConfigProvider>
  );
}
