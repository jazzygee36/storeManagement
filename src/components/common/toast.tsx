import React from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info'; // Default types
  onClose: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div
      className={`fixed top-5 right-5 px-4 z-[100] py-2 rounded shadow-lg transition duration-300 ${typeStyles[type]}`}
    >
      <div className='flex justify-between items-center'>
        <span>{message}</span>
        <button
          onClick={onClose}
          className='ml-4 text-white font-bold hover:text-gray-200'
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
