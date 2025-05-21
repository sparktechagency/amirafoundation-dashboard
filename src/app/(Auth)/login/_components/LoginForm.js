'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schema/authSchema';
import FormWrapper from '@/components/Form/FormWrapper';
import UInput from '@/components/Form/UInput';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useSignInMutation } from '@/redux/api/authApi';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import CustomLoader from '@/component/Shared/CustomLoader';
import { setUser } from '@/redux/features/authSlice';

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  // Login api handlers
  const [signin, { isLoading, error }] = useSignInMutation();

  const onLoginSubmit = async (data) => {
    try {
      const res = await signin(data).unwrap();
      // console.log("API Response:", res.data?.accessToken);
      if (res.success) {
        toast.success('Login successful');
        // localStorage.setItem("refreshToken", res?.data?.refreshToken);
        // Set user info into store
        dispatch(
          setUser({
            token: res.data?.accessToken,
          })
        );
        router.push('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="px-6 py-8 shadow-none shadow-primary-blue/10 w-full bg-white rounded-md">
      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold text-[#A57EA5]">Welcome back!</h4>
        <p className="text-dark-gray">Please enter your email and password to continue</p>
      </section>

      <FormWrapper onSubmit={onLoginSubmit} resolver={zodResolver(loginSchema)}>
        <UInput
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          size="large"
          className="!h-10"
        />

        <UInput
          name="password"
          label="Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!h-10 !mb-0"
        />

        <Button
          htmlType="submit"
          type="primary"
          size="large"
          className="w-full !font-semibold !h-10"
        >
          {isLoading ? <CustomLoader /> : 'Log In'}
        </Button>

        <Link
          href="/forgot-password"
          className="text-primary-blue text-center block mt-2 font-medium hover:text-primary-blue/85"
        >
          I forgot my password
        </Link>
      </FormWrapper>
    </div>
  );
}
