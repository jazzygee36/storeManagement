'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DropdownMenu from '@/components/common/dropdown-menu';
import ReusableModal from '@/components/common/modal';
import { LocalProductItem, ProductItem } from '@/components/utils/interface';
import HomeInput from '@/components/common/input';
import HomeButton from '@/components/common/button';
import { useDispatch } from 'react-redux';
import { RootState } from '@/components/state/store';
import { updateProduct } from '@/components/api/slices/updateProductSlice';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { fetchUserProfile } from '@/components/api/slices/userProfileSlice';
import { useToast } from '@/components/hook/context/useContext';

type Status = 'Out-of-stock' | 'In-stock' | 'Low';

const STATUS_COLORS: Record<Status, string> = {
  'Out-of-stock': 'red',
  'In-stock': 'green',
  Low: 'orange',
};

interface Props {
  currentPage: number;
  productItems: ProductItem[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const Products = ({
  currentPage,
  productItems,
  setCurrentPage,
  totalPages,
}: Props) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  // const { loading, success, error } = useSelector(
  //   (state: RootState) => state.updateProducts
  // );
  const { addToast } = useToast();
  const showToast = () => {
    addToast(' Product Updated', 'success');
  };
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<LocalProductItem | null>(null);

  // const openModal = (transaction: LocalProductItem) => {
  //   setSelectedTransaction(transaction);
  //   setIsModalOpen(true);
  // };
  const openModal = (transaction: LocalProductItem, isEdit = false) => {
    setSelectedTransaction(transaction);
    if (isEdit) {
      setIsEditModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
    setIsEditModalOpen(false); // Close the edit modal explicitly
  };

  const formatNumber = (num: number): string =>
    new Intl.NumberFormat().format(num);

  const handleProductClick = (
    productId: string,
    localProduct: LocalProductItem
  ) => {
    // dispatch(setSelectedProductId(productId));
    openModal(localProduct);
  };

  const mapProductToLocal = (product: ProductItem): LocalProductItem => ({
    product: product.productName,
    buyingPrice: product.unitPrice,
    qty: product.qtyBought,
    sellingPrice: product.salesPrice,
    exp: product.exp,
    purchaseAmt: product.unitPrice * product.qtyBought,
    amtGain:
      product.salesPrice * product.qtyBought -
      product.unitPrice * product.qtyBought,
    status: product.availability,
    availability: product.availability,
    // remainingItems: product.qtyRemaning,
    qtyRemaining: product.qtyRemaining,
    productId: product._id || '',
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }
  }, [dispatch]);

  const handleEditProductUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!selectedTransaction) return;

    const productId = selectedTransaction?.productId; // Replace with actual ID
    const productData = {
      productName: selectedTransaction.product,
      unitPrice: selectedTransaction.buyingPrice,
      qtyBought: selectedTransaction.qty,
      salesPrice: selectedTransaction.sellingPrice,
      qtyRemaining: selectedTransaction.qtyRemaining,
      exp: selectedTransaction.exp || undefined,
    };

    const userId = localStorage.getItem('userId');
    if (userId) {
      // Dispatch actions and await their results
      const productUpdate = await dispatch(
        updateProduct({ productId, productData })
      );
      const userProfileUpdate = await dispatch(fetchUserProfile(userId));

      // Wait for both updates to complete
      const [productUpdateResult, userProfileUpdateResult] = await Promise.all([
        productUpdate,
        userProfileUpdate,
      ]);

      // Check if both updates were successful before showing the toast
      if (productUpdateResult && userProfileUpdateResult) {
        showToast();
      }
      setLoading(false);
    }

    closeModal();
  };

  return (
    <>
      <div className='overflow-x-auto mt-5 pb-14'>
        <table className='min-w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-black text-white'>
              {[
                'Products',
                'Buying Price (per 1)',
                'Qty Bought',
                'Total Value',
                'Selling Price (1)',
                'Qty Remaining',
                'Expire Date',
                'Availability',
                'Action',
              ].map((header) => (
                <th
                  key={header}
                  className='border border-gray-300 px-4 py-2 text-left text-sm font-bold'
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productItems.map((product, index) => {
              const localProduct = mapProductToLocal(product);
              const goodsValue = localProduct.purchaseAmt;
              const statusColor = STATUS_COLORS[localProduct.status as Status];

              return (
                <tr
                  key={index}
                  onClick={() =>
                    product._id && handleProductClick(product._id, localProduct)
                  }
                  className='even:bg-gray-50 cursor-pointer'
                >
                  <td className='capitalize border border-gray-200 px-4 py-2 text-sm font-semibold bg-blue-800 text-white'>
                    {product.productName}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {formatNumber(product.unitPrice)}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {product.qtyBought}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm bg-blue text-white bg-blue-500 font-bold'>
                    {formatNumber(goodsValue)}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm bg-gray-500 text-white font-bold'>
                    {formatNumber(product.salesPrice)}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {product.qtyRemaining}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {product.exp
                      ? format(new Date(product.exp), 'dd MMM yyyy')
                      : ''}
                  </td>
                  <td
                    className='border border-gray-200 px-4 py-2 text-sm '
                    style={{ color: statusColor }}
                  >
                    {product.availability}
                  </td>
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className='border border-gray-200 px-4 py-2 text-sm relative overflow-visible'
                  >
                    <DropdownMenu
                      productId={product._id || ''}
                      product={localProduct} // Pass the current product
                      openEditModal={() => openModal(localProduct, true)} // Callback for editing
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className='flex justify-between items-center mt-5 my-5'>
        <HomeButton
          className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50'
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          title=' Previous'
          color={'grey'}
        />

        <p className='text-sm'>
          Page {currentPage} of {totalPages}
        </p>
        <HomeButton
          className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50'
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          title=' Next'
          color={'grey'}
        />
      </div>

      <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        {selectedTransaction ? (
          <div>
            <h2 className='text-lg font-medium mb-5 text-blue-950'>
              Product Details
            </h2>
            {[
              'Product',
              'Buying Price',
              'Quantity',
              'Selling Price',
              'Purchase Amount',
              'Expected Gain',
              'Status',
            ].map((label, idx) => (
              <div key={idx}>
                <div className='flex justify-between text-sm'>
                  <p>{label}:</p>
                  <p
                    className='font-semibold'
                    style={
                      label === 'Status'
                        ? {
                            color:
                              STATUS_COLORS[
                                selectedTransaction.status as Status
                              ],
                          }
                        : undefined
                    }
                  >
                    {(() => {
                      switch (label) {
                        case 'Product':
                          return selectedTransaction.product;
                        case 'Buying Price':
                          return formatNumber(selectedTransaction.buyingPrice);
                        case 'Quantity':
                          return selectedTransaction.qty;
                        case 'Selling Price':
                          return formatNumber(selectedTransaction.sellingPrice);
                        case 'Purchase Amount':
                          return formatNumber(selectedTransaction.purchaseAmt);
                        case 'Expected Gain':
                          return formatNumber(selectedTransaction.amtGain);
                        case 'Status':
                          return selectedTransaction.availability;
                      }
                    })()}
                  </p>
                </div>
                {/* Add an <hr /> after each item except the last one */}
                {idx < 6 && <hr className='my-3 border-gray-300' />}
              </div>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </ReusableModal>

      <ReusableModal isOpen={isEditModalOpen} onClose={closeModal}>
        <form onSubmit={handleEditProductUpdate}>
          <h2 className='text-lg font-bold mb-4 text-center'>Edit Product</h2>
          {selectedTransaction && (
            <div className='space-y-4'>
              <div className='flex justify-between gap-3'>
                <HomeInput
                  type='text'
                  label='  Product Name'
                  // className='w-full border rounded px-3 py-2'
                  defaultValue={selectedTransaction.product}
                  onChange={(e) =>
                    setSelectedTransaction((prev) =>
                      prev ? { ...prev, productName: e.target.value } : null
                    )
                  }
                />
                <HomeInput
                  type='text'
                  label=' Buying Price'
                  // className='w-full border rounded px-3 py-2'
                  defaultValue={selectedTransaction.buyingPrice}
                  onKeyPress={(
                    event: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    if (!/[0-9 +]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(e) =>
                    setSelectedTransaction((prev) =>
                      prev
                        ? {
                            ...prev,
                            buyingPrice: parseFloat(e.target.value) || 0,
                          }
                        : null
                    )
                  }
                />
              </div>

              <div className='flex justify-between gap-3'>
                <HomeInput
                  type='text'
                  label='Quantity Bought'
                  // className='w-full border rounded px-3 py-2'
                  defaultValue={selectedTransaction.qty}
                  onKeyPress={(
                    event: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    if (!/[0-9 +]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(e) =>
                    setSelectedTransaction((prev) =>
                      prev
                        ? { ...prev, qty: parseInt(e.target.value, 10) || 0 }
                        : null
                    )
                  }
                />
                <HomeInput
                  type='text'
                  label=' QtyRemaining'
                  // className='w-full border rounded px-3 py-2'
                  defaultValue={selectedTransaction.qtyRemaining}
                  onKeyPress={(
                    event: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    if (!/[0-9 +]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(e) =>
                    setSelectedTransaction((prev) =>
                      prev
                        ? {
                            ...prev,
                            qtyRemaining: parseFloat(e.target.value) || 0,
                          }
                        : null
                    )
                  }
                />
              </div>
              {/* <div className='flex justify-between gap-3'> */}
              <div className='flex justify-between gap-3'>
                <HomeInput
                  type='text'
                  label='Selling Price'
                  // className='w-full border rounded px-3 py-2'
                  defaultValue={selectedTransaction.sellingPrice}
                  onKeyPress={(
                    event: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    if (!/[0-9 +]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(e) =>
                    setSelectedTransaction((prev) =>
                      prev
                        ? {
                            ...prev,
                            sellingPrice: parseFloat(e.target.value) || 0,
                          }
                        : null
                    )
                  }
                />
                <HomeInput
                  type='date'
                  label='Expired (Optional)'
                  // className='w-full border rounded px-3 py-2'
                  defaultValue={selectedTransaction.exp || ''}
                />
              </div>
            </div>
          )}
          <div className='mt-6 flex justify-center gap-4'>
            <HomeButton
              type='button'
              onClick={closeModal}
              title={' Cancel'}
              color={'white'} // className='px-4 py-2 bg-gray-500 text-white rounded'
            />

            <HomeButton
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded'
              title={loading ? 'Updating...' : ' Save Changes'}
              color={'white'}
            />
          </div>
        </form>
      </ReusableModal>
    </>
  );
};

export default Products;
