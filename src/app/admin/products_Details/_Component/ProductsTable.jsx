'use client';

import { Button, Input, Table } from 'antd';
import { Tooltip } from 'antd';
import { ConfigProvider } from 'antd';
import { ChevronLeft, ChevronRight, Delete, Edit, PlusCircle, Search } from 'lucide-react';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import CustomConfirm from '@/components/CustomConfirm/CustomConfirm';
import { Tag } from 'antd';
import AddproductModal from '@/components/SharedModals/AddproductModal';
import EditProductModal from '@/components/SharedModals/EditProductModal';
import { useDeleteProductMutation, useGetAllproductQuery } from '@/redux/api/productsApi';
import ProductDeatislModal from '@/components/SharedModals/ProductDetailsModal';
import { toast } from 'sonner';

export default function ProductsTable() {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [addProductModalOpen, setShowCreateCategoryModal] = useState(false);
  const [editProductModalOpen, setEditProductModalModal] = useState(false);
  const [selectedproduct, SetSelectedProduct] = useState('');
  const [details, setDetails] = useState('');

  const [deleteProduct] = useDeleteProductMutation();

  // User data with query parameterss
  const { data, isLoading } = useGetAllproductQuery({
    limit: 10,
    page: currentPage,
    searchText,
  });

  //  table Data
  const tabledata = data?.data?.map((item, inx) => ({
    key: inx + 1,
    product: item?.name,
    userImg: item?.images?.[0]?.url,
    quantity: item?.quantity,
    price: item?.amount,
    category: item?.category?.title,
    des: item?.description,
    sold: item?.sold,
    discount: item?.discount,
    categoryId: item?.category?._id,
    Img: item?.images,
    id: item?._id,
  }));

  // Page change handler
  const handlePageChange = (page) => {
    // Ensure page stays within valid bounds
    const totalPages = data?.meta?.totalPage || 1;
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };
  // Block user handler
  const handleBlockUser = async (id) => {
    try {
      const res = await deleteProduct(id).unwrap();

      if (res.success) {
        toast.success('Product Delete Successfully');
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  // ================== Table Columns ================
  const columns = [
    { title: 'Serial', dataIndex: 'key', render: (value) => `#${value}` },
    {
      title: 'Product',
      dataIndex: 'product',
      render: (value, record) => {
        const firstLetter = value ? value.charAt(0).toUpperCase() : '';

        return (
          <div className="flex-center-start gap-x-2">
            {record?.userImg ? (
              <Image
                src={record.userImg}
                alt="User avatar"
                width={1200}
                height={1200}
                className="aspect-square h-auto w-10 rounded-full"
              />
            ) : (
              <div className="flex-center items-center h-10 w-10 rounded-full bg-[#A57EA5] text-white">
                {firstLetter}
              </div>
            )}

            <p className="font-medium">{value}</p>
          </div>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      //  filters: [
      //    {
      //      text: "In Stock",
      //      value: "inStock",
      //    },
      //    {
      //      text: "Out of Stock",
      //      value: "outOfStock",
      //    },
      //    {
      //      text: "Low Stock",
      //      value: "lowStock",
      //    },
      //  ],
      //  filterIcon: () => (
      //    <Filter
      //      size={18}
      //      color="#fff"
      //      className="flex items-start justify-start"
      //    />
      //  ),
      onFilter: (value, record) => record.accountType.indexOf(value) === 0,
      render: (value) => (
        <Tag color="cyan" className="!text-sm">
          {value}
        </Tag>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (value) => (
        <Tag color="blue" className="!text-base font-semibold">
          ₦ {value}
        </Tag>
      ),
    },
    { title: 'Category', dataIndex: 'category' },

    {
      title: 'Action',
      render: (_, record) => (
        <div className="flex-center-start gap-x-3">
          <Tooltip title="Edit Details">
            <button
              onClick={() => {
                setEditProductModalModal(true);
                setDetails(record);
              }}
            >
              <Edit color="#A57EA5" size={22} />
            </button>
          </Tooltip>
          <Tooltip title="Show Details">
            <button
              onClick={() => {
                SetSelectedProduct(record);
                setProfileModalOpen(true);
              }}
            >
              <Eye color="#A57EA5" size={22} />
            </button>
          </Tooltip>

          <Tooltip title="Block User">
            <CustomConfirm
              title="Delete Product"
              description="Are you sure to delete this product ?"
              onConfirm={() => handleBlockUser(record.id)}
            >
              <button>
                <Delete color="#F16365" size={22} />
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
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Button
          style={{ backgroundColor: '#A57EA5', color: '#fff' }}
          size="large"
          icon={<PlusCircle size={20} />}
          iconPosition="start"
          className="!py-4"
          onClick={() => setShowCreateCategoryModal(true)}
        >
          Add Product
        </Button>
      </div>

      <Table
        style={{ overflowX: 'auto' }}
        columns={columns}
        dataSource={tabledata}
        scroll={{ x: '100%' }}
        loading={isLoading}
        pagination={false}
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

      <ProductDeatislModal
        open={profileModalOpen}
        setOpen={setProfileModalOpen}
        product={selectedproduct}
      />
      <AddproductModal open={addProductModalOpen} setOpen={setShowCreateCategoryModal} />
      <EditProductModal
        open={editProductModalOpen}
        setOpen={setEditProductModalModal}
        details={details}
      />
    </ConfigProvider>
  );
}
