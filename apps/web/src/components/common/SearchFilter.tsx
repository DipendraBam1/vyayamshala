import type { ChangeEvent } from "react";

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;

  searchPlaceholder?: string;

  dateValue?: string;
  onDateChange?: (value: string) => void;
}

export default function SearchFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  dateValue,
  onDateChange,
}: SearchFilterProps) {
  function handleSearch(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    onSearchChange(e.target.value);
  }

  function handleDate(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    onDateChange?.(e.target.value);
  }

  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row">
      {/* Search */}
      <input
        type="text"
        value={searchValue}
        onChange={handleSearch}
        placeholder={searchPlaceholder}
        className="h-11 w-full rounded-lg border border-gray-700 bg-gray-950 px-4 text-white outline-none placeholder:text-gray-500 focus:border-primary md:max-w-md"
      />

      {/* Date */}
      {onDateChange && (
        <input
          type="date"
          value={dateValue || ""}
          onChange={handleDate}
          className="h-11 rounded-lg border border-gray-700 bg-gray-950 px-4 text-white outline-none focus:border-primary"
        />
      )}
    </div>
  );
}
