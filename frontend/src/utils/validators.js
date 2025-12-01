/**
 * Validation utility functions (used with Formik/Yup)
 */
import * as Yup from 'yup';

/**
 * Email validation schema
 */
export const emailSchema = Yup.string()
  .email('Invalid email')
  .required('Email is required');

/**
 * Password validation schema
 */
export const passwordSchema = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase and numbers'
  )
  .required('Password is required');

/**
 * Phone validation schema
 */
export const phoneSchema = Yup.string()
  .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
  .required('Phone is required');

/**
 * CPF validation
 */
export const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

/**
 * CPF validation schema
 */
export const cpfSchema = Yup.string()
  .test('cpf-valid', 'Invalid CPF', validateCPF)
  .required('CPF is required');

/**
 * Login validation schema
 */
export const loginValidationSchema = Yup.object({
  email: emailSchema,
  password: Yup.string().required('Password is required'),
});

/**
 * Register validation schema
 */
export const registerValidationSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: emailSchema,
  password: passwordSchema,
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: Yup.string().oneOf(['tenant', 'landlord']).required('Please select an account type'),
  terms: Yup.boolean().oneOf([true], 'You must accept the terms'),
});

/**
 * Property creation validation schema
 */
export const propertyValidationSchema = Yup.object({
  title: Yup.string()
    .min(10, 'Title must be at least 10 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(50, 'Description must be at least 50 characters')
    .required('Description is required'),
  property_type: Yup.string().required('Property type is required'),
  place_type: Yup.string().required('Place type is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  postal_code: Yup.string().required('Postal code is required'),
  bedrooms: Yup.number()
    .min(0, 'Must have at least 0 bedrooms')
    .required('Number of bedrooms is required'),
  bathrooms: Yup.number()
    .min(0.5, 'Must have at least 0.5 bathrooms')
    .required('Number of bathrooms is required'),
  max_guests: Yup.number()
    .min(1, 'Must accept at least 1 guest')
    .required('Maximum number of guests is required'),
  base_price: Yup.number()
    .min(1, 'Price must be greater than 0')
    .required('Base price is required'),
});

/**
 * Booking validation schema
 */
export const bookingValidationSchema = Yup.object({
  check_in: Yup.date()
    .min(new Date(), 'Check-in date must be in the future')
    .required('Check-in date is required'),
  check_out: Yup.date()
    .min(Yup.ref('check_in'), 'Check-out date must be after check-in')
    .required('Check-out date is required'),
  guests_count: Yup.number()
    .min(1, 'Must have at least 1 guest')
    .required('Number of guests is required'),
});

/**
 * Review validation schema
 */
export const reviewValidationSchema = Yup.object({
  rating: Yup.number()
    .min(1, 'Minimum rating is 1')
    .max(5, 'Maximum rating is 5')
    .required('Rating is required'),
  review_text: Yup.string()
    .min(20, 'Review must be at least 20 characters')
    .required('Review is required'),
});

