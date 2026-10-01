"use client";

import {
  ArrowLeftRight,
  CircleHelp,
  Coins,
  Droplets,
  LayoutDashboard,
  Settings,
  Wallet,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Overview", section: "overview", icon: LayoutDashboard },
  { name: "Performance", section: "performance", icon: Wallet },
  { name: "Assets", section: "assets", icon: Coins },
  { name: "Pools", section: "pools", icon: Droplets },
  { name: "Activity", section: "activity", icon: ArrowLeftRight },
];

interface SidebarProps {
  activeSection: string;
  mobileOpen: boolean;
  onNavigate: (section: string) => void;
  onOpenSettings: () => void;
}

export default function Sidebar({ activeSection, mobileOpen, onNavigate, onOpenSettings }: SidebarProps) {
  return (
    <>
      {mobileOpen && <button aria-label="Close navigation" className="sidebar-backdrop" onClick={() => onNavigate(activeSection)} type="button" />}
      <aside className={`dashboard-sidebar${mobileOpen ? " is-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark"><span>F</span></div>
          <div className="brand-name">FORMA<span>finance</span></div>
          <button aria-label="Close navigation" className="icon-button sidebar-close" onClick={() => onNavigate(activeSection)} type="button"><X size={18} /></button>
        </div>

        <div className="sidebar-network"><span className="network-dot" /> Ethereum · Demo <span className="network-chevron">⌄</span></div>

        <nav aria-label="Main navigation" className="sidebar-nav">
          <p className="nav-label">Workspace</p>
          {menuItems.map(({ name, section, icon: Icon }) => (
            <a
              aria-current={activeSection === section ? "page" : undefined}
              className={`nav-link${activeSection === section ? " is-active" : ""}`}
              href={`#${section}`}
              key={section}
              onClick={() => onNavigate(section)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{name}</span>
              {section === "activity" && <span className="nav-count">3</span>}
            </a>
          ))}
          <p className="nav-label nav-label-secondary">Preferences</p>
          <button className="nav-link" onClick={() => { onNavigate("settings"); onOpenSettings(); }} type="button"><Settings size={18} strokeWidth={1.8} /><span>Settings</span></button>
          <a className="nav-link" href="#help" onClick={() => onNavigate("help")}><CircleHelp size={18} strokeWidth={1.8} /><span>Help center</span></a>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-promo">
            <div className="promo-icon"><Droplets size={16} /></div>
            <strong>Put idle assets to work</strong>
            <p>Explore curated pools earning up to 8.4% APY.</p>
            <a href="#pools" onClick={() => onNavigate("pools")}>Explore pools <span>↗</span></a>
          </div>
          <div className="sidebar-user">
            <div className="user-avatar">JD</div>
            <div className="user-details"><strong>Demo account</strong><span>0x71C...9A24</span></div>
            <button aria-label="Account settings" className="icon-button user-menu" onClick={onOpenSettings} title="Account settings" type="button"><Settings size={17} /></button>
          </div>
        </div>
      </aside>
    </>
  );
}