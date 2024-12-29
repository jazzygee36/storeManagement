'use client';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import Loading from '@/components/common/loadingState';
import useAuth from '@/components/hook/useAuth';
import React from 'react';

const Reports = () => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Loading />;
  }
  return <MainDashboard>Reports</MainDashboard>;
};

export default Reports;
