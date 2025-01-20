import React from 'react';

interface Props {
  products: { name: string; quantity: number }[];
}
const LowStocks = ({ products }: Props) => {
  return (
    <div className=' mt-5'>
      {products.length === 0 ? (
        <p className='text-center flex justify-center'>No low-stock items.</p>
      ) : (
        products.map((product, index) => (
          <div
            key={index}
            className='flex justify-between items-center text-sm mb-3'
          >
            <div>
              <h3 className='font-medium'> {product.name}</h3>
              <h4 className='text-xs text-gray-500'>
                {' '}
                Remaining Quantity: {product.quantity}
              </h4>
            </div>
            <div className='text-[orange]'>Low</div>
          </div>
        ))
      )}
    </div>
  );
};

export default LowStocks;
