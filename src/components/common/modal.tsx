import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const ReusableModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = ''; // Restore background scrolling
    }

    return () => {
      document.body.style.overflow = ''; // Cleanup on unmount
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg w-full max-w-md mx-4 p-6 relative'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl'
          aria-label='Close modal'
        >
          &times;
        </button>
        {title && <h2 className='text-xl font-semibold mb-4'>{title}</h2>}
        <div
          className='max-h-[70vh] overflow-y-auto'
          style={{
            scrollbarWidth: 'thin', // Optional: Custom scrollbar styling
            scrollbarColor: 'gray lightgray',
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReusableModal;
