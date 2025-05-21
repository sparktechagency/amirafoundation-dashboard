"use client";
import AddbannerModal from "@/components/SharedModals/AddBannerModal";
import {Button} from "antd";
import {PlusCircle} from "lucide-react";
import {useState} from "react";

const BannerPage = () => {
     const [showCreatebannerModal, setShowCreatebannerModal] = useState(false);
     return (
          <div>
               {/* =====================================Add banner button=================================== */}
               <div>
                    <Button
                         type="primary"
                         size="large"
                         icon={<PlusCircle size={20} />}
                         iconPosition="start"
                         className="!w-full !py-6"
                         onClick={() => setShowCreatebannerModal(true)}>
                         Add Banner
                    </Button>
               </div>

               {/* =====================================Banner list=================================== */}

               <div>
                    {/* Banner list goes here */}
                    {/* Example: */}
                    {/* <BannerCard /> */}
                    {/* <BannerCard /> */}
                    {/* <BannerCard /> */}
               </div>
               <AddbannerModal
                    open={showCreatebannerModal}
                    setOpen={setShowCreatebannerModal}
               />
          </div>
     );
};

export default BannerPage;
