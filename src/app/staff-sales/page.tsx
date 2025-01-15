'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaffProducts } from '@/components/api/slices/staffProductsSlice';
import HomeButton from '@/components/common/button';
import HomeInput from '@/components/common/input';
import Loading from '@/components/common/loadingState';
import PaperBackground from '@/components/common/paper-bg';
import MainStaffDashboard from '@/components/common/staff-dashboard/main-staff-dashboard';
import useAuth from '@/components/hook/useAuth';
import { AppDispatch, RootState } from '@/components/state/store';
import { salesSchema } from '@/components/utils/validation';
import { z } from 'zod';

type FormData = z.infer<typeof salesSchema>;

const StaffSellProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.staffProduct
  );

  const isAuthenticated = useAuth();

  const [data, setData] = useState<FormData>({
    productName: '',
    unitPrice: '',
    qtyBuy: '',
    totalPrice: '',
  });

  const [sales, setSales] = useState<FormData[]>([]); // Array to hold sales data
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatNumber = (num: number): string =>
    new Intl.NumberFormat().format(num);

  useEffect(() => {
    const staffId = localStorage.getItem('staffId');
    if (staffId) {
      dispatch(fetchStaffProducts(staffId));
    }
  }, [dispatch]);

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProduct = products.find(
      (product) => product.productName === e.target.value
    );

    if (selectedProduct) {
      setData({
        productName: selectedProduct.productName,
        unitPrice: selectedProduct.unitPrice.toString(),
        qtyBuy: '',
        totalPrice: '',
      });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = e.target.value;
    const unitPrice = parseFloat(data.unitPrice || '0');
    const quantity = parseFloat(qty || '0');

    setData((prevData) => ({
      ...prevData,
      qtyBuy: qty,
      totalPrice: qty ? formatNumber(unitPrice * quantity) : '',
    }));
  };

  const handleSubmitSales = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = salesSchema.safeParse(data);

    if (!result.success) {
      const validationErrors = result.error.format();
      setErrors({
        productName: validationErrors.productName?._errors[0] || '',
        qtyBuy: validationErrors.qtyBuy?._errors[0] || '',
      });
      return;
    }

    // Add current data to the sales array
    setSales((prevSales) => [...prevSales, data]);

    // Reset the form
    setData({
      productName: '',
      unitPrice: '',
      qtyBuy: '',
      totalPrice: '',
    });
    setErrors({});
  };

  // Calculate the grand total
  const grandTotal = sales.reduce((total, sale) => {
    const totalPrice = parseFloat(sale.totalPrice.replace(/,/g, '')) || 0;
    return total + totalPrice;
  }, 0);

  return (
    <MainStaffDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <PaperBackground title={''}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <form
              onSubmit={handleSubmitSales}
              className='md:w-[60%] w-full m-auto border border-gray-300 p-5 rounded-lg bg-gray-200'
            >
              <div>
                <label className='text-sm'>Product Name</label>
                <select
                  name='productName'
                  value={data.productName}
                  onChange={handleProductSelect}
                  className=' px-2 border border-gray-300 h-[44px] rounded-md w-full capitalize focus:outline-none'
                >
                  <option value=''>Select Product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product.productName}>
                      {product.productName}
                    </option>
                  ))}
                </select>
                {errors.productName && (
                  <p className='text-red-500 text-[13px]'>
                    {errors.productName}
                  </p>
                )}
              </div>
              <div className='my-2'>
                <HomeInput
                  placeholder='Enter quantity'
                  name='qtyBuy'
                  value={data.qtyBuy}
                  onChange={handleQuantityChange}
                  label='Quantity'
                />
                {errors.qtyBuy && (
                  <p className='text-red-500 text-[13px]'>{errors.qtyBuy}</p>
                )}
              </div>
              <div className='my-2'>
                <HomeInput
                  name='unitPrice'
                  value={data.unitPrice}
                  readOnly={true}
                  placeholder={'Selling Price'}
                  label='Selling Price'
                />
              </div>
              <div className='my-2'>
                <HomeInput
                  label='Total Price'
                  name='totalPrice'
                  value={data.totalPrice}
                  readOnly
                  placeholder={'Total Price'}
                />
              </div>
              <div className='w-[50%] md:w-[100%] mt-5 m-auto'>
                <HomeButton
                  title={'Add to Sales'}
                  bg={'blue'}
                  color={'white'}
                  type='submit'
                />
              </div>
            </form>
            <div>
              <table className='min-w-full'>
                <thead>
                  <tr className='bg-gray-100'>
                    <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                      Item Name
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                      Selling Price
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                      Quantity
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                      Total Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale, index) => (
                    <tr
                      key={index}
                      className='bg-white rounded-lg shadow-md cursor-pointer my-2'
                    >
                      <td className='px-4 py-2 text-sm capitalize'>
                        {sale.productName}
                      </td>
                      <td className='px-4 py-2 text-sm'>
                        {formatNumber(parseFloat(sale.unitPrice))}
                      </td>
                      <td className='px-4 py-2 text-sm'>{sale.qtyBuy}</td>
                      <td className='px-4 py-2 text-sm flex items-center justify-between'>
                        <div>{sale.totalPrice}</div>
                        <h2
                          className='text-[red] font-semibold'
                          onClick={() => {
                            setSales((prevSales) =>
                              prevSales.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          X
                        </h2>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='flex justify-around items-center mt-4'>
                <h2 className='font-semibold'>Grand Total</h2>
                <div className='font-bold underline'>
                  N{formatNumber(grandTotal)}
                </div>
              </div>
              <div className='w-[50%] md:w-[40%] mt-5 m-auto'>
                <HomeButton
                  title={'Complete Sales'}
                  bg={'blue'}
                  color={'white'}
                  type='submit'
                />
              </div>
            </div>
          </div>
        </PaperBackground>
      )}
    </MainStaffDashboard>
  );
};

export default StaffSellProduct;
