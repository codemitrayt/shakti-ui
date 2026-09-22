import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  ArrowRight,
  CheckCircle,
  XCircle,
  ShieldAlert,
  ChevronRight,
  Monitor,
} from 'lucide-react';
import { DeviceApproval } from '../types';

interface DeviceApprovalsCardProps {
  devices: DeviceApproval[];
  onReview: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const DeviceApprovalsCard: React.FC<DeviceApprovalsCardProps> = ({
  devices,
  onReview,
  onApprove,
  onReject,
}) => {
  const pendingDevices = devices.filter((d) => d.status === 'Pending');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-600">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Device approvals</h3>
            {pendingDevices.length > 0 && (
              <span className="font-mono-plate font-bold text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {pendingDevices.length}
              </span>
            )}
          </div>
        </div>

        <button
          id="btn-review-devices"
          onClick={onReview}
          className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-amber-600 transition-colors"
        >
          <span>Review</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="divide-y divide-slate-100">
        <AnimatePresence>
          {pendingDevices.length > 0 ? (
            pendingDevices.map((device) => (
              <motion.div
                key={device.id}
                id={`device-row-${device.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Amber avatar matching screenshot */}
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center border border-amber-200 shrink-0 font-mono-plate shadow-xs">
                      {device.initials}
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{device.userName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                        <Monitor className="w-3 h-3 text-slate-400" />
                        <span>{device.device}</span>
                        <span>·</span>
                        <span>{device.platform}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Requested {device.requestTime}
                      </div>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Pending</span>
                  </span>
                </div>

                {/* Inline Quick Decision Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <button
                    id={`btn-approve-${device.id}`}
                    onClick={() => onApprove(device.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    id={`btn-reject-${device.id}`}
                    onClick={() => onReject(device.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-6 text-center space-y-2">
              <CheckCircle className="w-7 h-7 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-800">All devices authorized</p>
              <p className="text-[11px] text-slate-400">
                No pending device approval requests right now.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
