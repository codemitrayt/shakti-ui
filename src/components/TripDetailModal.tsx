import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  QrCode,
  Copy,
  Check,
  Phone,
  Clock,
  ExternalLink,
  Maximize2,
} from 'lucide-react';
import { Trip, TripStatus } from '../types';

interface TripDetailModalProps {
  trip: Trip | null;
  onClose: () => void;
  onUpdateStatus: (tripId: string, newStatus: TripStatus) => void;
  onOpenFullPage?: (trip: Trip) => void;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({
  trip,
  onClose,
  onUpdateStatus,
  onOpenFullPage,
}) => {
  const [copiedToken, setCopiedToken] = React.useState(false);

  if (!trip) return null;

  const passToken = trip.passToken || 'MT-BD7EY-AAJWC';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(passToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const getStatusBadge = (status: TripStatus) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Billed':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Created':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Action required':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            {/* Indian High Security Registration Plate */}
            <div className="inline-flex items-center bg-white border border-slate-900 rounded-lg shadow-2xs overflow-hidden">
              <div className="bg-[#002B7F] text-amber-300 px-1.5 py-1 text-[8px] font-black font-mono-plate">
                IND
              </div>
              <div className="px-2.5 py-0.5 font-mono-plate font-black text-xs text-slate-900">
                {trip.vehicleNumber}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {trip.vehicleModel || 'Tata Signa 1923.K'}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${getStatusBadge(trip.status)}`}>
                  {trip.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono-plate">
                Trip Ref: {trip.id} {trip.dateFormatted ? `· ${trip.dateFormatted}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenFullPage && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFullPage(trip);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Open full page view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Driver & Transporter Split Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Driver
              </span>
              <p className="font-bold text-slate-900 text-sm">{trip.driverName}</p>
              <div className="flex items-center gap-1.5 text-slate-500 font-mono-plate text-[11px]">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{trip.driverPhone || '7499487810'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Transporter
              </span>
              <p className="font-bold text-slate-900 text-sm">{trip.transporter || 'Shree Logistic'}</p>
              <div className="flex items-center gap-1.5 text-slate-500 font-mono-plate text-[11px]">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{trip.transporterPhone || '7499487810'}</span>
              </div>
            </div>
          </div>

          {/* Loading & Weighbridge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-slate-600" />
                <span className="font-bold text-slate-900 text-xs">Loading & Weighbridge</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Scale Synced
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Origin Yard</span>
                <p className="font-bold text-slate-800 text-sm">{trip.site} · {trip.dock}</p>
                <p className="text-[11px] text-slate-500">{trip.material || 'Raw Bauxite Lump'}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Weight / Volume</span>
                <p className="font-extrabold text-slate-900 text-lg font-mono-plate">
                  {trip.weightCFT || '30 CFT'}
                </p>
                <p className="text-[10px] text-slate-500 font-mono-plate">
                  Net Wt: {trip.netWeight || '28.6 MT'}
                </p>
              </div>
            </div>
          </div>

          {/* Gate Pass Token & QR Strip */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Digital Gate Pass
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono-plate text-white">{passToken}</span>
                <button
                  onClick={handleCopyToken}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                >
                  {copiedToken ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Scanned & verified at Barshi Gate Check Post.
              </p>
            </div>

            <div className="p-2 bg-white rounded-xl shrink-0">
              <QrCode className="w-12 h-12 text-slate-900" />
            </div>
          </div>

          {/* Quick Timeline */}
          {trip.history && trip.history.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Recent Timeline
              </span>
              <div className="space-y-2 border-l-2 border-slate-200 pl-3">
                {trip.history.slice(0, 3).map((evt, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">{evt.title}</span>
                      <span className="text-slate-400 font-mono-plate">{evt.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {evt.actor} {evt.location ? `· ${evt.location}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          {onOpenFullPage ? (
            <button
              onClick={() => {
                onClose();
                onOpenFullPage(trip);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>View Full Trip Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 font-mono-plate">{trip.id}</span>
          )}

          <div className="flex items-center gap-2">
            {trip.status !== 'Closed' && (
              <button
                onClick={() => {
                  onUpdateStatus(trip.id, 'Closed');
                  onClose();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-2xs"
              >
                Close Trip
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
