import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusColors = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  suspended: "bg-red-100 text-red-700",
  upcoming: "bg-blue-100 text-blue-700",
  ongoing: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
  submitted: "bg-blue-100 text-blue-700",
  in_review: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  registered: "bg-blue-100 text-blue-700",
  attended: "bg-green-100 text-green-700",
  absent: "bg-red-100 text-red-700",
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
  urgent: "bg-red-100 text-red-700",
  general: "bg-blue-100 text-blue-700",
  regular: "bg-blue-100 text-blue-700",
  premium: "bg-purple-100 text-purple-700",
  honorary: "bg-orange-100 text-orange-700",
};

export default function StatusBadge({ status, className }) {
  const color = statusColors[status] || "bg-gray-100 text-gray-700";
  return (
    <Badge variant="secondary" className={cn("border-0 font-medium capitalize", color, className)}>
      {status?.replace(/_/g, " ")}
    </Badge>
  );
}