'use client';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import LowStocks from '@/components/pages/dashbaord/low-stocks';
import ProductSummary from '@/components/pages/dashbaord/product-summary';
import SalesOverview from '@/components/pages/dashbaord/sale-overview';
import TopSelling from '@/components/pages/dashbaord/top-selling';
import React from 'react';
import useAuth from '../../components/hook/useAuth';
import Loading from '@/components/common/loadingState';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Dashboard = () => {
  const isAuthenticated = useAuth();

  return (
    <MainDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <Card>
              <CardHeader className='text-[16px] text-gray-800 font-medium font-inter'>
                Store Value
              </CardHeader>
              <CardContent>
                <SalesOverview />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='text-[16px] text-gray-800 font-medium font-inter'>
                Product Summary
              </CardHeader>
              <CardContent>
                <ProductSummary />
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
            <Card>
              <CardHeader className='text-[16px] text-gray-800 font-medium font-inter'>
                Top Selling Stock
              </CardHeader>
              <CardContent>
                <TopSelling />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='text-[16px] text-gray-800 font-medium font-inter'>
                Low Quantity Stock
              </CardHeader>
              <CardContent>
                <LowStocks />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </MainDashboard>
  );
};

export default Dashboard;
