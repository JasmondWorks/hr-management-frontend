import { ReactNode } from "react";

export interface TableColumn<T> {
  key?: keyof T;
  label?: string;
  render?: (row: T) => ReactNode;
  // isSortable?: boolean;
  // isSelectable?: boolean;
}

// export interface TableColumn<T = any, V = any> {
//   accessorKey: string;
//   header: string;
//   accessorFn?: (row: T) => V;
//   cell?: (row: T) => ReactNode;
//   enableSorting?: boolean;
// }
