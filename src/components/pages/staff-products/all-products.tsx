'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchStaffProducts } from '@/components/api/slices/staffProductsSlice';
import { AppDispatch, RootState } from '@/components/state/store';
import HomeButton from '@/components/common/button';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Status = 'Out-of-stock' | 'In-stock' | 'Low';

const STATUS_COLORS: Record<Status, string> = {
  'Out-of-stock': 'red',
  'In-stock': 'green',
  Low: 'orange',
};

const StaffProducts = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.staffProduct
  );

  const formatNumber = (num: number): string =>
    new Intl.NumberFormat().format(num);

  useEffect(() => {
    const staffId = localStorage.getItem('staffId');
    if (staffId) {
      dispatch(fetchStaffProducts(staffId));
    }
  }, [dispatch]);

  return (
    <>
      <div className='overflow-x-auto mt-5'>
        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-lg font-semibold '>Staff Products</h2>
          <div>
            <HomeButton
              title={'Sell Product'}
              color={'white'}
              onClick={() => router.push('/staff-sales')}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : products.length > 0 ? (
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow className='bg-gray-100 '>
              <TableHead className='text-black font-bold uppercase'>
                {' '}
                Item Name
              </TableHead>
              <TableHead className='text-black font-bold uppercase text-center'>
                Qty Stock
              </TableHead>
              <TableHead className='text-black font-bold uppercase text-center'>
                Selling Price
              </TableHead>
              <TableHead className='text-black font-bold uppercase text-center'>
                Qty Remaining
              </TableHead>
              <TableHead className='text-black font-bold uppercase'>
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const statusColor =
                STATUS_COLORS[product.availability as Status] || 'gray';

              return (
                <TableRow key={product._id}>
                  <TableCell className='font-medium'>
                    {product.productName}
                  </TableCell>
                  <TableCell className='text-center'>
                    {product.qtyBought}
                  </TableCell>
                  <TableCell className='text-center'>
                    {' '}
                    {formatNumber(product.salesPrice)}
                  </TableCell>
                  <TableCell className='text-center'>
                    {product.qtyRemaining}
                  </TableCell>
                  <TableCell className='' style={{ color: statusColor }}>
                    {product.availability || 'unknown'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <p className='text-gray-500'>No products attached to this staff.</p>
      )}
    </>
  );
};

export default StaffProducts;
