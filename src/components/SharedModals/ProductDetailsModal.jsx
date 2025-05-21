'use client';

import { Modal } from 'antd';
import Image from 'next/image';
import { Tag } from 'antd';

export default function ProductDeatislModal({ open, setOpen, product }) {
  return (
    <Modal
      centered
      open={open}
      setOpen={setOpen}
      footer={null}
      onCancel={() => {
        setOpen(false);
      }}
      width={1000}
    >
      <div className="flex flex-col items-center gap-4 rounded-lg bg-primary-pink py-4">
        <Image
          src={product?.userImg}
          alt="user image"
          height={2400}
          width={2400}
          className="w-[30%] h-auto rounded-full aspect-square"
        />

        <h4 className="text-3xl font-bold text-white">{product?.product}</h4>
      </div>

      <div className=" grid-cols-1 gap-7 px-12 py-8 md:grid-cols-2 ">
        <div className="text-black">
          <h5 className=" font-bold">Description :</h5>
          <div
            dangerouslySetInnerHTML={{
              __html: product?.des || 'sorry, no description found',
            }}
            className="break-words"
          ></div>
        </div>
        <div className="text-black flex gap-5">
          <h5 className=" font-bold">Discount :</h5>
          <p className="font-dmSans text-base font-bold text-red-500">{product?.discount}</p>
        </div>
        <div className="text-black flex gap-5">
          <h5 className=" font-bold">Sold</h5>
          <p className="font-dmSans text-base font-bold text-green-500">{product?.sold}</p>
        </div>
      </div>
    </Modal>
  );
}
