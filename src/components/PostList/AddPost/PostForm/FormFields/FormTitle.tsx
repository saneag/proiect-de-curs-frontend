import { useEffect, useRef } from 'react';

interface Props {
  title: string;
  setTitle: (title: string) => void;
}

const FormTitle = ({ title, setTitle }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <input
        type="text"
        ref={inputRef}
        aria-label="Title"
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-xl font-semibold text-gray-900 outline-hidden transition placeholder:font-normal placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        placeholder="Give your post a title"
        value={title}
        maxLength={50}
        onChange={(e) => setTitle(e.target.value)}
      />
      <span className="self-end text-sm text-gray-400">{title.length}/50</span>
    </div>
  );
};

export default FormTitle;
