import React from 'react';
import debounce from 'lodash.debounce';

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
        <div className="flex w-full justify-center xl:justify-start">
            <div className="relative w-60 md:w-80">
                <input
                    placeholder="Search..."
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-2 bg-white px-3 py-2 text-xl text-black outline-hidden transition-all duration-300 focus:border-blue-500"
                    maxLength={50}
                    ref={inputRef}
                />
                {inputValue && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        className="material-symbols-outlined absolute top-3 right-2 cursor-pointer"
                        onClick={handleClearSearch}
                    >
                        close
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchPost;
