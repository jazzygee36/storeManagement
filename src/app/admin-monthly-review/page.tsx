'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import HomeInput from '@/components/common/input';
import HomeButton from '@/components/common/button';
import MainDashboard from '@/components/common/dashboard/main-dasboard';
import Loading from '@/components/common/loadingState';
import useAuth from '@/components/hook/useAuth';
import axios from 'axios';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { saveAs } from 'file-saver';

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
  reports: Report[];
}

interface SalesReport {
  date: string;
  staffReports: StaffReport[];
}

const MonthlyReview = () => {
  const isAuthenticated = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(() =>
    format(new Date(), 'yyyy-MM')
  );
  const [salesReports, setSalesReports] = useState<SalesReport[]>([]);

  useEffect(() => {
    const fetchSalesReports = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${userId}/staff/sales/report`
        );
        if (Array.isArray(data?.salesReports)) {
          setSalesReports(data.salesReports);
        } else {
          console.error('Invalid sales report data:', data?.salesReports);
        }
      } catch (error) {
        console.error('Error fetching sales reports:', error);
      }
    };

    fetchSalesReports();
  }, []);

  const filteredReports = useMemo(
    () =>
      salesReports.filter(
        ({ date }) => format(parseISO(date), 'yyyy-MM') === selectedMonth
      ),
    [selectedMonth, salesReports]
  );

  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

  const calculateProfit = (reports: Report[]) =>
    Math.abs(
      reports.reduce(
        (total, { totalPrice, qtySold, unitPrice }) =>
          total + (totalPrice - qtySold * unitPrice),
        0
      )
    );

  const calculateTotal = (key: 'totalPrice') =>
    filteredReports.reduce(
      (sum, { staffReports }) =>
        sum +
        staffReports.reduce((staffSum, staff) => staffSum + staff[key], 0),
      0
    );

  const calculateTotalProfit = () =>
    filteredReports.reduce(
      (sum, { staffReports }) =>
        sum +
        staffReports.reduce(
          (staffSum, { reports }) => staffSum + calculateProfit(reports),
          0
        ),
      0
    );

  const handleExportReport = () => {
    if (!filteredReports.length) {
      alert('No report available for export.');
      return;
    }

    const csvContent =
      'Date,Username,Sales,Profit\n' +
      filteredReports
        .flatMap(({ date, staffReports }) =>
          staffReports.map(({ username, totalPrice, reports }) => {
            const profit = calculateProfit(reports);
            return `${new Date(
              date
            ).toLocaleDateString()},${username},${totalPrice},${profit}`;
          })
        )
        .join('\n');

    saveAs(
      new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }),
      `Monthly_Report_${selectedMonth}.csv`
    );
  };

  return (
    <MainDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <div className='p-6 bg-white shadow-md rounded-lg'>
          <h2 className='md:text-lg text-sm font-bold mb-4'>Monthly Report</h2>

          {/* Month Selector */}
          <div className='flex justify-between items-center md:text-base text-sm'>
            <HomeInput
              type='month'
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <HomeButton
              className='my-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-black '
              title='Export Report'
              onClick={handleExportReport}
              color={''}
            />
          </div>

          {/* Key Metrics */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <Card className='p-2 bg-gray-100 rounded-lg text-center'>
              <CardHeader className='md:text-base text-sm font-bold'>
                N{formatNumber(calculateTotal('totalPrice'))}
              </CardHeader>
              <CardContent className='text-sm text-gray-600'>
                Total Sales
              </CardContent>
            </Card>
            <Card className='p-2 bg-gray-100 rounded-lg text-center'>
              <CardHeader className='md:text-base text-sm font-bold'>
                N{formatNumber(calculateTotalProfit())}
              </CardHeader>
              <CardContent className='text-sm text-gray-600'>
                Total Profits
              </CardContent>
            </Card>
            <Card className='p-2 bg-gray-100 rounded-lg text-center'>
              <CardHeader className='md:text-base text-sm font-bold'>
                N
                {formatNumber(
                  calculateTotal('totalPrice') + calculateTotalProfit()
                )}
              </CardHeader>
              <CardContent className='text-sm text-gray-600'>
                Total Revenue
              </CardContent>
            </Card>
          </div>

          {/* Report Table */}
          <h3 className='md:text-lg text-sm font-semibold mb-2'>
            Detailed Report
          </h3>
          <table className='w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-200 md:text-base text-sm'>
                <th className='border p-2'>Date</th>
                <th className='border p-2'>Sales</th>
                <th className='border p-2'>Profits</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length ? (
                filteredReports.map(({ date, staffReports }) =>
                  staffReports.map(({ totalPrice, reports }, index) => (
                    <tr key={index} className='md:text-base text-sm'>
                      <td className='border p-2 md:text-base text-sm'>
                        {new Date(date).toLocaleDateString()}
                      </td>
                      <td className='border p-2 md:text-base text-sm'>
                        N{formatNumber(totalPrice)}
                      </td>
                      <td className='border p-2 md:text-base text-sm'>
                        N{formatNumber(calculateProfit(reports))}
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className='text-center p-4 md:text-base text-sm'
                  >
                    No report for this month
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </MainDashboard>
  );
};

export default MonthlyReview;
