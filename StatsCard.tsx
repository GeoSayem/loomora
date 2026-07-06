import { LucideIcon } from "lucide-react";

export function StatsCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="card-surface p-6 flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-espresso">{label}</p>
        <p className="font-display text-3xl mt-2">{value}</p>
      </div>
      <Icon className="h-5 w-5 text-gold" />
    </div>
  );
}
