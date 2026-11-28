import * as Yup from 'yup';

export const UserEditSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, '* Firstname is too short!')
    .max(20, '* Firstname is too long!')
    .required('* Name is required'),
  lastName: Yup.string()
    .min(3, '* Lastname is too short!')
    .max(20, '* Lastname is too long!')
    .required('* Name is required'),
  email: Yup.string().email('* Invalid email').required('* Email is required'),
  description: Yup.string()
    .test(
      'min-length',
      '* Bio is too short!',
      (value) => !value || value.length >= 10,
    )
    .max(300, '* Bio is too long!'),
});
