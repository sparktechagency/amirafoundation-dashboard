import { Button, Divider, Form, Input, Modal, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RiCloseLargeLine } from 'react-icons/ri';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useGetArticleCategoryQuery } from '@/redux/api/contentCategoryApi';
import { debounce } from 'lodash';
import { useUpdateArticleMutation } from '@/redux/api/articleApi';
import { toast } from 'sonner';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const EditArticleModal = ({ open, setOpen, details }) => {
  const [form] = Form.useForm();
  const [aboutMe, setAboutMe] = useState('');
  const [searchText, setSearchText] = useState('');
  const id = details?.id;

  // get article category API handler
  const { data, isError } = useGetArticleCategoryQuery({ searchText });

  // update/edit article api handaler

  const [update, { isLoading }] = useUpdateArticleMutation();

  // Debounced search handler to reduce API calls
  const handleSearch = debounce((value) => {
    setSearchText(value);
  }, 500);

  // Set initial value for aboutMe and image when the modal opens
  useEffect(() => {
    if (details) {
      form.setFieldsValue({
        title: details?.title,
        category: details?.categoryId,
        author: details?.author,
        description: details?.description,
        image: details?.thumbnail
          ? [
              {
                uid: '-1',
                name: 'thumbnail.jpg',
                status: 'done',
                url: details?.thumbnail,
              },
            ]
          : [],
      });
      setAboutMe(details?.description || '');
    }
  }, [details, form]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(values));
      if (values.image && values.image.length > 0) {
        const file = values.image[0].originFileObj;
        formData.append('image', file);
      }
      const res = await update({ formData, id }).unwrap();
      if (res.success) {
        toast.success('Article Update succesfully');
        form.resetFields();
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      closeIcon={false}
      style={{
        minWidth: '1000px',
        width: '100%',
        position: 'relative',
      }}
    >
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl"
        onClick={() => setOpen(false)}
      >
        <RiCloseLargeLine size={18} color="black" className="absolute left-1/3 top-1/3" />
      </div>
      <h1 className="text-center text-2xl font-semibold">Edit Article</h1>
      <Divider />
      <div>
        <Form
          onFinish={handleSubmit}
          layout="vertical"
          style={{
            marginTop: '40px',
          }}
          form={form} // Ensure the form is connected with the form instance
        >
          <div className="flex gap-12">
            <div className="flex-1">
              {/* ===================== Article Title ============================== */}
              <Form.Item
                label="Article Title"
                name="title"
                rules={[{ required: true, message: 'Please enter Article Title' }]}
              >
                <Input size="large" placeholder="Enter Article title" />
              </Form.Item>

              {/* ========================= Category ===================== */}
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select Category' }]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  onSearch={handleSearch}
                  filterOption={false}
                  options={data?.data?.map((category) => ({
                    value: category._id,
                    label: category.title,
                  }))}
                />
              </Form.Item>

              {/* ========================= Author ===================== */}
              <Form.Item
                label="Author"
                name="author"
                rules={[{ required: true, message: 'Please enter Author' }]}
              >
                <Input size="large" placeholder="Enter Author" />
              </Form.Item>

              {/* =============================== Input: Featured Image Upload ===================== */}
              <h1 className="py-2 font-medium">Feature Image Upload</h1>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                rules={[{ required: true, message: 'Please upload an image' }]}
              >
                <Upload
                  name="image"
                  listType="picture"
                  beforeUpload={() => false} // Prevent auto-upload
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </div>

            <div className="flex-1">
              {/* ======================== Jodit Editor for Content ===================== */}
              <Form.Item label="Content" name="description">
                <JoditEditor
                  value={aboutMe}
                  config={{
                    height: 500,
                    placeholder: 'Enter article content.',
                    uploader: {
                      insertImageAsBase64URI: true,
                    },
                  }}
                  onBlur={(content) => setAboutMe(content)}
                />
              </Form.Item>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
            style={{
              backgroundColor: '#A57EA5',
              color: 'white',
            }}
          >
            Submit
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default EditArticleModal;
