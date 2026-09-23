import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  RotateCcw,
  Truck,
  User,
  MapPin,
  ClipboardCheck,
} from 'lucide-react';
import { ActionIncident } from '../types';

interface ResolveActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: ActionIncident | null;
  onResolve: (incidentId: string, resolution: {
    actionTaken: string;
    notes: string;
    resolvedBy: string;
  }) => void;
}

const RESOLUTION_OPTIONS = [
  {
    id: 'manual_pass',
    title: 'Manual Gate Pass Issued',
    desc: 'Authorized physical paper pass or supervisor override after physical vehicle check.',
    badge: 'Pass Issued',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'link_trip',
    title: 'Trip Dispatched & Linked',
    desc: 'Matched to an existing manifest or created trip ticket in system.',
    badge: 'Linked to Trip',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'gate_refusal',
    title: 'Gate Refusal / Turnaround',
    desc: 'Vehicle refused entry and instructed to turnaround due to non-compliance.',
    badge: 'Turnaround',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'phone_verification',
    title: 'Verified via Dispatch Phone',
    desc: 'Confirmed credentials directly with Transporter & Loading Yard master.',
    badge: 'Verified',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
];

export const ResolveActionModal: React.FC<ResolveActionModalProps> = ({
  isOpen,
  onClose,
  incident,
  onResolve,
}) => {
  const [selectedOption, setSelectedOption] = useState(RESOLUTION_OPTIONS[0].id);
  const [customNotes, setCustomNotes] = useState('');
  const [resolverName, setResolverName] = useState('Super Admin');

  if (!isOpen || !incident) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = RESOLUTION_OPTIONS.find((o) => o.id === selectedOption);
    onResolve(incident.id, {
      actionTaken: chosen ? chosen.title : 'Manual verification completed',
      notes: customNotes.trim() || 'Verified by gate supervisor with physical documentation check.',
      resolvedBy: resolverName.trim() || 'Super Admin',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Resolve Gate Check Incident
                </h3>
                <p className="text-[11px] text-slate-500">
                  Clear stopped status for vehicle at {incident.stoppedAt.name}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
            {/* Incident Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-plate font-black text-sm bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-slate-900">
                  {incident.vehicleNumber}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Stopped at {incident.stoppedAt.name} ({incident.stoppedAt.code})
                </span>
              </div>
              <div className="text-slate-600 flex items-center justify-between pt-1 text-[11px]">
                <span>Driver: <strong className="text-slate-800">{incident.driverName}</strong> ({incident.driverPhone})</span>
                <span className="text-slate-400">{incident.timeAgo}</span>
              </div>
              <p className="text-[11px] text-amber-700 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/60 font-medium">
                Reason: {incident.reason}
              </p>
            </div>

            {/* Resolution Type Picker */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                Select Resolution Outcome *
              </label>
              <div className="space-y-2">
                {RESOLUTION_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedOption === opt.id
                        ? 'bg-emerald-50/40 border-emerald-500 ring-1 ring-emerald-500/50'
                        : 'bg-white border-slate-200 hover:bg-slate-50/70'
                    }`}
                  >
                    <input
                      type="radio"
                      name="resolution"
                      checked={selectedOption === opt.id}
                      onChange={() => setSelectedOption(opt.id)}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{opt.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Officer Observation Notes */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                Resolution Notes / Verification Remarks
              </label>
              <textarea
                rows={2}
                placeholder="State challan number, manual pass ref, or supervisor remarks..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white resize-none"
              />
            </div>

            {/* Resolving Officer */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                Authorized By
              </label>
              <input
                type="text"
                value={resolverName}
                onChange={(e) => setResolverName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white font-medium"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Mark Resolved</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
