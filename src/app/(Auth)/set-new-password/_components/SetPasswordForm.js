'use client';

import { LogoSvg } from '@/assets/logos/LogoSvg';
import FormWrapper from '@/components/Form/FormWrapper';
import UInput from '@/components/Form/UInput';
import { useResetPasswordMutation } from '@/redux/api/authApi';
import { resetPassSchema } from '@/schema/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'antd';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

export default function SetPasswordForm() {
  const router = useRouter();

  // reset api endpoint

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (data) => {
    try {
      const res = await resetPassword(data).unwrap();
      if (res?.success) {
        toast.success(res?.message || 'Password reset successfully');
        localStorage.removeItem('forgetPasswordToken');
        router.push('/login');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="px-6 py-8">
      <Link
        href="/login"
        className="text-primary-blue flex-center-start gap-x-2 font-medium hover:text-primary-blue/85 mb-4"
      >
        <ArrowLeft size={18} /> Back to login
      </Link>

      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold text-[#A57EA5]">Set New Password</h4>
        <p className="text-dark-gray">Enter your new password login</p>
      </section>

      <FormWrapper onSubmit={onSubmit} resolver={zodResolver(resetPassSchema)}>
        <UInput
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          size="large"
          className="!h-10 !mb-0"
        />

        <UInput
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!h-10 !mb-0"
        />

        <UInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!h-10 !mb-0"
        />

        <Button
          type="primary"
          size="large"
          className="w-full !font-semibold !h-10"
          htmlType="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          Submit
        </Button>
      </FormWrapper>
    </div>
  );
}
