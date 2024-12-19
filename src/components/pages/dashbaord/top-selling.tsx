import React from 'react';

const TopSellingStock = [
  {
    productName: 'Custard',
    soldQuantity: '9',
    RemaningQuantity: '4',
    price: '2000',
  },
  {
    productName: 'Agege bread',
    soldQuantity: '20',
    RemaningQuantity: '16',
    price: '500',
  },
  {
    productName: 'Baby food',
    soldQuantity: '13',
    RemaningQuantity: '2',
    price: '9000',
  },
];

const TopSelling = () => {
  return (
    <div className='overflow-x-auto mt-5'>
      <table className='min-w-full border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
              Product Name
            </th>
            <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
              Sold Qty
            </th>
            <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
              Remaining Qty
            </th>
            <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {TopSellingStock.map((top, index) => (
            <tr key={index} className='even:bg-gray-50'>
              <td className='border border-gray-300 px-4 py-2 text-sm'>
                {top.productName}
              </td>
              <td className='border border-gray-300 px-4 py-2 text-sm'>
                {top.soldQuantity}
              </td>
              <td className='border border-gray-300 px-4 py-2 text-sm'>
                {top.RemaningQuantity}
              </td>
              <td className='border border-gray-300 px-4 py-2 text-sm'>
                {top.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopSelling;
