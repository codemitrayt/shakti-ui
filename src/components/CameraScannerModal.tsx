import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  Flashlight,
  RefreshCw,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkPostName: string;
  onScanComplete: (token: string, plate?: string) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  checkPostName,
  onScanComplete,
}) => {
  const [torchOn, setTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scanning, setScanning] = useState(true);

  if (!isOpen) return null;

  const handleSimulateScan = (token: string, plate: string) => {
    setScanning(false);
    setTimeout(() => {
      onScanComplete(token, plate);
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col"
        >
          {/* Top Bar */}
          <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-white tracking-wide">
                Live Gate Camera · {checkPostName || 'Barshi CP-01'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTorchOn(!torchOn)}
                className={`p-2 rounded-xl transition-colors ${
                  torchOn
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Toggle Torch"
              >
                <Flashlight className="w-4 h-4" />
              </button>

              <button
                onClick={() =>
                  setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
                }
                className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors"
                title="Switch Camera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Viewfinder Canvas */}
          <div className="relative aspect-4/3 sm:aspect-square bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center overflow-hidden">
            {/* Background subtle video simulation grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Viewfinder reticle */}
            <div className="relative w-64 h-64 border-2 border-emerald-500/70 rounded-3xl p-4 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl" />

              {/* Animated laser scanning bar */}
              <motion.div
                animate={{
                  y: [-90, 90, -90],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: 'easeInOut',
                }}
                className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399]"
              />

              <QrCode className="w-20 h-20 text-slate-700/60" />
              <p className="text-[11px] text-emerald-300 font-medium mt-3 bg-slate-900/90 px-3 py-1 rounded-full border border-emerald-500/30">
                Align Driver QR Pass in frame
              </p>
            </div>
          </div>

          {/* Bottom Quick Test Scanner Triggers */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Quick Test Recognition
              </span>
              <span>ANPR Optical Scanner Ready</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  handleSimulateScan('MT-BD7EY-AAJWC', 'MH 11 UV 2233')
                }
                className="flex items-center justify-between px-3 py-2 bg-slate-800/90 hover:bg-slate-750 text-white rounded-xl border border-slate-700 text-xs font-semibold transition-colors text-left"
              >
                <div>
                  <span className="font-mono-plate font-bold text-amber-300 block">
                    MH 11 UV 2233
                  </span>
                  <span className="text-[10px] text-slate-400">Tata Signa 1923.K</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">
                  Scan
                </span>
              </button>

              <button
                onClick={() =>
                  handleSimulateScan('MT-8819-KP', 'MH 12 PQ 9912')
                }
                className="flex items-center justify-between px-3 py-2 bg-slate-800/90 hover:bg-slate-750 text-white rounded-xl border border-slate-700 text-xs font-semibold transition-colors text-left"
              >
                <div>
                  <span className="font-mono-plate font-bold text-amber-300 block">
                    MH 12 PQ 9912
                  </span>
                  <span className="text-[10px] text-slate-400">Ashok Leyland 2820</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">
                  Scan
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
