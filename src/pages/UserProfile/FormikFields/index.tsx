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
        className={`mb-4 w-80 rounded-md border-2 bg-white p-3 text-xl text-black outline-hidden duration-300 md:w-72 ${disabled && 'cursor-default'}`}
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
  disabled?: boolean;
}

export const FormikTextArea = ({
  value,
  placeholder,
  disabled,
}: IFormikTextAreaProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={value} className="capitalize">
        {value}
      </label>
      <div className="relative">
        <Field
          as="textarea"
          id={value}
          name={value}
          placeholder={placeholder}
          className={`mb-4 min-h-50 w-80 resize-none rounded-md border-2 bg-white p-3 text-xl text-black outline-hidden duration-300 ${
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
