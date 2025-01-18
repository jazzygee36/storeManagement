import StaffHeader from './staff-header';

const MainStaffDashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col h-screen gap-5'>
      <div className='sticky top-0 z-10'>
        <StaffHeader />
      </div>
      <div className=''>{children}</div>
    </div>
  );
};

export default MainStaffDashboard;
