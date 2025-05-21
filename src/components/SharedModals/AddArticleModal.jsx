import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RiCloseLargeLine } from "react-icons/ri";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useCreateArticleMutation } from "@/redux/api/articleApi";
import { toast } from "sonner";
import { useGetArticleCategoryQuery } from "@/redux/api/contentCategoryApi";
import { debounce } from "lodash";
import CreateCategoryModal from "@/app/admin/category/_components/CreateCategoryModal";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AddArticleModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [aboutMe, setAboutMe] = useState("");
  const [searchText, setSearchText] = useState(""); 
  const [categoryopen,setCategoryOpen]=useState(false)

  


// create article api handaler

  const [create, { isLoading }] = useCreateArticleMutation();

  // get article category api handaler

  const {data,isError}=useGetArticleCategoryQuery({searchText});


  // Debounced search handler to reduce API calls
   const handleSearch = debounce((value) => {
    setSearchText(value); // Update search text when the user types
  }, 500); // Wait for 500ms after the user stops typing before calling API



  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(values));
      // Handle file upload - get the first file from fileList
      if (values.image && values.image.length > 0) {
        const file = values.image[0].originFileObj;
        formData.append("image", file);
      }
      const res = await create(formData).unwrap();
      if (res.success) {
        toast.success("Article Added succesfully")
      }
    } catch (error) {
      toast.error(error?.data?.message)
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
        minWidth: "1000px",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl"
        onClick={() => setOpen(false)}
      >
        <RiCloseLargeLine
          size={18}
          color="black"
          className="absolute left-1/3 top-1/3"
        />
      </div>
      <h1 className="text-center text-2xl font-semibold">Add New Article</h1>
      <Divider />
      <div>
        <Form
          onFinish={handleSubmit}
          layout="vertical"
          style={{
            marginTop: "40px",
          }}
        >
          <div className="flex gap-12">
            <div className="flex-1">
              {/* ===================== Article Title ============================== */}
              <Form.Item
                label="Article Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please enter Article Title",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input size="large" placeholder="Enter Article title"></Input>
              </Form.Item>

              {/* ========================= Category ===================== */}
              <Form.Item
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please enter Category",
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
        options={data?.data?.map((therapist) => ({
          value: therapist._id,
          label: therapist.title,
        }))}
      />
              </Form.Item>
              <div className="flex justify-end">
                <Button onClick={()=>setCategoryOpen(true)}>Add New Category</Button>
              </div>
              {/*  =========================Input: About author======================== */}

              <Form.Item
                label="Author"
                name="author"
                rules={[{ type: "text", required: true }]}
              >
                <Input size="large" placeholder="Enter Author"></Input>
              </Form.Item>
              {/* ===============================Input: Featured Image Upload================================ */}
              <h1 className="py-2 font-medium">Feature Image Upload</h1>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) =>
                  Array.isArray(e) ? e : e && e.fileList
                }
                rules={[{ required: true }]}
                style={{
                  textAlign: "center",
                  border: "2px dashed #B87CAE",
                  paddingBlock: "20px",
                  borderRadius: "10px",
                }}
              >
                <Upload
                  name="image"
                  listType="picture"
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </div>
            <div className="flex-1">
              {/* About Me */}
              <Form.Item label="Content :" name="description">
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
          </div>
          <Button
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
            style={{
              backgroundColor: "#A57EA5",
              color: "white",
            }}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </Form>
      </div>

      <CreateCategoryModal open={categoryopen} setOpen={setCategoryOpen}/>

    </Modal>
  );
};

export default AddArticleModal;
