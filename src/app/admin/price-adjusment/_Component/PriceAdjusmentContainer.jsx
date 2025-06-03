'use client';
import { Button } from 'antd';
import { Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import CreateNewPriceModal from './CreateNewPriceModal';
import {
  useDeleteDeliveryChargeMutation,
  useGetAllDeliveryChargeQuery,
} from '@/redux/api/deliverychargeApi';
import CustomConfirm from '@/components/CustomConfirm/CustomConfirm';

import { toast } from 'sonner';
import DeliveryPriceEditModal from './DeliveryPriceEditModal';

const PriceAdjusmentContainer = () => {
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [pakageData, SetData] = useState('');
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [deletePakage, { isLoading: deleting }] = useDeleteDeliveryChargeMutation();
  // get data from api
  const { data, isLoading } = useGetAllDeliveryChargeQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (id) => {
    try {
      const res = await deletePakage(id).unwrap();
      if (res.success) {
        toast.success('Delivery Price Delete successfully');
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        size="large"
        icon={<Edit size={20} />}
        iconPosition="start"
        className="!w-full !py-6"
        onClick={() => setShowCreatePlanModal(true)}
      >
        Set new price adjusment
      </Button>
      <section className="my-10 grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {data?.data?.map((data, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-4 border py-10 space-y-5">
            <p className="text-gray-600 text-xl font-bold">{data?.type}</p>
            <p className="text-gray-600 text-lg font-medium"> ₦ {data?.charge}</p>
            {/* Edit & Delete Button */}
            <div className="space-x-4 flex-center">
              <CustomConfirm
                title="Delete Plan"
                description={'Are you sure you want to delete this plan?'}
                onConfirm={() => handleDelete(data?._id)}
                isLoading={deleting}
              >
                <Button
                  className="!font-medium w-1/2 !bg-danger !text-white !border-none"
                  icon={<Trash2 size={16} />}
                >
                  Delete
                </Button>
              </CustomConfirm>

              <Button
                type="primary"
                className="!font-medium w-1/2"
                icon={<Edit size={16} />}
                onClick={() => {
                  setShowEditPlanModal(true);
                  SetData(data);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </section>

      {/* Edit price Plan Modal */}
      <DeliveryPriceEditModal
        open={showEditPlanModal}
        setOpen={setShowEditPlanModal}
        data={pakageData}
      />

      {/* Create price Plan Modal */}
      <CreateNewPriceModal open={showCreatePlanModal} setOpen={setShowCreatePlanModal} />
    </div>
  );
};

export default PriceAdjusmentContainer;
