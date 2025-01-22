'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import DropdownMenu from '@/components/common/dropdown-menu';
import ReusableModal from '@/components/common/modal';
import { LocalProductItem, ProductItem } from '@/components/utils/interface';
import HomeInput from '@/components/common/input';
import HomeButton from '@/components/common/button';

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
    isEdit ? setIsEditModalOpen(true) : setIsModalOpen(true);
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
  });

  return (
    <>
      <div className='overflow-x-auto mt-5'>
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
                    className='border border-gray-200 px-4 py-2 text-sm'
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

      <div className='flex justify-between items-center mt-5 mb-3'>
        <button
          className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50'
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <p className='text-sm'>
          Page {currentPage} of {totalPages}
        </p>
        <button
          className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50'
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Handle save logic here
          }}
        >
          <h2 className='text-lg font-bold mb-4 text-center'>Edit Product</h2>
          {selectedTransaction && (
            <div className='space-y-4'>
              <HomeInput
                type='text'
                label='  Product Name'
                // className='w-full border rounded px-3 py-2'
                defaultValue={selectedTransaction.product}
              />
              <div className='flex justify-between gap-3'>
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
                />
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
                />
                <HomeInput
                  type='date'
                  label='Expired (Optional)'
                  // className='w-full border rounded px-3 py-2'
                  defaultValue={selectedTransaction.sellingPrice}
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
              title={' Save Changes'}
              color={'white'}
            />
          </div>
        </form>
      </ReusableModal>
    </>
  );
};

export default Products;
