'use client';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import PaperBackground from '@/components/common/paper-bg';
import LowStocks from '@/components/pages/dashbaord/low-stocks';
import ProductSummary from '@/components/pages/dashbaord/product-summary';
import SalesOverview from '@/components/pages/dashbaord/sale-overview';
import TopSelling from '@/components/pages/dashbaord/top-selling';
import React from 'react';
import useAuth from '../../components/hook/useAuth';
import Loading from '@/components/common/loadingState';

const Dashboard = () => {
  const isAuthenticated = useAuth();

  return (
    <MainDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <PaperBackground title={'Sales Overview'}>
              <SalesOverview />
            </PaperBackground>
            <PaperBackground
              title={'Product Summary'}
              container={
                <>
                  <p className='text-blue-600 cursor-pointer'>View all</p>
                </>
              }
            >
              <ProductSummary />
            </PaperBackground>
          </div>
          <div className='flex gap-5 my-3'>
            {/* <PaperBackground title={'Purchase Overview'}>
          {''}
          iiti
        </PaperBackground>

        <PaperBackground title={'Inventory Summary'}>
          {''}
          jjgj
        </PaperBackground> */}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <PaperBackground title={'Top Selling Stock'}>
              <TopSelling />
            </PaperBackground>
            <PaperBackground title={'Low Quantity Stock'}>
              <LowStocks />
            </PaperBackground>
          </div>
        </>
      )}
    </MainDashboard>
  );
};

export default Dashboard;
