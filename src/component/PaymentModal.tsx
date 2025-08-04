import React from 'react';
import Star from '../assets/icons/Star';

type PaymentModalProps = {
  modal: boolean;
  // setModal: (value: boolean) => void;
  transactionId?: string;
  date?: string;
  amount?: number;
  paymentMethod?: string;
};

const PaymentModal: React.FC<PaymentModalProps> = ({ modal,transactionId,date,amount,paymentMethod }) => {
  if (!modal) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[540px]">
        <div className='flex flex-col items-center justify-center'>
          <Star />
          <p className="text-xl font-semibold mb-4 text-[#31343A]">Payment Successful</p>
          <p className='text-[#6C6C6C] pb-10'>Successfully paid ${amount?.toFixed(2) ?? '—'}</p>
        </div>
        <p className='text-[#404348] font-medium pb-3'>Payment details</p>
        <div className='border-dotted border border-[#ECECEC] bg-[#F9FAFB] rounded-lg p-6'>
          <div className='flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
              <p className='text-[#6C6C6C]'>Status:</p>
              <div className='border border-[#D1FAE5] bg-[#ECFDF5] rounded-full py-1 px-3 text-[#047857]'>Success</div>
            </div>
            <div className='flex justify-between items-center'>
              <p className='text-[#6C6C6C]'>Transaction ID:</p>
              <div className='text-[#404348]'>{transactionId ?? ''}</div>
            </div>
            <div className='flex justify-between items-center'>
              <p className='text-[#6C6C6C]'>Date:</p>
              <div className='text-[#404348]'>{date
  ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  : '—'}
</div>
            </div>
            <div className='flex justify-between items-center'>
              <p className='text-[#6C6C6C]'>Type of Transaction:</p>
              <div className='text-[#404348]'>{paymentMethod ?? '—'}</div>
            </div>
            <hr className='border border-[#ECECEC]' />
            <div className='flex justify-between items-center'>
              <p className='text-[#6C6C6C]'>Total:</p>
              <div className='text-[#404348]'>AUD${amount?.toFixed(2) ?? '—'}</div>
            </div>
          </div>
        </div>
        <div className='flex justify-center items-center pt-5'>
          <p className='text-[#404348] text-sm font-semibold pr-4'>
            Powered by <span>Stripe</span>
          </p>
          <span className='text-[#ECECEC] pr-1.5'>|</span>
          <p className='text-[#6C6C6C] text-sm'>Terms</p>
          <p className='text-[#6C6C6C] text-sm pl-4'>Privacy</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
