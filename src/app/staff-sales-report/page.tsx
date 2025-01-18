'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/components/state/store';
import { fetchSales, resetError } from '@/components/api/slices/salesSlice';
import Loading from '@/components/common/loadingState';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ReusableModal from '@/components/common/modal';
import MainStaffDashboard from '@/components/common/staff-dashboard/main-staff-dashboard';
import useAuth from '@/components/hook/useAuth';
import { Sale } from '@/components/utils/interface';

// const STATUS_COLORS: Record<PaymentType, string> = {
//   Transfer: 'blue',
//   Cash: 'green',
//   POS: 'orange',
//   'Cash & Transfer': 'black',
//   'Cash & POS': 'purple',
// };

const StaffSalesReport: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sales, loading, error } = useSelector(
    (state: RootState) => state.sales
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSales, setSelectedSales] = useState<Sale[]>([]);

  const isAuthenticated = useAuth();

  const formatNumber = (num: number): string =>
    new Intl.NumberFormat().format(num);

  useEffect(() => {
    const staffId = localStorage.getItem('staffId');
    if (staffId) {
      console.log('Fetching sales for staffId:', staffId);
      dispatch(fetchSales(staffId));
    }

    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

  const openModal = (salesData: Sale[]) => {
    setSelectedSales(salesData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSales([]);
  };

  return (
    <MainStaffDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <div className='p-5'>
          <h2 className='font-bold'>Daily Sales Report</h2>
          {loading && <Loading />}
          {error && <h2>{error}</h2>}
          {!loading && !error && Object.keys(sales).length === 0 && (
            <h2 className='flex justify-center m-auto text-center'>
              No sales data available.
            </h2>
          )}
          {!loading && !error && Object.keys(sales)?.length > 0 && (
            <>
              {Object.entries(sales).map(([date, saleData]) => (
                <Table key={date} className='w-full mt-4'>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <h3>{date}</h3>
                      </TableHead>
                      <TableHead className='text-center'>
                        <p>
                          Total Sales:
                          <strong> {formatNumber(saleData.grandTotal)}</strong>
                        </p>
                      </TableHead>
                      <TableHead
                        className='text-right cursor-pointer text-blue-600'
                        onClick={() => openModal(saleData.sales)}
                      >
                        View more
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              ))}
            </>
          )}
          <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity Sold</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Payment Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSales.map((sale) => {
                  // const statusColor = STATUS_COLORS[sale.paymentMethod]; // Make sure paymentMethod is typed as Status
                  return (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.productName || 'N/A'}</TableCell>
                      <TableCell>{sale.qtySold}</TableCell>
                      <TableCell>{formatNumber(sale.sellingPrice)}</TableCell>
                      <TableCell>{formatNumber(sale.totalPrice)}</TableCell>
                      <TableCell>{sale.paymentMethod}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ReusableModal>
        </div>
      )}
    </MainStaffDashboard>
  );
};

export default StaffSalesReport;
