import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  GitFork,
  ScanLine,
  SlidersHorizontal,
  Truck,
  Building2,
  MapPin,
  ShieldCheck,
  Users,
  Smartphone,
  Coins,
  AppWindow,
  PanelLeftClose,
  PanelLeft,
  Flame,
  Radio,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string | null;
  badgeColor?: string;
}

interface NavSection {
  title: string | null;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
  pendingApprovalsCount: number;
  openTripsCount: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  activeItem,
  setActiveItem,
  pendingApprovalsCount,
  openTripsCount,
  mobileOpen,
  setMobileOpen,
}) => {
  const navSections: NavSection[] = [
    {
      title: null,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'trips', label: 'Trips', icon: GitFork, badge: openTripsCount > 0 ? String(openTripsCount) : null },
        { id: 'check-vehicle', label: 'Check a vehicle', icon: ScanLine, badge: null },
        { id: 'actions', label: 'Actions', icon: SlidersHorizontal, badge: null },
      ],
    },
    {
      title: 'FLEET',
      items: [
        { id: 'vehicles', label: 'Vehicles', icon: Truck, badge: '11' },
        { id: 'transporters', label: 'Transporters', icon: Building2, badge: null },
      ],
    },
    {
      title: 'LOCATIONS',
      items: [
        { id: 'sites-docks', label: 'Sites & docks', icon: MapPin, badge: null },
        { id: 'check-posts', label: 'Check posts', icon: Radio, badge: null },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { id: 'users', label: 'Users', icon: Users, badge: null },
        { id: 'roles', label: 'Roles & permissions', icon: ShieldCheck, badge: null },
        {
          id: 'devices',
          label: 'Devices',
          icon: Smartphone,
          badge: pendingApprovalsCount > 0 ? String(pendingApprovalsCount) : null,
          badgeColor: 'bg-amber-500 text-white',
        },
        { id: 'rates', label: 'Rates', icon: Coins, badge: null },
        { id: 'app-versions', label: 'App versions', icon: AppWindow, badge: null },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{
          width: collapsed ? 80 : 260,
        }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0b0f19] text-slate-300 border-r border-slate-800/80 select-none shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center px-4 border-b border-slate-800/80 justify-between overflow-hidden">
          <div className="flex items-center gap-3 min-w-0">
            {/* Custom geometric brand glyph */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-blue-600 p-[1.5px] shrink-0 shadow-md shadow-orange-500/10">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-orange-500/30" />
                <span className="font-extrabold text-sm tracking-wider text-white flex items-center justify-center gap-0.5 relative z-10 font-mono-plate">
                  <span className="text-orange-400">S</span>
                  <span className="text-blue-400">S</span>
                </span>
              </div>
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col whitespace-nowrap min-w-0"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black tracking-widest text-orange-400 uppercase">
                      SANGHMITRA
                    </span>
                  </div>
                  <span className="text-[11px] font-bold tracking-wider text-blue-400 uppercase">
                    SHAKTI
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && !collapsed && (
                <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {section.title}
                </div>
              )}
              {section.title && collapsed && (
                <div className="my-2 border-t border-slate-800/80 mx-2" />
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => {
                      setActiveItem(item.id);
                      setMobileOpen(false);
                    }}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group relative ${
                      isActive
                        ? 'bg-slate-800/90 text-white shadow-sm shadow-black/40 ring-1 ring-slate-700/60'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850/60 hover:bg-slate-800/40'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activePill"
                        className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-orange-400 to-amber-500 rounded-r-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-orange-400'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />

                    {!collapsed && (
                      <span className="truncate flex-1 text-left text-[13px] tracking-tight">
                        {item.label}
                      </span>
                    )}

                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {collapsed && item.badge && (
                      <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[#0b0f19]" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer with collapse toggle */}
        <div className="p-3 border-t border-slate-800/80 bg-[#080b12]">
          <button
            id="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors text-xs font-medium"
          >
            {collapsed ? (
              <PanelLeft className="w-4 h-4 shrink-0 text-slate-300 mx-auto" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 shrink-0 text-slate-400" />
                <span className="truncate">Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
};
