import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, Upload } from 'antd';
import { Plus } from 'lucide-react';
import { useUpdateProductcategoryMutation } from '@/redux/api/productCategoryApi';
import { toast } from 'sonner';

export default function EditCategoryModal({ open, setOpen, data }) {
  const [form] = Form.useForm();
  const [update, { isLoading }] = useUpdateProductcategoryMutation();

  // Update form fields when data changes or modal opens
  useEffect(() => {
    if (data && open) {
      form.setFieldsValue({
        title: data?.title,
        image: data?.img
          ? [
              {
                uid: '-1',
                name: 'thumbnail.jpg',
                status: 'done',
                url: data?.img,
              },
            ]
          : [],
      });
    }
  }, [data, open, form]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(values));

      // Handle single image
      if (values.image && values.image.length > 0 && values.image[0].originFileObj) {
        formData.append('image', values.image[0].originFileObj);
      }

      const res = await update({ id: data.id, data: formData }).unwrap();
      if (res.success) {
        toast.success('Category updated successfully');
        form.resetFields();
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update category');
    }
  };

  // Image upload validation
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) {
      toast.error('You can only upload image files!');
      return false;
    }
    if (!isLt2M) {
      toast.error('Image must be smaller than 2MB!');
      return false;
    }
    return true;
  };

  return (
    <Modal
      centered
      open={open}
      footer={null}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      title="Edit Category"
    >
      <Form
        form={form}
        layout="vertical"
        style={{
          marginTop: '40px',
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Category Title"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please enter category name',
            },
          ]}
          style={{ width: '100%' }}
        >
          <Input size="large" placeholder="Enter category name" />
        </Form.Item>

        <div className="mb-6 flex-center-between">
          <div>
            <h4 className="text-sm font-medium">Media</h4>
            <p className="mt-1 mb-3">Add category banner image</p>
          </div>
          <Form.Item
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: 'Please upload an image' }]}
            style={{
              textAlign: 'center',
              padding: '20px',
              borderRadius: '10px',
            }}
          >
            <Upload
              name="image"
              listType="picture"
              beforeUpload={beforeUpload}
              maxCount={1}
              accept="image/*"
            >
              <Button type="primary" htmlType="button" icon={<Plus size={20} />}>
                Add media
              </Button>
            </Upload>
          </Form.Item>
        </div>

        <Button
          loading={isLoading}
          htmlType="submit"
          type="primary"
          size="large"
          className="w-full"
        >
          Update Category
        </Button>
      </Form>
    </Modal>
  );
}
