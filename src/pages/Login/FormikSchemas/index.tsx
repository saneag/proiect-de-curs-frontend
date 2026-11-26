import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('* Email is required'),
  password: Yup.string().required('* Password is required'),
});

export const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('* Invalid email').required('* Email is required'),
  password: Yup.string()
    .min(12, '* Password must be at least 12 characters!')
    .max(72, '* Password is too long!')
    .required('* Password is required'),
  firstName: Yup.string()
    .min(3, '* Firstname is too short!')
    .max(20, '* Firstname is too long!')
    .required('* Name is required'),
  lastName: Yup.string()
    .min(3, '* Lastname is too short!')
    .max(20, '* Lastname is too long!')
    .required('* Name is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], '* Password does not match')
    .required('* Confirm password is required'),
});
