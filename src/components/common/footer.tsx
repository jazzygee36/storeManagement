const Footer = () => {
  return (
    <div className='bg-zinc-900 grid grid-cols-1 text-center p-8 text-white mt-5'>
      <div className='grid grid-cols-1 md:grid-cols-1 mb-3 justify-center  cursor-pointer gap-3'>
        <div>
          <h3>
            Offering unique expirence that cater to your individual interests
            and desire.
          </h3>
          <a
            href='https://www.linkedin.com/in/samsonmesioye'
            className='text-blue-600'
          >
            LinkedIn
          </a>
          {/* <a href=''>Twitter</a> */}
        </div>
      </div>
      <h1 className='text-2xl md:text-8xl'>INVENTORY</h1>
      <hr className='my-4' />
      <h3 className='text-xs'>
        (c) 2025 Inventory System. All Rights Reserved
      </h3>
    </div>
  );
};

export default Footer;
