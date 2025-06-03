'use client';

import { useUpdateDeliveryChargeMutation } from '@/redux/api/deliverychargeApi';

import { Form, Input, Button, Modal, Select, InputNumber } from 'antd';
import { useEffect } from 'react';
import { toast } from 'sonner';

const { Option } = Select;

export default function DeliveryPriceEditModal({ open, setOpen, data }) {
  const [form] = Form.useForm();

  // create pakage api handaller

  const [update, { isLoading }] = useUpdateDeliveryChargeMutation();

  const onSubmit = async (value) => {
    try {
      const res = await update({ id: data?._id, value }).unwrap();
      if (res.success) {
        toast.success('Update Delivery Price Successfully');
        setOpen(false);
        form.resetFields();
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        type: data?.type,
        charge: data?.charge,
      });
    }
  }, [data]);

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
          name="type"
          label="Place Name"
          rules={[{ required: true, message: 'Please enter the place name' }]}
        >
          <Input placeholder="Please enter the place name" />
        </Form.Item>

        <Form.Item
          name="charge"
          label="Charge"
          rules={[{ required: true, message: 'Please enter the charge' }]}
        >
          <InputNumber className="!w-full" type="number" placeholder="Enter charge" min={0} />
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
