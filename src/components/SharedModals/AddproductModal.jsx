import { Button, Divider, Form, Input, InputNumber, Modal, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RiCloseLargeLine } from 'react-icons/ri';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCreateProductMutation, useGetAllproductCategoryQuery } from '@/redux/api/productsApi';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression'; // ✅ Add this

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const AddproductModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [aboutMe, setAboutMe] = useState('');
  const [searchtext, setsearchtext] = useState('');

  // Get product category APIs
  const { data } = useGetAllproductCategoryQuery({ searchtext });
  const category = data?.data;

  // Add new product API handler
  const [create, { isLoading }] = useCreateProductMutation();

  // Debounced search handler to reduce API calls
  const handleSearch = debounce((value) => {
    setsearchtext(value);
  }, 500);

  // ✅ Function to compress images before sending
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1, // max 1MB
      maxWidthOrHeight: 1200, // resize if larger than 1200px
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return new File([compressedFile], file.name, { type: file.type });
    } catch (error) {
      console.error('Image compression failed:', error);
      return file; // fallback to original
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(values));

      // ✅ Compress and append multiple images
      if (values.image && values.image.length > 0) {
        for (const fileObj of values.image) {
          const compressed = await compressImage(fileObj.originFileObj);
          formData.append('images', compressed);
        }
      }

      const res = await create(formData).unwrap();
      if (res.success) {
        toast.success('Product Added successfully');
        form.resetFields();
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add product');
    }
  };

  // List of Nigerian States
  const states = [
    'Abia',
    'Adamawa',
    'Akwa Ibom',
    'Anambra',
    'Bauchi',
    'Bayelsa',
    'Benue',
    'Borno',
    'Cross River',
    'Delta',
    'Ebonyi',
    'Edo',
    'Ekiti',
    'Enugu',
    'Gombe',
    'Imo',
    'Jigawa',
    'Kaduna',
    'Kano',
    'Katsina',
    'Kebbi',
    'Kogi',
    'Kwara',
    'Lagos',
    'Nasarawa',
    'Niger',
    'Ogun',
    'Ondo',
    'Osun',
    'Oyo',
    'Plateau',
    'Rivers',
    'Sokoto',
    'Taraba',
    'Yobe',
    'Zamfara',
  ];

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      closeIcon={false}
      style={{ minWidth: '1200px', position: 'relative' }}
    >
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl"
        onClick={() => setOpen(false)}
      >
        <RiCloseLargeLine size={18} color="black" className="absolute left-1/3 top-1/3" />
      </div>
      <h1 className="text-center text-2xl font-semibold">Add Product</h1>
      <Divider />
      <div>
        <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: '40px' }}>
          <div className="flex gap-12">
            <div className="flex-1">
              {/* Input: Product Name */}
              <Form.Item
                label="Product Name"
                name="name"
                rules={[{ required: true, message: 'Please enter product name' }]}
                style={{ width: '100%' }}
              >
                <Input size="large" placeholder="Enter Product Name" />
              </Form.Item>

              {/* Input: Description */}
              <Form.Item label="Description :" name="description">
                <JoditEditor
                  value={aboutMe}
                  config={{
                    height: 500,
                    placeholder: 'Note: Enter details about you.',
                    uploader: { insertImageAsBase64URI: true },
                  }}
                  onBlur={(content) => setAboutMe(content)}
                />
              </Form.Item>
            </div>

            <div className="flex-1">
              {/* Input: Category */}
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select a category' }]}
                style={{ width: '100%' }}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  onSearch={handleSearch}
                  filterOption={false}
                  options={category?.map((therapist) => ({
                    value: therapist._id,
                    label: therapist.title,
                  }))}
                />
              </Form.Item>

              {/* Input: Stock Quantity */}
              <Form.Item
                label="Stock Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please enter stock quantity' }]}
              >
                <InputNumber
                  type="number"
                  size="large"
                  placeholder="Enter stock quantity"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              {/* Input: Price */}
              <Form.Item
                label="Price"
                name="amount"
                rules={[{ required: true, message: 'Please enter price' }]}
                style={{ width: '100%' }}
              >
                <InputNumber
                  type="number"
                  size="large"
                  placeholder="Enter Price"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              {/* New Store Address Input */}
              <Form.Item
                label="Store Address (State)"
                name="storeAddress"
                rules={[{ required: true, message: 'Please select a store address (state)' }]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Search and Select State"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase().includes(input.toLowerCase()) || !input
                  }
                  notFoundContent="No states found"
                  options={states.map((state) => ({
                    value: state,
                    label: state,
                  }))}
                />
              </Form.Item>

              {/* Input: Image Upload */}
              <h1 className="py-2 font-semibold">Product Gallery</h1>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                rules={[{ required: true, message: 'Please upload at least one image' }]}
                style={{
                  textAlign: 'center',
                  border: '2px dashed #B87CAE',
                  paddingBlock: '20px',
                  borderRadius: '10px',
                }}
              >
                <Upload
                  name="images"
                  listType="picture"
                  beforeUpload={() => false}
                  multiple={true}
                  maxCount={5}
                >
                  <Button icon={<UploadOutlined />}>Upload Product Images</Button>
                </Upload>
              </Form.Item>
            </div>
          </div>
          <Button
            htmlType="submit"
            size="large"
            loading={isLoading}
            block
            style={{ backgroundColor: '#A57EA5', color: 'white' }}
          >
            Upload
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default AddproductModal;
