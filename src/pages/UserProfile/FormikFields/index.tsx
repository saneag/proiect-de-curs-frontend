import { ErrorMessage, Field } from 'formik';

import { type IFormikFieldsProps } from 'shared/interfaces/IFormikFieldsProps';

export const FormikFields = ({ value, type, disabled }: IFormikFieldsProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={value} className="capitalize">
        {value.toLowerCase()}
      </label>
      <Field
        id={value}
        name={value}
        type={type || 'text'}
        className={`mb-4 w-full rounded-md border border-gray-300 bg-white p-3 text-lg text-black outline-hidden duration-300 focus:border-blue-500 ${disabled && 'cursor-default'}`}
        disabled={disabled}
      />
      <ErrorMessage
        name={value}
        component="div"
        className="-mt-3 mb-3 font-bold text-red-500"
      />
    </div>
  );
};

interface IFormikTextAreaProps {
  value: string;
  placeholder: string;
  label?: string;
  disabled?: boolean;
}

export const FormikTextArea = ({
  value,
  placeholder,
  label,
  disabled,
}: IFormikTextAreaProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={value} className="capitalize">
        {label ?? value}
      </label>
      <div className="relative">
        <Field
          as="textarea"
          id={value}
          name={value}
          placeholder={placeholder}
          className={`mb-4 min-h-32 w-full resize-none rounded-md border border-gray-300 bg-white p-3 text-lg text-black outline-hidden duration-300 focus:border-blue-500 ${
            disabled && 'cursor-default'
          } `}
          disabled={disabled}
        />
        {!disabled && (
          <span className="absolute right-2 bottom-0">
            <span
              className={`${
                placeholder.length > 300 && 'font-bold text-red-500'
              }`}
            >
              {placeholder.length}
            </span>
            /300
          </span>
        )}
      </div>
      <ErrorMessage
        name={value}
        component="div"
        className="-mt-3 mb-3 font-bold text-red-500"
      />
    </div>
  );
};
