import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RiCloseLargeLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  useGetAllproductCategoryQuery,
  useUpdateProductMutation,

} from "@/redux/api/productsApi";
import { debounce } from "lodash";
import { toast } from "sonner";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditProductModal = ({ open, setOpen, details }) => {
  const [form] = Form.useForm();
  const [aboutMe, setAboutMe] = useState("");
  const [searchtext, setsearchtext] = useState("");

  // Get product category APIs
  const { data, isError } = useGetAllproductCategoryQuery({ searchtext });
  const category = data?.data;

  // Update product API handler
  const [update, { isLoading }] = useUpdateProductMutation();

  // Debounced search handler to reduce API calls
  const handleSearch = debounce((value) => {
    setsearchtext(value);
  }, 500);

  // console.log("image",details?.Img)

  // Update form fields when details change
  useEffect(() => {
    if (details && open) {
      form.setFieldsValue({
        name: details?.product,
        category: details?.categoryId,
        quantity: details?.quantity,
        description: details?.des,
        amount: details?.price,
        image: details?.Img?.map((img, index) => ({
          uid: `-${index + 1}`,
          name: `image-${index + 1}.jpg`,
          status: "done",
          url: img.url,
        })) || [],
      });
      setAboutMe(details?.des || "");
    }
  }, [details, open, form]);

  // Reset form and state when modal is closed
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setAboutMe("");
      setsearchtext("");
    }
  }, [open, form]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(values));

      // Handle multiple images
      if (values.image && values.image.length > 0) {
        values.image.forEach((fileObj) => {
          if (fileObj.originFileObj) {
            formData.append("images", fileObj.originFileObj);
          }
        });
      }

      const res = await update({ id: details.id, data: formData }).unwrap();
      if (res.success) {
        toast.success("Product Updated successfully");
        form.resetFields();
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update product");
    }
    console.log(values)
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
        setAboutMe("");
      }}
      closeIcon={false}
      style={{
        minWidth: "1200px",
        position: "relative",
      }}
    >
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl"
        onClick={() => {
          setOpen(false);
          form.resetFields();
          setAboutMe("");
        }}
      >
        <RiCloseLargeLine
          size={18}
          color="black"
          className="absolute left-1/3 top-1/3"
        />
      </div>
      <h1 className="text-center text-2xl font-semibold">Edit Product</h1>
      <Divider />
      <div>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          style={{
            marginTop: "40px",
          }}
        >
          <div className="flex gap-12">
            <div className="flex-1">
              {/* Input: Product Name */}
              <Form.Item
                label="Product Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter product name",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input size="large" placeholder="Enter Product Name" />
              </Form.Item>

              {/* Input: Description */}
              <Form.Item label="Description :" name="description">
                <JoditEditor
                  value={aboutMe}
                  config={{
                    height: 500,
                    placeholder: "Note: Enter details about you.",
                    uploader: {
                      insertImageAsBase64URI: true,
                    },
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
                rules={[
                  {
                    required: true,
                    message: "Please select a category",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
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
                rules={[
                  {
                    required: true,
                    message: "Please enter stock quantity",
                  },
                ]}
              >
                <InputNumber
                  type="number"
                  size="large"
                  placeholder="Enter stock quantity"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              {/* Input: Price */}
              <Form.Item
                label="Price"
                name="amount"
                rules={[
                  {
                    required: true,
                    message: "Please enter price",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <InputNumber
                  type="number"
                  size="large"
                  placeholder="Enter Price"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              {/* Input: Image Upload */}
              <h1 className="py-2 font-semibold">Product Gallery</h1>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) =>
                  Array.isArray(e) ? e : e && e.fileList
                }
                rules={[{ required: true, message: "Please upload at least one image" }]}
                style={{
                  textAlign: "center",
                  border: "2px dashed #B87CAE",
                  paddingBlock: "20px",
                  borderRadius: "10px",
                }}
              >
                <Upload
                  name="images"
                  listType="picture"
                  beforeUpload={() => false}
                  multiple={true}
                  maxCount={5}
                  accept="image/*" // Restrict to image files
                >
                  <Button icon={<UploadOutlined />}>
                    Upload Product Images
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          </div>
          <Button
            htmlType="submit"
            size="large"
            // loading={isLoading}
            block
            style={{
              backgroundColor: "#A57EA5",
              color: "white",
            }}
          >
            Update Product
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default EditProductModal;