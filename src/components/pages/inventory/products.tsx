'use client';
import DropdownMenu from '@/components/common/dropdown-menu';
import ReusableModal from '@/components/common/modal';
import { ProductProps } from '@/components/utils/interface';
import { Dispatch, SetStateAction, useState } from 'react';

type Status = 'Out-of-stock' | 'In-stock' | 'Low';

const color: Record<Status, string> = {
  'Out-of-stock': 'red',
  'In-stock': 'green',
  Low: 'orange',
};

const ProductStatusColor = {
  'Out-of-stock': 'red',
  'In-stock': 'green',
  Low: 'orange',
};

interface ProductItem {
  product: string;
  buyingPrice: string;
  qty: string;
  sellingPrice: string;
  exp: string;
  status: string;
  purchaseAmt: string;
  amtGain: string;
  qtyRemaning: string;
}

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
    useState<ProductProps | null>(null);

  // Open modal and set selected transaction
  const openModal = (transaction: ProductProps) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className='overflow-x-auto mt-5'>
        <table className='min-w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Products
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Unit Price(1)
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Qty Bought
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Goods Value
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Sales Price(1)
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Qty Sold
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Sales Value
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Remaining Items
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
            {productItems.map((product: any, index: any) => (
              <tr
                key={index}
                onClick={() => {
                  openModal(product);
                }}
                className='even:bg-gray-50 cursor-pointer'
              >
                <td className='border border-gray-200 px-4 py-2 text-sm'>
                  {product.product}
                </td>
                <td className='border border-gray-200 px-4 py-2 text-sm'>
                  {product.buyingPrice}
                </td>
                <td className='border border-gray-200 px-4 py-2 text-sm'>
                  {product.qty}
                </td>
                <td className='border border-gray-200 px-4 py-2 text-sm'>
                  {product.sellingPrice}
                </td>
                <td className='border border-gray-200 px-4 py-2 text-sm'>
                  {product.qtyRemaning}
                </td>
                <td className='border border-gray-200 px-4 py-2 text-sm'>
                  {product.qtyRemaning}
                </td>
                <td className='border border-gray-200 px-4 py-2 text-sm'>
                  {product.qtyRemaning}
                </td>
                <td className='border border-gray-200 px-4 py-2 text-sm'>
                  {product.qtyRemaning}
                </td>
                <td className='border border-gray-200 px-4 py-2 text-sm'>
                  {product.exp}
                </td>
                <td
                  className={`border border-gray-200 px-4 py-2 text-sm ${ProductStatusColor}`}
                  style={{ color: color[product.status as Status] }}
                >
                  {product.status}
                </td>
                <td
                  onClick={(e) => e.stopPropagation()}
                  className='border border-gray-200 px-4 py-2 text-sm'
                >
                  <DropdownMenu />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className='flex justify-between items-center mt-5 mb-3'>
        <button
          className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50'
          onClick={() => setCurrentPage((prev: any) => Math.max(prev - 1, 1))}
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
            setCurrentPage((prev: any) => Math.min(prev + 1, totalPages))
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

            <div className='flex justify-between text-sm'>
              <p>Expired At:</p>
              <p className='font-semibold'>{selectedTransaction.exp}</p>
            </div>
            <hr className='my-3' />
            <div className='flex justify-between text-sm'>
              <p>Purchase Amount:</p>
              <p className='font-semibold'>{selectedTransaction.purchaseAmt}</p>
            </div>
            <hr className='my-3' />
            <div className='flex justify-between text-sm'>
              <p>Amount Gain:</p>
              <p className='font-semibold'>{selectedTransaction.amtGain}</p>
            </div>
            <hr className='my-3' />

            <div className='flex justify-between text-sm'>
              <p>Status:</p>
              <span
                className='font-semibold'
                style={{ color: color[selectedTransaction.status as Status] }}
              >
                {selectedTransaction.status}
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
