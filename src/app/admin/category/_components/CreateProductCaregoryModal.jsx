import { useCreateProductCategoryMutation } from '@/redux/api/productCategoryApi';
import { Button, Form, Input, Modal, Upload } from 'antd';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateProductCaregoryModal({ open, setOpen }) {
  const [create, { isLoading }] = useCreateProductCategoryMutation();

  // edit

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(values));
      if (values.image && values.image.length > 0) {
        const file = values.image[0].originFileObj;
        formData.append('image', file);
      }
      const res = await create(formData).unwrap();
      if (res.success) {
        toast.success(' Category Create succesfully');
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <Modal
      centered
      open={open}
      setOpen={setOpen}
      footer={null}
      onCancel={() => {
        setOpen(false);
      }}
      title="Edit Category"
    >
      <Form
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
          <Input size="large" placeholder=" Enter category name"></Input>
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
            rules={[{ required: true }]}
            style={{
              textAlign: 'center',
              padding: '20px',
              borderRadius: '10px',
            }}
          >
            <Upload name="image" listType="picture" beforeUpload={() => false}>
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
          Submit
        </Button>
      </Form>
    </Modal>
  );
}
