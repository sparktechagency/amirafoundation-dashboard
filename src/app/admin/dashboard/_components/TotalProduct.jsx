import React from 'react';
import { Table, Typography, Tag } from 'antd';
import CustomCountUp from '@/components/CustomCountUp/CustomCountUp';
const { Text } = Typography;

const ProductCard = ({ product }) => {
  const data = product?.data?.products?.restockProducts?.map((item, inx) => ({
    productId: item?.id,
    productName: item?.name,
    stockLevel: item?.quantity,
  }));

  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Stock Level',
      dataIndex: 'stockLevel',
      key: 'stockLevel',
      render: (text) => <Text style={{ color: 'red' }}>{text}</Text>,
    },
  ];
  return (
    <div className="rounded-xl border bg-white px-[25px] pt-8 shadow-md">
      <div className="mb-2 space-y-1">
        <h1 className="text-3xl font-bold">Total Product</h1>
        <h1 className="text-3xl font-semibold">
          <CustomCountUp end={product?.data?.products?.totalProduct} />
        </h1>
        <p>Avarage Order: {product?.data?.products?.avgOrder}</p>

        <h1 className="text-lg font-bold text-red-500">Low Stock Alert</h1>
      </div>
      <Table
        style={{ width: '100%' }}
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default ProductCard;
