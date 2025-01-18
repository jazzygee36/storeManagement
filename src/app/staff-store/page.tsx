'use client';

import Loading from '@/components/common/loadingState';
import MainStaffDashboard from '@/components/common/staff-dashboard/main-staff-dashboard';
import useAuth from '@/components/hook/useAuth';
import StaffProducts from '@/components/pages/staff-products/all-products';
import { Card, CardContent } from '@/components/ui/card';

const StaffStore = () => {
  const isAuthenticated = useAuth();

  return (
    <MainStaffDashboard>
      <div className='mx-4 mb-4'>
        {!isAuthenticated ? (
          <Loading />
        ) : (
          <Card>
            <CardContent>
              <StaffProducts />
            </CardContent>
          </Card>
        )}
      </div>
    </MainStaffDashboard>
  );
};

export default StaffStore;
