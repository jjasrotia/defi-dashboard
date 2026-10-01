"use client";

import { useState, useSyncExternalStore } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  Layers3,
  Moon,
  Percent,
  Sun,
  Wallet,
  X,
} from "lucide-react";
import AssetList, { assets } from "@/components/dashboard/AssetList";
import Header from "@/components/dashboard/Header";
import PoolList, { pools } from "@/components/dashboard/PoolList";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import Sidebar from "@/components/dashboard/Sidebar";
import StatCard from "@/components/dashboard/StatCard";
import "./dashboard.css";

const activityItems = [
  { title: "Swap completed", detail: "0.42 ETH to 1,286.40 USDC", time: "12 min ago", amount: "+$1,286.40", kind: "swap" },
  { title: "Supply to Aave", detail: "USDC lending position", time: "2 hours ago", amount: "$2,000.00", kind: "supply" },
  { title: "Reward received", detail: "Uniswap V3 · ETH / USDC", time: "Yesterday", amount: "+$18.62", kind: "reward" },
];

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

const themeChangeEvent = "defix-theme-change";

function subscribeToTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(themeChangeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(themeChangeEvent, onChange);
  };
}

function getThemeSnapshot(): "dark" | "light" {
  return window.localStorage.getItem("defix-theme") === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): "dark" | "light" {
  return "dark";
}

export default function Dashboard() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleActivity = activityItems.filter((item) =>
    `${item.title} ${item.detail} ${item.amount}`.toLowerCase().includes(normalizedQuery),
  );
  const visibleAssetCount = assets.filter((asset) =>
    `${asset.symbol} ${asset.name} ${asset.amount}`.toLowerCase().includes(normalizedQuery),
  ).length;
  const visiblePoolCount = pools.filter((pool) =>
    `${pool.pair} ${pool.protocol} ${pool.tags.join(" ")}`.toLowerCase().includes(normalizedQuery),
  ).length;

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  function setTheme(nextTheme: "dark" | "light") {
    window.localStorage.setItem("defix-theme", nextTheme);
    window.dispatchEvent(new Event(themeChangeEvent));
  }

  function exportReport() {
    const rows: (string | number)[][] = [
      ["Record type", "Name", "Symbol or pair", "Amount", "Price or TVL", "Change or APY", "Value"],
      ...assets.map((asset) => ["Asset", asset.name, asset.symbol, asset.amount, asset.price, asset.change, asset.value]),
      ...pools.map((pool) => ["Pool", pool.protocol, pool.pair, "", pool.tvl, pool.apy, ""]),
      ...activityItems.map((item) => ["Activity", item.title, item.detail, item.time, "", "", item.amount]),
    ];
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `forma-demo-portfolio-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function navigateTo(section: string) {
    setActiveSection(section);
    setMobileNavOpen(false);
  }

  return (
    <div className="dashboard-shell" data-density={compactView ? "compact" : "comfortable"} data-theme={theme}>
      <Sidebar
        activeSection={activeSection}
        mobileOpen={mobileNavOpen}
        onNavigate={navigateTo}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <main className="dashboard-main" id="overview">
        <Header
          onMenuToggle={() => setMobileNavOpen(!mobileNavOpen)}
          onThemeToggle={toggleTheme}
          theme={theme}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notificationsEnabled={notificationsEnabled}
        />

        <div className="dashboard-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">Demo portfolio</p>
              <h1>Portfolio overview</h1>
              <p className="muted-copy">A clear view of your assets, performance, and opportunities.</p>
            </div>
            <button className="button button-secondary export-button" onClick={exportReport} type="button">
              <ArrowDownToLine size={16} />
              <span>Export report</span>
            </button>
          </div>

          {normalizedQuery && (
            <div className="search-summary" role="status">
              <span>{visibleAssetCount + visiblePoolCount + visibleActivity.length} matches across assets, pools, and activity</span>
              <button onClick={() => setSearchQuery("")} type="button">Clear search <X size={13} /></button>
            </div>
          )}

          <section aria-label="Portfolio summary" className="stats-grid">
            <StatCard title="Total balance" value="$24,580.42" change="4.28%" caption="vs. last month" positive icon={<Wallet size={18} />} />
            <StatCard title="24h change" value="+$428.20" change="1.76%" caption="vs. previous 24h" positive icon={<Activity size={18} />} />
            <StatCard title="Average APY" value="8.42%" change="0.84%" caption="across your positions" positive icon={<Percent size={18} />} />
          </section>

          <section className="chart-section" id="performance" aria-label="Portfolio performance">
            <PortfolioChart />
          </section>

          <div className="dashboard-columns">
            <section id="assets" aria-label="Your assets">
              <AssetList query={searchQuery} />
            </section>
            <section id="pools" aria-label="Top liquidity pools">
              <PoolList query={searchQuery} />
            </section>
          </div>

          <section className="panel activity-panel" id="activity" aria-labelledby="activity-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">On-chain</p>
                <h2 id="activity-title">Recent activity</h2>
              </div>
              <button className="text-button" type="button">View all <ArrowUpRight size={15} /></button>
            </div>
            <div className="activity-list">
              {visibleActivity.map((item) => (
                <div className="activity-row" key={item.title}>
                  <div className={`activity-icon activity-icon-${item.kind}`}>
                    {item.kind === "swap" ? <ArrowUpRight size={17} /> : item.kind === "supply" ? <Layers3 size={17} /> : <CircleDollarSign size={17} />}
                  </div>
                  <div className="activity-description">
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                  <span className="activity-time">{item.time}</span>
                  <strong className="activity-amount">{item.amount}</strong>
                </div>
              ))}
              {visibleActivity.length === 0 && <p className="empty-search-result">No activity matches “{searchQuery}”.</p>}
            </div>
          </section>

          <footer className="dashboard-footer">Sample portfolio data for interface preview.</footer>
        </div>
      </main>

      {settingsOpen && (
        <div className="settings-backdrop" onClick={() => setSettingsOpen(false)} role="presentation">
          <section aria-labelledby="settings-title" aria-modal="true" className="settings-dialog" onClick={(event) => event.stopPropagation()} role="dialog">
            <header className="settings-heading">
              <div><p className="eyebrow">Preferences</p><h2 id="settings-title">Dashboard settings</h2></div>
              <button aria-label="Close settings" className="icon-button" onClick={() => setSettingsOpen(false)} type="button"><X size={18} /></button>
            </header>
            <div className="settings-options">
              <div className="settings-option">
                <div><strong>Appearance</strong><span>Choose a dashboard color mode.</span></div>
                <div className="settings-segmented">
                  <button aria-pressed={theme === "light"} className={theme === "light" ? "is-selected" : ""} onClick={() => setTheme("light")} type="button"><Sun size={15} />Light</button>
                  <button aria-pressed={theme === "dark"} className={theme === "dark" ? "is-selected" : ""} onClick={() => setTheme("dark")} type="button"><Moon size={15} />Dark</button>
                </div>
              </div>
              <div className="settings-option">
                <div><strong>Compact tables</strong><span>Reduce row spacing in dashboard lists.</span></div>
                <button aria-checked={compactView} aria-label="Compact tables" className={`settings-switch${compactView ? " is-on" : ""}`} onClick={() => setCompactView(!compactView)} role="switch" type="button"><span /></button>
              </div>
              <div className="settings-option">
                <div><strong>Notifications</strong><span>Show the dashboard activity bell.</span></div>
                <button aria-checked={notificationsEnabled} aria-label="Enable notifications" className={`settings-switch${notificationsEnabled ? " is-on" : ""}`} onClick={() => setNotificationsEnabled(!notificationsEnabled)} role="switch" type="button"><span /></button>
              </div>
            </div>
            <footer className="settings-footer"><span><Check size={14} /> Changes apply immediately</span><button className="button button-secondary" onClick={() => setSettingsOpen(false)} type="button">Done</button></footer>
          </section>
        </div>
      )}
    </div>
  );
}