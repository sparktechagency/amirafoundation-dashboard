'use client';

import { useUpdateSubCriptionMutation } from '@/redux/api/subsCriptionApi';
import { Form, Input, Button, Modal, Space, Select, InputNumber } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const { Option } = Select;
export default function EditSubscriptionPlanModal({ open, setOpen, pakageData }) {
  const [form] = Form.useForm();
  const [descriptions, setDescriptions] = useState([]);

  // create pakage api handaller

  const [updatepakage, { isLoading }] = useUpdateSubCriptionMutation();

  useEffect(() => {
    if (pakageData) {
      form.setFieldsValue({
        title: pakageData?.title,
        price: pakageData?.price,
        billingCycle: pakageData?.billingCycle,
      });
      setDescriptions(pakageData?.description);
    }
  }, [pakageData, form]);

  const onSubmit = async (data) => {
    const value = { ...data, description: descriptions };
    try {
      const res = await updatepakage({ id: pakageData?._id, value }).unwrap();
      if (res.success) {
        toast.success('Update Pakage Successfully');
        setOpen(false);
        form.resetFields();
        setDescriptions([]);
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const addDescription = () => {
    setDescriptions([...descriptions, '']);
  };

  const removeDescription = (index) => {
    setDescriptions(descriptions.filter((_, i) => i !== index));
  };

  const updateDescription = (index, value) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  return (
    <Modal
      centered
      open={open}
      footer={null}
      title="Create Subscription Plan"
      onCancel={() => setOpen(false)}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit} validateTrigger="onSubmit">
        <Form.Item
          name="title"
          label="Name"
          rules={[{ required: true, message: 'Please enter the subscription plan name' }]}
        >
          <Input placeholder="Enter subscription plan name" />
        </Form.Item>

        <Form.Item
          name="billingCycle"
          label="Duration"
          rules={[{ required: true, message: 'Please select a duration' }]}
        >
          <Select placeholder="Select a duration">
            <Option value="monthly">Monthly</Option>
            <Option value="halfYearly">HalfYearly</Option>
            <Option value="yearly">Yearly</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Description">
          {descriptions.map((desc, index) => (
            <Space key={index} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
              <Input
                placeholder="Enter description"
                value={desc}
                onChange={(e) => updateDescription(index, e.target.value)}
                style={{ width: 400 }}
              />
              <Trash2
                onClick={() => removeDescription(index)}
                style={{ color: '#ff4d4f', marginLeft: 8 }}
                className=" cursor-pointer"
              />
            </Space>
          ))}
          <Button
            type="dashed"
            onClick={addDescription}
            block
            icon={<Plus />}
            style={{ marginTop: 8 }}
          >
            Add Description
          </Button>
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter the price' }]}
        >
          <InputNumber type="number" placeholder="Enter price" min={0} />
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
