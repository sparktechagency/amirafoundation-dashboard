'use client';

import { Button } from 'antd';
import { Edit } from 'lucide-react';
import SubscriptionPlanCard from './SubscriptionPlanCard';
import CreateSubscriptionPlanModal from './CreateSubscriptionPlanModal';
import { useState } from 'react';
import EditSubscriptionPlanModal from './EditSubscriptionPlanModal';
import { useGetAllSubCriptionQuery } from '@/redux/api/subsCriptionApi';

export default function SubscriptionsContainer() {
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [pakageData, SetData] = useState('');
  const { data } = useGetAllSubCriptionQuery();
  const subscriptionPlans = data?.data;

  //

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
        Create Subscription Plan
      </Button>

      <section className="my-10 grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {subscriptionPlans?.map((data, idx) => (
          <SubscriptionPlanCard
            key={idx}
            data={data}
            setShowEditPlanModal={setShowEditPlanModal}
            SetData={SetData}
          />
        ))}
      </section>

      {/* Create Subscription Plan Modal */}
      <CreateSubscriptionPlanModal open={showCreatePlanModal} setOpen={setShowCreatePlanModal} />

      {/* Edit Subscription Plan Modal */}
      <EditSubscriptionPlanModal
        open={showEditPlanModal}
        setOpen={setShowEditPlanModal}
        pakageData={pakageData}
      />
    </div>
  );
}
