import React from 'react';
import debounce from 'lodash.debounce';
import { Search, X } from 'lucide-react';

interface ISearchPost {
  setSearch: (search: string) => void;
}

const SearchPost = ({ setSearch }: ISearchPost) => {
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const updateSearch = React.useMemo(
    () => debounce((value: string) => setSearch(value), 400),
    [setSearch],
  );

  React.useEffect(() => () => updateSearch.cancel(), [updateSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    updateSearch(e.target.value);
  };

  const handleClearSearch = () => {
    updateSearch.cancel();
    setSearch('');
    setInputValue('');
    inputRef.current?.focus();
  };

  return (
    <div className="group relative w-full max-w-md flex-1">
      <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600" />
      <input
        placeholder="Search posts..."
        value={inputValue}
        onChange={handleInputChange}
        className="h-11 w-full rounded-full bg-white pr-11 pl-11 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 outline-hidden transition placeholder:text-gray-400 hover:ring-gray-300 focus:ring-2 focus:ring-blue-500"
        maxLength={50}
        ref={inputRef}
      />
      {inputValue && (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
          onClick={handleClearSearch}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};

export default SearchPost;
