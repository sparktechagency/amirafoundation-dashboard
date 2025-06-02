'use client';
import { Button } from 'antd';
import { Edit } from 'lucide-react';
import React, { useState } from 'react';
import CreateNewPriceModal from './CreateNewPriceModal';

const PriceAdjusmentContainer = () => {
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
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

      <CreateNewPriceModal open={showCreatePlanModal} setOpen={setShowCreatePlanModal} />
    </div>
  );
};

export default PriceAdjusmentContainer;
