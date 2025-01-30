'use client';

import HomeButton from '@/components/common/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import Footer from '@/components/common/footer';
import { testimonies } from '@/components/utils/testimonies';
import { useRouter } from 'next/navigation';
import Tracking from '@/components/assets/icons/tracking';
import Adding from '@/components/assets/icons/adding';
import Analysis from '@/components/assets/icons/analysis';

function LandingPageTabs() {
  const router = useRouter();
  return (
    <>
      <div className='p-0 md:p-2'>
        <div className='bg-purple-600 h-full w-full rounded-none md:rounded-xl px-3 md:px-8 py-4 md:py-8'>
          <div className='flex justify-between items-center '>
            {/* <div>logo</div> */}
            <ul className='flex items-center gap-3 text-white'>
              <li>Home</li>
              {/* <li>Benefit</li> */}
            </ul>
            <HomeButton
              title={'Login'}
              bg='white'
              color={'purple'}
              className='rounded-xl font-medium px-8'
              onClick={() => router.push('/login')}
            />
          </div>
          <div className='text-center my-12 text-white w-full md:w-[60%] m-auto'>
            <h1 className='text-3xl md:text-5xl font-inter font-bold mb-3'>
              Real-Time Inventory Insights, Anytime, Anywhere
            </h1>
            <p className='w-full md:w-[63%] m-auto'>
              Automate stock updates, streamline order processes, and manage
              multiple locations with an inventory system that works for you.
            </p>
          </div>
          <div className='flex justify-center'>
            <HomeButton
              title={'Get Started'}
              bg='white'
              color={'purple'}
              className='rounded-xl font-medium px-8 m-auto'
              onClick={() => router.push('/register')}
            />
          </div>
        </div>
        {/* <div className='text-center my-10'>
          <h3 className=' font-medium text-xl md:text-2xl font-inter'>
            Optimize Your Inventory with Smart Features
          </h3>
          <p className='text-gray-500 text-base'>
            Gain full visibility and control over your stock, solution designed
            to streamline your operations.
          </p>

          <div className='grid grid-cols-1 m-auto mt-3 justify-center'>
            <Image
              src={Dashboard}
              alt='dashboard'
              className='rounded-xl m-auto'
            />
          </div>
        </div> */}
        <div className=' my-12 mx-5 '>
          <h3 className=' font-semibold text-xl md:text-2xl font-inter text-center'>
            Why Choose Our Inventory Management System
          </h3>
          <p className='text-gray-500 text-base text-center'>
            Unlock seamless inventory control, boost efficiency and stay ahead
            with smart automation and real-time-insights.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-3 mt-7'>
            <Card className=''>
              <CardHeader className='font-medium text-lg flex flex-col gap-2'>
                <Tracking />
                <h1> Real-Time Inventory Tracking</h1>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-600'>
                  Track Inventory levels across all locations with instant
                  updates, ensuring accurate inventory manegement at all time.
                </p>
              </CardContent>
            </Card>
            <Card className=''>
              <CardHeader className='font-medium text-lg flex flex-col gap-2'>
                <Adding />
                <h1> Quick Product Add & Update</h1>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-600'>
                  Add new products and update existing listing effortlessly,
                  ensurig your inventory date is always accurate and up-to-date.
                </p>
              </CardContent>
            </Card>
            <Card className=''>
              <CardHeader className='font-medium text-lg flex flex-col gap-2'>
                <Analysis />
                <h1> Comprehensive Analytics</h1>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-600'>
                  Gain in-depth insights with advanced reporting tools, enabling
                  you to make data-driven decisions on inventory tunover and
                  demand forecasting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className='my-8'>
          <div className='bg-purple-500 text-white w-32 m-auto p-2 text-center rounded-full'>
            Testimonies
          </div>

          <div className='relative overflow-hidden my-12'>
            <div className='flex gap-6 animate-scroll'>
              {testimonies.map((people, index) => (
                <div
                  key={index}
                  className='px-4 py-6 bg-white rounded-lg shadow-md min-w-[300px]'
                >
                  <h3 className='font-medium text-lg text-center text-purple-500'>
                    {people.name}
                  </h3>
                  <p className='text-sm mt-2 truncate '>{people.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='w-[95%] md:w-[80%] m-auto bg-zinc-900 p-4 text-center rounded-xl py-12'>
          <h2 className='text-3xl text-white'>
            Ready to take control of your Inventory?
          </h2>
          <p className='text-white text-base my-4 w-[70%] text-center m-auto'>
            Start optimizing your stock management today with our powerful,
            easy-to-use platform. No more manual tracking, just seamless
            automation and real-time-insights.
          </p>
          <div className='flex justify-center mt-3'>
            <HomeButton
              title={'Get Started'}
              // bg='purple'
              color={'white'}
              className='rounded-xl font-medium px-8 m-auto bg-purple-500'
              onClick={() => router.push('/register')}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LandingPageTabs;
