import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/shared/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// Builds a compact page list with ellipses, e.g. [1, "…", 4, 5, 6, "…", 12].
function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const items: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("ellipsis");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  // Always render when invoked (even for a single page -> "Page 1 of 1").
  const total = Math.max(totalPages, 1);
  const page = Math.min(Math.max(currentPage, 1), total);

  const canPrev = page > 1;
  const canNext = page < total;
  const items = getPageItems(page, total);

  const arrowClass =
    "inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-b-2xl border border-t-0 border-border bg-card px-4 py-3",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span>{" "}
        of <span className="font-medium text-foreground">{total}</span>
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className={arrowClass}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="size-4" />
        </button>

        {items.map((item, i) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="inline-flex size-9 items-center justify-center text-sm text-muted-foreground"
            >
              &hellip;
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                item === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className={arrowClass}
          aria-label="Next page"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </nav>
    </div>
  );
}
