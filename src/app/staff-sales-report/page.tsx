'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/components/state/store';
import { fetchSales, resetError } from '@/components/api/slices/salesSlice';
import Loading from '@/components/common/loadingState';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ReusableModal from '@/components/common/modal';

import MainStaffDashboard from '@/components/common/staff-dashboard/main-staff-dashboard';
import useAuth from '@/components/hook/useAuth';

type Status = 'Transfer' | 'Cash' | 'POS' | 'Cash & Transfer' | 'Cash & POS';

const STATUS_COLORS: Record<Status, string> = {
  Transfer: 'blue',
  Cash: 'green',
  POS: 'orange',
  'Cash & Transfer': 'black',
  'Cash & POS': 'purple',
};

const StaffSalesReport: React.FC<{ staffId: string }> = ({ staffId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { sales, loading, error } = useSelector(
    (state: RootState) => state.sales
  );
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
  }, [dispatch, staffId]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <MainStaffDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <div className='p-5'>
          <h2 className='font-bold '>Daily Sales Report</h2>

          {loading && <Loading />}
          {error && <h2>{error}</h2>}
          {!loading && !error && Object.keys(sales).length === 0 && (
            <h2 className='flex justify-center m-auto text-center font-'>
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
                        onClick={() => openModal()}
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
            {Object.entries(sales).map(([date, saleData]) => (
              <Table key={saleData.grandTotal}>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <strong>Product Name</strong>
                    </TableHead>
                    <TableHead>
                      <strong>Quantity Sold</strong>
                    </TableHead>
                    <TableHead>
                      <strong>Selling Price</strong>
                    </TableHead>
                    <TableHead>
                      <strong>Total Price</strong>
                    </TableHead>
                    <TableHead>
                      <strong>Payment Method</strong>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='w-full'>
                  {saleData.sales.map((sale) => {
                    const statusColor =
                      STATUS_COLORS[sale.paymentMethod as Status];

                    return (
                      <TableRow key={sale.id}>
                        {date}
                        <TableHead>{sale.productName || 'N/A'}</TableHead>
                        <TableHead>{sale.qtySold}</TableHead>
                        <TableHead>{sale.sellingPrice}</TableHead>
                        <TableHead>{sale.totalPrice}</TableHead>
                        <TableHead style={{ color: statusColor }}>
                          {sale.paymentMethod}
                        </TableHead>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ))}
          </ReusableModal>
        </div>
      )}
    </MainStaffDashboard>
  );
};

export default StaffSalesReport;
