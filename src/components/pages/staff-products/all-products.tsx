import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchStaffProducts } from '@/components/api/slices/staffProductsSlice';
import { AppDispatch, RootState } from '@/components/state/store';
import HomeButton from '@/components/common/button';
import { useRouter } from 'next/navigation';

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
    <div className='overflow-x-auto mt-5'>
      <div className='flex justify-between items-center mb-5'>
        <h2 className='text-lg font-semibold '>Staff Products</h2>
        <div>
          <HomeButton
            title={'Sell Product'}
            bg={'orange'}
            color={'white'}
            onClick={() => router.push('/staff-sales')}
          />
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : products.length > 0 ? (
        <table className='min-w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Item Name
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Qty Stock
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Selling Price
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Qty Remaining
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const statusColor =
                STATUS_COLORS[product.availability as Status] || 'gray';

              return (
                <tr
                  key={product._id}
                  className='even:bg-gray-50 hover:bg-gray-100 cursor-pointer capitalize'
                >
                  <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {product.productName}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {product.qtyBought}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {formatNumber(product.salesPrice)}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {product.qtyRemaining}
                  </td>
                  <td
                    className='border border-gray-200 px-4 py-2 text-sm'
                    style={{ color: statusColor }}
                  >
                    {product.availability || 'Unknown'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className='text-gray-500'>No products attached to this staff.</p>
      )}
    </div>
  );
};

export default StaffProducts;
