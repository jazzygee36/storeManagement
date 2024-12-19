import React from 'react';

const Overall = () => {
  return (
    <div className='flex justify-between items-center mt-5 text-sm'>
      <div className='text-center'>
        <h2 className='text-[#4285F4] font-semibold font-inter my-2'>
          Total Products
        </h2>
        <h2>8</h2>
      </div>
      <div className='text-center'>
        <h2 className='text-[green] font-semibold font-inter my-2'>In Stock</h2>
        <h2>30</h2>
      </div>
      <div className='text-center'>
        <h2 className='text-[orange] font-semibold font-inter my-2'>
          Low Stock
        </h2>
        <h2>5</h2>
      </div>
      <div className='text-center'>
        <h2 className='text-[red] font-semibold font-inter my-2'>
          Out of Stocks
        </h2>
        <div>2</div>
      </div>
    </div>
  );
};

export default Overall;
