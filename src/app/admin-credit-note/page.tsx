'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
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

interface Report {
  paymentMethod: string;
  qtySold: number;
  unitPrice: number;
  _id: string;
  date: string;
  totalPrice: number;
  username: string;
  customerNumber: string;
  customerName: string;
}

interface StaffReport {
  username: string;
  reports: Report[];
}

interface SalesReport {
  date: string;
  staffReports: StaffReport[];
}

interface GroupedReport {
  customerNumber: string;
  customerName: string;
  totalAmount: number;
}

const groupCreditReports = (reports: Report[]): GroupedReport[] => {
  const grouped = reports
    .filter((r) => r.paymentMethod === 'Credit')
    .reduce<Record<string, GroupedReport>>((acc, r) => {
      if (!acc[r.customerNumber]) {
        acc[r.customerNumber] = {
          customerNumber: r.customerNumber,
          customerName: r.customerName,
          totalAmount: 0,
        };
      }
      acc[r.customerNumber].totalAmount += r.totalPrice;
      return acc;
    }, {});

  return Object.values(grouped);
};

const AdminCreditNote: React.FC = () => {
  const isAuthenticated = useAuth();
  const [salesReports, setSalesReports] = useState<SalesReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
          console.error('Invalid response format:', data?.salesReports);
        }
      } catch (error) {
        console.error('Error fetching sales reports:', error);
      }
    };

    fetchSalesReports();
  }, []);

  const totalPages = useMemo(
    () => Math.ceil(salesReports.length / itemsPerPage),
    [salesReports]
  );
  const currentSlice = useMemo(
    () =>
      salesReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [salesReports, currentPage]
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
                <TableHead>Customer Name</TableHead>
                <TableHead>Customer Number</TableHead>
                <TableHead>Total Credit Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesReports.length > 0 ? (
                currentSlice.map(({ date, staffReports }, index) => {
                  const groupedReports = groupCreditReports(
                    staffReports.flatMap((staff) => staff.reports)
                  );

                  return (
                    groupedReports.length > 0 &&
                    groupedReports.map(
                      ({ customerNumber, customerName, totalAmount }, i) => (
                        <TableRow key={`${index}-${i}`}>
                          {i === 0 && (
                            <TableCell rowSpan={groupedReports.length}>
                              {new Date(date).toLocaleDateString()}
                            </TableCell>
                          )}
                          <TableCell>{customerName}</TableCell>
                          <TableCell>{customerNumber}</TableCell>
                          <TableCell>
                            N{new Intl.NumberFormat().format(totalAmount)}
                          </TableCell>
                        </TableRow>
                      )
                    )
                  );
                })
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
              color=''
            />
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <HomeButton
              title='Next'
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              color=''
            />
          </div>
        </div>
      )}
    </MainDashboard>
  );
};

export default AdminCreditNote;
