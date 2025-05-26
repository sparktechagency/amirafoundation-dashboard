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
import { jwtDecode } from 'jwt-decode';

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signin, { isLoading }] = useSignInMutation();

  const onLoginSubmit = async (data) => {
    try {
      const res = await signin(data).unwrap();

      if (res?.data?.accessToken) {
        const decodedToken = jwtDecode(res.data.accessToken);
        const userRole = decodedToken?.role;
        if (userRole !== 'admin') {
          toast.error('You are not authorized to access this site');
          return;
        }
        // On successful login and role check
        toast.success('Login successful');
        dispatch(
          setUser({
            token: res.data.accessToken,
          })
        );
        router.push('/admin/dashboard');
      } else {
        toast.error(res?.message || 'Login failed: No access token received');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to login');
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
          disabled={isLoading}
          loading={isLoading}
          icon={isLoading ? <CustomLoader className="w-5 h-5" /> : null}
        >
          Login
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
