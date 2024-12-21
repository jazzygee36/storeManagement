import React from 'react';

const LowQuantityStock = [
  {
    productName: 'Salt',

    RemaningQuantity: '4',
  },
  {
    productName: 'Biscuit',

    RemaningQuantity: '1',
  },
  {
    productName: 'Pampards',

    RemaningQuantity: '2',
  },
];

const LowStocks = () => {
  return (
    <div className=' mt-5'>
      {LowQuantityStock.map((lowStock) => (
        <div
          key={lowStock.productName}
          className='flex justify-between items-center text-sm mb-3'
        >
          <div>
            <h3 className='font-medium'> {lowStock.productName}</h3>
            <h4 className='text-xs text-gray-500'>
              {' '}
              Remaining Quantity: {lowStock.RemaningQuantity}
            </h4>
          </div>
          <div className='text-[orange]'>Low</div>
        </div>
      ))}
    </div>
  );
};

export default LowStocks;
