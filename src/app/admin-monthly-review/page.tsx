'use client';
import React, { useState, useEffect } from 'react';
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
  totalProfit: number;
  reports: Report[];
}

interface SalesReport {
  date: string;
  staffReports: StaffReport[];
}

const MonthlyReview = () => {
  const isAuthenticated = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), 'yyyy-MM')
  );
  const [salesReports, setSalesReports] = useState<SalesReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<SalesReport[]>([]);

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

  useEffect(() => {
    const filtered = salesReports.filter(
      ({ date }) => format(parseISO(date), 'yyyy-MM') === selectedMonth
    );
    setFilteredReports(filtered);
  }, [selectedMonth, salesReports]);

  const formatNumber = (num: number): string =>
    new Intl.NumberFormat().format(num);

  const calculateTotal = (key: 'totalPrice'): number => {
    return filteredReports.reduce((sum, report) => {
      return (
        sum +
        report.staffReports.reduce(
          (staffSum, staff) => staffSum + staff[key],
          0
        )
      );
    }, 0);
  };
  const calculateProfit = (reports?: Report[]): number =>
    reports?.reduce(
      (total, item) =>
        total + (item.totalPrice - item.qtySold * item.unitPrice),
      0
    ) || 0;

  const calculateTotalProfit = (): number => {
    return filteredReports.reduce((sum, report) => {
      return (
        sum +
        report.staffReports.reduce(
          (staffSum, staff) => staffSum + calculateProfit(staff.reports),
          0
        )
      );
    }, 0);
  };

  const handleExportReport = () => {
    if (filteredReports.length === 0) {
      alert('No report available for export.');
      return;
    }

    let csvContent = 'Date,Username,Sales,Profit\n';

    filteredReports.forEach(({ date, staffReports }) => {
      staffReports.forEach(({ username, totalPrice, reports }) => {
        const profit = calculateProfit(reports);
        csvContent += `${new Date(
          date
        ).toLocaleDateString()},${username},${totalPrice},${profit}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `Monthly_Report_${selectedMonth}.csv`);
  };

  return (
    <MainDashboard>
      {!isAuthenticated ? (
        <Loading />
      ) : (
        <>
          <div className='p-6 bg-white shadow-md rounded-lg'>
            <h2 className='text-lg font-bold mb-4'>Monthly Report</h2>

            {/* Month Selector */}
            <div className='flex justify-between items-center'>
              <HomeInput
                type='month'
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                label=''
                // className='w-[50%]'
              />
              <HomeButton
                className='my-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-black'
                title='Export Report'
                color={''}
                onClick={handleExportReport}
              />
            </div>

            {/* Key Metrics */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
              <Card className='p-2 bg-gray-100 rounded-lg text-center'>
                <CardHeader className='text-lg font-bold'>
                  N{formatNumber(calculateTotal('totalPrice'))}
                </CardHeader>
                <CardContent className='text-sm text-gray-600'>
                  Total Sales
                </CardContent>
              </Card>
              <Card className='p-2 bg-gray-100 rounded-lg text-center'>
                <CardHeader className='text-lg font-bold'>
                  N{formatNumber(calculateTotalProfit())}
                </CardHeader>
                <CardContent className='text-sm text-gray-600'>
                  Total Profits
                </CardContent>
              </Card>
              <Card className='p-2 bg-gray-100 rounded-lg text-center'>
                <CardHeader className='text-lg font-bold'>
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
            <div>
              <h3 className='text-lg font-semibold mb-2'>Detailed Report</h3>
              <table className='w-full border-collapse border border-gray-300'>
                <thead>
                  <tr className='bg-gray-200'>
                    <th className='border p-2'>Date</th>
                    <th className='border p-2'>Sales</th>
                    <th className='border p-2'>Profits</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map(({ date, staffReports }, index) => (
                      <React.Fragment key={index}>
                        {staffReports.map(
                          ({ totalPrice, reports }, reportIndex) => (
                            <tr key={reportIndex}>
                              <td className='border p-2'>
                                {new Date(date).toLocaleDateString()}
                              </td>
                              <td className='border p-2'>
                                N{formatNumber(totalPrice)}
                              </td>
                              <td className='border p-2'>
                                N{formatNumber(calculateProfit(reports))}
                              </td>
                            </tr>
                          )
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className='text-center p-4'>
                        No report for this month
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </MainDashboard>
  );
};

export default MonthlyReview;
