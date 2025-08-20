'use client';
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  DatePicker,
  TimePicker,
  Button as AntButton,
  message,
} from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { RiCloseLargeLine } from 'react-icons/ri';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import moment from 'moment';
import { useGetAllTherapistQuery } from '@/redux/api/therapistApi';
import { debounce } from 'lodash';
import { useAddNewSessionMutation } from '@/redux/api/sessionApi';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

const AddSessionModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [slots, setSlots] = useState([]);
  const [searchText, setSearchText] = useState('');

  // get therapist name from api
  const { data } = useGetAllTherapistQuery({ limit: 10, page: 1, searchText });

  // add new session api handaler
  const [addSession, { isLoading }] = useAddNewSessionMutation();

  const handleSubmit = async (values) => {
    const formValues = { ...values, slots: slots };
    const formData = new FormData();
    formData.append('data', JSON.stringify(formValues));

    const fileList = form.getFieldValue('image');

    if (fileList && fileList.length > 0) {
      for (const file of fileList) {
        const originalFile = file.originFileObj;

        // ✅ compress before append
        const options = {
          maxSizeMB: 1, // 1MB max
          maxWidthOrHeight: 1024, // resize if too large
          useWebWorker: true,
        };

        try {
          const compressedFile = await imageCompression(originalFile, options);
          console.log(
            `Compressed from ${(originalFile.size / 1024 / 1024).toFixed(2)} MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
          );
          formData.append('image', compressedFile, compressedFile.name);
        } catch (err) {
          console.error('Image compression failed:', err);
          formData.append('image', originalFile); // fallback
        }
      }
    }

    try {
      const res = await addSession(formData).unwrap();
      if (res.success) {
        toast.success('Session added successfully');
        form.resetFields();
        setSlots([]);
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Something went wrong');
    }
  };

  // Add a time slot for a selected date
  const addTimeSlot = () => {
    const selectedDate = form.getFieldValue('selectedDate');
    const startTime = form.getFieldValue('startTime');
    const endTime = form.getFieldValue('endTime');

    if (!selectedDate || !startTime || !endTime) {
      return message.error('Please select a date and time range');
    }

    const newSlot = {
      date: selectedDate.format('YYYY-MM-DD'),
      startTime: startTime.format('h:mm A'),
      endTime: endTime.format('h:mm A'),
    };

    setSlots([...slots, newSlot]);
    form.setFieldsValue({ startTime: null, endTime: null });
  };

  // Remove a time slot
  const removeSlot = (index) => {
    const updatedSlots = slots.filter((_, i) => i !== index);
    setSlots(updatedSlots);
  };

  // Debounced search handler to reduce API calls
  const handleSearch = debounce((value) => {
    setSearchText(value);
  }, 500);

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      closeIcon={false}
      style={{ minWidth: '80%', position: 'relative' }}
    >
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl"
        onClick={() => setOpen(false)}
      >
        <RiCloseLargeLine size={18} color="black" className="absolute left-1/3 top-1/3" />
      </div>
      <h1 className="text-center text-2xl font-semibold">Add New Session</h1>
      <Divider />
      <div>
        <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: '40px' }}>
          <div className="flex gap-12">
            {/* Left side */}
            <div className="flex-1">
              <Form.Item
                label="Session Title"
                name="title"
                rules={[{ required: true, message: 'Please enter Session Title' }]}
              >
                <Input size="large" placeholder="Enter Session Title" />
              </Form.Item>

              <Form.Item
                label="About Therapy session"
                name="description"
                rules={[{ type: 'text', required: true }]}
              >
                <TextArea rows={4} placeholder="Write Description" />
              </Form.Item>

              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: 'Please enter Location' }]}
              >
                <Input size="large" placeholder="Enter Location" />
              </Form.Item>

              <Form.Item
                label="Location link"
                name="locationLink"
                rules={[
                  { required: true, message: 'Please enter Location link' },
                  {
                    pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
                    message: 'Please enter a valid URL',
                  },
                ]}
              >
                <Input size="large" placeholder="Enter Location link" />
              </Form.Item>

              <Form.Item
                label="Per Session Fee"
                name="fee"
                rules={[{ required: true, message: 'Please enter session fee' }]}
              >
                <Input type="number" size="large" placeholder="Enter session fee" />
              </Form.Item>

              <Form.Item
                label="Therapy Type"
                name="therapyType"
                rules={[{ required: true, message: 'Please enter Type' }]}
              >
                <Select
                  size="large"
                  placeholder="Enter Type"
                  options={[
                    { value: 'text_therapy', label: 'Text Therapy' },
                    { value: 'Vedio_Therapy', label: 'Vedio Therapy' },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Therapist Name"
                name="therapist"
                rules={[{ required: true, message: 'Please enter Therapist Name' }]}
              >
                <Select
                  showSearch
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  onSearch={handleSearch}
                  filterOption={false}
                  options={data?.data?.map((therapist) => ({
                    value: therapist._id,
                    label: therapist?.user?.name,
                  }))}
                />
              </Form.Item>
            </div>

            {/* Middle side */}
            <div className="flex-1">
              <h1 className="py-2 font-medium">Upload Thumbnail Field</h1>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                rules={[{ required: true }]}
                style={{
                  textAlign: 'center',
                  border: '2px dashed #B87CAE',
                  paddingBlock: '20px',
                  borderRadius: '10px',
                }}
              >
                <Upload name="image" listType="picture" beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </div>

            {/* Right side */}
            <div className="flex-1">
              <h1 className="py-2 font-medium">Availability</h1>
              <Form.Item
                label="Select Date"
                name="selectedDate"
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  size="large"
                  disabledDate={(current) => current && current < moment().startOf('day')}
                />
              </Form.Item>

              <div className="flex gap-4">
                <Form.Item label="Start Time" name="startTime" style={{ flex: 1 }}>
                  <TimePicker style={{ width: '100%' }} size="large" format="h:mm A" use12Hours />
                </Form.Item>

                <Form.Item label="End Time" name="endTime" style={{ flex: 1 }}>
                  <TimePicker style={{ width: '100%' }} size="large" format="h:mm A" use12Hours />
                </Form.Item>

                <AntButton
                  type="primary"
                  shape="circle"
                  icon={<UploadOutlined />}
                  size="large"
                  onClick={addTimeSlot}
                  style={{ marginTop: '32px' }}
                />
              </div>

              <div className="mt-4">
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border p-2 mb-2 rounded"
                  >
                    <span>
                      {slot.date}: {slot.startTime} - {slot.endTime}
                    </span>
                    <AntButton
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeSlot(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button
            htmlType="submit"
            size="large"
            block
            style={{ backgroundColor: '#A57EA5', color: 'white' }}
            loading={isLoading}
          >
            Upload
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default AddSessionModal;
