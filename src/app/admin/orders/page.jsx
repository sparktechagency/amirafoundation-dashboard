import OrderTable from './_Component/OrderTable';

export const metadata = { title: 'Orders', description: 'Orders page' };
const page = () => {
  return (
    <div>
      <OrderTable />
    </div>
  );
};

export default page;
