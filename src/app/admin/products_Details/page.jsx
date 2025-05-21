import React from 'react';
import ProductsTable from '../products_Details/_Component/ProductsTable';

export const metadata = {
  title: 'Products Table',
  description: 'Products page',
};

const page = () => {
  return (
    <div>
      <ProductsTable />
    </div>
  );
};

export default page;
