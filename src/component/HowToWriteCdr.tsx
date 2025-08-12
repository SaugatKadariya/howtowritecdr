import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import z from "zod";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { getNames } from 'country-list';
import Logo from "../assets/icons/Logo";
import MasterCard from "../assets/icons/MasterCard";
import { VisaCard } from "../assets/icons/VisaCard";
import AmericanExpress from "../assets/icons/AmericanExpress";
import { formSchema } from "./formSchema";
import PaymentModal from "./PaymentModal";

type FormData = z.infer<typeof formSchema>;


function HowToWriteCdr() {
 const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState<{
  transactionId?: string;
  date?: string;
  amount?: number;
  paymentMethod?: string;
}>({});
  const [amount, setAmount] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  const countryOptions = getNames()
    .sort((a, b) => a.localeCompare(b))
    .map((country) => ({
      label: country,
      value: country,
    }));

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const watchedFields = watch([
    'email',
    'name',
    'address',
    'city',
    'state',
    'country', 
  ]);
  const handleChange = (e: { target: { value: string; }; }) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    setAmount(value);
  };
  const anyEmpty =
    watchedFields.some((field) => !field || field.trim() === '') || !amount;
const onSubmit = async () => {
  const numericAmount = Number(amount);

  if (!stripe || !elements || !amount) return;

  try {
    const res = await fetch('http://54.179.157.41:8080/public/v1/stripes/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(numericAmount * 100) }), 
    });

    const data = await res.json();
    const clientSecret = data?.data?.client_secret;
    if (!clientSecret) {
      alert('Could not initiate payment.');
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement!,
      },
    });

    if (result.error) {
      alert('Payment failed: ' + result.error.message);
    } else if (result.paymentIntent?.status === 'succeeded') {
      await fetch('http://54.179.157.41:8080/public/v1/stripes/success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intentId: result.paymentIntent.id }),
      });

      const { id, payment_method_types } = result.paymentIntent;

      setModalData({
        transactionId: id,
        date: new Date().toLocaleDateString(),
        amount: numericAmount,
        paymentMethod: payment_method_types[0],
      });

      setModal(true);

      setTimeout(() => {
        window.location.href = 'https://www.howtowritecdr.com/';
      }, 30000);
    }
  } catch (error) {
    alert('Something went wrong. Please try again.');
    console.error('Payment error:', error);
  }
};
    const [activeStep, setActiveStep] = useState(1)
  return (
   <div className="flex justify-center items-center min-h-screen bg-[#E5EAF5] overflow-auto">
  <div className="bg-white rounded-xl w-full max-w-[795px] my-5">
<div className="bg-[#3B4CEE] h-[103px] rounded-t-xl py-7 px-[72px]">
  <Logo />
</div>
{activeStep === 1 && (
 <div className="px-5 md:px-[72px] pt-12 pb-3">
          <label className="block text-2xl  text-[#000000] mb-7 font-medium">Payment amount</label>
          <div className="relative max-w-[651px] mt-1.5">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#404348] mr-3 flex items-center">
              AUD
              <span className="inline-block w-[1px] h-[14px] bg-[#404348] opacity-50 ml-3"></span>
            </span>
           <input
  value={amount}
  onChange={handleChange}
  className="border border-[#ECECEC] rounded-[6px] focus:outline-none w-full pl-[68px] p-3.5 text-[#404348] bg-transparent"
  placeholder="Enter Amount"
/>

          </div>
          <button className={`mt-6 py-2.5 bg-[#3B4CEE] text-white rounded-lg w-full max-w-[651px]  ${!amount ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} 
              onClick={() => {
      if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
        setActiveStep(2);
      } else {
        alert('Please enter a valid amount before proceeding.');
      }
    }} 
         disabled={!amount}>Proceed</button>
        </div> )} 
        {
          activeStep === 2 && (
            <>
            <div className=" mt-12">
              <div className="px-4 md:px-20 ">

                
                <label className="block text-2xl text-[#000000] mb-7 font-medium">Payment Summary</label>
                <div className="relative max-w-[651px] mt-1.5">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#404348] mr-3 flex items-center">
              AUD
              <span className="inline-block w-[1px] h-[14px] bg-[#404348] opacity-50 ml-3"></span>
            </span>
           <input
  value={amount}
  onChange={handleChange}
  className="border border-[#ECECEC] rounded-[6px] focus:outline-none w-full pl-[68px] p-3.5 text-[#404348] bg-transparent"
  placeholder="Enter Amount"
/>
  </div>

          </div>
                <hr className="border border-[#E1E1E5] mt-12"/>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 px-4 md:px-20 ">
            <div>
              <label className="block font-medium text-[#404348]">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="email@example.com"
                className={`mt-1 block w-full border ${
                  errors.email ? 'border-red-500' : 'border-[#ECECEC]'
                } rounded-md px-[14px] py-[13px]`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <label className="block mb-2 text-lg font-semibold text-gray-700">
              Card Information
            </label>

            <div
              className='border-[#ECECEC] border rounded'
            >
              <div className="px-3 py-2 border-b border-[#ECECEC] relative">
                <CardNumberElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#404348',
                        '::placeholder': { color: '#BFBFBF' },
                      },
                      invalid: { color: '#fa755a' },
                    },
                  }}
                  className="w-full outline-none pr-28"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <MasterCard />
                  <VisaCard />
                  <AmericanExpress />
                </div>
              </div>

              <div className="flex">
                <div className="w-1/2 px-3 py-2">
                  <CardExpiryElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#404348',
                          '::placeholder': { color: '#BFBFBF' },
                        },
                        invalid: { color: '#fa755a' },
                      },
                    }}
                    className="w-full outline-none"
                  />
                </div>

                <div className="border-l border-[#ECECEC]"></div>

                <div className="w-1/2 px-3 py-2">
                  <CardCvcElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#404348',
                          '::placeholder': { color: '#BFBFBF' },
                        },
                        invalid: { color: '#fa755a' },
                      },
                    }}
                    className="w-full outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#404348]">Name on Card</label>
              <input
                {...register('name')}
                type="text"
                placeholder="eg. John Doe"
                className={`mt-1 block w-full border ${
                  errors.name ? 'border-red-500' : 'border-[#ECECEC]'
                } rounded-md px-[14px] py-[13px]`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-[#404348]">Address</label>
              <input
                {...register('address')}
                type="text"
                placeholder="Street Address or PO box"
                className={`mt-1 block w-full border ${
                  errors.address ? 'border-red-500' : 'border-[#ECECEC]'
                } rounded-md px-[14px] py-[13px]`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div className="flex w-full gap-2">
              <div className="w-1/2">
                <label className="block font-medium text-[#404348]">City</label>
                <input
                  {...register('city')}
                  type="text"
                  placeholder="City"
                  className={`mt-1 block w-full border ${
                    errors.city ? 'border-red-500' : 'border-[#ECECEC]'
                  } rounded-md px-[14px] py-[13px]`}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city.message}</p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block font-medium text-[#404348]">State</label>
                <input
                  {...register('state')}
                  type="text"
                  placeholder="State, province, region"
                  className={`mt-1 block w-full border ${
                    errors.state ? 'border-red-500' : 'border-[#ECECEC]'
                  } rounded-md px-[14px] py-[13px]`}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm">{errors.state.message}</p>
                )}
              </div>
            </div>

         <div>
  <label className="block font-medium text-[#404348]">Country</label>

  <Controller
  name="country"
  control={control}
  rules={{ required: 'Country is required' }}
  render={({ field }) => (
    <Select
      {...field}
      options={countryOptions}
      placeholder="Select Country"
      className="mt-1"
      classNamePrefix="react-select"
      value={countryOptions.find((opt: { value: string; }) => opt.value === field.value)}
      onChange={(selected) => field.onChange(selected?.value)}
      styles={{
        control: (base) => ({
          ...base,
          borderColor: errors.country ? 'red' : '#ECECEC',
          borderWidth: '1px',
          borderRadius: '0.375rem',
          paddingTop: '2px',
          paddingBottom: '2px',
          paddingLeft: '2px',
          paddingRight: '2px',
          boxShadow: 'none',
          '&:hover': {
            borderColor: errors.country ? 'red' : '#ccc',
          },
        }),
        singleValue: (base) => ({
          ...base,
          color: '#404348',
        }),
      }}
    />
  )}
/>


  {errors.country && (
    <p className="text-red-500 text-sm">{errors.country.message}</p>
  )}
</div>

            <button
              type="submit"
              disabled={anyEmpty}
              className={`mt-4 mb-5 px-6 py-2 rounded w-full text-white bg-[#3B4CEE] ${
                anyEmpty
                  ? 'opacity-50 cursor-not-allowed'
                  : ' cursor-pointer'
              }`}
            >
              Pay | AUD {amount}
            </button>
          </form>

          
      </div>
            </>
             )
        }
        <div className="flex justify-center items-center pb-12">
            <p className="text-[#404348] text-sm font-semibold pr-4">
              Powered by <span>Stripe</span>
            </p>
            <span className="text-[#ECECEC] pr-1.5">|</span>
            <p className="text-[#6C6C6C] text-sm">Terms</p>
            <p className="text-[#6C6C6C] text-sm pl-4">Privacy</p>
          </div>  </div>
        {modal && (
  <PaymentModal
    modal={modal}
    // setModal={setModal}
    transactionId={modalData.transactionId}
    date={modalData.date}
    amount={modalData.amount}
    paymentMethod={modalData.paymentMethod}
  />
)}
         </div>
         
  )
}

export default HowToWriteCdr
