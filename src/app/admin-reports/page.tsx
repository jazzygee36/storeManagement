'use client';

import HomeButton from '@/components/common/button';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import Loading from '@/components/common/loadingState';
import useAuth from '@/components/hook/useAuth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Report {
  paymentMethod: string;
  qtySold: number;
  unitPrice: number;
  totalPrice: number;
}

interface StaffReport {
  username: string;
  reports: Report[];
}

interface SalesReport {
  date: string;
  staffReports: StaffReport[];
}

const formatNumber = (num: number): string =>
  new Intl.NumberFormat().format(num);

const calculateTotalSales = (reports: Report[]): number =>
  reports
    .filter((r) => r.paymentMethod !== 'Credit')
    .reduce((total, r) => total + r.totalPrice, 0);

const calculateProfit = (reports: Report[]): number =>
  Math.abs(
    reports
      .filter((r) => r.paymentMethod !== 'Credit')
      .reduce((total, r) => total + (r.totalPrice - r.qtySold * r.unitPrice), 0)
  );

const SalesReports: React.FC = () => {
  const isAuthenticated = useAuth();
  const [salesReports, setSalesReports] = useState<SalesReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSalesReports = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${userId}/staff/sales/report`
        );
        if (Array.isArray(response.data?.salesReports)) {
          setSalesReports(response.data.salesReports);
        }
      } catch (error) {
        console.error('Error fetching sales reports:', error);
      }
    };
    fetchSalesReports();
  }, []);

  const totalPages = Math.ceil(salesReports.length / itemsPerPage);
  const currentSlice = salesReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <MainDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <div className='p-6 bg-white shadow-md rounded-lg'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Staff Name</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesReports.length > 0 ? (
                currentSlice.map(({ date, staffReports }, index) => (
                  <React.Fragment key={index}>
                    {staffReports.map(({ username, reports }, reportIndex) => (
                      <TableRow key={reportIndex}>
                        <TableCell>
                          {new Date(date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className='capitalize'>{username}</TableCell>
                        <TableCell>
                          N{formatNumber(calculateTotalSales(reports))}
                        </TableCell>
                        <TableCell>
                          N{formatNumber(calculateProfit(reports))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className='text-center'>
                    No Sales Reports Available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className='w-full flex justify-between items-center mt-8'>
            <HomeButton
              title='Previous'
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              color={''}
            />
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <HomeButton
              title='Next'
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              color={''}
            />
          </div>
        </div>
      )}
    </MainDashboard>
  );
};

export default SalesReports;
