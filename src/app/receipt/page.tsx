'use client';
import Loading from '@/components/common/loadingState';
import MainStaffDashboard from '@/components/common/staff-dashboard/main-staff-dashboard';
import useAuth from '@/components/hook/useAuth';

const CustomerReceipt = () => {
  const isAuthenticated = useAuth();

  return (
    <MainStaffDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <div className='bg-purple-600 h-screen flex justify-center '>
          <div className=' py-5 px-5 w-[90%] md:w-[30%] lg:w-[25%] m-auto bg-white flex flex-col rounded-xl  '>
            <h1 className='text-center font-semibold text-xl'>Company Name</h1>
            <h4 className='text-center text-sm'>Wed, May 27, 2020. 8:00 AM</h4>
            <div className='w-full m-auto p-4 text-center border my-4 rounded-lg font-medium'>
              <h2>000-000-000-02</h2>
            </div>

            <div className='flex items-center justify-between '>
              <h2 className='text-gray-400 text-sm'>Customer name</h2>
              <h1 className='font-inter text-sm'>Samson Olamide</h1>
            </div>
            <div className='flex items-center justify-between my-3'>
              <h2 className='text-gray-400 text-sm'>Customer phoneNumber</h2>
              <h1 className='font-inter text-sm'>09817625453</h1>
            </div>
            <hr className='' />
            <h1 className='text-center font-inter my-3 text-base'>
              Description
            </h1>
            <table>
              <thead>
                <tr className='text-left text-sm font-semibold text-gray-500  font-inter'>
                  <th className='font-inter text-sm'>Products</th>
                  <th className='font-inter text-sm'>Qty</th>
                  <th className='font-inter text-sm text-right'>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className='font-inter text-sm'>
                  <td className='font-inter text-sm'>Cream</td>
                  <td className='font-inter text-sm'>2</td>
                  <td className='font-inter text-sm text-right'>7000</td>
                </tr>
                <tr className='font-inter text-sm'>
                  <td className='font-inter text-sm'>Cream</td>
                  <td className='font-inter text-sm'>2</td>
                  <td className='font-inter text-sm text-right'>7000</td>
                </tr>
                <tr className='mt-5 font-bold'>
                  <td>Total</td>
                  <td className='font-inter text-sm'></td>

                  <td className='text-right'>50,000</td>
                </tr>
              </tbody>
            </table>
            <hr className='my-3' />
            <div className='flex items-center justify-between text-sm my-3'>
              <p>Operator</p>
              <h2>Ade</h2>
            </div>
          </div>
        </div>
      )}
    </MainStaffDashboard>
  );
};

export default CustomerReceipt;
