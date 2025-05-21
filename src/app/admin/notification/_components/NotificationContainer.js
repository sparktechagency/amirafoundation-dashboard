'use client';
import NotificationCard from './NotificationCard';
import { Button, Empty } from 'antd';
import {
  useDeleteNotificationMutation,
  useGetMyNotificationQuery,
  useMarkAsReadMutation,
} from '@/redux/api/notificationApi';
import { toast } from 'sonner';

export default function NotificationContainer() {
  const { data: notificationRes, refetch, isLoading } = useGetMyNotificationQuery({});
  const notificationData = notificationRes?.data || [];
  const [updateNotification] = useMarkAsReadMutation();
  const handelToRead = async () => {
    try {
      await updateNotification({}).unwrap();
      toast.success('All Notification successfully mark as read');
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  // const handelToDelete = async () => {
  //   try {
  //     await deleteFn({}).unwrap();
  //     toast.success('All Notification successfully deleted');
  //   } catch (error) {
  //     toast.error(error?.message || error?.data?.message);
  //   }
  // };
  return (
    <div className="w-3/4 mx-auto mb-10">
      <section className="mb-10 flex-center-between">
        <h4 className="text-3xl font-semibold">Notifications</h4>

        <div className="space-x-3">
          <Button onClick={handelToRead} type="primary">
            Mark as read
          </Button>
          {/* <Button onClick={handelToDelete} className="!bg-danger !text-white">
            Delete all
          </Button> */}
        </div>
      </section>

      <section className="space-y-8">
        {notificationData?.length > 0 ? (
          notificationData?.map((notification) => (
            <NotificationCard key={notification.key} notification={notification} />
          ))
        ) : (
          <Empty />
        )}
      </section>
    </div>
  );
}
