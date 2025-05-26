'use client';

import { Modal } from 'antd';
import Image from 'next/image';
import { Tag } from 'antd';

export default function TherapistProfileModal({ open, setOpen, user }) {
  console.log('ssssssssssss', user);
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
          src={user?.userImg}
          alt="user image"
          height={2400}
          width={2400}
          className="w-[30%] h-auto rounded-full aspect-square"
        />

        <h4 className="text-3xl font-bold text-white">{user?.name}</h4>
      </div>

      <div className=" grid grid-cols-1 gap-7 px-12 py-8 md:grid-cols-2 ">
        <div className="text-black">
          <h5 className=" font-bold">Name</h5>
          <p className="font-dmSans text-base">{user?.name}</p>
        </div>
        <div className="text-black">
          <h5 className=" font-bold">Email</h5>
          <p className="font-dmSans text-base">{user?.email}</p>
        </div>
        {/* <div className="text-black">
                    <h5 className=" font-bold">Contact</h5>
                    <p className="font-dmSans text-base">{user?.contact}</p>
                </div> */}
      </div>
      <div className="text-black">
        <h5 className=" font-bold">Bio</h5>
        <p className="font-dmSans ">{user?.bio}</p>
      </div>
    </Modal>
  );
}
