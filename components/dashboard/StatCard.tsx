import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  caption: string;
  positive?: boolean;
  icon: ReactNode;
}

export default function StatCard({ title, value, change, caption, positive = true, icon }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className="stat-icon">{icon}</span>
        <span className="stat-label">{title}</span>
        <span className="stat-menu-mark" aria-hidden="true">···</span>
      </div>
      <p className="stat-value">{value}</p>
      <div className="stat-card-bottom">
        <span className={`change-pill${positive ? " is-positive" : " is-negative"}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
        <span className="stat-caption">{caption}</span>
      </div>
    </article>
  );
}