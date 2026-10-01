"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartData: Record<string, { name: string; value: number }[]> = {
  "1D": [
    { name: "09:00", value: 24120 }, { name: "11:00", value: 24320 }, { name: "13:00", value: 24180 },
    { name: "15:00", value: 24510 }, { name: "17:00", value: 24420 }, { name: "19:00", value: 24580 },
  ],
  "1W": [
    { name: "Mon", value: 23920 }, { name: "Tue", value: 24180 }, { name: "Wed", value: 24060 },
    { name: "Thu", value: 24320 }, { name: "Fri", value: 24210 }, { name: "Sat", value: 24480 }, { name: "Sun", value: 24580 },
  ],
  "1M": [
    { name: "Sep 01", value: 22040 }, { name: "Sep 06", value: 22410 }, { name: "Sep 11", value: 22280 },
    { name: "Sep 16", value: 23360 }, { name: "Sep 21", value: 23090 }, { name: "Sep 26", value: 23920 }, { name: "Oct 01", value: 24580 },
  ],
  "3M": [
    { name: "Jul 01", value: 18420 }, { name: "Jul 16", value: 19260 }, { name: "Aug 01", value: 20680 },
    { name: "Aug 16", value: 20140 }, { name: "Sep 01", value: 22040 }, { name: "Sep 16", value: 23360 }, { name: "Oct 01", value: 24580 },
  ],
  "1Y": [
    { name: "Oct", value: 14210 }, { name: "Dec", value: 15780 }, { name: "Feb", value: 16640 },
    { name: "Apr", value: 18420 }, { name: "Jun", value: 20120 }, { name: "Aug", value: 21860 }, { name: "Oct", value: 24580 },
  ],
};

const periods = Object.keys(chartData);

export default function PortfolioChart() {
  const [period, setPeriod] = useState("1M");

  return (
    <div className="panel performance-panel">
      <div className="performance-heading">
        <div>
          <p className="eyebrow">Portfolio performance</p>
          <div className="performance-total"><h2>$24,580.42</h2><span><ArrowUpRight size={15} /> 4.28%</span></div>
          <p className="performance-caption">+$1,012.84 <span>over the last 30 days</span></p>
        </div>
        <div aria-label="Chart time range" className="period-switcher" role="group">
          {periods.map((item) => (
            <button aria-pressed={period === item} className={period === item ? "is-selected" : ""} key={item} onClick={() => setPeriod(item)} type="button">{item}</button>
          ))}
        </div>
      </div>

      <div className="performance-chart">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={chartData[period]} margin={{ top: 12, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-line)" stopOpacity={0.26} />
                <stop offset="100%" stopColor="var(--chart-line)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 5" vertical={false} />
            <XAxis axisLine={false} dataKey="name" tick={{ fill: "var(--muted)", fontSize: 11 }} tickLine={false} tickMargin={12} />
            <YAxis axisLine={false} domain={["dataMin - 900", "dataMax + 500"]} tick={{ fill: "var(--muted)", fontSize: 11 }} tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`} tickLine={false} width={48} />
            <Tooltip
              contentStyle={{ background: "var(--panel-raised)", border: "1px solid var(--border-strong)", borderRadius: 8, color: "var(--text)", fontSize: 12 }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Balance"]}
              labelStyle={{ color: "var(--muted)", marginBottom: 4 }}
            />
            <Area activeDot={{ r: 4, fill: "var(--chart-line)", stroke: "var(--panel)", strokeWidth: 2 }} dataKey="value" fill="url(#portfolioFill)" stroke="var(--chart-line)" strokeWidth={2.5} type="monotone" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="performance-summary">
        <div><span>Invested</span><strong>$21,842.10</strong></div>
        <div><span>Total profit</span><strong className="positive-text">+$2,738.32</strong></div>
        <div><span>24h change</span><strong className="positive-text">+1.76%</strong></div>
        <div><span>Risk profile</span><strong><i className="risk-indicator" />Moderate</strong></div>
      </div>
    </div>
  );
}