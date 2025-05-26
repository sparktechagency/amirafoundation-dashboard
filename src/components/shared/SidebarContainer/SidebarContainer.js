'use client';

import './Sidebar.css';
import logo from '@/assets/images/logo.png';
import { logout } from '@/redux/features/authSlice';
import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { CircleDollarSign, ShoppingCart } from 'lucide-react';
import { Shapes } from 'lucide-react';
import { ScrollText } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { SlidersVertical } from 'lucide-react';
import { CircleUser } from 'lucide-react';
import { House } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PiMoney } from 'react-icons/pi';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const SidebarContainer = ({ collapsed }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Logout handler
  const onClick = (e) => {
    if (e.key === 'logout') {
      dispatch(logout());
      router.refresh();
      router.push('/login');
      toast.success('Logout Successfully');
    }
  };

  const navLinks = [
    {
      key: 'dashboard',
      icon: <House size={21} strokeWidth={2} />,
      label: <Link href={'/admin/dashboard'}>Dashboard</Link>,
    },
    {
      key: 'account-details',
      icon: <CircleUser size={21} strokeWidth={2} />,
      label: <Link href={'/admin/account-details'}>User Management</Link>,
    },
    {
      key: 'therapist-details',
      icon: <CircleUser size={21} strokeWidth={2} />,
      label: <Link href={'/admin/therapist'}>Therapist Management</Link>,
    },
    {
      key: 'earnings',
      icon: <CircleDollarSign size={21} strokeWidth={2} />,
      label: <Link href={'/admin/earnings'}>Earnings</Link>,
    },

    {
      key: 'session_details',
      icon: <CircleDollarSign size={21} strokeWidth={2} />,
      label: <Link href={'/admin/session_details'}>Session Management</Link>,
    },
    {
      key: 'resource_Hub',
      icon: <CircleDollarSign size={21} strokeWidth={2} />,
      label: <Link href={'/admin/resource_hub'}>Resources Hub Management</Link>,
    },

    {
      key: 'products',
      icon: <ShoppingCart size={21} strokeWidth={2} />,
      label: <Link href={'/admin/products_Details'}>Products</Link>,
    },
    {
      key: 'category',
      icon: <Shapes size={21} strokeWidth={2} />,
      label: <Link href={'/admin/category'}>Product Category</Link>,
    },

    {
      key: 'orders',
      icon: <CircleUser size={21} strokeWidth={2} />,
      label: <Link href={'/admin/orders'}>Order</Link>,
    },
    {
      key: 'subscription',
      icon: <PiMoney size={21} strokeWidth={2} />,
      label: <Link href={'/admin/manage-subscription'}>Payments & Subscriptions</Link>,
    },
    // {
    //   key: "notification",
    //   icon: <PiNotification size={21} strokeWidth={2} />,
    //   label: <Link href={"/admin/notification"}>Notification</Link>,
    // },
    {
      key: 'settings',
      icon: <SlidersVertical size={21} strokeWidth={2} />,
      label: 'Settings',
      children: [
        {
          key: 'privacy-policy',
          icon: <ScrollText size={21} strokeWidth={2} />,
          label: <Link href="/admin/privacy-policy">Privacy Policy</Link>,
        },
        {
          key: 'terms-conditions',
          icon: <ScrollText size={21} strokeWidth={2} />,
          label: <Link href="/admin/terms-conditions">Terms & Conditions</Link>,
        },
        {
          key: 'about-us',
          icon: <ScrollText size={21} strokeWidth={2} />,
          label: <Link href="/admin/about-us">About Us</Link>,
        },
      ],
    },

    {
      key: 'logout',
      icon: <LogOut size={21} strokeWidth={2} />,
      label: <Link href="/login">Logout</Link>,
    },
  ];

  // Get current path for sidebar menu item `key`
  const currentPathname = usePathname()?.replace('/admin/', '')?.split(' ')[0];

  return (
    <Sider
      width={320}
      theme="light"
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        paddingInline: `${!collapsed ? '10px' : '4px'}`,
        paddingBlock: '30px',
        backgroundColor: '#FFFFFF',
        maxHeight: '100vh',
        overflow: 'auto',
      }}
      className="scroll-hide"
    >
      <div className="mb-6 flex flex-col justify-center items-center gap-y-5">
        <Link href={'/'}>
          {collapsed ? (
            // Logo small
            <Image src={logo} alt="Logo Of Before After Story" className="h-4 w-auto" />
          ) : (
            <Image src={logo} alt="Logo Of Before After Story" className="h-16 w-auto" />
          )}
        </Link>
      </div>

      <Menu
        onClick={onClick}
        defaultSelectedKeys={[currentPathname]}
        mode="inline"
        className="sidebar-menu !bg-transparent space-y-2.5 !border-none"
        items={navLinks}
      />
    </Sider>
  );
};

export default SidebarContainer;
