"use client";

import { ChevronDownIcon, CheckIcon, MinusIcon } from "@heroicons/react/24/outline";
import { TableColumn, TableProps } from "@/shared/ui/Table/types";
import { useEffect, useState, type ReactNode } from "react";
import Pagination from "./Pagination";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/shared/ui/skeleton";

const Table = <T extends { id: string | number }>(props: TableProps<T>) => {
  // Destructure props
  const {
    variant = "default",
    data,
    columns,
    loading = false,
    emptyMessage = "No data found.",
    onRowSelect,
    selectable = false,
    actions = [],
    className = "",
    rowClassName,
    onItemClick,
    getRowHref,
    isPaginated = true,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    hasHeaders = true,
    paginationClassName,
  } = props;

  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
  const [openDropdownId, setOpenDropdownId] = useState<string | number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      // Close when clicking outside ANY open action dropdown. Matching on a data
      // attribute avoids the single-shared-ref bug across rows.
      if (!target.closest("[data-table-dropdown]")) {
        setOpenDropdownId(null);
      }
    };

    // Only add listener when dropdown is open
    if (openDropdownId) {
      // Use setTimeout to ensure this runs after other click handlers
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdownId]);

  const toggleDropdown = (id: string | number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const total = data?.length ?? 0;
  const selectedCount = selectedItems.size;
  const allSelected = total > 0 && selectedCount === total;
  const someSelected = selectedCount > 0 && selectedCount < total;

  const handleHeaderToggle = () => {
    if (allSelected || someSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(data?.map((item) => item.id)));
    }
  };

  const handleSelectItem = (id: string | number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Notify parent of selection changes
  useEffect(() => {
    if (onRowSelect) {
      const selectedData = data?.filter((item) => selectedItems.has(item.id));
      onRowSelect(selectedData!);
    }
  }, [selectedItems, data, onRowSelect]);

  const renderCellContent = (column: TableColumn<T>, item: T, index: number) => {
    if (column.render) {
      return column.render(item, index);
    }

    // Default rendering - access nested properties using dot notation
    const value = column.key.split(".").reduce((obj: any, key) => obj?.[key], item);
    return value as ReactNode ?? "N/A";
  };

  if (loading) {
    return (
      <div
        className={cn(
          `grid w-full max-w-full min-w-0 grid-cols-1 overflow-hidden bg-gray-50 dark:bg-card`,
          isPaginated ? "rounded-t-2xl" : "rounded-2xl",
          className
        )}
      >
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 dark:border-border dark:divide-border">
            {hasHeaders && (
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.label ?? column.key}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-gray-200 bg-white dark:bg-card dark:divide-border">
              {Array.from({ length: 5 }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {columns.map((column) => (
                    <td key={column.label ?? column.key} className="px-6 py-4">
                      <Skeleton className="h-4 w-full rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return <TableVariant {...props} />;
  }

  return (
    <div>
      <div
        className={cn(
          `grid w-full max-w-full min-w-0 grid-cols-1 overflow-hidden bg-gray-50 dark:bg-card`,
          isPaginated ? "rounded-t-2xl" : "rounded-2xl",
          className
        )}
      >
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 dark:border-border dark:divide-border">
            {hasHeaders && (
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {selectable && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase"
                    >
                      <div
                        role="button"
                        aria-label="Select all rows"
                        onClick={handleHeaderToggle}
                        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm border border-gray-400 bg-transparent hover:border-[#7f56d9]"
                      >
                        {allSelected ? (
                          <CheckIcon className="h-4 w-4 stroke-3 text-[#7f56d9]" />
                        ) : someSelected ? (
                          <MinusIcon className="h-4 w-4 stroke-3 text-[#7f56d9]" />
                        ) : null}
                      </div>
                    </th>
                  )}
                  {columns.map((column) => (
                    <th
                      key={column.label ?? column.key}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase ${column.className || ""
                        }`}
                      style={{ width: column.width }}
                    >
                      {column.label}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-gray-200 bg-white dark:bg-card dark:divide-border">
              {!data || data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data?.map((item, index) => (
                  <tr
                    key={item.id}
                    className={cn(
                      rowClassName ? rowClassName(item, index) : "",
                      onItemClick || getRowHref ? "cursor-pointer" : ""
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemClick && onItemClick(item);
                    }}
                  >
                    {selectable && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          role="button"
                          aria-label="Select row"
                          onClick={() => handleSelectItem(item.id)}
                          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm border border-gray-400 bg-transparent hover:border-[#7f56d9]"
                        >
                          {selectedItems.has(item.id) && (
                            <CheckIcon className="h-4 w-4 stroke-3 text-[#7f56d9]" />
                          )}
                        </div>
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td
                        key={column.label ?? column.key}
                        className={cn(
                          "px-6 py-4 text-sm whitespace-nowrap",
                          column.className || "text-gray-500 dark:text-muted-foreground",
                          colIndex === 0 && getRowHref ? "relative" : ""
                        )}
                      >
                        {colIndex === 0 && getRowHref && (
                          <Link
                            href={getRowHref(item)}
                            className="absolute inset-0"
                            aria-label="View row"
                          />
                        )}
                        {renderCellContent(column, item, index)}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <div className="relative inline-block text-left" data-table-dropdown>
                          <button
                            type="button"
                            className="focus:ring-primary inline-flex w-full cursor-pointer justify-center rounded-md border border-gray-300 bg-white dark:bg-muted dark:border-border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-muted/80 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                            onClick={() => toggleDropdown(item.id)}
                          >
                            Actions
                            <ChevronDownIcon
                              className={`-mr-1 ml-2 h-5 w-5 transition-transform duration-200 ${openDropdownId === item.id ? "rotate-180" : ""
                                }`}
                            />
                          </button>
                          {openDropdownId === item.id && (
                            <div className="ring-opacity-5 absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-popover shadow-lg ring-1 ring-black dark:ring-border focus:outline-none">
                              <div className="py-1">
                                {actions
                                  .filter((action) => !action.condition || action.condition(item))
                                  .map((action, actionIndex) => (
                                    <button
                                      key={actionIndex}
                                      onClick={() => {
                                        action.onClick(item);
                                        setOpenDropdownId(null);
                                      }}
                                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-muted ${action.className || "text-gray-700 dark:text-foreground"
                                        }`}
                                    >
                                      {action.label}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isPaginated && onPageChange && (
        <Pagination
          className={paginationClassName}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
const TableVariant = <T extends { id: string | number }>(props: TableProps<T>) => {
  const {
    data,
    columns,
    emptyMessage,
    hasHeaders = true,
    isPaginated = false,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    paginationClassName,
  } = props;

  const renderCell = (column: TableColumn<T>, item: T, index: number) => {
    if (column.render) return column.render(item, index);
    const value = column.key.split(".").reduce((obj: any, key) => obj?.[key], item);
    return value as ReactNode ?? "N/A";
  };

  return (
    <div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-t border-b border-y-[#e5e7eb] dark:border-y-border">
          {hasHeaders && (
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.label ?? column.key}
                    scope="col"
                    className="py-2 pr-6 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase first:pl-0"
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-border">
            {!data?.length ? (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id}>
                  {columns.map((column) => (
                    <td
                      key={column.label ?? column.key}
                      className={
                        column.className ??
                        "py-4 pr-6 text-sm whitespace-nowrap text-[#6B7280] dark:text-muted-foreground first:pl-0"
                      }
                      style={{ width: column.width }}
                    >
                      {renderCell(column, item, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isPaginated && onPageChange && (
        <Pagination
          className={cn("bg-transparent border-x-0 border-b-0 rounded-none px-0", paginationClassName)}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
export default Table;
