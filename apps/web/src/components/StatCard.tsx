import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value?: string | number | React.ReactNode;
  icon?: React.ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  description?: string;
  isLoading?: boolean;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection,
  description,
  isLoading,
  className, 
  ...props 
}: StatCardProps) {
  return (
    <div 
      className={cn("bg-card border border-border rounded-lg p-5 flex flex-col shadow-sm backdrop-blur-sm", className)} 
      {...props}
    >
      <div className="flex items-center justify-between mb-3 text-muted-foreground">
        <h3 className="text-xs font-medium uppercase tracking-wider">{title}</h3>
        {icon && <span className="text-muted-foreground/60">{icon}</span>}
      </div>
      
      {isLoading ? (
        <div className="space-y-2 mb-1 mt-1">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-2xl font-semibold text-foreground">{value}</div>
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trendDirection === "up" ? "text-green-500" : 
                trendDirection === "down" ? "text-red-500" : "text-muted-foreground"
              )}>
                {trend}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </>
      )}
    </div>
  )
}
