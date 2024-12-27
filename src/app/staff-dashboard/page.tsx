import PaperBackground from '@/components/common/paper-bg';
import StaffHeader from '@/components/common/staff-dashboard/staff-header';
import StaffProducts from '@/components/pages/staff-products/all-products';

const StaffDashboard = () => {
  return (
    <div className='bg-gray-100 h-screen px-5'>
      <div className='mb-10'>
        <StaffHeader />
      </div>
      <PaperBackground title={'All Prodcuts'}>
        <StaffProducts />
      </PaperBackground>
    </div>
  );
};

export default StaffDashboard;
