'use client';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import Loading from '@/components/common/loadingState';
import useAuth from '@/components/hook/useAuth';
import React from 'react';

const Reports = () => {
  const isAuthenticated = useAuth();

  // if (!isAuthenticated) {
  //   return <Loading />;
  // }
  return (
    <MainDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full border border-gray-300 divide-y divide-gray-200'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                  Product/Services
                </th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                  Unit Price
                </th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                  Unit Sold
                </th>
                <th className='px-4 py-2 text-left text-sm font-medium text-gray-700'>
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              <tr>
                <td className='px-4 py-2 text-sm text-gray-800'>Service A</td>
                <td className='px-4 py-2 text-sm text-gray-800'>$50</td>
                <td className='px-4 py-2 text-sm text-gray-800'>10</td>
                <td className='px-4 py-2 text-sm text-gray-800'>Cash</td>
              </tr>
              <tr>
                <td className='px-4 py-2 text-sm text-gray-800'>Product B</td>
                <td className='px-4 py-2 text-sm text-gray-800'>$30</td>
                <td className='px-4 py-2 text-sm text-gray-800'>20</td>
                <td className='px-4 py-2 text-sm text-gray-800'>Transfer</td>
              </tr>
              <tr>
                <td className='px-4 py-2 text-sm text-gray-800'>Service C</td>
                <td className='px-4 py-2 text-sm text-gray-800'>$100</td>
                <td className='px-4 py-2 text-sm text-gray-800'>5</td>
                <td className='px-4 py-2 text-sm text-gray-800'>Pos</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </MainDashboard>
  );
};

export default Reports;
