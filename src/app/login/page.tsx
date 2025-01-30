'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import AdminLoginForm from '@/components/pages/admin-login/page';
import StaffLoginForm from '@/components/pages/staff-login/page';
import BackArrow from '@/components/assets/icons/back';

const Login = () => {
  return (
    <div className='h-screen'>
      <BackArrow />

      <div className='  h-screen flex  items-center justify-center mt-12'>
        <Tabs defaultValue='admin' className='w-full h-screen '>
          <TabsList className='grid w-[60%] md:w-[25%] h-[44px] m-auto grid-cols-2 mb-5 mt-3 '>
            <TabsTrigger value='admin'>Admin Login</TabsTrigger>
            <TabsTrigger value='staff'>Staff Login</TabsTrigger>
          </TabsList>
          <TabsContent value='admin'>
            <Card className='border border-none'>
              <CardContent className='w-full'>
                <AdminLoginForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='staff'>
            <Card className='border border-none'>
              <CardContent className=''>
                <StaffLoginForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
