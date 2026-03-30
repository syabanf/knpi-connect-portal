import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, title, description, children }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-full bg-secondary mb-4">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-heading font-semibold text-lg">{title || "No data yet"}</h3>
      {description && <p className="text-muted-foreground text-sm mt-1 max-w-sm">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}