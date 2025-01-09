'use client';
import DropdownMenu from '@/components/common/dropdown-menu';
import ReusableModal from '@/components/common/modal';
import { LocalProductItem, ProductItem } from '@/components/utils/interface';
import { Dispatch, SetStateAction, useState } from 'react';
import { format } from 'date-fns';

type Status = 'Out-of-stock' | 'In-stock' | 'Low';

const color: Record<Status, string> = {
  'Out-of-stock': 'red',
  'In-stock': 'green',
  Low: 'orange',
};

interface Props {
  currentPage: number;
  productItems: ProductItem[];
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

const Products = ({
  currentPage,
  productItems,
  setCurrentPage,
  totalPages,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<LocalProductItem | null>(null);

  // Open modal and set selected transaction
  const openModal = (transaction: LocalProductItem) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <>
      <div className='overflow-x-auto mt-5'>
        <table className='min-w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-black text-white'>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm  text-white font-bold'>
                Products
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Buying Price(per 1)
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm bg-black text-white'>
                Qty Bought
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm text-white'>
                Goods Value
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm '>
                Selling Price(1)
              </th>
              {/* <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Qty Sold
              </th> */}

              {/* <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Sales Value
              </th> */}
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Qty Remaining
              </th>

              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Expire Date
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Availability
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {productItems.map((product: ProductItem, index) => {
              const localProduct: LocalProductItem = {
                product: product.productName, // Map 'productName' to 'product'
                buyingPrice: product.unitPrice, // Assuming unitPrice is the buying price
                qty: product.qtyBought, // Map 'qtyBought' to 'qty'
                sellingPrice: product.salesPrice, // Assuming salesPrice is selling price
                exp: product.exp, // Expiration date
                purchaseAmt: product.unitPrice * product.qtyBought, // Calculate purchase amount
                amtGain:
                  product.salesPrice * product.qtyBought -
                  product.unitPrice * product.qtyBought, // Calculate gain
                status: product.availability,
                availability: product.availability,
                remainingItems: product.remainingItems,
              };
              const goodsValue = product.unitPrice * product.qtyBought; // Calculate goods value dynamically

              return (
                <tr
                  key={index}
                  onClick={() => {
                    openModal(localProduct);
                  }}
                  className='even:bg-gray-50 cursor-pointer'
                >
                  <td className='border border-gray-200 px-4 py-2 text-sm font-semibold bg-blue-800 text-white'>
                    {product.productName}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {formatNumber(product.unitPrice)}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {product.qtyBought}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm bg-[blue] text-white font-bold'>
                    {formatNumber(goodsValue)} {/* Display goods value */}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm bg-gray-500'>
                    {formatNumber(product.salesPrice)}
                  </td>
                  {/* <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {product.qtySold}
                  </td> */}

                  {/* <td className='border border-gray-200 px-4 py-2 text-sm text-green-600'>
                    {formatNumber(product.salesPrice * product.qtySold)}{' '}
                  
                  </td> */}
                  <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {product.qtyBought}
                  </td>
                  <td className='border border-gray-200 px-4 py-2 text-sm'>
                    {product.exp
                      ? format(new Date(product.exp), 'dd MMM yyyy')
                      : ''}
                  </td>
                  <td
                    className={`border border-gray-200 px-4 py-2 text-sm`}
                    style={{ color: color[product.availability as Status] }}
                  >
                    {product.remainingItems < 4
                      ? 'Low'
                      : product.remainingItems === 0
                      ? 'Out-of-stock'
                      : 'In-stock'}
                  </td>
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className='border border-gray-200 px-4 py-2 text-sm'
                  >
                    <DropdownMenu />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className='flex justify-between items-center mt-5 mb-3'>
        <button
          className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50'
          onClick={() =>
            setCurrentPage((prev: number) => Math.max(prev - 1, 1))
          }
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
            setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))
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
            <div className='flex justify-between text-sm '>
              <p>Product:</p>
              <p className='font-semibold'>{selectedTransaction.product}</p>
            </div>
            <hr className='my-3' />

            <div className='flex justify-between text-sm'>
              <p>Buying Price:</p>
              <p className='font-semibold'>{selectedTransaction.buyingPrice}</p>
            </div>
            <hr className='my-3' />

            <div className='flex justify-between text-sm'>
              <p>Quantity:</p>
              <p className='font-semibold'>{selectedTransaction.qty}</p>
            </div>
            <hr className='my-3' />

            <div className='flex justify-between text-sm'>
              <p>Selling Price:</p>
              <p className='font-semibold'>
                {selectedTransaction.sellingPrice}
              </p>
            </div>
            <hr className='my-3' />

            {/* <div className='flex justify-between text-sm'>
              <p>Expired At:</p>
              <p className='font-semibold'>{selectedTransaction.exp}</p>
            </div> */}
            <hr className='my-3' />
            <div className='flex justify-between text-sm'>
              <p>Purchase Amount:</p>
              <p className='font-semibold'>{selectedTransaction.purchaseAmt}</p>
            </div>
            <hr className='my-3' />
            <div className='flex justify-between text-sm'>
              <p>Expected Gain:</p>
              <p className='font-semibold'>{selectedTransaction.amtGain}</p>
            </div>
            <hr className='my-3' />

            <div className='flex justify-between text-sm'>
              <p>Status:</p>
              <span
                className='font-semibold'
                style={{ color: color[selectedTransaction.status as Status] }}
              >
                {selectedTransaction.remainingItems < 4
                  ? 'Low'
                  : selectedTransaction.remainingItems === 0
                  ? 'Out-of-stock'
                  : 'In-stock'}
              </span>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </ReusableModal>
    </>
  );
};

export default Products;
