import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border border-border ${className}`}
    >
      {icon && (
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-primary">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
