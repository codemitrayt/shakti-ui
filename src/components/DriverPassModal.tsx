import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  Download,
  Share2,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Copy,
  Check,
} from 'lucide-react';
import { Trip } from '../types';

interface DriverPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}

export const DriverPassModal: React.FC<DriverPassModalProps> = ({
  isOpen,
  onClose,
  trip,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !trip) return null;

  const passToken = trip.passToken || 'MT-BD7EY-AAJWC';

  const handleCopy = () => {
    navigator.clipboard.writeText(passToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8"
        >
          {/* Top Security Banner */}
          <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                  Digital Gate Clearance Pass
                </h4>
                <p className="text-[10px] text-slate-400 font-mono-plate">
                  Token: {passToken}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pass Card Interior */}
          <div className="p-6 space-y-6 text-center">
            {/* License plate header */}
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-xl border border-slate-800 shadow-xs">
              <span className="text-[10px] font-black text-amber-400 font-mono-plate">IND</span>
              <span className="text-sm font-bold font-mono-plate tracking-wider">
                {trip.vehicleNumber}
              </span>
            </div>

            {/* Crisp QR Code Visual */}
            <div className="flex flex-col items-center justify-center">
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-lg relative group">
                {/* SVG QR Code */}
                <svg
                  className="w-48 h-48"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                  <rect x="13" y="13" width="12" height="12" rx="1" fill="#0f172a" />

                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                  <rect x="75" y="13" width="12" height="12" rx="1" fill="#0f172a" />

                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                  <rect x="13" y="75" width="12" height="12" rx="1" fill="#0f172a" />

                  {/* High density QR matrix pattern */}
                  <rect x="38" y="6" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="6" width="6" height="6" fill="#0f172a" />
                  <rect x="56" y="6" width="6" height="6" fill="#0f172a" />

                  <rect x="38" y="16" width="6" height="6" fill="#0f172a" />
                  <rect x="50" y="16" width="12" height="6" fill="#0f172a" />

                  <rect x="38" y="26" width="18" height="6" fill="#0f172a" />

                  <rect x="6" y="38" width="6" height="6" fill="#0f172a" />
                  <rect x="16" y="38" width="12" height="6" fill="#0f172a" />
                  <rect x="32" y="38" width="6" height="6" fill="#0f172a" />
                  <rect x="42" y="38" width="16" height="6" fill="#0f172a" />
                  <rect x="62" y="38" width="6" height="6" fill="#0f172a" />
                  <rect x="72" y="38" width="12" height="6" fill="#0f172a" />
                  <rect x="88" y="38" width="6" height="6" fill="#0f172a" />

                  <rect x="6" y="48" width="12" height="6" fill="#0f172a" />
                  <rect x="22" y="48" width="6" height="6" fill="#0f172a" />
                  <rect x="32" y="48" width="12" height="6" fill="#0f172a" />
                  <rect x="48" y="48" width="6" height="6" fill="#0f172a" />
                  <rect x="60" y="48" width="14" height="6" fill="#0f172a" />
                  <rect x="78" y="48" width="16" height="6" fill="#0f172a" />

                  <rect x="6" y="58" width="6" height="6" fill="#0f172a" />
                  <rect x="18" y="58" width="14" height="6" fill="#0f172a" />
                  <rect x="38" y="58" width="6" height="6" fill="#0f172a" />
                  <rect x="50" y="58" width="12" height="6" fill="#0f172a" />
                  <rect x="68" y="58" width="6" height="6" fill="#0f172a" />
                  <rect x="80" y="58" width="14" height="6" fill="#0f172a" />

                  <rect x="38" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="68" width="12" height="6" fill="#0f172a" />
                  <rect x="66" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="76" y="68" width="18" height="6" fill="#0f172a" />

                  <rect x="38" y="78" width="14" height="6" fill="#0f172a" />
                  <rect x="56" y="78" width="6" height="6" fill="#0f172a" />
                  <rect x="66" y="78" width="12" height="6" fill="#0f172a" />
                  <rect x="84" y="78" width="10" height="6" fill="#0f172a" />

                  <rect x="38" y="88" width="6" height="6" fill="#0f172a" />
                  <rect x="48" y="88" width="18" height="6" fill="#0f172a" />
                  <rect x="72" y="88" width="6" height="6" fill="#0f172a" />
                  <rect x="84" y="88" width="10" height="6" fill="#0f172a" />

                  {/* Centered Logo Badge */}
                  <rect x="42" y="42" width="16" height="16" rx="4" fill="#0f172a" />
                  <circle cx="50" cy="50" r="5" fill="#f59e0b" />
                </svg>
              </div>

              {/* Scannable instruction */}
              <div className="mt-3 space-y-1">
                <p className="text-xs font-bold text-slate-900">
                  Scan at Gate Check Post Scanner
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-mono-plate">
                  <span>Pass Token:</span>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {passToken}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                    title="Copy token"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Trip Details Summary */}
            <div className="grid grid-cols-2 gap-2 text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Driver</span>
                <span className="font-semibold text-slate-800">{trip.driverName}</span>
                <p className="text-slate-500">{trip.driverPhone || '7499487810'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Transporter</span>
                <span className="font-semibold text-slate-800">{trip.transporter || 'Shree Logistic'}</span>
                <p className="text-slate-500">Fleet ID: #9921</p>
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Origin Loading</span>
                <span className="font-semibold text-slate-800">{trip.site} · {trip.dock}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Payload</span>
                <span className="font-bold font-mono-plate text-slate-900">{trip.weightCFT || '30 CFT'}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
