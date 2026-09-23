import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  Truck,
  User,
  MapPin,
  Clock,
  Camera,
  CheckCircle2,
  FileWarning,
} from 'lucide-react';

interface NoPassIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkPost: string;
  onRecordIncident: (incident: {
    plate: string;
    driverName: string;
    driverPhone: string;
    reason: string;
    actionTaken: string;
    notes: string;
  }) => void;
}

export const NoPassIncidentModal: React.FC<NoPassIncidentModalProps> = ({
  isOpen,
  onClose,
  checkPost,
  onRecordIncident,
}) => {
  const [plate, setPlate] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [reason, setReason] = useState('No pass presented');
  const [actionTaken, setActionTaken] = useState('Detained at gate for physical verification');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) return;

    onRecordIncident({
      plate: plate.trim().toUpperCase(),
      driverName: driverName.trim() || 'Unidentified Driver',
      driverPhone: driverPhone.trim(),
      reason,
      actionTaken,
      notes: notes.trim(),
    });

    onClose();
    setPlate('');
    setDriverName('');
    setDriverPhone('');
    setNotes('');
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

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-rose-100 bg-rose-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Record Gate Check Incident
                </h3>
                <p className="text-[11px] text-slate-500">
                  Vehicle without verified gate pass at {checkPost || 'Check Post'}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                Vehicle License Plate *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MH 11 UV 2233"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono-plate font-bold uppercase text-sm tracking-wider focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Driver Name
                </label>
                <input
                  type="text"
                  placeholder="Driver's reported name"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Driver Phone
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono-plate focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Incident Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white font-medium"
                >
                  <option value="No pass presented">No pass presented</option>
                  <option value="QR Code unreadable / damaged">QR Code unreadable / damaged</option>
                  <option value="Pass expired">Pass expired</option>
                  <option value="Vehicle mismatch">Vehicle mismatch</option>
                  <option value="Unscheduled detour">Unscheduled detour</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Action Taken
                </label>
                <select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white font-medium"
                >
                  <option value="Detained for manual check">Detained for manual check</option>
                  <option value="Manual pass issued">Manual pass issued</option>
                  <option value="Gate refusal / turnaround">Gate refusal / turnaround</option>
                  <option value="Escalated to Control Room">Escalated to Control Room</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                Security Officer Observation Notes
              </label>
              <textarea
                rows={2}
                placeholder="State reason for missing pass or physical inspection findings..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white resize-none"
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
                disabled={!plate.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                Record Incident
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
