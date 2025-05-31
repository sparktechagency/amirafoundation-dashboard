'use client';
import { useCreateCategoryMutation } from '@/redux/api/contentCategoryApi';
import { Button, Form, Input, Modal, Select } from 'antd';
import { toast } from 'sonner';

export default function CreateCategoryModal({ open, setOpen }) {
  const [form] = Form.useForm();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const handleSubmit = async (values) => {
    try {
      const res = await createCategory(values).unwrap();
      if (res.success) {
        toast.success('Category Create Succesfully');
        setOpen(false);
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
      title="Create Category"
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        style={{
          marginTop: '40px',
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please enter  Title',
            },
          ]}
          style={{ width: '100%' }}
        >
          <Input size="large" placeholder="Enter  title"></Input>
        </Form.Item>

        {/*============== caterogry Type============= */}

        <Form.Item
          label="Category Type"
          name="categoryType"
          rules={[
            {
              required: true,
              message: 'Please enter Type',
            },
          ]}
        >
          <Select
            size="large"
            placeholder="Enter Type"
            options={[
              {
                value: 'Article',
                label: 'Article',
              },
              {
                value: 'Podcast',
                label: 'Podcast',
              },
            ]}
          />
        </Form.Item>

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
