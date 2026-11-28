import { Field, useField, useFormikContext } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';

import { type IFormikFieldsProps } from 'shared/interfaces/IFormikFieldsProps';

export const FormikFields = ({
  value,
  placeholder,
  type,
}: IFormikFieldsProps) => {
  const { submitCount } = useFormikContext();
  const [field, meta] = useField(value);
  const [editedSinceSubmit, setEditedSinceSubmit] = useState(false);
  const [lastSubmitCount, setLastSubmitCount] = useState(submitCount);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  if (lastSubmitCount !== submitCount) {
    setLastSubmitCount(submitCount);
    setEditedSinceSubmit(false);
  }

  const isPassword = type === 'password';
  const hasValue = String(field.value ?? '').length > 0;
  const showError = submitCount > 0 && !editedSinceSubmit && !!meta.error;

  return (
    <>
      <label
        htmlFor={value}
        className="text-md font-medium text-gray-400 capitalize max-sm:text-sm"
      >
        {value}
      </label>
      <div className="relative mb-4 w-9/12">
        <Field
          id={value}
          name={value}
          placeholder={placeholder}
          type={isPassword && isPasswordVisible ? 'text' : type || 'text'}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            field.onChange(e);
            setEditedSinceSubmit(true);
          }}
          className={`w-full rounded-md bg-cyan-900 p-3 text-xl text-white shadow-sm outline-hidden duration-300 hover:shadow-md focus:shadow-md ${isPassword ? 'pr-12' : ''}`}
        />
        {isPassword && hasValue && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-300 hover:text-white"
          >
            {isPasswordVisible ? (
              <Eye className="size-6" />
            ) : (
              <EyeOff className="size-6" />
            )}
          </button>
        )}
      </div>
      {showError && (
        <div className="-mt-3 mb-3 font-bold text-red-500">{meta.error}</div>
      )}
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
