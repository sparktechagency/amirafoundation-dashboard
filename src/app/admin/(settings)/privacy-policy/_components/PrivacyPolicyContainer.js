'use client';

import FormWrapper from '@/components/Form/FormWrapper';
import UTextEditor from '@/components/Form/UTextEditor';
import { useGetContentsQuery, useUpdateContentMutation } from '@/redux/api/contentApi';
import { Button } from 'antd';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function PrivacyPolicyContainer() {
  const { data } = useGetContentsQuery();
  const value = data?.data?.[0]?.privacyPolicy;
  // update contetnt api handeller

  const [updateContent, { isLoading: updating }] = useUpdateContentMutation();

  const handleSubmit = async (values) => {
    try {
      const res = await updateContent(values).unwrap();
      if (res.success) {
        toast.success('Content Update Successfully');
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <section>
      <h3 className="text-2xl font-semibold mb-6">Privacy Policy</h3>

      <FormWrapper onSubmit={handleSubmit}>
        <UTextEditor
          value={value}
          name="privacyPolicy"
          placeholder="Note: Enter details about your privacy policy here."
        />

        <Button
          type="primary"
          size="large"
          className="w-full rounded-xl"
          htmlType="submit"
          icon={<Edit size={18} />}
          loading={updating}
        >
          Save Changes
        </Button>
      </FormWrapper>
    </section>
  );
}
