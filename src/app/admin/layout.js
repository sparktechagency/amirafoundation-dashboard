'use client';

import HeaderContainer from '@/components/shared/HeaderContainer/HeaderContainer';
import SidebarContainer from '@/components/shared/SidebarContainer/SidebarContainer';
import { selectToken } from '@/redux/features/authSlice';
import { setNotification } from '@/redux/features/notificationSlice';
import { socket } from '@/soket';
import { useMediaQuery } from '@react-hook/media-query';
import { Layout } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
const { Content } = Layout;

export default function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dispatch = useDispatch();

  // Check if small screen
  const screenSizeLessThan1300 = useMediaQuery('only screen and (max-width: 1300px)');

  // Show prompt to collapse sidebar if screen size is less than 1300px
  useEffect(() => {
    if (screenSizeLessThan1300 && !sidebarCollapsed) {
      toast.success(
        "Small screen detected! If content doesn't fit better please collapse the sidebar by clicking the menu button on top-left",
        { duration: 2500 }
      );
    }
  }, [screenSizeLessThan1300, sidebarCollapsed]);

  const token = useSelector(selectToken);

  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken._id;
      // console.log('User ID:', userId);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  useEffect(() => {
    socket.auth = { token };
    socket.connect();
    const handleNotificationEvent = (data) => {
      dispatch(setNotification(data));
    };

    socket.on('notification::' + userId, handleNotificationEvent);

    return () => {
      // Clean up the event listener when the component is unmounted
      socket.off(userId, handleNotificationEvent);
      socket.disconnect();
    };
  }, [userId, dispatch, token]);

  return (
    <Layout style={{ height: '100vh', overflow: 'auto' }}>
      <SidebarContainer collapsed={sidebarCollapsed}></SidebarContainer>

      <Layout>
        <HeaderContainer
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        ></HeaderContainer>

        <Content
          style={{
            height: '100vh',
            maxHeight: '100vh',
            overflow: 'auto',
            backgroundColor: '#F5F5F5',
            paddingInline: '70px',
            paddingTop: '50px',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
