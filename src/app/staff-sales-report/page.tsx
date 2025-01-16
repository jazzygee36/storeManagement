'use client';
import Loading from '@/components/common/loadingState';
import MainStaffDashboard from '@/components/common/staff-dashboard/main-staff-dashboard';
import useAuth from '@/components/hook/useAuth';
import React from 'react';

const DailySalesReport = () => {
  const isAuthenticated = useAuth();
  return (
    <MainStaffDashboard>
      {!isAuthenticated ? <Loading /> : <h1>Staff report</h1>}
    </MainStaffDashboard>
  );
};

export default DailySalesReport;
