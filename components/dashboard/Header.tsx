"use client";

import { Bell, Check, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";

interface HeaderProps {
  onMenuToggle: () => void;
  onThemeToggle: () => void;
  theme: "dark" | "light";
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notificationsEnabled: boolean;
}

const demoNotifications = [
  { title: "Swap completed", detail: "0.42 ETH exchanged for USDC", time: "12 min ago" },
  { title: "Position supplied", detail: "USDC supplied to Aave", time: "2 hours ago" },
  { title: "New pool opportunity", detail: "ETH / USDC · 8.42% APY", time: "Yesterday" },
];

export default function Header({ onMenuToggle, onThemeToggle, theme, searchQuery, onSearchChange, notificationsEnabled }: HeaderProps) {
  const dispatch = useAppDispatch();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      event.preventDefault();
      if (window.matchMedia("(max-width: 560px)").matches) setMobileSearchOpen(true);
      searchInputRef.current?.focus();
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen) searchInputRef.current?.focus();
  }, [mobileSearchOpen]);

  return (
    <header className="dashboard-header">
      <div className="header-leading">
        <button aria-label="Open navigation" className="icon-button mobile-menu-button" onClick={onMenuToggle} type="button"><Menu size={20} /></button>
        <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-divider">/</span><strong>Overview</strong></div>
      </div>
      <div className="header-actions">
        <button aria-label={mobileSearchOpen ? "Close search" : "Open search"} aria-expanded={mobileSearchOpen} className="icon-button mobile-search-button" onClick={() => setMobileSearchOpen(!mobileSearchOpen)} type="button"><Search size={17} /></button>
        <label className={`search-field${mobileSearchOpen ? " is-open" : ""}`}>
          <Search size={16} />
          <input aria-label="Search assets, pools, and activity" onChange={(event) => onSearchChange(event.target.value)} placeholder="Search assets, pools..." ref={searchInputRef} type="search" value={searchQuery} />
          <kbd>/</kbd>
        </label>
        <span className="header-divider" />
        <button aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={theme === "light"} className="icon-button theme-toggle" onClick={onThemeToggle} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} type="button">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="notification-wrap">
          <button aria-label="Notifications" aria-expanded={notificationsOpen} className="icon-button notification-button" disabled={!notificationsEnabled} onClick={() => setNotificationsOpen(!notificationsOpen)} title={notificationsEnabled ? "Open notifications" : "Notifications are disabled in settings"} type="button">
            <Bell size={18} />{notificationsEnabled && !notificationsRead && <span />}
          </button>
          {notificationsOpen && notificationsEnabled && (
            <section aria-label="Notifications" className="notification-popover">
              <div className="popover-heading"><div><strong>Notifications</strong><span>Demo activity updates</span></div><button className="mark-read-button" onClick={() => setNotificationsRead(true)} type="button"><Check size={13} /> Mark read</button></div>
              <div className="notification-list">
                {demoNotifications.map((notification) => (
                  <article className={`notification-item${notificationsRead ? " is-read" : ""}`} key={notification.title}>
                    <span className="notification-dot" />
                    <div><strong>{notification.title}</strong><p>{notification.detail}</p><time>{notification.time}</time></div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
        <button className="wallet-button" type="button"><span className="wallet-status" /> <span className="wallet-address">Demo wallet</span></button>
        <button aria-label="Sign out" className="icon-button sign-out-button" onClick={() => dispatch(logout())} title="Sign out" type="button"><LogOut size={17} /></button>
      </div>
    </header>
  );
}