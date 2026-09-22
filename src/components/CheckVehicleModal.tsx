import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  ScanLine,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Clock,
  Radio,
  Search,
} from 'lucide-react';
import { sampleRegisteredVehicles } from '../data/mockData';

interface CheckVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchVehicle?: (plate: string) => void;
}

export const CheckVehicleModal: React.FC<CheckVehicleModalProps> = ({
  isOpen,
  onClose,
  onDispatchVehicle,
}) => {
  const [searchPlate, setSearchPlate] = useState('MH11UV2233');

  if (!isOpen) return null;

  const currentVehicle =
    sampleRegisteredVehicles.find(
      (v) => v.plate.toLowerCase() === searchPlate.trim().toLowerCase()
    ) || sampleRegisteredVehicles[0];

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
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <ScanLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Check Vehicle Verification</h3>
              <p className="text-xs text-slate-500">Scan QR or query registration credentials</p>
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
        <div className="p-6 space-y-5">
          {/* Search bar & quick chips */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Enter Plate Number or Tag ID
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
                placeholder="MH11UV2233..."
                className="w-full pl-9 pr-3 py-2 text-sm font-mono-plate font-bold uppercase bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] text-slate-400">Quick test:</span>
              {sampleRegisteredVehicles.map((v) => (
                <button
                  key={v.plate}
                  onClick={() => setSearchPlate(v.plate)}
                  className={`text-xs px-2 py-0.5 rounded font-mono-plate font-semibold transition-colors ${
                    currentVehicle.plate === v.plate
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {v.plate}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle card result */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 text-white px-3 py-2 rounded-xl flex items-center gap-2 shadow-xs border border-slate-800">
                  <span className="text-[10px] font-black text-amber-400 font-mono-plate">
                    IND
                  </span>
                  <span className="text-base font-bold font-mono-plate tracking-wider">
                    {currentVehicle.plate}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{currentVehicle.type}</h4>
                  <p className="text-xs text-slate-500">{currentVehicle.transporter}</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified</span>
              </span>
            </div>

            {/* Compliance Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                <span className="text-[10px] text-slate-400 font-medium uppercase">
                  Fitness Cert
                </span>
                <p className="text-xs font-bold text-slate-800 font-mono-plate">
                  {currentVehicle.fitnessExpiry}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold">Valid</span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                <span className="text-[10px] text-slate-400 font-medium uppercase">
                  Insurance Valid
                </span>
                <p className="text-xs font-bold text-slate-800 font-mono-plate">
                  {currentVehicle.insuranceExpiry}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold">Insured</span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200/70">
                <span className="text-[10px] text-slate-400 font-medium uppercase">
                  Pollution / PUC
                </span>
                <p className="text-xs font-bold text-slate-800 font-mono-plate">
                  {currentVehicle.pucExpiry}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold">Compliant</span>
              </div>
            </div>

            {/* Telemetry row */}
            <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-2 text-slate-600">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>GPS: <strong>{currentVehicle.gpsStatus}</strong></span>
              </div>
              <div className="font-mono-plate font-semibold text-slate-700">
                Speed: {currentVehicle.speed}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onDispatchVehicle?.(currentVehicle.plate);
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Dispatch this Vehicle</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
