"use client";
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RiCloseLargeLine } from "react-icons/ri";
import TextArea from "antd/es/input/TextArea";
import { useAddNewTherapistMutation } from "@/redux/api/therapistApi";
import { toast } from "sonner";

const AddTherapistModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [addTherapist, { isLoading }] = useAddNewTherapistMutation();

  const handleSubmit = async (values) => {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("bio", values.bio);
      formData.append("achievement", values.achievement);

      // Handle file upload - get the first file from fileList
      if (values.image && values.image.length > 0) {
        const file = values.image[0].originFileObj;
        formData.append("image", file);
      }
      const response = await addTherapist(formData).unwrap();
      if (response.success) {
        toast.success("Therapist Added SuccesFully")
        form.resetFields()
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
        minWidth: "500px",
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
      <h1 className="text-center text-2xl font-semibold">Add New Therapist</h1>
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
              {/* Therapist Name */}
              <Form.Item
                label="Therapist Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter Therapist name",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input size="large" placeholder="Enter Therapist Name" />
              </Form.Item>

              {/* Therapist Email */}
              <Form.Item
                label="Therapist Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter Therapist Email",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input
                  type="email"
                  size="large"
                  placeholder="Enter Therapist Email"
                />
              </Form.Item>

              {/* About Therapist */}
              <Form.Item
                label="About Therapist"
                name="bio"
                rules={[
                  {
                    required: true,
                    message: "Please enter therapist bio"
                  }
                ]}
              >
                <TextArea rows={3} placeholder="Write Description" />
              </Form.Item>

              {/* Therapist Certificates */}
              <Form.Item
                label="Therapist Certificates"
                name="achievement"
                rules={[
                  {
                    required: true,
                    message: "Please enter therapist achievements"
                  }
                ]}
              >
                <TextArea rows={3} placeholder="Write Description" />
              </Form.Item>

              {/* Therapist Image Upload */}
              <h1 className="py-2 font-medium">Therapist Profile Picture</h1>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }}
                rules={[
                  {
                    required: true,
                    message: "Please upload a profile picture"
                  }
                ]}
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
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
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
    </Modal>
  );
};

export default AddTherapistModal;