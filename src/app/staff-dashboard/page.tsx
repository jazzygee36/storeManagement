'use client';
import Loading from '@/components/common/loadingState';
// import PaperBackground from '@/components/common/paper-bg';
import MainStaffDashboard from '@/components/common/staff-dashboard/main-staff-dashboard';
// import StaffHeader from '@/components/common/staff-dashboard/staff-header';
import useAuth from '@/components/hook/useAuth';
// import StaffProducts from '@/components/pages/staff-products/all-products';

const StaffDashboard = () => {
  const isAuthenticated = useAuth();

  return (
    <MainStaffDashboard>
      {!isAuthenticated ? <Loading /> : 'jgjgjkk'}
    </MainStaffDashboard>
  );
};

export default StaffDashboard;
