'use client';

import { Divider, Modal } from 'antd';
import userImage from '@/assets/images/user-avatar-lg.png';
import Image from 'next/image';
import { Tag } from 'antd';

export default function OrderDetailsModal({ open, setOpen, details }) {
  return (
    <Modal
      centered
      open={open}
      setOpen={setOpen}
      footer={null}
      width={800}
      onCancel={() => {
        setOpen(false);
      }}
    >
      <h3 className="text-2xl font-bold text-black text-center">Order Details</h3>
      <Divider />
      <div className="flex flex-col items-center gap-4 rounded-lg ">
        <Image
          src={details?.customerImage}
          alt="user image"
          height={2400}
          width={2400}
          className="w-[20%] h-auto rounded-full aspect-square"
        />

        <h4 className="text-lg font-bold text-black">{details?.customer_name}</h4>
      </div>
      <Divider />

      <div className=" grid grid-cols-1 gap-7 px-12 py-8 md:grid-cols-2 ">
        <div className="text-black">
          <h5 className=" font-bold">Order Id</h5>
          <p className="font-dmSans text-base">{details?.order_id}</p>
        </div>
        <div className="text-black">
          <h5 className=" font-bold">Order Date </h5>
          <p className="font-dmSans text-base">{details?.order_date}</p>
        </div>
        <div className="text-black">
          <h5 className=" font-bold">Amount</h5>
          <p className="font-dmSans text-base">₦{details?.amount}</p>
        </div>
        <div className="text-black">
          <h5 className=" font-bold">Product Name </h5>
          <p className="font-dmSans">
            <Tag color="cyan" className="!text-sm !mt-1 !font-semibold">
              {details?.product_name}
            </Tag>
          </p>
        </div>
      </div>
    </Modal>
  );
}
