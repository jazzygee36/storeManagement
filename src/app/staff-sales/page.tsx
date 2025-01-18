'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaffProducts } from '@/components/api/slices/staffProductsSlice';
import HomeButton from '@/components/common/button';
import HomeInput from '@/components/common/input';
import Loading from '@/components/common/loadingState';
import MainStaffDashboard from '@/components/common/staff-dashboard/main-staff-dashboard';
import useAuth from '@/components/hook/useAuth';
import { AppDispatch, RootState } from '@/components/state/store';
import { salesSchema } from '@/components/utils/validation';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { addSale } from '@/components/api/slices/salesSlice';
import { useToast } from '@/components/hook/context/useContext';

type FormData = z.infer<typeof salesSchema>;

const StaffSellProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();
  const { products } = useSelector((state: RootState) => state.staffProduct);
  const isAuthenticated = useAuth();

  const [data, setData] = useState<FormData & { paymentMethod?: string }>({
    productName: '',
    sellingPrice: '',
    qtyBuy: '',
    totalPrice: '',
    paymentMethod: '',
  });

  const [currentSales, setCurrentSales] = useState<FormData[]>([]);

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
        sellingPrice: selectedProduct.salesPrice.toString(),
        qtyBuy: '',
        totalPrice: '',
      });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = e.target.value;
    const sellingPrice = parseFloat(data.sellingPrice || '0');
    const quantity = parseFloat(qty || '0');

    setData((prevData) => ({
      ...prevData,
      qtyBuy: qty,
      totalPrice: qty ? formatNumber(sellingPrice * quantity) : '',
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

    setCurrentSales((prevSales) => [...prevSales, data]);

    setData({
      productName: '',
      sellingPrice: '',
      qtyBuy: '',
      totalPrice: '',
    });
    setErrors({});
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setData((prevData) => ({
      ...prevData,
      paymentMethod: e.target.value,
    }));
  };

  const grandTotal = currentSales.reduce((total, sale) => {
    const totalPrice = parseFloat(sale.totalPrice.replace(/,/g, '')) || 0;
    return total + totalPrice;
  }, 0);

  const handleSales = () => {
    const staffId = localStorage.getItem('staffId') || '';

    if (!staffId) {
      console.error('Staff ID is missing');
      return;
    }

    if (!data.paymentMethod) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        paymentMethod: 'Select a payment method',
      }));
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      paymentMethod: '',
    }));

    if (currentSales.length === 0) {
      return;
    }

    const salesData = currentSales.map((sale) => {
      const selectedProduct = products.find(
        (product) => product.productName === sale.productName
      );

      if (!selectedProduct) {
        return null; // Skip the sale if the product is not found
      }

      return {
        productId: selectedProduct._id,
        sellingPrice: parseFloat(sale.sellingPrice.replace(/,/g, '')),
        qtySold: parseInt(sale.qtyBuy, 10),
        totalPrice: parseFloat(sale.totalPrice.replace(/,/g, '')),
        paymentMethod: data.paymentMethod,
        date: new Date().toISOString(),
      };
    });

    const validSales = salesData.filter((sale) => sale !== null);

    if (validSales.length === 0) {
      console.warn('No valid sales to process');
      return;
    }

    dispatch(
      addSale({
        sales: validSales,
        staffId,
        showToast: () => addToast('Sale recorded successfully', 'success'),
      })
    );

    setCurrentSales([]);
  };

  return (
    <MainStaffDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <Card className='w-full md:w-[60%] m-auto py-5'>
            <CardContent>
              <form onSubmit={handleSubmitSales}>
                <div>
                  <label className='text-sm'>Product Name</label>
                  <select
                    name='productName'
                    value={data.productName}
                    onChange={handleProductSelect}
                    className='px-2 border border-gray-300 h-[44px] rounded-md w-full capitalize focus:outline-none'
                  >
                    <option value=''>Select Product</option>
                    {products
                      .filter(
                        (product) =>
                          product.availability === 'In-stock' ||
                          product.availability === 'Low'
                      ) // Filter products to only show those in stock
                      .map((product) => (
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

                <div className='my-5'>
                  <HomeInput
                    placeholder=''
                    name='qtyBuy'
                    value={data.qtyBuy}
                    onChange={handleQuantityChange}
                    label='Quantity'
                  />
                  {errors.qtyBuy && (
                    <p className='text-red-500 text-[13px]'>{errors.qtyBuy}</p>
                  )}
                </div>
                <div className='my-5'>
                  <HomeInput
                    name='sellingPrice'
                    value={data.sellingPrice}
                    readOnly={true}
                    label='Selling Price'
                  />
                </div>
                <div className='my-5'>
                  <HomeInput
                    label='Total Price'
                    name='totalPrice'
                    value={data.totalPrice}
                    readOnly
                  />
                </div>
                <div className='w-[100%] mt-5 m-auto'>
                  <HomeButton
                    title={'Add to Sales'}
                    color={'white'}
                    type='submit'
                    className='w-[100%] mt-5 m-auto'
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <div>
            <table className='w-full'>
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
                {currentSales.map((sale, index) => (
                  <tr
                    key={index}
                    className='bg-white rounded-lg shadow-md cursor-pointer my-2'
                  >
                    <td className='px-4 py-2 text-sm capitalize'>
                      {sale.productName}
                    </td>
                    <td className='px-4 py-2 text-sm'>
                      {formatNumber(parseFloat(sale.sellingPrice))}
                    </td>
                    <td className='px-4 py-2 text-sm'>{sale.qtyBuy}</td>
                    <td className='px-4 py-2 text-sm flex items-center justify-between'>
                      <div>{sale.totalPrice}</div>
                      <h2
                        className='text-[red] font-semibold'
                        onClick={() => {
                          setCurrentSales((prevSales) =>
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

            {currentSales.length > 0 && (
              <>
                <div className='flex items-center justify-around gap-5 my-3'>
                  <h2>Payment Method</h2>
                  <div>
                    <select
                      value={data.paymentMethod || ''} // Default to 'Cash'
                      onChange={handlePaymentMethodChange}
                      className='h-[44px] border boder-gray-200 outline-none rounded-md px-2'
                    >
                      <option value=''>Select</option>

                      <option value='Cash'>Cash</option>
                      <option value='Transfer'>Transfer</option>
                      <option value='POS'>POS</option>
                      <option value='Cash & POS'>Cash & POS</option>
                      <option value='Cash & Transfer'>Cash & Transfer</option>
                    </select>
                    {errors.paymentMethod && (
                      <p className='text-red-500 text-[13px]'>
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>
                </div>
                <div className='flex justify-around items-center'>
                  <h2 className='font-semibold'>Grand Total</h2>
                  <div className='font-bold underline'>
                    N{formatNumber(grandTotal)}
                  </div>
                </div>

                <div className='w-[50%] md:w-[40%] mt-5 m-auto'>
                  <HomeButton
                    title={'Complete Sales'}
                    color={'white'}
                    type='button'
                    onClick={handleSales}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </MainStaffDashboard>
  );
};

export default StaffSellProduct;
