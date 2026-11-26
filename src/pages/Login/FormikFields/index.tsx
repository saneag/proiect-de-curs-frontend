import { ErrorMessage, Field } from 'formik';

import { type IFormikFieldsProps } from 'shared/interfaces/IFormikFieldsProps';

export const FormikFields = ({
  value,
  placeholder,
  type,
}: IFormikFieldsProps) => {
  return (
    <>
      <label
        htmlFor={value}
        className="text-md font-medium text-gray-400 capitalize max-sm:text-sm"
      >
        {value}
      </label>
      <Field
        id={value}
        name={value}
        placeholder={placeholder}
        type={type || 'text'}
        className="mb-4 w-9/12 rounded-md bg-cyan-900 p-3 text-xl text-white shadow-md shadow-cyan-700/50 outline-hidden duration-300 hover:shadow-cyan-700 focus:shadow-cyan-700"
      />
      <ErrorMessage
        name={value}
        component="div"
        className="-mt-3 mb-3 font-bold text-red-500"
      />
    </>
  );
};

export const ApiError = ({ value }: IFormikFieldsProps) => {
  return (
    <div>
      <p className="-mt-2 mb-3 text-center font-bold text-red-500">{value}</p>
    </div>
  );
};
