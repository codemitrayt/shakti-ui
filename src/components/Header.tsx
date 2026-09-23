import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Globe,
  Radio,
  CheckCircle2,
  ExternalLink,
  Shield,
  LogOut,
  Settings,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onOpenMobileMenu: () => void;
  activeItem: string;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  onOpenDeviceReview: () => void;
  pendingApprovalsCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTripTitle?: string;
  onClearSelectedTrip?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarCollapsed,
  onOpenMobileMenu,
  activeItem,
  language,
  setLanguage,
  onOpenDeviceReview,
  pendingApprovalsCount,
  searchQuery,
  setSearchQuery,
  selectedTripTitle,
  onClearSelectedTrip,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Capitalize active view for breadcrumb
  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    trips: 'Trips & Dispatch',
    'check-vehicle': 'Check a vehicle',
    actions: 'Actions',
    vehicles: 'Fleet Registry',
    transporters: 'Transporter Directory',
    'sites-docks': 'Sites & Docks',
    'check-posts': 'Gate Check Posts',
    users: 'System Users',
    roles: 'Roles & Permissions',
    devices: 'Device Approvals',
    rates: 'Tariff & Freight Rates',
    'app-versions': 'App Version Control',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left breadcrumb & mobile toggle */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-sidebar"
          onClick={onOpenMobileMenu}
          className="p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold">
          {activeItem === 'trips' ? (
            <>
              <span className="text-slate-500 hover:text-slate-700 cursor-pointer">Operations</span>
              <span className="text-slate-300 font-normal">›</span>
              <span
                onClick={onClearSelectedTrip}
                className={selectedTripTitle ? 'text-slate-500 hover:text-slate-800 cursor-pointer font-medium' : 'text-slate-900 font-bold'}
              >
                Trips
              </span>
              {selectedTripTitle && (
                <>
                  <span className="text-slate-300 font-normal">›</span>
                  <span className="text-slate-900 font-bold font-mono-plate">{selectedTripTitle}</span>
                </>
              )}
            </>
          ) : activeItem === 'check-vehicle' ? (
            <>
              <span className="text-slate-500 hover:text-slate-700 cursor-pointer">Operations</span>
              <span className="text-slate-300 font-normal">›</span>
              <span className="text-slate-900 font-bold">Check a vehicle</span>
            </>
          ) : activeItem === 'actions' ? (
            <>
              <span className="text-slate-500 hover:text-slate-700 cursor-pointer">Operations</span>
              <span className="text-slate-300 font-normal">›</span>
              <span className="text-slate-900 font-bold">Actions</span>
            </>
          ) : activeItem === 'vehicles' ? (
            <>
              <span className="text-slate-500 hover:text-slate-700 cursor-pointer">Fleet</span>
              <span className="text-slate-300 font-normal">›</span>
              <span className="text-slate-900 font-bold">Vehicles</span>
            </>
          ) : (
            <>
              <span className="text-slate-900 font-bold tracking-tight">
                {viewTitles[activeItem] || 'Dashboard'}
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                v2.4
              </span>
            </>
          )}
        </div>
      </div>

      {/* Middle search input */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vehicle (e.g. MH11), driver, trip..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live system status pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Website</span>
        </div>

        {/* Language switch */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            id="lang-btn-en"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              language === 'en'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            English
          </button>
          <button
            id="lang-btn-hi"
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              language === 'hi'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            हिंदी
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingApprovalsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-slate-800"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Notifications
                  </span>
                  <span className="text-[11px] font-semibold text-blue-600">
                    {pendingApprovalsCount} pending
                  </span>
                </div>

                <div className="py-2 space-y-1">
                  {pendingApprovalsCount > 0 ? (
                    <div
                      onClick={() => {
                        setNotificationsOpen(false);
                        onOpenDeviceReview();
                      }}
                      className="p-2.5 rounded-xl hover:bg-amber-50/70 border border-amber-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          New Device Approval
                        </span>
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full font-medium">
                          Action
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Rushikesh Mungse requested login on macOS Chrome.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No new notifications
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User profile button & dropdown */}
        <div className="relative">
          <button
            id="user-profile-menu-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
          >
            {/* Green initials avatar matching screenshot */}
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200/80 shrink-0 font-mono-plate">
              SA
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-slate-900">Super Admin</span>
              <span className="text-[11px] text-slate-500 font-medium">super.admin@mining</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          <AnimatePresence>
            {userDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-slate-800"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Super Admin</p>
                  <p className="text-[11px] text-slate-500">Super Administrator</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Master Access
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    System Settings
                  </button>
                  <button
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    Security & RBAC
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
