'use client';
import React, { useEffect, useState } from 'react';
import { ProductItem } from '@/components/utils/interface/index';
import HomeButton from '@/components/common/button';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import Loading from '@/components/common/loadingState';
import ReusableModal from '@/components/common/modal';
import useAuth from '@/components/hook/useAuth';
import AllProductModal from '@/components/pages/inventory/add-product-modal';
import Products from '@/components/pages/inventory/products';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/components/state/store';
import { fetchUserProfile } from '@/components/api/slices/userProfileSlice';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import HomeInput from '@/components/common/input';

const Inventory = () => {
  const isAuthenticated = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const itemsPerPage = 7;

  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector(
    (state: RootState) => state.userProfile
  ) as {
    products: ProductItem[];
    status: string;
    error: string | null;
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) dispatch(fetchUserProfile(userId));
  }, [dispatch]);

  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm =
      searchTerm.length < 1 ||
      product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === '' || product.availability === filter;

    return matchesSearchTerm && matchesFilter;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const productItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <MainDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <>
          <div className='mt-3'>
            <Card>
              <CardHeader className='w-full'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 justify-between items-center'>
                  <div className='w-full'>
                    <HomeInput
                      placeholder={'Search Product'}
                      onInputChange={(value) => setSearchTerm(value)}
                    />
                  </div>

                  <div className='w-full flex justify-between md:justify-end gap-5'>
                    <HomeButton
                      title='Add Products'
                      color='white'
                      onClick={openModal}
                      bg='blue'
                    />
                    <select
                      aria-label='Filter products by stock status'
                      className='border border-gray-300 p-2 rounded-md focus:outline-none'
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value=''>All stock</option>
                      <option value='Out-of-stock'>Out of stock</option>
                      <option value='In-stock'>In stock</option>
                      <option value='Low'>Low</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
          <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
            <AllProductModal closeModal={closeModal} />
          </ReusableModal>
        </>
      )}
    </MainDashboard>
  );
};

export default Inventory;
