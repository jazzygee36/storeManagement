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
  qtySold: number;
  unitPrice: number;
  _id: string;
  date: string;
  totalPrice: number;
}

interface StaffReport {
  username: string;
  totalPrice: number;
  totalProfit: number;
  reports: Report[];
}

interface SalesReport {
  date: string;
  staffReports: StaffReport[];
}

const SalesReports: React.FC = () => {
  const isAuthenticated = useAuth();
  const [salesReports, setSalesReports] = useState<SalesReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSalesReports = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${userId}/staff/sales/report`
        );
        if (Array.isArray(response.data?.salesReports)) {
          setSalesReports(response.data.salesReports);
        } else {
          console.error(
            'salesReports is not an array',
            response.data?.salesReports
          );
        }
      } catch (error) {
        console.error('Error fetching sales reports:', error);
      }
    };

    fetchSalesReports();
  }, []);

  const formatNumber = (num: number): string =>
    new Intl.NumberFormat().format(num);

  const calculateProfit = (reports?: Report[]): number =>
    reports?.reduce(
      (total, item) =>
        total + (item.totalPrice - item.qtySold * item.unitPrice),
      0
    ) || 0;

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
                {/* <TableHead className='text-center'>More</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesReports.length > 0 ? (
                currentSlice.map(({ date, staffReports }, index) => (
                  <React.Fragment key={index}>
                    {staffReports.map(
                      ({ username, totalPrice, reports }, reportIndex) => {
                        return (
                          <TableRow key={reportIndex}>
                            <TableCell>
                              {new Date(date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className='capitalize'>
                              {username}
                            </TableCell>
                            <TableCell>N{formatNumber(totalPrice)}</TableCell>
                            <TableCell>
                              N{formatNumber(calculateProfit(reports))}
                            </TableCell>
                            {/* <TableCell className='text-center cursor-pointer'>
                            View More
                          </TableCell> */}
                          </TableRow>
                        );
                      }
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='text-center'>
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
