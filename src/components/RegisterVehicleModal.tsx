import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Truck,
  Upload,
  User,
  Phone,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  Building2,
  Layers,
} from 'lucide-react';
import { RegisteredVehicle } from '../types';

interface RegisterVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (vehicle: Omit<RegisteredVehicle, 'id' | 'addedAgo'>) => void;
}

const COMMON_MODELS = [
  'Tata Signa 1923.K',
  'Tata Prima 2830.K',
  'Tata LPK 2518',
  'BharatBenz 3523C',
  'BharatBenz 2828C Heavy',
  'Mahindra Blazo X 35',
  'Ashok Leyland 2820',
  'Ashok Leyland 2825 Tipper',
  'Eicher Pro 8035XM',
];

const WHEEL_OPTIONS = [6, 10, 12, 14, 16];

export const RegisterVehicleModal: React.FC<RegisterVehicleModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState(COMMON_MODELS[0]);
  const [wheels, setWheels] = useState<number>(10);
  const [capacity, setCapacity] = useState<number>(30);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [transporter, setTransporter] = useState('Sanghmitra Logistics Corp');
  const [photoUploaded, setPhotoUploaded] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPlate = plate.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleanPlate) return;

    // Generate initials
    const initials = ownerName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'TR';

    onRegister({
      registrationNumber: cleanPlate,
      model,
      wheels,
      maxCapacityCFT: capacity,
      addedDate: 'Today',
      transporter,
      badgeCertification: 'A++ NAAC',
      status: 'Active',
      owner: {
        name: ownerName.trim() || 'Fleet Owner',
        phone: ownerPhone.trim() || '9820011999',
        initials,
        colorBg: 'bg-amber-100 text-amber-800',
      },
      photos: [
        {
          id: `p-${Date.now()}`,
          title: 'Induction front inspection record',
          category: 'front',
          url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
          timestamp: 'Recorded during registration',
        },
      ],
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
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8 text-slate-800"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                <Truck className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Register New Fleet Vehicle
                </h3>
                <p className="text-[11px] text-slate-500">
                  Record vehicle credentials, axle configuration, and owner details
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
            {/* Plate & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Registration Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH12AB1234"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono-plate font-black text-sm text-slate-900 uppercase focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Make & Model *
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                >
                  {COMMON_MODELS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Wheels & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Wheels (Axle Configuration) *
                </label>
                <div className="flex items-center gap-1.5">
                  {WHEEL_OPTIONS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWheels(w)}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs border transition-all ${
                        wheels === w
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {w}W
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Max Capacity (CFT) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={10}
                    max={60}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                    CFT
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Details */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Owner & Operator Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhan Qureshi"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9820011209"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono-plate text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Transporter Fleet *
                </label>
                <input
                  type="text"
                  value={transporter}
                  onChange={(e) => setTransporter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Inspection Photo Upload */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                Vehicle Physical Inspection Photographs
              </label>
              <div
                onClick={() => setPhotoUploaded(!photoUploaded)}
                className={`p-3.5 rounded-2xl border-2 border-dashed flex items-center justify-between cursor-pointer transition-all ${
                  photoUploaded
                    ? 'border-emerald-300 bg-emerald-50/40 text-emerald-800'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    photoUploaded ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {photoUploaded ? <CheckCircle2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs block">
                      {photoUploaded ? 'Inspection Photo Attached (Front & Plate)' : 'Upload or Drag Vehicle Photo'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Standard angle: Front grill with visible number plate
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white border border-slate-200">
                  {photoUploaded ? 'Change' : 'Browse'}
                </span>
              </div>
            </div>

            {/* Submit */}
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
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Complete Vehicle Registration</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
