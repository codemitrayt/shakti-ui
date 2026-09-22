import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Truck, User, MapPin, Building, Scale, PlusCircle } from 'lucide-react';
import { Trip, TripStatus } from '../types';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: Omit<Trip, 'id' | 'timestamp'>) => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [vehicleNumber, setVehicleNumber] = useState('MH11UV2233');
  const [driverName, setDriverName] = useState('Narayan Mungse');
  const [site, setSite] = useState('Site 01');
  const [dock, setDock] = useState('D1');
  const [status, setStatus] = useState<TripStatus>('Created');
  const [transporter, setTransporter] = useState('Sanghmitra Logistics Corp');
  const [material, setMaterial] = useState('Crushed Iron Ore Grade-B');
  const [tareWeight, setTareWeight] = useState('12.2 MT');
  const [grossWeight, setGrossWeight] = useState('38.5 MT');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim() || !driverName.trim()) return;

    onSubmit({
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      passBadge: 'P1',
      driverName: driverName.trim(),
      site,
      dock,
      status,
      transporter,
      material,
      weightCFT: '18 CFT',
      checkPostsCount: { completed: 0, total: 1 },
      dateFormatted: 'Today',
      tareWeight,
      grossWeight,
      netWeight: '26.3 MT',
      checkPostStatus: 'Pending',
    });
    onClose();
  };

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
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create New Trip</h3>
              <p className="text-xs text-slate-500">Dispatch a transport vehicle and record manifest</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Quick Vehicle Selection
            </label>
            <div className="flex gap-2 flex-wrap">
              {['MH11UV2233', 'MH31QR7788', 'MH12RN4590'].map((plate) => (
                <button
                  type="button"
                  key={plate}
                  onClick={() => setVehicleNumber(plate)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono-plate font-semibold border transition-all ${
                    vehicleNumber === plate
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {plate}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vehicle Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Plate Number *
              </label>
              <div className="relative">
                <Truck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. MH11UV2233"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono-plate font-semibold bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none uppercase"
                />
              </div>
            </div>

            {/* Driver Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Driver Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Narayan Mungse"
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Site */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Site Location
              </label>
              <select
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="Site 01">Site 01 (Northern Pit)</option>
                <option value="Site 02">Site 02 (Main Crusher)</option>
                <option value="Site 03">Site 03 (Rail Siding)</option>
              </select>
            </div>

            {/* Dock */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loading Dock / Bay
              </label>
              <select
                value={dock}
                onChange={(e) => setDock(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-mono-plate"
              >
                <option value="D1">Dock D1</option>
                <option value="D2">Dock D2</option>
                <option value="D3">Dock D3</option>
                <option value="Bay 4">Bay 4</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Transporter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transporter Agency
              </label>
              <input
                type="text"
                value={transporter}
                onChange={(e) => setTransporter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cargo / Material
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Initial Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Trip Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TripStatus)}
                className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="Created">Created (Draft & Tagged)</option>
                <option value="Billed">Billed</option>
                <option value="Verified">Verified at Check post</option>
              </select>
            </div>

            {/* Tare Weight */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tare Weight (MT)
              </label>
              <input
                type="text"
                value={tareWeight}
                onChange={(e) => setTareWeight(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono-plate bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-create-trip-btn"
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Dispatch Trip</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
