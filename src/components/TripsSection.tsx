import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitFork,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Truck,
  Plus,
  Search,
  Scale,
} from 'lucide-react';
import { Trip, TripStatus } from '../types';

interface TripsSectionProps {
  trips: Trip[];
  onTripSelect: (trip: Trip) => void;
  onCreateTrip: () => void;
  searchFilter: string;
  onViewAllTrips?: () => void;
}

export const TripsSection: React.FC<TripsSectionProps> = ({
  trips,
  onTripSelect,
  onCreateTrip,
  searchFilter,
  onViewAllTrips,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<TripStatus | 'All'>('All');
  const [localSearch, setLocalSearch] = useState('');

  // Counts by status
  const counts = useMemo(() => {
    const res: Record<string, number> = {
      Created: 0,
      Billed: 0,
      Verified: 0,
      'Action required': 0,
      Closed: 0,
    };
    trips.forEach((t) => {
      if (res[t.status] !== undefined) {
        res[t.status]++;
      }
    });
    return res;
  }, [trips]);

  const openTripsCount = trips.filter((t) => t.status !== 'Closed').length;

  // Filtered trips
  const filteredTrips = useMemo(() => {
    const q = (localSearch || searchFilter).toLowerCase().trim();
    return trips.filter((t) => {
      const matchesStatus =
        selectedStatus === 'All'
          ? true
          : t.status === selectedStatus;

      const matchesSearch =
        !q ||
        t.vehicleNumber.toLowerCase().includes(q) ||
        t.driverName.toLowerCase().includes(q) ||
        t.site.toLowerCase().includes(q) ||
        t.dock.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [trips, selectedStatus, localSearch, searchFilter]);

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
          dotBg: 'bg-slate-500',
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-blue-600">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Trips</h2>
            <p className="text-xs text-slate-500">Live operational dispatches and site movements</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="all-trips-btn"
            onClick={() => {
              if (onViewAllTrips) {
                onViewAllTrips();
              } else {
                setSelectedStatus('All');
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-xl hover:bg-slate-50 border border-slate-200/80 transition-colors"
          >
            <span>All trips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Status Breakdown Section */}
      <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Open trips by status
          </div>
          <div className="text-xs font-semibold text-slate-500">
            <span className="font-mono-plate font-bold text-slate-900">{openTripsCount}</span> open
          </div>
        </div>

        {/* Status filter buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Created */}
          <button
            id="filter-status-created"
            onClick={() => setSelectedStatus(selectedStatus === 'Created' ? 'All' : 'Created')}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              selectedStatus === 'Created'
                ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-100 text-sky-900 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Created</span>
            </div>
            <span className="font-mono-plate font-bold text-slate-900 text-xs">
              {counts.Created}
            </span>
          </button>

          {/* Billed */}
          <button
            id="filter-status-billed"
            onClick={() => setSelectedStatus(selectedStatus === 'Billed' ? 'All' : 'Billed')}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              selectedStatus === 'Billed'
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-100 text-amber-900 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Billed</span>
            </div>
            <span className="font-mono-plate font-bold text-slate-900 text-xs">
              {counts.Billed}
            </span>
          </button>

          {/* Verified */}
          <button
            id="filter-status-verified"
            onClick={() => setSelectedStatus(selectedStatus === 'Verified' ? 'All' : 'Verified')}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              selectedStatus === 'Verified'
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-100 text-emerald-900 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Verified</span>
            </div>
            <span className="font-mono-plate font-bold text-slate-900 text-xs">
              {counts.Verified}
            </span>
          </button>

          {/* Action required */}
          <button
            id="filter-status-action"
            onClick={() =>
              setSelectedStatus(selectedStatus === 'Action required' ? 'All' : 'Action required')
            }
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              selectedStatus === 'Action required'
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-100 text-rose-900 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="truncate">Action required</span>
            </div>
            <span className="font-mono-plate font-bold text-slate-900 text-xs">
              {counts['Action required']}
            </span>
          </button>
        </div>
      </div>

      {/* Active filter hint if selected */}
      {selectedStatus !== 'All' && (
        <div className="px-5 py-2 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-700">
          <span>
            Filtered by status: <strong>{selectedStatus}</strong>
          </span>
          <button
            onClick={() => setSelectedStatus('All')}
            className="font-bold underline hover:text-blue-900"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Trips List */}
      <div className="divide-y divide-slate-100">
        <AnimatePresence mode="popLayout">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip, idx) => {
              const badge = getStatusBadge(trip.status);

              return (
                <motion.div
                  key={trip.id}
                  id={`trip-row-${trip.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  onClick={() => onTripSelect(trip)}
                  className="group px-4 sm:px-5 py-3.5 hover:bg-slate-50/90 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Left: Vehicle plate & Driver/Site details */}
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Vehicle Plate Badge */}
                    <div className="relative flex flex-col items-center justify-center bg-slate-900 text-white rounded-lg px-2.5 py-1.5 shadow-xs border border-slate-800 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black text-amber-400 font-mono-plate">
                          IND
                        </span>
                        <span className="font-mono-plate font-bold text-sm tracking-wider">
                          {trip.vehicleNumber}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-xs text-slate-600 flex items-center flex-wrap gap-1.5 font-medium">
                        <span className="text-slate-900 font-semibold">{trip.driverName}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-700">{trip.site}</span>
                        <span className="text-slate-300">·</span>
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono-plate text-[11px]">
                          {trip.dock}
                        </span>
                        {trip.material && (
                          <>
                            <span className="text-slate-300 hidden md:inline">·</span>
                            <span className="text-slate-500 text-[11px] truncate max-w-[150px] hidden md:inline">
                              {trip.material}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>ID: {trip.id}</span>
                        {trip.netWeight && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Scale className="w-3 h-3 text-slate-400" />
                            {trip.netWeight}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status badge & timestamp & chevron */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto">
                    {/* Status Pill Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.pillBg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotBg}`} />
                      <span>{trip.status}</span>
                    </span>

                    {/* Timestamp */}
                    <span className="text-xs text-slate-500 whitespace-nowrap min-w-[70px] text-right">
                      {trip.timestamp}
                    </span>

                    {/* Arrow chevron */}
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-3">
              <Truck className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No trips found</p>
              <p className="text-xs text-slate-400">
                Try adjusting your status filter or search query.
              </p>
              <button
                onClick={() => {
                  setSelectedStatus('All');
                  setLocalSearch('');
                }}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Trips Footer quick action */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Showing <strong className="text-slate-800">{filteredTrips.length}</strong> of{' '}
          <strong className="text-slate-800">{trips.length}</strong> total records
        </span>
        <button
          id="btn-inline-create-trip"
          onClick={onCreateTrip}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50/80 px-2.5 py-1 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Dispatch New Trip</span>
        </button>
      </div>
    </div>
  );
};
