import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  Image as ImageIcon,
  Calendar,
  Truck,
  Download,
  CheckCircle2,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { RegisteredVehicle, VehiclePhoto } from '../types';

interface VehiclePhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: RegisteredVehicle | null;
}

export const VehiclePhotosModal: React.FC<VehiclePhotosModalProps> = ({
  isOpen,
  onClose,
  vehicle,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!isOpen || !vehicle) return null;

  const photos = vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos : [
    {
      id: 'fallback-1',
      title: 'Registration inspection photograph',
      category: 'front' as const,
      url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
      timestamp: `${vehicle.addedAgo} (at check-in)`,
    },
  ];

  const currentPhoto = photos[selectedIdx] || photos[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden z-10 my-8 text-white flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-plate font-black text-sm bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700 text-white tracking-wide">
                    {vehicle.registrationNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {vehicle.model}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Inspection records captured during physical fleet induction
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo Canvas */}
          <div className="p-6 space-y-4">
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.title}
                className="w-full h-full object-cover"
              />

              {/* Photo Navigation arrows if multiple */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Overlay Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800/80 text-xs">
                <div>
                  <h4 className="font-bold text-white text-xs">{currentPhoto.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <Calendar className="w-3 h-3 text-orange-400" />
                    <span>Recorded: {currentPhoto.timestamp}</span>
                    <span>·</span>
                    <span className="capitalize">{currentPhoto.category} Angle</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-plate px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    Verified Match
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {photos.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedIdx(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedIdx === idx
                        ? 'border-orange-500 ring-2 ring-orange-500/30'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Vehicle Metadata Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Owner</span>
                <span className="font-semibold text-white">{vehicle.owner.name}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Axles & Wheels</span>
                <span className="font-semibold text-white">{vehicle.wheels} Wheels</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Max Payload Volume</span>
                <span className="font-semibold text-white font-mono-plate">{vehicle.maxCapacityCFT} CFT</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Recorded In System</span>
                <span className="font-semibold text-white">{vehicle.addedAgo}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-end bg-slate-900/60">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Close Viewer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
