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

interface SalesReport {
  username: string;
  totalPrice: number;
  reports: {
    _id: string;
    date: string;
    totalPrice: number;
  }[];
}

const SalesReports: React.FC = () => {
  const isAuthenticated = useAuth();
  const [salesReports, setSalesReports] = useState<SalesReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch sales reports from the backend
  useEffect(() => {
    const fetchSalesReports = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${userId}/staff/sales/report`
        );

        setSalesReports(response.data?.salesReports);
      } catch (error) {
        console.error('Error fetching sales reports:', error);
      }
    };

    fetchSalesReports();
  }, []);

  // Calculate the current slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSlice = salesReports.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const calculateProfit = (reports: SalesReport['reports']): number => {
    return reports.reduce((totalProfit, item) => {
      const profit = item.totalPrice * 0.2; // Assume a 20% profit margin
      return totalProfit + profit;
    }, 0);
  };

  const formatNumber = (num: number): string =>
    new Intl.NumberFormat().format(num);
  // Total pages
  const totalPages = Math.ceil(salesReports.length / itemsPerPage);

  // Handlers for pagination
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <MainDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <div className='sales-reports'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead className='text-center'>More</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSlice.map((report) => {
                const totalProfit = calculateProfit(report.reports);
                console.log('report', report);
                return (
                  <TableRow
                    key={report.username}
                    className='capitalize sales-report '
                  >
                    <TableCell>{report.username}</TableCell>

                    <TableCell>N{formatNumber(report.totalPrice)}</TableCell>
                    <TableCell>N{formatNumber(totalProfit)}</TableCell>
                    <TableCell className='text-center cursor-pointer'>
                      View More
                    </TableCell>
                    {/* <ul>
              {report.reports.map((item) => (
                <li key={item._id}>
                  Date: {new Date(item.date).toLocaleDateString()} - $
                  {item.totalPrice.toFixed(2)}
                </li>
              ))}
            </ul> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className='w-full  flex justify-between items-center mt-5'>
            <HomeButton
              title='Previous'
              onClick={handlePrevious}
              disabled={currentPage === 1}
              color={''}
            />

            <span>
              Page {currentPage} of {totalPages}
            </span>
            <HomeButton
              title='Next'
              onClick={handleNext}
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
