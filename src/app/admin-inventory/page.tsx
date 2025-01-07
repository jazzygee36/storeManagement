'use client';
import { useEffect, useState } from 'react';
import HomeButton from '@/components/common/button';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import Loading from '@/components/common/loadingState';
import ReusableModal from '@/components/common/modal';
import PaperBackground from '@/components/common/paper-bg';
import useAuth from '@/components/hook/useAuth';
import AllProductModal from '@/components/pages/inventory/add-product-modal';
import Products from '@/components/pages/inventory/products';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/components/state/store';
import { fetchUserProfile } from '@/components/api/slices/userProfileSlice';
import { useFilteredProducts } from '@/components/utils/interface/index'; // Adjust the import path as necessary

const Inventory = () => {
  const isAuthenticated = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector(
    (state: RootState) => state.userProfile
  );

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) dispatch(fetchUserProfile(userId));

    const socket = new WebSocket(`wss://${process.env.NEXT_PUBLIC_BASE_URL}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'PROFILE_UPDATED') {
        dispatch(fetchUserProfile(userId as string));
      }
    };

    return () => {
      socket.close();
    };
  }, [dispatch, userId]);

  const filteredProducts = useFilteredProducts(products, filter);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const productItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // if (!isAuthenticated) return <Loading />;

  // if (status === 'loading') return <Loading />;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <MainDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <>
          <div className='mt-5'>
            <PaperBackground
              title='All Products'
              container={
                <div className='flex items-center gap-3'>
                  <HomeButton
                    title='Add Products'
                    bg='#4285F4'
                    color='white'
                    onClick={openModal}
                  />
                  <select
                    aria-label='Filter products by stock status'
                    className='border border-gray-300 p-2 rounded-md'
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value=''>All stock</option>
                    <option value='Out-of-stock'>Out of stock</option>
                    <option value='In-stock'>In stock</option>
                    <option value='Low'>Low</option>
                  </select>
                </div>
              }
            >
              {filteredProducts.length === 0 ? (
                <div className='text-center flex justify-center items-center h-40'>
                  No products available.
                </div>
              ) : (
                <Products
                  productItems={productItems}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              )}
            </PaperBackground>
          </div>
          <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
            <AllProductModal />
          </ReusableModal>
        </>
      )}
    </MainDashboard>
  );
};

export default Inventory;
