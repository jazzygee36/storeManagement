'use client';

// interface Props {
//   currentPage: number;
//   productItems: ProductItem[];
//   setCurrentPage: Dispatch<SetStateAction<number>>;
//   totalPages: number;
// }

const StaffProducts = () => {
  return (
    <>
      <div className='overflow-x-auto mt-5'>
        <table className='min-w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Products
              </th>
              {/* <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Unit Price(1)
              </th> */}
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Qty Stock
              </th>
              {/* <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Goods Value
              </th> */}
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Remaining Items
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Sales Price(1)
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm text-[blue]'>
                Qty Sold
              </th>

              <th className='border border-gray-300 px-4 py-2 text-left text-sm text-[green]'>
                Sales Value
              </th>

              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Expire Date
              </th>
              <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Availability
              </th>
              {/* <th className='border border-gray-300 px-4 py-2 text-left text-sm'>
                Action
              </th> */}
            </tr>
          </thead>
          <tbody>
            {/* {productItems.map((product, index) => (
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
            ))} */}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StaffProducts;
