
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

const StatCard = ({ title, value, icon, className, trend }: StatCardProps) => {
  return (
    <div className={cn("glass-card p-6 flex flex-col", className)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 font-medium">{title}</h3>
        {icon && <div className="text-sypher-accent">{icon}</div>}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold">{value}</div>
        
        {trend && (
          <div 
            className={cn(
              "flex items-center text-sm",
              trend.positive ? "text-green-500" : "text-red-500"
            )}
          >
            <span>{trend.positive ? "+" : "-"}{trend.value}%</span>
            <svg 
              className="h-4 w-4 ml-1" 
              viewBox="0 0 24 24" 
              fill="none"
              style={{ 
                transform: trend.positive ? "rotate(0deg)" : "rotate(180deg)" 
              }}
            >
              <path 
                d="M6 9l6-6 6 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
