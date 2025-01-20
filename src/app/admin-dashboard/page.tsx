'use client';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import LowStocks from '@/components/pages/dashbaord/low-stocks';
import ProductSummary from '@/components/pages/dashbaord/product-summary';
import SalesOverview from '@/components/pages/dashbaord/sale-overview';
import TopSelling from '@/components/pages/dashbaord/top-selling';
import React, { useEffect } from 'react';
import useAuth from '../../components/hook/useAuth';
import Loading from '@/components/common/loadingState';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/components/state/store';
import { fetchUserProfile } from '@/components/api/slices/userProfileSlice';
import { ProductItem } from '@/components/utils/interface';

const Dashboard = () => {
  const isAuthenticated = useAuth();

  const formatNumber = (num: number): string =>
    new Intl.NumberFormat().format(num);

  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.userProfile) as {
    products: ProductItem[];
    status: string;
    error: string | null;
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) dispatch(fetchUserProfile(userId));
  }, [dispatch]);

  const totalCostValue = products.reduce((total, product) => {
    const goodsValue = product.qtyBought * product.unitPrice;
    return total + goodsValue;
  }, 0);

  const totalRevenueValue = products.reduce((total, product) => {
    const goodsValue = product.qtyBought * product.salesPrice;
    return total + goodsValue;
  }, 0);

  const totalProfit = products.reduce((total, product) => {
    const profitPerProduct =
      (product.salesPrice - product.unitPrice) * product.qtyBought;
    return total + profitPerProduct;
  }, 0);

  const productsInStock = products.filter(
    (product) => product.availability === 'In-stock'
  );

  const lowStockProducts = products.filter(
    (product) => product.qtyRemaining < 4
  ); // Example threshold of 10

  const lowStockData = lowStockProducts
    .map((product) => ({
      name: product.productName,
      quantity: product.qtyRemaining,
    }))
    .slice(0, 3);

  const ProductOutOfStock = products.filter(
    (product) => product.availability === 'Out-of-stock'
  );
  const OutOfStockLength = ProductOutOfStock.length;
  const InStock = productsInStock.length;

  return (
    <MainDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <Card>
              <CardHeader className='text-[16px] text-gray-800 font-medium font-inter'>
                <div className='flex justify-between gap-2 items-center '>
                  <h3> Store Value</h3>
                  <div className='flex gap-2 items-center '>
                    <h3>
                      Revenue Value:{' '}
                      <span className='font-bold text-[14px]'>
                        N{formatNumber(totalRevenueValue)}
                      </span>
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SalesOverview
                  totalCostValue={totalCostValue}
                  totalProfit={totalProfit}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='text-[16px] text-gray-800 font-medium font-inter'>
                Product Summary
              </CardHeader>
              <CardContent>
                <ProductSummary
                  InStock={InStock}
                  OutOfStockLength={OutOfStockLength}
                />
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
            <Card>
              <CardHeader className='text-[16px] text-gray-800 font-medium font-inter'>
                Top Selling Stock
              </CardHeader>
              <CardContent>{/* <TopSelling /> */}</CardContent>
            </Card>

            <Card>
              <CardHeader className='text-[16px] text-gray-800 font-medium font-inter'>
                Low Quantity Stock
              </CardHeader>
              <CardContent>
                <LowStocks products={lowStockData} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </MainDashboard>
  );
};

export default Dashboard;
