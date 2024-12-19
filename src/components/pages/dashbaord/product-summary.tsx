import React from 'react';

const ProductSummary = () => {
  return (
    <div className='grid grid-cols-2 gap-4 mt-3 justify-between items-center text-center text-sm'>
      <div>
        <h5>3</h5>
        <p className='text-[green] font-medium'>Product In-Stock</p>
      </div>

      <div>
        <h5>3</h5>
        <p className='text-[red] font-medium'>Product Out-Of-Stock</p>
      </div>
    </div>
  );
};

export default ProductSummary;
