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
  const [loading, setLoading] = useState(false);
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
    const selectedProduct = products.find(
      (product) => product.productName === data.productName
    );

    if (
      selectedProduct &&
      quantity > parseFloat(selectedProduct.qtyRemaining)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        qtyBuy: `Quantity exceeds available stock (${selectedProduct.qtyRemaining}).`,
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, qtyBuy: '' }));
    }

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

  const handleSales = async () => {
    const staffId = localStorage.getItem('staffId') || '';

    if (!staffId) {
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

    const salesData = currentSales
      .map((sale) => {
        const selectedProduct = products.find(
          (product) => product.productName === sale.productName
        );

        if (!selectedProduct) return null; // Skip invalid sales

        return {
          productId: selectedProduct._id,
          sellingPrice: parseFloat(sale.sellingPrice.replace(/,/g, '')),
          qtySold: parseInt(sale.qtyBuy, 10),
          totalPrice: parseFloat(sale.totalPrice.replace(/,/g, '')),
          paymentMethod: data.paymentMethod,
          date: new Date().toISOString(),
        };
      })
      .filter((sale) => sale !== null); // Remove null values

    if (salesData.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const response = await dispatch(
        addSale({
          sales: salesData,
          staffId,
          showToast: () => addToast('Sale recorded successfully', 'success'),
        })
      ).unwrap(); // `unwrap` ensures we get the action payload

      if (response.length > 0) {
        addToast('Sale recorded successfully', 'success');
        setCurrentSales([]); // Clear sales only if successful
      } else {
        addToast('Sale failed. Please try again.', 'error');
      }
    } catch {
      addToast('Sale failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSale = (index: number) => {
    setCurrentSales((prevSales) =>
      prevSales.filter((_, saleIndex) => saleIndex !== index)
    );
  };

  return (
    <MainStaffDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <Card className='w-[95%] md:w-[60%] m-auto py-5'>
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
                      )
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
                    onKeyPress={(
                      event: React.KeyboardEvent<HTMLInputElement>
                    ) => {
                      if (!/[0-9 +]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
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
                    className='w-[100%] mt-5 m-auto bg-purple-600'
                    disabled={
                      !data.productName ||
                      !data.qtyBuy ||
                      !!errors.qtyBuy ||
                      parseFloat(data.qtyBuy || '0') === 0
                    }
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
              {currentSales.length > 0 && (
                <>
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
                          <div>{sale.totalPrice}</div>{' '}
                          <span
                            className='text-red-600 text-bold'
                            onClick={() => handleRemoveSale(index)}
                          >
                            {' '}
                            X
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className='mt-5'>
                      <td
                        colSpan={3}
                        className='px-4 py-2 text-lg font-bold text-center'
                      >
                        Grand Total:
                      </td>
                      <td className='px-4 py-2 text-lg font-bold text-left'>
                        {formatNumber(grandTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </>
              )}
            </table>
            {currentSales.length > 0 && (
              <>
                <div className='mt-5 flex justify-around items-center'>
                  <label className='text-sm'>Payment Method</label>
                  <div>
                    <select
                      name='paymentMethod'
                      value={data.paymentMethod}
                      onChange={handlePaymentMethodChange}
                      className='px-2 border border-gray-300 h-[44px] rounded-md w-[100%] capitalize focus:outline-none'
                    >
                      <option value=''>Select Payment Method</option>
                      <option value='Cash'>Cash</option>
                      <option value='POS'>POS</option>
                      <option value='Transfer'>Transfer</option>
                    </select>
                    {errors.paymentMethod && (
                      <p className='text-red-500 text-[13px]'>
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>
                </div>
                <div className='w-[50%] mt-5 m-auto'>
                  <HomeButton
                    title={loading ? 'Processing...' : 'Complete Sales'}
                    color={'white'}
                    onClick={handleSales}
                    className='w-[100%] mt-5 m-auto bg-green-600'
                    disabled={loading}
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
