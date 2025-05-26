'use client';

import { Divider, Modal } from 'antd';

export default function EarningModal({ open, setOpen, earning }) {
  return (
    <Modal
      centered
      open={open}
      setOpen={setOpen}
      footer={null}
      onCancel={() => {
        setOpen(false);
      }}
      title={null}
    >
      <h1 className=" text-center text-2xl font-bold my-10">Transaction Details</h1>
      <Divider />

      <section className="text-lg font-medium space-y-5 px-4 my-4">
        <div className="flex-center-between">
          <span>Name :</span>
          <span>{earning.name}</span>
        </div>
        <Divider />
        <div className="flex-center-between">
          <span>Trans ID :</span>
          <span>{earning?.tId}</span>
        </div>
        <Divider />
        <div className="flex-center-between">
          <span>Amount :</span>
          <span>{earning?.amount}</span>
        </div>
        {/* <Divider />
        <div className="flex-center-between">
          <span>A/C number :</span>
          <span>*** **** **** *545</span>
        </div> */}
        <Divider />
        <div className="flex-center-between">
          <span>Date :</span>
          <span>{earning?.date}</span>
        </div>
      </section>
    </Modal>
  );
}
