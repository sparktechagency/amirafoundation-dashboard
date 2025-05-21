'use client';

import { Badge, Button } from 'antd';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Layout } from 'antd';
import { AlignJustify } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectToken } from '@/redux/features/authSlice';
import { useGetMyProfileQuery } from '@/redux/api/authApi';
import { useGetMyNotificationQuery } from '@/redux/api/notificationApi';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { socket } from '@/soket';
import { toast } from 'sonner';
const { Header } = Layout;

export default function HeaderContainer({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isError, isLoading, isSuccess } = useGetMyProfileQuery();
  const user = data?.data;

  // notification-------------------
  const { data: notificationData, refetch } = useGetMyNotificationQuery({
    read: false,
  });

  const token = useSelector(selectToken);

  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken._id;
      // console.log('User ID:', userId);
    } catch (error) {
      // console.error('Error decoding token:', error);
    }
  }

  const notification = useSelector((state) => state.notification?.notification);
  useEffect(() => {
    if (notification?.message) {
      toast.info(notification?.message);
    }
  }, [notification]);

  //socket
  useEffect(() => {
    socket.auth = { token };
    socket.connect();
    const handleNotificationEvent = (data) => {
      if (data) {
        refetch();
        data = null;
      }
    };

    socket.on('notification::' + userId, handleNotificationEvent);

    return () => {
      // Clean up the event listener when the component is unmounted
      socket.off(userId, handleNotificationEvent);
      socket.disconnect();
    };
  }, [userId, refetch, token]);

  if (!userId) {
    router.push('/login');
  }

  const navbarTitle = pathname.split('/admin')[1];

  return (
    <Header
      style={{
        backgroundColor: '#FFFFFF',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 0,
        paddingRight: '40px',
      }}
    >
      {/* Collapse Icon */}
      <div className="flex items-center gap-x-2">
        <Button
          type="text"
          icon={<AlignJustify strokeWidth={3} size={25} />}
          onClick={() => setCollapsed(!collapsed)}
        />
        <h1 className="capitalize text-xl font-semibold font-dmSans -mt-3">
          {navbarTitle.length > 1
            ? navbarTitle.replaceAll('/', ' ').replaceAll('-', ' ')
            : 'dashboard'}
        </h1>
      </div>

      {/* Right --- notification, user profile */}
      <div className="flex items-center gap-x-6">
        {/* <button>
          <Search color="#1C1B1F" size={22} strokeWidth={2.5} />
        </button> */}

        <Link href="/admin/notification" className="!leading-none relative">
          {/* Notification dot indicator */}
          <div />
          <Badge count={notificationData?.data?.length || 0} overflowCount={10}></Badge>
          <Bell fill="#1C1B1F" stroke="#1C1B1F" size={22} />
        </Link>

        {/* User */}
        <Link
          href={'/admin/profile'}
          className="flex items-center gap-x-2 text-black hover:text-primary-blue group"
        >
          <Image
            src={user?.photoUrl}
            alt="Admin avatar"
            width={52}
            height={52}
            className="rounded-full border-2 p-0.5 border-primary-pink group-hover:border"
          />

          <h4 className="text-lg font-semibold">{user?.name}</h4>
        </Link>
      </div>
    </Header>
  );
}
