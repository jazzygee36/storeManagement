import Image from 'next/image';
import Revenue from '@/components/assets/svg/Revenue.svg';
interface Props {
  totalRevenueValue: number;
}
const formatNumber = (num: number): string =>
  new Intl.NumberFormat().format(num);

const TopSelling = ({ totalRevenueValue }: Props) => {
  return (
    <div className='flex flex-col gap-5 items-center'>
      <Image src={Revenue} alt='revenue' />
      <h1 className='font-bold text-[18px]'>
        N{formatNumber(totalRevenueValue)}
      </h1>
    </div>
  );
};

export default TopSelling;
