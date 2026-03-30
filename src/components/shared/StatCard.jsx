import { cn } from "@/lib/utils";

export default function StatCard({ icon: Icon, label, value, change, className }) {
  return (
    <div className={cn("bg-card rounded-xl border border-border p-5 transition-shadow hover:shadow-md", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-heading font-bold mt-1">{value}</p>
          {change && (
            <p className={cn("text-xs mt-1 font-medium", change > 0 ? "text-green-600" : "text-red-500")}>
              {change > 0 ? "+" : ""}{change}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-secondary">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}