import { Card } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  trend?: "up" | "down";
  loading?: boolean;
}

export function StatCard({ label, value, delta, trend = "up", loading }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      {loading ? (
        <div className="flex items-center justify-between">
          <div className="h-9 w-20 bg-muted animate-pulse rounded-md"></div>
          <div className="h-5 w-10 bg-muted animate-pulse rounded-full"></div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-card-foreground">{value}</span>
          {delta && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                trend === "up"
                  ? "bg-success/15 text-success"
                  : "bg-destructive/15 text-destructive",
              )}
            >
              {delta}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}

export default StatCard;
