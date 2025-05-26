'use client';

import { Button, Pagination } from 'antd';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import CustomConfirm from '@/components/CustomConfirm/CustomConfirm';
import EditCategoryModal from './EditCategoryModal';
import {
  useDeleteProductCategoryMutation,
  useGetAllproductCategoryQuery,
} from '@/redux/api/productCategoryApi';
import CreateProductCaregoryModal from './CreateProductCaregoryModal';
import { toast } from 'sonner';

export default function CategoryContainer() {
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [searchText, setSearchtext] = useState('');
  const [currentpage, SetcurrentPage] = useState(1);
  const [data, setData] = useState('');

  // get all product category
  const { data: category } = useGetAllproductCategoryQuery({
    limit: 10,
    page: currentpage,
    searchText,
  });
  console.log(setSearchtext);
  console.log(SetcurrentPage);

  // delete category api handeller ==

  const [deleteCategory, { isLoading: deleting }] = useDeleteProductCategoryMutation();

  const handleDelete = async (id) => {
    try {
      const res = await deleteCategory(id).unwrap();
      if (res.success) {
        toast.success('Category  Delete Successfully');
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        size="large"
        icon={<PlusCircle size={20} />}
        iconPosition="start"
        className="!w-full !py-6"
        onClick={() => setShowCreateCategoryModal(true)}
      >
        Create Category
      </Button>

      {/* Categories */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-7 my-10">
        {category?.data?.map((category) => (
          <div
            key={category.key}
            className="p-4 rounded-xl flex flex-col items-center shadow border border-primary-blue/25"
          >
            <Image
              src={category.thumbnail}
              alt={`Image of category ${category.name}`}
              className="rounded h-[200px]"
              width={1800}
              height={1800}
            />

            <h4 className="text-lg font-semibold mt-2 mb-5">{category.title}</h4>

            <div className="flex-center gap-x-3 w-full">
              <CustomConfirm
                title="Delete Category"
                description="Are you sure to delete this category?"
                onConfirm={() => handleDelete(category?._id)}
                isLoading={deleting}
              >
                <Button className="w-full !bg-danger !text-white">Delete</Button>
              </CustomConfirm>

              <Button
                type="primary"
                className="w-full"
                onClick={() => {
                  setShowEditCategoryModal(true);
                  setData({
                    id: category?._id,
                    title: category?.title,
                    img: category?.thumbnail,
                  });
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </section>

      <div className="my-10 max-w-max ml-auto">
        <Pagination style={{ fontSize: '1.2rem' }} />
      </div>

      {/* Create Category Modal */}
      <CreateProductCaregoryModal
        open={showCreateCategoryModal}
        setOpen={setShowCreateCategoryModal}
      />

      {/* Edit category modal */}
      <EditCategoryModal
        open={showEditCategoryModal}
        setOpen={setShowEditCategoryModal}
        data={data}
      />
    </div>
  );
}
