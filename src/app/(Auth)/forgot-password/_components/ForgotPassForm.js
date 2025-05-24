'use client';
import Link from 'next/link';
import FormWrapper from '@/components/Form/FormWrapper';
import UInput from '@/components/Form/UInput';
import { Button } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForgetPasswordMutation } from '@/redux/api/authApi';
import { toast } from 'sonner';

export default function ForgotPassForm() {
  const router = useRouter();

  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const onSubmit = async (data) => {
    try {
      const res = await forgetPassword(data).unwrap();
      if (res?.success) {
        toast.success(res?.message);

        localStorage.setItem('forgetPasswordToken', res?.data?.token);

        router.push('/otp-verification');
      }
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error?.data?.message);
      } else {
        toast.error('Something went wrong');
      }
    }

    router.push('/otp-verification');
  };

  return (
    <div className="px-6 py-8 w-full">
      <Link
        href="/login"
        className="text-primary-blue flex-center-start gap-x-2 font-medium hover:text-primary-blue/85 mb-4"
      >
        <ArrowLeft size={18} /> Back to login
      </Link>

      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold text-[#A57EA5]">Forgot Password</h4>
        <p className="text-dark-gray">
          Enter your email and we&apos;ll send you an otp for verification
        </p>
      </section>

      <FormWrapper onSubmit={onSubmit}>
        <UInput
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          size="large"
          className="!h-10"
        />

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="w-full !font-semibold !h-10"
          loading={isLoading}
          disabled={isLoading}
        >
          Submit
        </Button>
      </FormWrapper>
    </div>
  );
}
