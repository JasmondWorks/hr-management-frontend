import { ReactNode } from "react";

export interface TableAction<T> {
  label: string;
  onClick: (item: T) => void;
  condition?: (item: T) => boolean;
  className?: string;
}

export interface TableColumn<T> {
  key: string;
  label?: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  width?: string | number;
}

export interface TableProps<T> {
  variant?: "default" | "minimal";
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: ReactNode;
  onRowSelect?: (selectedItems: T[]) => void;
  selectable?: boolean;
  actions?: TableAction<T>[];
  className?: string;
  rowClassName?: (item: T, index: number) => string;
  loaderComponent?: ReactNode;
  onItemClick?: (item: T) => void;
  getRowHref?: (item: T) => string;
  isPaginated?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  hasHeaders?: boolean;
  paginationClassName?: string;
}
