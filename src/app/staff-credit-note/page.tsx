'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
import MainStaffDashboard from '@/components/common/staff-dashboard/main-staff-dashboard';
import useAuth from '@/components/hook/useAuth';
import ReusableModal from '@/components/common/modal';
import Checked from '@/components/assets/icons/check';
import Tooltip from '@/components/common/tooltip';
import HomeButton from '@/components/common/button';
import { updatePaymentMethod } from '@/components/api/slices/updatePaymentSlice';

interface Sale {
  paymentMethod: string;
  customerNumber: string;
  customerName?: string;
  sellingPrice: number;
  qtySold: number;
  productName?: string;
}

const StaffCreditNote: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sales, error } = useSelector((state: RootState) => state.sales);
  const { loading, successMessage } = useSelector(
    (state: RootState) => state.updatePaymentSlice
  );
  const isAuthenticated = useAuth();

  // State Management
  const [customerNumber, setCustomerNumber] = useState(() => '');
  const [modalState, setModalState] = useState({
    isOpen: false,
    isCustomerOpen: false,
    selectedProducts: [] as string[],
  });

  useEffect(() => {
    const staffId = localStorage.getItem('staffId');
    if (staffId) dispatch(fetchSales(staffId));

    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const staffId = localStorage.getItem('staffId');
      if (staffId) dispatch(fetchSales(staffId));
      closeModal();
    }
  }, [successMessage, dispatch]);

  // Format number with commas
  const formatNumber = (num: number): string =>
    new Intl.NumberFormat().format(num);

  // Group sales by customer phone number
  const groupedSales = useMemo(() => {
    const grouped: Record<
      string,
      { customerName: string; totalAmount: number; products: string[] }
    > = {};

    Object.values(sales).flatMap((saleData) =>
      saleData.sales.forEach((sale: Sale) => {
        if (sale.paymentMethod !== 'Credit') return;

        if (!grouped[sale.customerNumber]) {
          grouped[sale.customerNumber] = {
            customerName: sale.customerName || 'Unknown',
            totalAmount: 0,
            products: [],
          };
        }

        grouped[sale.customerNumber].totalAmount +=
          sale.sellingPrice * sale.qtySold;
        if (sale.productName)
          grouped[sale.customerNumber].products.push(sale.productName);
      })
    );

    return grouped;
  }, [sales]);

  // Modal Handlers
  const openModal = useCallback((products: string[]) => {
    setModalState({
      isOpen: true,
      isCustomerOpen: false,
      selectedProducts: products,
    });
  }, []);

  const openCustomerModal = useCallback((phone: string) => {
    setCustomerNumber(phone);
    setModalState({
      isOpen: false,
      isCustomerOpen: true,
      selectedProducts: [],
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      isCustomerOpen: false,
      selectedProducts: [],
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (customerNumber.trim())
      dispatch(updatePaymentMethod(Number(customerNumber)));
  }, [customerNumber, dispatch]);

  if (!isAuthenticated) return <Loading />;
  if (loading) return <Loading />;
  if (error) return <h2 className='text-center'>{error}</h2>;

  return (
    <MainStaffDashboard>
      <div className='p-5'>
        <h2 className='font-bold'>Debtors</h2>

        {Object.keys(groupedSales).length === 0 ? (
          <h2 className='text-center m-auto'>No sales data available.</h2>
        ) : (
          <Table className='w-full mt-4'>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedSales).map(
                ([phone, { customerName, totalAmount, products }]) => (
                  <TableRow key={phone} className='items-center'>
                    <TableCell>{customerName}</TableCell>
                    <TableCell>{phone}</TableCell>
                    <TableCell
                      className='text-blue-600 cursor-pointer underline'
                      onClick={() => openModal(products)}
                    >
                      View
                    </TableCell>
                    <TableCell>
                      <strong>{formatNumber(totalAmount)}</strong>
                    </TableCell>
                    <TableCell>
                      <Tooltip text='Payment completed'>
                        <div onClick={() => openCustomerModal(phone)}>
                          <Checked />
                        </div>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Products Modal */}
      <ReusableModal isOpen={modalState.isOpen} onClose={closeModal}>
        <h2 className='font-bold text-lg mb-2'>Products Purchased</h2>
        <ul className='list-disc pl-5'>
          {modalState.selectedProducts.length ? (
            modalState.selectedProducts.map((product, index) => (
              <li key={index} className='mb-1'>
                {product}
              </li>
            ))
          ) : (
            <p>No products available</p>
          )}
        </ul>
      </ReusableModal>

      {/* Payment Confirmation Modal */}
      <ReusableModal isOpen={modalState.isCustomerOpen} onClose={closeModal}>
        <h1 className='text-center'>
          Confirm that the customer has completed payment?
        </h1>
        <div className='flex justify-center gap-4 mt-5'>
          <HomeButton
            title='Cancel'
            onClick={closeModal}
            color='white'
            bg='blue'
            width='100%'
          />
          <HomeButton
            title={loading ? 'Updating...' : 'Paid'}
            onClick={handleSubmit}
            color='white'
            bg='green'
            width='100%'
          />
        </div>
      </ReusableModal>
    </MainStaffDashboard>
  );
};

export default StaffCreditNote;
