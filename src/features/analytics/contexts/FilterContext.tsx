import { createContext, useContext, useState, ReactNode } from 'react';

type SortBy = 'time' | 'plays';

interface FilterContextType {
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  const [sortBy, setSortBy] = useState<SortBy>('time');

  return (
    <FilterContext.Provider
      value={{
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
}
