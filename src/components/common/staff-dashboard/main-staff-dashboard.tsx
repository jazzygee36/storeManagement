import StaffHeader from './staff-header';

const MainStaffDashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col h-screen gap-5'>
      <div>
        <StaffHeader />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default MainStaffDashboard;
