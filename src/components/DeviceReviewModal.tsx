import React from 'react';
import { motion } from 'motion/react';
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  XCircle,
  MapPin,
  Globe,
  Clock,
  Laptop,
} from 'lucide-react';
import { DeviceApproval } from '../types';

interface DeviceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: DeviceApproval[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const DeviceReviewModal: React.FC<DeviceReviewModalProps> = ({
  isOpen,
  onClose,
  devices,
  onApprove,
  onReject,
}) => {
  if (!isOpen) return null;

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
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Device Approvals</h3>
              <p className="text-xs text-slate-500">Security authorization for new browser sessions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {devices.map((device) => (
            <div
              key={device.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-bold text-sm flex items-center justify-center border border-amber-200 shrink-0 font-mono-plate">
                    {device.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{device.userName}</h4>
                    <p className="text-xs text-slate-500">{device.userEmail}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    device.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : device.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {device.status}
                </span>
              </div>

              {/* Hardware & IP Details */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-600">
                  <Laptop className="w-3.5 h-3.5 text-slate-400" />
                  <span>{device.device}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>IP: {device.ipAddress || '103.142.170.82'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{device.location || 'Pune, Maharashtra'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Requested {device.requestTime}</span>
                </div>
              </div>

              {/* Actions */}
              {device.status === 'Pending' && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onApprove(device.id);
                      onClose();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Authorize Device</span>
                  </button>
                  <button
                    onClick={() => {
                      onReject(device.id);
                      onClose();
                    }}
                    className="py-2 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
