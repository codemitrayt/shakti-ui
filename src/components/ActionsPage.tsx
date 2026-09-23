import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Phone,
  Copy,
  Plus,
  ExternalLink,
  ChevronDown,
  MapPin,
  Truck,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  MoreVertical,
} from 'lucide-react';
import { ActionIncident, Trip } from '../types';
import { ResolveActionModal } from './ResolveActionModal';
import { NoPassIncidentModal } from './NoPassIncidentModal';

interface ActionsPageProps {
  actions: ActionIncident[];
  trips: Trip[];
  onResolveAction: (incidentId: string, resolution: {
    actionTaken: string;
    notes: string;
    resolvedBy: string;
  }) => void;
  onRecordIncident: (incident: {
    plate: string;
    driverName: string;
    driverPhone: string;
    reason: string;
    actionTaken: string;
    notes: string;
  }) => void;
  onReopenAction?: (incidentId: string) => void;
  onCreateTripForVehicle?: (plate: string, driverName?: string, driverPhone?: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
}

export const ActionsPage: React.FC<ActionsPageProps> = ({
  actions,
  trips,
  onResolveAction,
  onRecordIncident,
  onReopenAction,
  onCreateTripForVehicle,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'open' | 'resolved'>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostFilter, setSelectedPostFilter] = useState<string>('all');
  const [postDropdownOpen, setPostDropdownOpen] = useState(false);

  // Modal states
  const [resolveModalIncident, setResolveModalIncident] = useState<ActionIncident | null>(null);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Copy phone helper
  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
    onShowToast?.(`Driver phone ${phone} copied to clipboard`);
  };

  // Counts
  const openCount = useMemo(() => actions.filter((a) => a.status === 'Open').length, [actions]);
  const resolvedCount = useMemo(() => actions.filter((a) => a.status === 'Resolved').length, [actions]);

  // Unique check posts for filter dropdown
  const checkPostOptions = useMemo(() => {
    const set = new Set<string>();
    actions.forEach((a) => set.add(a.stoppedAt.name));
    return Array.from(set);
  }, [actions]);

  // Filtered incidents
  const filteredActions = useMemo(() => {
    return actions.filter((a) => {
      const matchesTab = activeTab === 'open' ? a.status === 'Open' : a.status === 'Resolved';
      if (!matchesTab) return false;

      if (selectedPostFilter !== 'all' && a.stoppedAt.name !== selectedPostFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesPlate = a.vehicleNumber.toLowerCase().includes(query);
        const matchesDriver = a.driverName.toLowerCase().includes(query);
        const matchesPhone = a.driverPhone.includes(query);
        const matchesReason = a.reason.toLowerCase().includes(query);
        const matchesLocation = a.stoppedAt.name.toLowerCase().includes(query) || a.stoppedAt.code.toLowerCase().includes(query);
        return matchesPlate || matchesDriver || matchesPhone || matchesReason || matchesLocation;
      }

      return true;
    });
  }, [actions, activeTab, selectedPostFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs matching screenshot: Operations > Actions */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="hover:text-slate-800 transition-colors cursor-pointer">Operations</span>
        <span className="text-slate-300 font-normal">›</span>
        <span className="text-slate-900 font-bold">Actions</span>
      </div>

      {/* Page Header matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {/* Yellow/Orange Alert Icon Box matching screenshot */}
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Actions
              </h1>
              {openCount > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100/80 text-amber-800 border border-amber-200">
                  {openCount} require resolution
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
              Vehicles stopped without a valid pass. Each one is either a trip to chase or a vehicle nobody booked.
            </p>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setRecordModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Record Incident</span>
          </button>
        </div>
      </div>

      {/* Main Actions Card matching screenshot */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Top Toolbar: Tabs & Search Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          {/* Segmented Tab Pill matching screenshot */}
          <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70 shrink-0 self-start sm:self-auto">
            {/* Open Tab */}
            <button
              onClick={() => setActiveTab('open')}
              id="tab-open-actions"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'open'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${activeTab === 'open' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Open</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-plate font-semibold ${
                  activeTab === 'open'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {openCount}
              </span>
            </button>

            {/* Resolved Tab */}
            <button
              onClick={() => setActiveTab('resolved')}
              id="tab-resolved-actions"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'resolved'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${activeTab === 'resolved' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Resolved</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-plate font-semibold ${
                  activeTab === 'resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {resolvedCount}
              </span>
            </button>
          </div>

          {/* Search & Check Post Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search vehicle or driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            {/* Check Post Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPostDropdownOpen(!postDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
              >
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="capitalize">
                  {selectedPostFilter === 'all' ? 'All Posts' : selectedPostFilter}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {postDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 divide-y divide-slate-100 text-xs">
                  <button
                    onClick={() => {
                      setSelectedPostFilter('all');
                      setPostDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium ${
                      selectedPostFilter === 'all' ? 'text-slate-900 font-bold bg-slate-50' : 'text-slate-600'
                    }`}
                  >
                    All Check Posts
                  </button>
                  {checkPostOptions.map((post) => (
                    <button
                      key={post}
                      onClick={() => {
                        setSelectedPostFilter(post);
                        setPostDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium ${
                        selectedPostFilter === post ? 'text-slate-900 font-bold bg-slate-50' : 'text-slate-600'
                      }`}
                    >
                      {post}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6 font-bold">Vehicle & Driver</th>
                <th className="py-3.5 px-6 font-bold">Stopped At</th>
                <th className="py-3.5 px-6 font-bold">
                  {activeTab === 'open' ? 'Matching Trip' : 'Resolution'}
                </th>
                <th className="py-3.5 px-6 font-bold">
                  {activeTab === 'open' ? 'When' : 'Resolved At'}
                </th>
                <th className="py-3.5 px-6 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredActions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-2 text-slate-400">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                        {activeTab === 'open' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <RotateCcw className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <p className="font-semibold text-slate-700 text-sm">
                        {activeTab === 'open'
                          ? 'No open actions pending'
                          : 'No resolved actions matching criteria'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {activeTab === 'open'
                          ? 'All gate check post alerts are currently cleared.'
                          : 'Try changing your search query or check post filter.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredActions.map((incident) => (
                  <tr
                    key={incident.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Vehicle & Driver Column matching screenshot */}
                    <td className="py-4 px-6 align-top">
                      <div className="space-y-1">
                        {/* License Plate in High-Contrast font-mono-plate */}
                        <div className="flex items-center gap-2">
                          <span className="font-mono-plate font-black text-sm tracking-wide text-slate-900 uppercase">
                            {incident.vehicleNumber}
                          </span>
                          {incident.vehicleModel && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              · {incident.vehicleModel}
                            </span>
                          )}
                        </div>

                        {/* Driver & Phone */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <span>{incident.driverName}</span>
                          <span className="text-slate-300">·</span>
                          <span className="font-mono-plate text-slate-600">{incident.driverPhone}</span>
                          <button
                            onClick={() => handleCopyPhone(incident.driverPhone)}
                            className="p-0.5 text-slate-400 hover:text-slate-700 rounded transition-colors"
                            title="Copy driver phone"
                          >
                            {copiedPhone === incident.driverPhone ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Reason Line matching screenshot */}
                        <p className="text-xs text-slate-500">
                          {incident.reason}
                        </p>
                      </div>
                    </td>

                    {/* Stopped At Column matching screenshot */}
                    <td className="py-4 px-6 align-top">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 text-xs">
                          {incident.stoppedAt.name}
                        </div>
                        <div className="text-[11px] font-mono-plate text-slate-500">
                          {incident.stoppedAt.code}
                        </div>
                        {incident.stoppedAt.location && (
                          <div className="text-[10px] text-slate-400">
                            {incident.stoppedAt.location}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Matching Trip or Resolution Column */}
                    <td className="py-4 px-6 align-top">
                      {activeTab === 'open' ? (
                        <div className="space-y-1.5">
                          {incident.matchingTripId ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <span>Matched {incident.matchingTripId}</span>
                            </div>
                          ) : (
                            /* No open trip matched pill matching screenshot */
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50/90 text-rose-700 border border-rose-200">
                              <span>No open trip matched</span>
                            </div>
                          )}

                          {/* Quick Trip Assist */}
                          {!incident.matchingTripId && onCreateTripForVehicle && (
                            <button
                              onClick={() =>
                                onCreateTripForVehicle(
                                  incident.vehicleNumber,
                                  incident.driverName,
                                  incident.driverPhone
                                )
                              }
                              className="block text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                              + Create Trip for Vehicle
                            </button>
                          )}
                        </div>
                      ) : (
                        /* Resolved view detail */
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>{incident.resolution?.actionTaken || 'Pass Issued'}</span>
                          </span>
                          {incident.resolution?.notes && (
                            <p className="text-[11px] text-slate-500 max-w-xs line-clamp-1">
                              {incident.resolution.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    {/* When Column matching screenshot */}
                    <td className="py-4 px-6 align-top">
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-600 font-medium">
                          {activeTab === 'open' ? incident.timeAgo : incident.resolution?.resolvedAt || incident.timeAgo}
                        </span>
                        {activeTab === 'open' && (
                          <div className="text-[10px] text-slate-400">
                            {incident.createdAt}
                          </div>
                        )}
                        {activeTab === 'resolved' && incident.resolution && (
                          <div className="text-[10px] text-slate-400">
                            By {incident.resolution.resolvedBy}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action Column matching screenshot */}
                    <td className="py-4 px-6 align-top text-right">
                      {activeTab === 'open' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setResolveModalIncident(incident)}
                            id={`btn-resolve-${incident.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs active:scale-98 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 text-slate-700 stroke-[2.5]" />
                            <span>Mark resolved</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {onReopenAction && (
                            <button
                              onClick={() => onReopenAction(incident.id)}
                              className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline transition-colors"
                            >
                              Re-open
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer matching screenshot: Showing 1–1 of 1 actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-medium">
          <span>
            Showing 1–{filteredActions.length} of {filteredActions.length} actions
          </span>

          <span className="text-[11px] text-slate-400">
            Real-time synchronization active with Gate Checkpoints
          </span>
        </div>
      </div>

      {/* Resolution Modal */}
      <ResolveActionModal
        isOpen={Boolean(resolveModalIncident)}
        onClose={() => setResolveModalIncident(null)}
        incident={resolveModalIncident}
        onResolve={(incidentId, res) => {
          onResolveAction(incidentId, res);
          onShowToast?.(`Incident marked resolved for ${resolveModalIncident?.vehicleNumber}`, 'success');
        }}
      />

      {/* Incident Recording Modal */}
      <NoPassIncidentModal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        checkPost="Barshi CP-01"
        onRecordIncident={(inc) => {
          onRecordIncident(inc);
          onShowToast?.(`Incident recorded for ${inc.plate}. Added to Open actions.`);
        }}
      />
    </div>
  );
};
