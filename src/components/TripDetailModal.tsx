import React from 'react';
import { motion } from 'motion/react';
import {
  X,
  Truck,
  User,
  MapPin,
  Calendar,
  Scale,
  CheckCircle2,
  FileText,
  ArrowRight,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { Trip, TripStatus } from '../types';

interface TripDetailModalProps {
  trip: Trip | null;
  onClose: () => void;
  onUpdateStatus: (tripId: string, newStatus: TripStatus) => void;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({
  trip,
  onClose,
  onUpdateStatus,
}) => {
  if (!trip) return null;

  const steps = [
    { title: 'Created', done: true },
    { title: 'Billed', done: trip.status === 'Billed' || trip.status === 'Verified' || trip.status === 'Closed' },
    { title: 'Verified', done: trip.status === 'Verified' || trip.status === 'Closed' },
    { title: 'Closed', done: trip.status === 'Closed' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs border border-slate-800">
              <span className="text-[9px] font-black text-amber-400 font-mono-plate">IND</span>
              <span className="text-sm font-bold font-mono-plate">{trip.vehicleNumber}</span>
            </div>
            {trip.passBadge && (
              <span
                className={`text-xs font-mono-plate font-bold px-2 py-0.5 rounded border ${
                  trip.passBadge === 'P1'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {trip.passBadge}
              </span>
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-900">Trip {trip.id}</h3>
              <p className="text-[11px] text-slate-500">
                {trip.timestamp} {trip.dateFormatted ? `· ${trip.dateFormatted}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Progress Timeline */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Trip Dispatch Lifecycle
            </div>
            <div className="flex items-center justify-between relative">
              {/* Timeline bar */}
              <div className="absolute left-3 right-3 top-3 h-0.5 bg-slate-200 -z-0" />

              {steps.map((s, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      s.done
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {s.done ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      s.done ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Driver</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {trip.driverName}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Location</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {trip.site} · Dock {trip.dock}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Material</span>
              <p className="font-medium text-slate-800 truncate">{trip.material || 'General Freight'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Transporter</span>
              <p className="font-medium text-slate-800 truncate">{trip.transporter || 'None'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Volume / Weight</span>
              <p className="font-mono-plate font-bold text-slate-900">{trip.weightCFT || 'Not weighed'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Gate Check Post</span>
              <p className="font-semibold text-slate-800">
                {trip.checkPostsCount
                  ? `${trip.checkPostsCount.completed}/${trip.checkPostsCount.total} verified`
                  : 'Pending'}
              </p>
            </div>
          </div>

          {/* Weighbridge summary */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Weighbridge Measurement</span>
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono-plate">
                Calibrated
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono-plate">
              <div>
                <span className="text-[10px] text-slate-400">Tare</span>
                <p className="text-xs font-bold text-slate-200">{trip.tareWeight || '12.4 MT'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Gross</span>
                <p className="text-xs font-bold text-slate-200">{trip.grossWeight || '38.2 MT'}</p>
              </div>
              <div>
                <span className="text-[10px] text-amber-400">Net Weight</span>
                <p className="text-sm font-black text-amber-400">{trip.netWeight || '25.8 MT'}</p>
              </div>
            </div>
          </div>

          {/* Action to update status */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Update Trip Lifecycle</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Created', 'Billed', 'Verified', 'Closed'] as TripStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(trip.id, st)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    trip.status === st
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => alert(`Printing E-Way bill manifest for ${trip.id}`)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print E-Way Bill</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
