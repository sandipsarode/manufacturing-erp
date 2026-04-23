interface StatusBadgeProps {
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  "IN_PROGRESS":  "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  "COMPLETED":    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "DRAFT":        "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "HOLD":         "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  "CANCELLED":    "bg-red-50 text-red-700 ring-1 ring-red-200",
  "active":       "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "inactive":     "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
  "IN":           "bg-green-50 text-green-700 ring-1 ring-green-200",
  "OUT":          "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  "IN_PROGRESS": "In Progress",
  "COMPLETED":   "Completed",
  "DRAFT":       "Draft",
  "HOLD":        "On Hold",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status] || "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
  const label  = STATUS_LABELS[status] || status;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}
