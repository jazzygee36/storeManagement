'use client';

import dynamic from 'next/dynamic';

import { ComponentType } from 'react';

const DailySalesReport: ComponentType = dynamic(
  () => import('@/app/staff-sales-report/page'),
  {
    ssr: false,
  }
);

export default DailySalesReport;
