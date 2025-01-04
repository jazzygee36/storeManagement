'use client';
import HomeButton from '@/components/common/button';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
// import Loading from '@/components/common/loadingState';
import ReusableModal from '@/components/common/modal';
import PaperBackground from '@/components/common/paper-bg';
// import useAuth from '@/components/hook/useAuth';
import AllProductModal from '@/components/pages/inventory/add-product-modal';
import Products from '@/components/pages/inventory/products';
import { useState } from 'react';

const AllProducts = [
  {
    product: 'Maggi',
    buyingPrice: '450',
    qty: '40',
    sellingPrice: '550',
    exp: '12-30-2025',
    status: 'In-stock',
    purchaseAmt: '18,000',
    amtGain: '4000',
    qtyRemaning: '10',
  },
  {
    product: 'Red Bull',
    buyingPrice: '850',
    qty: '10',
    sellingPrice: '950',
    exp: '10-31-2025',
    status: 'In-stock',
    purchaseAmt: '18,000',
    amtGain: '4000',
    qtyRemaning: '10',
  },
  {
    product: 'Coca-cola',
    buyingPrice: '30',
    qty: '11',
    sellingPrice: '440',
    exp: '12-12-2024',
    status: 'Out-of-stock',
    purchaseAmt: '18,000',
    amtGain: '4000',
    qtyRemaning: '10',
  },
  {
    product: 'Red Bull',
    buyingPrice: '850',
    qty: '10',
    sellingPrice: '950',
    exp: '10-31-2025',
    status: 'Low',
    purchaseAmt: '18,000',
    amtGain: '4000',
    qtyRemaning: '10',
  },
  {
    product: 'Maggi',
    buyingPrice: '450',
    qtyRemaning: '10',
    qty: '40',
    sellingPrice: '550',
    exp: '12-30-2025',
    status: 'In-stock',
    purchaseAmt: '18,000',
    amtGain: '4000',
  },
  {
    product: 'Red Bull',
    buyingPrice: '850',
    qty: '10',
    sellingPrice: '950',
    exp: '10-31-2025',
    status: 'In-stock',
    purchaseAmt: '18,000',
    amtGain: '4000',
    qtyRemaning: '10',
  },
  {
    product: 'Coca-cola',
    buyingPrice: '30',
    qty: '11',
    sellingPrice: '440',
    exp: '12-12-2024',
    status: 'Out-of-stock',
    purchaseAmt: '18,000',
    amtGain: '4000',
    qtyRemaning: '10',
  },
  {
    product: 'Red Bull',
    buyingPrice: '850',
    qty: '10',
    qtyRemaning: '10',
    sellingPrice: '950',
    exp: '10-31-2025',
    status: 'Low',
    purchaseAmt: '18,000',
    amtGain: '4000',
  },
];

const Inventory = () => {
  // const isAuthenticated = useAuth();

  // if (!isAuthenticated) {
  //   return <Loading />;
  // }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const itemsPerPage = 5;

  // Filtered data based on selected status
  const filteredTable = filter
    ? AllProducts.filter((item) => item.status === filter)
    : AllProducts;

  const totalPages = Math.ceil(filteredTable.length / itemsPerPage);

  // Get current items for the current page
  const productItems = filteredTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <MainDashboard>
      {/* <PaperBackground title={'Overall Inventory'}>
        <Overall />
      </PaperBackground> */}

      <div className='mt-5'>
        <PaperBackground
          title={'All Products'}
          container={
            <>
              <HomeButton
                title={'Add Products'}
                bg={'#4285F4'}
                type={'submit'}
                color={'white'}
                onClick={openModal}
              />
              <select
                className='border border-gray-300 p-2 rounded-md'
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value=''>All stock</option>
                <option value='Out-of-stock'>Out of stock</option>
                <option value='In-stock'>In stock</option>
                <option value='Low'>Low</option>
              </select>
            </>
          }
        >
          <Products
            productItems={productItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </PaperBackground>
      </div>
      <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        <AllProductModal />
      </ReusableModal>
    </MainDashboard>
  );
};

export default Inventory;
