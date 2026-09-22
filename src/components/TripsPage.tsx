import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitFork,
  Plus,
  Search,
  ChevronDown,
  MoreVertical,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Filter,
  Truck,
  Building2,
  MapPin,
  Scale,
  ShieldAlert,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { Trip, TripStatus } from '../types';

interface TripsPageProps {
  trips: Trip[];
  onCreateTrip: () => void;
  onTripSelect: (trip: Trip) => void;
  onUpdateStatus: (tripId: string, newStatus: TripStatus) => void;
}

export const TripsPage: React.FC<TripsPageProps> = ({
  trips,
  onCreateTrip,
  onTripSelect,
  onUpdateStatus,
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('All statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSite, setSelectedSite] = useState<string>('All sites');
  const [selectedTransporter, setSelectedTransporter] = useState<string>('All transporters');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'weight'>('newest');
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'All statuses': trips.length,
      Created: 0,
      Billed: 0,
      Verified: 0,
      'Action required': 0,
      Closed: 0,
    };
    trips.forEach((t) => {
      if (counts[t.status] !== undefined) {
        counts[t.status]++;
      }
    });
    return counts;
  }, [trips]);

  // Distinct sites and transporters
  const sitesList = useMemo(() => {
    const s = new Set<string>();
    trips.forEach((t) => s.add(t.site));
    return ['All sites', ...Array.from(s)];
  }, [trips]);

  const transportersList = useMemo(() => {
    const t = new Set<string>();
    trips.forEach((trip) => {
      if (trip.transporter && trip.transporter !== 'None') {
        t.add(trip.transporter);
      }
    });
    return ['All transporters', ...Array.from(t), 'None'];
  }, [trips]);

  // Filtering & sorting
  const filteredTrips = useMemo(() => {
    return trips
      .filter((t) => {
        // Status filter
        if (selectedStatusTab !== 'All statuses' && t.status !== selectedStatusTab) {
          return false;
        }
        // Site filter
        if (selectedSite !== 'All sites' && t.site !== selectedSite) {
          return false;
        }
        // Transporter filter
        if (selectedTransporter !== 'All transporters') {
          if (selectedTransporter === 'None' && t.transporter !== 'None' && t.transporter) {
            return false;
          }
          if (selectedTransporter !== 'None' && t.transporter !== selectedTransporter) {
            return false;
          }
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchPlate = t.vehicleNumber.toLowerCase().includes(q);
          const matchDriver = t.driverName.toLowerCase().includes(q);
          const matchPhone = t.driverPhone?.toLowerCase().includes(q) || false;
          const matchId = t.id.toLowerCase().includes(q);
          const matchTransporter = t.transporter?.toLowerCase().includes(q) || false;
          if (!matchPlate && !matchDriver && !matchPhone && !matchId && !matchTransporter) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return a.id.localeCompare(b.id);
        }
        if (sortBy === 'weight') {
          const wA = parseInt(a.weightCFT?.replace(/\D/g, '') || '0', 10);
          const wB = parseInt(b.weightCFT?.replace(/\D/g, '') || '0', 10);
          return wB - wA;
        }
        // default newest first
        return b.id.localeCompare(a.id);
      });
  }, [trips, selectedStatusTab, selectedSite, selectedTransporter, searchQuery, sortBy]);

  // Status tabs config
  const statusTabs = [
    { label: 'All statuses', count: statusCounts['All statuses'], dot: null },
    { label: 'Created', count: statusCounts['Created'], dot: 'bg-sky-500' },
    { label: 'Billed', count: statusCounts['Billed'], dot: 'bg-amber-500' },
    { label: 'Verified', count: statusCounts['Verified'], dot: 'bg-emerald-500' },
    { label: 'Action required', count: statusCounts['Action required'], dot: 'bg-rose-500' },
    { label: 'Closed', count: statusCounts['Closed'], dot: 'bg-slate-400' },
  ];

  // Helper for status pill styling
  const getStatusBadge = (status: TripStatus) => {
    switch (status) {
      case 'Created':
        return {
          pillBg: 'bg-sky-50 text-sky-700 border-sky-200/80',
          dotBg: 'bg-sky-500',
        };
      case 'Billed':
        return {
          pillBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dotBg: 'bg-amber-500',
        };
      case 'Verified':
        return {
          pillBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dotBg: 'bg-emerald-500',
        };
      case 'Closed':
        return {
          pillBg: 'bg-slate-100 text-slate-700 border-slate-200',
          dotBg: 'bg-slate-400',
        };
      case 'Action required':
        return {
          pillBg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dotBg: 'bg-rose-500',
        };
      default:
        return {
          pillBg: 'bg-slate-50 text-slate-700 border-slate-200',
          dotBg: 'bg-slate-400',
        };
    }
  };

  const toggleSelectAll = () => {
    if (selectedTripIds.length === filteredTrips.length) {
      setSelectedTripIds([]);
    } else {
      setSelectedTripIds(filteredTrips.map((t) => t.id));
    }
  };

  const toggleSelectTrip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTripIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header Section */}
      <div className="space-y-3">
        {/* Breadcrumb path */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span className="hover:text-slate-800 transition-colors">Operations</span>
          <span className="text-slate-300">›</span>
          <span className="text-slate-900 font-bold">Trips</span>
        </div>

        {/* Title + CTA Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            {/* Warm Amber Badge with Route Icon from screenshot */}
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-xs shrink-0">
              <GitFork className="w-5 h-5 rotate-90" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Trips</span>
                <span className="text-xs font-mono-plate font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {trips.length} Total
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Every load leaving a site: booked, billed at the gate, checked on the road, then closed.
              </p>
            </div>
          </div>

          {/* Create Trip Action Button */}
          <button
            id="trips-create-btn"
            onClick={onCreateTrip}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all hover:shadow-md active:scale-98 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create trip</span>
          </button>
        </div>
      </div>

      {/* Structured Main Content Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Horizontal Status Tabs (Exactly matching the screenshot) */}
        <div className="border-b border-slate-200 px-4 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-6 min-w-max">
            {statusTabs.map((tab) => {
              const isActive = selectedStatusTab === tab.label;
              return (
                <button
                  key={tab.label}
                  id={`tab-${tab.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedStatusTab(tab.label)}
                  className={`py-3.5 text-xs sm:text-sm font-semibold transition-colors relative flex items-center gap-2 ${
                    isActive
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`} />}
                  <span>{tab.label}</span>

                  {/* Active bottom underline indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/40">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="trips-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search registration number, driver or phone"
                className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 placeholder:text-slate-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Site Dropdown */}
              <div className="relative">
                <select
                  id="select-site-filter"
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                >
                  {sitesList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Transporter Dropdown */}
              <div className="relative">
                <select
                  id="select-transporter-filter"
                  value={selectedTransporter}
                  onChange={(e) => setSelectedTransporter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                >
                  {transportersList.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  id="select-sort-trips"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-slate-300 focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="weight">Highest weight</option>
                </select>
                <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Selected batch actions bar if rows selected */}
        {selectedTripIds.length > 0 && (
          <div className="px-5 py-2.5 bg-slate-900 text-white flex items-center justify-between text-xs animate-fadeIn">
            <span className="font-semibold">
              {selectedTripIds.length} {selectedTripIds.length === 1 ? 'trip' : 'trips'} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  alert(`Exporting ${selectedTripIds.length} trip manifests`);
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3 h-3 text-slate-300" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setSelectedTripIds([])}
                className="px-2 py-1 text-slate-400 hover:text-white transition-colors"
              >
                Deselect
              </button>
            </div>
          </div>
        )}

        {/* Responsive Table / List View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                <th className="py-3 px-4 sm:px-6 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredTrips.length > 0 &&
                      selectedTripIds.length === filteredTrips.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded text-slate-900 focus:ring-slate-900"
                  />
                </th>
                <th className="py-3 px-4 sm:px-6">VEHICLE & DRIVER</th>
                <th className="py-3 px-4 sm:px-6">ROUTE</th>
                <th className="py-3 px-4 sm:px-6">WEIGHT</th>
                <th className="py-3 px-4 sm:px-6">STATUS</th>
                <th className="py-3 px-4 sm:px-6">CREATED</th>
                <th className="py-3 px-4 sm:px-6 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              <AnimatePresence mode="popLayout">
                {filteredTrips.length > 0 ? (
                  filteredTrips.map((trip, idx) => {
                    const badge = getStatusBadge(trip.status);
                    const isSelected = selectedTripIds.includes(trip.id);
                    // In the screenshot, the second row (Billed) has a highlighted amber left border
                    const isHighlighted = trip.status === 'Billed';

                    return (
                      <motion.tr
                        key={trip.id}
                        id={`trip-table-row-${trip.id}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.99 }}
                        transition={{ duration: 0.18, delay: idx * 0.02 }}
                        onClick={() => onTripSelect(trip)}
                        className={`group hover:bg-slate-50/80 transition-colors cursor-pointer relative ${
                          isHighlighted ? 'bg-amber-50/15' : ''
                        } ${isSelected ? 'bg-blue-50/40' : ''}`}
                      >
                        {/* Checkbox column with optional left accent border */}
                        <td
                          className={`py-4 px-4 sm:px-6 relative ${
                            isHighlighted
                              ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-amber-500'
                              : ''
                          }`}
                          onClick={(e) => toggleSelectTrip(trip.id, e)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-slate-900 focus:ring-slate-900"
                          />
                        </td>

                        {/* Vehicle & Driver */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* License plate number */}
                            <span className="font-mono-plate font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                              {trip.vehicleNumber}
                            </span>

                            {/* Pass Badge (P1 or P2) */}
                            {trip.passBadge && (
                              <span
                                className={`text-[10px] font-mono-plate font-bold px-1.5 py-0.5 rounded border ${
                                  trip.passBadge === 'P1'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : 'bg-slate-100 text-slate-600 border-slate-300'
                                }`}
                              >
                                {trip.passBadge}
                              </span>
                            )}
                          </div>
                          {/* Driver Name */}
                          <div className="text-xs text-slate-500 mt-0.5 font-medium">
                            {trip.driverName}
                          </div>
                        </td>

                        {/* Route */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                            <span>{trip.site}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-slate-500 font-mono-plate">{trip.dock}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {trip.transporter || 'None'}
                          </div>
                        </td>

                        {/* Weight */}
                        <td className="py-4 px-4 sm:px-6">
                          {trip.weightCFT && trip.weightCFT !== 'Not weighed' ? (
                            <span className="font-mono-plate font-bold text-xs sm:text-sm text-slate-900">
                              {trip.weightCFT}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 italic font-medium">
                              Not weighed
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="space-y-1">
                            {/* Main status pill */}
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.pillBg}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${badge.dotBg}`} />
                              <span>{trip.status}</span>
                            </span>

                            {/* Check posts sub-badge */}
                            {trip.checkPostsCount && (
                              <div className="text-[11px] font-medium flex items-center gap-1">
                                {trip.checkPostsCount.warning ? (
                                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                                    <span>
                                      {trip.checkPostsCount.completed}/{trip.checkPostsCount.total} check posts
                                    </span>
                                  </span>
                                ) : trip.checkPostsCount.completed > 0 ? (
                                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span>
                                      {trip.checkPostsCount.completed}/{trip.checkPostsCount.total} check posts
                                    </span>
                                  </span>
                                ) : (
                                  <span className="text-slate-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span>
                                      {trip.checkPostsCount.completed}/{trip.checkPostsCount.total} check posts
                                    </span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Created */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="text-xs text-slate-800 font-medium">
                            {trip.timestamp}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {trip.dateFormatted || '18 Sept 2026'}
                          </div>
                        </td>

                        {/* Action dots menu */}
                        <td
                          className="py-4 px-4 sm:px-6 text-right relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="relative inline-block">
                            <button
                              id={`trip-action-menu-${trip.id}`}
                              onClick={() =>
                                setActiveMenuId(activeMenuId === trip.id ? null : trip.id)
                              }
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown menu */}
                            <AnimatePresence>
                              {activeMenuId === trip.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 text-left text-xs font-medium text-slate-700"
                                >
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onTripSelect(trip);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                    <span>View Details</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onUpdateStatus(trip.id, 'Billed');
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-amber-700"
                                  >
                                    <Scale className="w-3.5 h-3.5" />
                                    <span>Mark Billed</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onUpdateStatus(trip.id, 'Verified');
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-emerald-700"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Verify at Checkpost</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      onUpdateStatus(trip.id, 'Closed');
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-600"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Close Trip</span>
                                  </button>

                                  <div className="my-1 border-t border-slate-100" />

                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      alert(`Printing manifest for ${trip.vehicleNumber}`);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-600"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Print E-Way Bill</span>
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-700">No trips matching criteria</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Try resetting your search or filter options.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedStatusTab('All statuses');
                          setSelectedSite('All sites');
                          setSelectedTransporter('All transporters');
                          setSearchQuery('');
                        }}
                        className="mt-3 text-xs font-bold text-blue-600 hover:underline"
                      >
                        Reset all filters
                      </button>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 sm:px-6 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{filteredTrips.length}</strong> of{' '}
            <strong className="text-slate-800">{trips.length}</strong> loads dispatched
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                alert('Exporting full dataset as CSV');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
