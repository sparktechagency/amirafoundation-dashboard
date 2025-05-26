import CustomConfirm from '@/components/CustomConfirm/CustomConfirm';
import { useDeleteSubCriptionMutation } from '@/redux/api/subsCriptionApi';
import { Button } from 'antd';
import { Trash2 } from 'lucide-react';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionPlanCard({ data, setShowEditPlanModal, SetData }) {
  // pakage delete handaller-------------

  const [deletePakage, { isLoading }] = useDeleteSubCriptionMutation();

  const handleDelete = async (id) => {
    try {
      const res = await deletePakage(id).unwrap();
      if (res.success) {
        toast.success('Pakage Delete successfully');
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  // Normal subscription card
  return (
    <div className="rounded-3xl border border-gray-300 p-7 font-medium flex flex-col justify-between gap-y-4">
      <div>
        <div className="space-y-4">
          <h4 className="text-2xl font-semibold">{data?.title} Plan</h4>
          <h1 className="text-5xl font-semibold">
            ₦{data?.price}
            <span className="text-xl font-medium text-black/50">/{data?.billingCycle}</span>
          </h1>
          <p className="font-medium text-black/75">{data?.type}</p>
        </div>

        <div className="my-4 h-[1px] w-full border-b border-dashed border-b-black"></div>

        <div>
          {data?.description && (
            <ul className="text-lg list-disc pl-5">
              {data.description.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Edit & Delete Button */}
      <div className="space-x-4 flex-center">
        <CustomConfirm
          title="Delete Plan"
          description={'Are you sure you want to delete this plan?'}
          onConfirm={() => handleDelete(data?._id)}
          isLoading={isLoading}
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
  );
}
