import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  FileText,
  Building2,
  Truck,
  Scale,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { Trip } from '../types';

interface ChallanDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}

export const ChallanDocumentModal: React.FC<ChallanDocumentModalProps> = ({
  isOpen,
  onClose,
  trip,
}) => {
  if (!isOpen || !trip) return null;

  const handlePrint = () => {
    window.print();
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

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                <FileText className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Delivery Challan & Weighbridge Slip
                </h3>
                <p className="text-[11px] text-slate-500 font-mono-plate">
                  {trip.challanNumber || `CH-2026-09-${trip.id.replace('TRIP-', '')}`} · Trip {trip.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print Slip</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Challan Body (Paper Form Styled) */}
          <div className="p-6 space-y-6 text-slate-800 text-xs">
            {/* Company Banner */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-tight text-slate-900 font-mono-plate">
                    SANGHMITRA SHAKTI
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    OFFICIAL DISPATCH
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Industrial Logistics & Gate Weighbridge Operations
                </p>
                <p className="text-[10px] text-slate-400">
                  GSTIN: 27AAHCS8921R1Z8 · Site 01 Loading Yard, Maharashtra
                </p>
              </div>

              <div className="text-right space-y-0.5 font-mono-plate">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Challan Ref</span>
                <p className="text-xs font-bold text-slate-900">
                  {trip.challanNumber || `CH-2026-09-${trip.id.replace('TRIP-', '')}`}
                </p>
                <p className="text-[10px] text-slate-500">{trip.dateFormatted || trip.timestamp}</p>
              </div>
            </div>

            {/* Vehicle & Consignor Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Vehicle & Driver
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-900 font-mono-plate">
                    {trip.vehicleNumber}
                  </span>
                  <p className="text-[11px] text-slate-600 font-medium">
                    {trip.vehicleModel || 'Tata Signa 1923.K'}
                  </p>
                </div>
                <p className="text-[11px] text-slate-500">
                  Driver: <span className="font-semibold text-slate-800">{trip.driverName}</span> ({trip.driverPhone || '7499487810'})
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Origin & Transporter
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    {trip.site} ({trip.dock})
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Transporter: <span className="font-semibold text-slate-800">{trip.transporter || 'Shree Logistic'}</span>
                  </p>
                </div>
                <p className="text-[11px] text-slate-500">
                  Gate Token: <span className="font-mono-plate font-semibold text-slate-800">{trip.passToken || 'MT-BD7EY-AAJWC'}</span>
                </p>
              </div>
            </div>

            {/* Cargo & Weight Table */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Cargo Payload & Weighbridge Metrics
              </span>
              <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Description of Goods</th>
                    <th className="py-2.5 px-3">Volume</th>
                    <th className="py-2.5 px-3">Gross Wt</th>
                    <th className="py-2.5 px-3">Tare Wt</th>
                    <th className="py-2.5 px-3 text-right">Net Wt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-plate text-xs">
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">
                      {trip.material || 'Raw Bauxite Lump'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{trip.weightCFT || '30 CFT'}</td>
                    <td className="py-2.5 px-3 text-slate-600">{trip.grossWeight || '41.2 MT'}</td>
                    <td className="py-2.5 px-3 text-slate-600">{trip.tareWeight || '12.6 MT'}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 text-right">
                      {trip.netWeight || '28.6 MT'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Check Post Clearance & Signatures */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-6 items-end">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Gate Security Cleared</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  RFID / ANPR match verified at outbound weighbridge terminal.
                </p>
              </div>

              <div className="text-right space-y-1">
                <div className="border-b border-slate-300 w-36 ml-auto pb-1 text-[10px] font-bold text-slate-400 uppercase">
                  Authorized Signatory
                </div>
                <p className="text-[11px] font-semibold text-slate-700">Super Admin (Operations)</p>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono-plate">
              Secure QR Hash: {trip.passToken || 'MT-BD7EY-AAJWC'}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
