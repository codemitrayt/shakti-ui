import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Truck,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import { RegisteredVehicle } from '../types';

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: RegisteredVehicle | null;
  onUpdate: (vehicleId: string, updates: Partial<RegisteredVehicle>) => void;
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

export const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onUpdate,
}) => {
  const [model, setModel] = useState('');
  const [wheels, setWheels] = useState<number>(10);
  const [capacity, setCapacity] = useState<number>(30);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');

  useEffect(() => {
    if (vehicle) {
      setModel(vehicle.model);
      setWheels(vehicle.wheels);
      setCapacity(vehicle.maxCapacityCFT);
      setOwnerName(vehicle.owner.name);
      setOwnerPhone(vehicle.owner.phone);
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(vehicle.id, {
      model,
      wheels,
      maxCapacityCFT: capacity,
      owner: {
        ...vehicle.owner,
        name: ownerName.trim() || vehicle.owner.name,
        phone: ownerPhone.trim() || vehicle.owner.phone,
      },
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
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8 text-slate-800"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Vehicle Record
                  </h3>
                  <span className="font-mono-plate font-black text-xs bg-white px-2 py-0.5 rounded border border-slate-300">
                    {vehicle.registrationNumber}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Update model, owner contact, and cargo capacity
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
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                Make & Model
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Wheels
                </label>
                <select
                  value={wheels}
                  onChange={(e) => setWheels(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                >
                  <option value={6}>6 Wheels</option>
                  <option value={10}>10 Wheels</option>
                  <option value={12}>12 Wheels</option>
                  <option value={14}>14 Wheels</option>
                  <option value={16}>16 Wheels</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Max Capacity (CFT)
                </label>
                <input
                  type="number"
                  min={10}
                  max={60}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Owner Name
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                  Owner Phone
                </label>
                <input
                  type="tel"
                  required
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono-plate font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
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
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
