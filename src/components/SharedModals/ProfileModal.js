'use client';

import { Modal } from 'antd';
import Image from 'next/image';
import { Tag } from 'antd';
import { useState } from 'react';

export default function ProfileModal({ open, setOpen, user }) {
  const isValidUrl = (url) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
  };

  // Determine the image source
  const imageSrc = isValidUrl(user?.userImg);

  // State for controlling the full-size image modal
  const [fullImageOpen, setFullImageOpen] = useState(false);

  return (
    <Modal
      centered
      open={open}
      setOpen={setOpen}
      footer={null}
      onCancel={() => {
        setOpen(false);
      }}
    >
      <div className="flex flex-col items-center gap-4 rounded-lg bg-primary-pink py-4">
        <Image
          src={imageSrc}
          alt="user image"
          height={2400}
          width={2400}
          className="w-[30%] h-auto rounded-full aspect-square"
        />

        <h4 className="text-3xl font-bold text-white">{user?.name}</h4>
      </div>

      <div className="grid grid-cols-1 gap-7 px-12 py-8 md:grid-cols-2">
        <div className="text-black">
          <h5 className="font-bold">Name</h5>
          <p className="font-dmSans text-base">{user?.name}</p>
        </div>
        <div className="text-black">
          <h5 className="font-bold">Email</h5>
          <p className="font-dmSans text-base">{user?.email}</p>
        </div>
        <div className="text-black">
          <h5 className="font-bold">Contact</h5>
          <p className="font-dmSans text-base">{user?.contact}</p>
        </div>
        <div className="text-black">
          <h5 className="font-bold">Status</h5>
          <p className="font-dmSans">
            <Tag color="cyan" className="!text-sm !mt-1 !font-semibold">
              {user?.status}
            </Tag>
          </p>
        </div>
        {user?.documents && (
          <div div className=" flex flex-col items-start text-black gap-5">
            <h1 className="font-bold">Documents :</h1>
            <div className="text-black">
              <Image
                src={user?.documents}
                alt="document image"
                height={2400}
                width={2400}
                className="w-[30%] h-auto cursor-pointer"
                onClick={() => setFullImageOpen(true)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Full-size image modal */}
      <Modal
        centered
        open={fullImageOpen}
        footer={null}
        onCancel={() => setFullImageOpen(false)}
        width={800}
      >
        {user?.documents && (
          <Image
            src={user?.documents}
            alt="full-size document image"
            height={2400}
            width={2400}
            className="w-full h-auto"
          />
        )}
      </Modal>
    </Modal>
  );
}
