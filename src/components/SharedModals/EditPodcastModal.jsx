import { Button, Divider, Form, Input, Modal, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RiCloseLargeLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { useGetPodcastCategoryQuery } from "@/redux/api/contentCategoryApi";
import { useUpdatePodcastMutation } from "@/redux/api/podcastApi";
import { toast } from "sonner";

const EditpodCast = ({ open, setOpen,details }) => {
   const [searchText, setSearchText] = useState(""); 
  const [form] = Form.useForm();
  const id = details?.id
 // get podcast category api handeller 
  const {data,isError}=useGetPodcastCategoryQuery({searchText});

  // update 
    const [update,{isLoading}]=useUpdatePodcastMutation()

  // Set initial value for aboutMe and image when the modal opens
  useEffect(() => {
    if (details) {
      form.setFieldsValue({
        title: details?.title,
        category: details?.categoryId,
        author: details?.author,
        episodeNumber:details?.episode,
        duration:details?.duration,
        fileLink : details?.link,
        image: details?.thumbnail
        ? [
            {
              uid: "-1",
              name: "thumbnail.jpg", 
              status: "done",
              url: details?.thumbnail,
            },
          ]
        : [],

      });
    }
  }, [details, form]);


  // Debounced search handler to reduce API calls
  const handleSearch = debounce((value) => {
    setSearchText(value); 
  }, 500); 

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData()
      formData.append("data",JSON.stringify(values))
      if (values.image && values.image.length > 0) {
        const file = values.image[0].originFileObj;
        formData.append("image", file);
      }
      const res = await update({formData,id}).unwrap();
      if (res.success) {
        toast.success("Podcast Update succesfully")
        form.resetFields()
        setOpen(false)
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
      <h1 className="text-center text-2xl font-semibold">Edit Podcast</h1>
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
              {/* ===================== Episode Title ============================== */}
              <Form.Item
                label="Episode Title"
                name="title"
                initialValue={details?.title}
                rules={[
                  {
                    required: true,
                    message: "Please enter Episode Title",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input size="large" placeholder="Enter Episode title"></Input>
              </Form.Item>

              {/* ========================= Number ===================== */}
              <Form.Item
                label="Episode Number"
                name="episodeNumber"
                rules={[
                  {
                    required: true,
                    message: "Please enter Episode Number",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input
                  type="number"
                  size="large"
                  placeholder="Enter Number"
                ></Input>
              </Form.Item>
              {/* ========================= category ===================== */}
              <Form.Item
                label="Category"
                name="category"
                initialValue={details?.categoryId}
                // rules={[{ required: true, message: "Please select Category" }]}
              >
                <Select
                initialValue={details?.categoryId}
                  showSearch
                  style={{ width: "100%" }}
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
              {/*  =========================Input: About author======================== */}

              <Form.Item
                label="Author"
                name="author"
                rules={[{ type: "text", required: true }]}
              >
                <Input size="large" placeholder="Enter Author"></Input>
              </Form.Item>
              {/* =====================duration============ */}
              <Form.Item
                label="Duration"
                name="duration"
                rules={[{ type: "text", required: true }]}
              >
                <Input size="large" placeholder=" Enter Duration"></Input>
              </Form.Item>
            </div>
            <div className="flex-1">
              {/* =====================episode link============ */}
              <Form.Item
                label="Episode Link"
                name="fileLink"
                rules={[{ type: "text", required: true }]}
              >
                <Input
                  size="large"
                  placeholder="Paste Your Podcast link"
                ></Input>
              </Form.Item>
              {/* ===============================Input: Featured Image Upload================================ */}
              <h1 className="py-2 font-medium">Cover Image Upload</h1>
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
          </div>
          <Button
            htmlType="submit"
            loading={isLoading}
            size="large"
            block
            style={{
              backgroundColor: "#A57EA5",
              color: "white",
            }}
          >
            Upload
          </Button>
        </Form>
      </div>
    </Modal>
  );
};

export default EditpodCast;
