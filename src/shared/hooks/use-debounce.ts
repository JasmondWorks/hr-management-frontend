import { useState, useEffect } from "react";

export default function useDebounce({
  query,
  delay = 500,
}: {
  query: string;
  delay?: number;
}) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timeout);
  }, [query, delay]);

  return debouncedQuery;
}
