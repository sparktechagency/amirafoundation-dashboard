'use client';

import { Button, Input, Table } from 'antd';
import { Tooltip } from 'antd';
import { ConfigProvider } from 'antd';
import { ChevronLeft, ChevronRight, Edit, PlusCircle, Search } from 'lucide-react';
import { useState } from 'react';
import CustomConfirm from '@/components/CustomConfirm/CustomConfirm';
import { Tag } from 'antd';
import { Delete } from 'lucide-react';
import AddArticleModal from '@/components/SharedModals/AddArticleModal';
import EditArticleModal from '@/components/SharedModals/EditArticleModal';
import {
  useDeleteArticleMutation,
  useGetAllArticleQuery,
  useUpdateArticleStatusMutation,
} from '@/redux/api/articleApi';
import moment from 'moment';
import { toast } from 'sonner';
import CustomLoader from '@/component/Shared/CustomLoader';

export default function ArticlesTable() {
  const [searchText, setSearchText] = useState('');
  const [addProductModalOpen, setShowCreateCategoryModal] = useState(false);
  const [editProductModalOpen, setEditProductModalModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [details, setDetails] = useState('');

  // get article api handaler
  const { data, isLoading, isError } = useGetAllArticleQuery({
    limit: 10,
    page: currentPage,
    searchText,
  });

  // change article status api handaler
  const [updateStatus, { isLoading: updating }] = useUpdateArticleStatusMutation();

  // delte api handaler ===================

  const [deleteArticle, { isLoading: Deleteting }] = useDeleteArticleMutation();

  //  table Data
  const tabledata = data?.data?.map((item, inx) => ({
    title: item?.title,
    author: item?.author,
    status: item?.status,
    category: item?.category?.title,
    categoryId: item?.category?._id,
    time: moment(item?.createdAt).format('DD-MM-YYYY'),
    id: item?._id,
    description: item?.description,
    thumbnail: item?.thumbnail,
  }));

  // Block user handler
  const handleBlockUser = async (id) => {
    try {
      const res = await deleteArticle(id).unwrap();

      if (res.success) {
        toast.success('Article Delete Successfully');
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  // change article status  handaler
  const handlechangeStatus = async (values) => {
    const { id } = values;
    try {
      const res = await updateStatus({ id, status: 'published' }).unwrap();
      if (res.success) {
        toast.success('Article Published successfully');
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

  // ================== Table Columns ================
  const columns = [
    { title: 'Article Title', dataIndex: 'title' },
    { title: 'Author', dataIndex: 'author' },
    { title: 'Date Published', dataIndex: 'time' },
    { title: 'Category', dataIndex: 'category' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value, record) => (
        <div className="flex items-center gap-x-2">
          <Tag
            color={value === 'published' ? '#32CD32' : '#F16365'}
            className="!text-base font-semibold"
          >
            {value}
          </Tag>
          {value === 'draft' && (
            <Tooltip title="Publish Article">
              <button onClick={() => handlechangeStatus(record)}>
                {updating ? <CustomLoader /> : <PlusCircle color="#A57EA5" size={22} />}
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },

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
          <Tooltip title="Block User">
            <CustomConfirm
              title="Delete Article "
              description="Are you sure to delete this article?"
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
          placeholder="Search by title"
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
          onClick={() => setShowCreateCategoryModal(true)}
        >
          Add Article
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

      <AddArticleModal open={addProductModalOpen} setOpen={setShowCreateCategoryModal} />
      <EditArticleModal
        open={editProductModalOpen}
        setOpen={setEditProductModalModal}
        details={details}
      />
    </ConfigProvider>
  );
}
