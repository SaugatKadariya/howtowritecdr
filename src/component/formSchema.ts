import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email({ message: 'Please enter your email' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
//   cardNumber: z
//     .string()
//     .min(19, { message: 'Card number must be 16 digits with spaces' })
//     .regex(/^(\d{4} \d{4} \d{4} \d{4})$/, {
//       message: 'Card number must be in format 4242 4242 4242 4242',
//     })
//    ,

//   expiryDate: z
//     .string()
//     .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, {
//       message: 'Expiry date must be in MM/YY format',
//     }),

//   cvc: z.string().regex(/^\d{3,4}$/, { message: 'CVC must be 3 or 4 digits' }),
});

