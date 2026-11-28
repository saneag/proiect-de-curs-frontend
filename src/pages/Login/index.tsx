import React from 'react';
import { motion } from 'framer-motion';
import { Form, Formik, type FormikHelpers } from 'formik';
import { LoaderCircle } from 'lucide-react';
import { useAppDispatch } from 'redux/store';
import { useLocation, useNavigate } from 'react-router';

import { login, register, resetStatus } from 'redux/slices/userSlice';
import { type IUserRegister } from 'shared/interfaces/IUser';

import { FormikFields, ApiError } from './FormikFields';
import { LoginSchema, RegisterSchema } from './FormikSchemas';

interface IPayload {
  isAuthenticated: boolean;
  status: number;
}

const Login = () => {
  const dispatch = useAppDispatch();

  const [isRegister, setIsRegister] = React.useState(false);
  const [responseStatus, setResponseStatus] = React.useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const handleClick = (
    setErrorsCallback: FormikHelpers<IUserRegister>['setErrors'],
    resetFormCallback: FormikHelpers<IUserRegister>['resetForm'],
  ) => {
    setIsRegister(!isRegister);
    dispatch(resetStatus());
    setErrorsCallback({});
    resetFormCallback();
  };

  const validate = async (values: IUserRegister) => {
    const { password, email } = values;

    if (isRegister) {
      const { payload } = await dispatch(register(values));
      const { status } = payload as IPayload;
      setResponseStatus(status);
      if (status === 409) {
        return;
      }
    } else {
      const { payload } = await dispatch(login({ email, password }));
      const { status } = payload as IPayload;
      setResponseStatus(status);

      if (status === 401) {
        return;
      }
    }

    navigate(redirectTo, { replace: true });
    setIsRegister(false);
  };

  return (
    <div className="flex min-h-screen flex-wrap content-center justify-center bg-blue-950">
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-white shadow-2xl shadow-sky-400/40 max-sm:w-full sm:w-8/12 md:w-6/12 xl:w-4/12"
      >
        <Formik
          initialValues={{
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            confirmPassword: '',
          }}
          validationSchema={isRegister ? RegisterSchema : LoginSchema}
          onSubmit={validate}
        >
          {({ setErrors, resetForm, isSubmitting }) => (
            <Form
              aria-busy={isSubmitting}
              className="flex size-full flex-col flex-wrap content-center justify-center rounded-2xl py-6"
            >
              {isRegister && (
                <FormikFields value={'firstName'} placeholder={'John'} />
              )}
              {isRegister && (
                <FormikFields value={'lastName'} placeholder={'Doe'} />
              )}
              <FormikFields
                value={'email'}
                placeholder={'example@example.com'}
              />
              <FormikFields
                value={'password'}
                placeholder={isRegister ? 'At least 6 characters' : 'password'}
                type={'password'}
              />
              {isRegister && (
                <FormikFields
                  value={'confirmPassword'}
                  placeholder={'Repeat your password'}
                  type={'password'}
                />
              )}

              {!isRegister && responseStatus === 401 && (
                <ApiError value={'Username or password is wrong'} />
              )}

              {isRegister && responseStatus === 409 && (
                <ApiError value={'Email already exist'} />
              )}

              {!isRegister && responseStatus === 500 && (
                <ApiError value={'Something went wrong with server'} />
              )}

              <div className="flex justify-around">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-5/12 items-center justify-center gap-2 self-center rounded-full border-b-4 border-blue-900 bg-linear-to-r from-blue-500 to-blue-800 p-2 text-xl text-white shadow-lg shadow-blue-900/25 transition-[translate,border-width,box-shadow] duration-75 active:translate-y-1 active:border-b-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && (
                    <LoaderCircle
                      aria-hidden="true"
                      className="size-5 animate-spin"
                    />
                  )}
                  {isRegister ? 'Register' : 'Login'}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  className={`w-5/12 self-center rounded-full border-b-4 border-green-900 bg-linear-to-l from-green-500 to-green-800 p-2 text-xl text-white shadow-lg shadow-green-900/25 transition-[translate,border-width,box-shadow] duration-75 active:translate-y-1 active:border-b-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 ${
                    isRegister
                      ? 'border-yellow-900 from-yellow-500 ' + 'to-yellow-800'
                      : ''
                  }`}
                  onClick={() => handleClick(setErrors, resetForm)}
                >
                  {isRegister ? 'Back' : 'Register'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default Login;
