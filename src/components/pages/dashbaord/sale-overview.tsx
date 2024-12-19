import React from 'react';

const SalesOverview = () => {
  return (
    <div className='grid grid-cols-2 gap-5 mt-3 justify-between items-center text-center text-sm'>
      <div>
        <h5>3</h5>
        <div className='flex justify-evenly items-center'>
          <h2>N50,000</h2>
          <h2>Sales</h2>
        </div>
      </div>

      <div>
        <h5>3</h5>
        <div className='flex justify-evenly items-center'>
          <h2>N20,000</h2>
          <h2>Profit</h2>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
