'use client';

import { useCreateSubCriptionMutation } from '@/redux/api/subsCriptionApi';
import { Form, Input, Button, Modal, Space, Select, InputNumber } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const { Option } = Select;

export default function CreateNewPriceModal({ open, setOpen }) {
  const [form] = Form.useForm();
  const [descriptions, setDescriptions] = useState([]);

  // create pakage api handaller

  const [create, { isLoading }] = useCreateSubCriptionMutation();

  const onSubmit = async (data) => {
    const value = { ...data, description: descriptions };
    try {
      const res = await create(value).unwrap();
      if (res.success) {
        toast.success('Create New Pakage Successfully');
        setOpen(false);
        form.resetFields();
        setDescriptions([]);
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <Modal
      centered
      open={open}
      footer={null}
      title="Create New Delivery Price"
      onCancel={() => setOpen(false)}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit} validateTrigger="onSubmit">
        <Form.Item
          name="title"
          label="Name"
          rules={[{ required: true, message: 'Please enter the place name' }]}
        >
          <Input placeholder="Please enter the place name" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter the price' }]}
        >
          <InputNumber className="!w-full" type="number" placeholder="Enter price" min={0} />
        </Form.Item>

        <Form.Item>
          <Button loading={isLoading} type="primary" htmlType="submit" size="large" block>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
