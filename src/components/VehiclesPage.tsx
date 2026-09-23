import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Truck,
  Search,
  Plus,
  MoreHorizontal,
  Camera,
  Edit2,
  Trash2,
  Phone,
  Copy,
  Check,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  Eye,
  Award,
  Calendar,
  Layers,
  X,
} from 'lucide-react';
import { RegisteredVehicle } from '../types';
import { VehiclePhotosModal } from './VehiclePhotosModal';
import { RegisterVehicleModal } from './RegisterVehicleModal';
import { EditVehicleModal } from './EditVehicleModal';

interface VehiclesPageProps {
  vehicles: RegisteredVehicle[];
  onRegisterVehicle: (vehicle: Omit<RegisteredVehicle, 'id' | 'addedAgo'>) => void;
  onUpdateVehicle: (vehicleId: string, updates: Partial<RegisteredVehicle>) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
}

export const VehiclesPage: React.FC<VehiclesPageProps> = ({
  vehicles,
  onRegisterVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [wheelFilter, setWheelFilter] = useState<'all' | 6 | 10 | 12>('all');
  const [activeMenuVehicleId, setActiveMenuVehicleId] = useState<string | null>(null);

  // Modals state
  const [photosModalVehicle, setPhotosModalVehicle] = useState<RegisteredVehicle | null>(null);
  const [editModalVehicle, setEditModalVehicle] = useState<RegisteredVehicle | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Close active dropdown on outside click
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuVehicleId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
    onShowToast?.(`${label} copied to clipboard`);
  };

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (wheelFilter !== 'all' && v.wheels !== wheelFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesPlate = v.registrationNumber.toLowerCase().includes(query);
        const matchesModel = v.model.toLowerCase().includes(query);
        const matchesOwner = v.owner.name.toLowerCase().includes(query);
        const matchesPhone = v.owner.phone.includes(query);
        return matchesPlate || matchesModel || matchesOwner || matchesPhone;
      }
      return true;
    });
  }, [vehicles, wheelFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs matching screenshot: Fleet > Vehicles */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="hover:text-slate-800 transition-colors cursor-pointer">Fleet</span>
        <span className="text-slate-300 font-normal">›</span>
        <span className="text-slate-900 font-bold">Vehicles</span>
      </div>

      {/* Page Header matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {/* Amber Icon Box matching screenshot */}
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Truck className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Vehicles
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {vehicles.length} registered
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
              The vehicle register: what each one is, who owns it, and the photos taken when it was recorded.
            </p>
          </div>
        </div>

        {/* Top Right Action Button: + Register vehicle */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setRegisterModalOpen(true)}
            id="btn-register-vehicle"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Register vehicle</span>
          </button>
        </div>
      </div>

      {/* Main Table Card matching screenshot */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Top Search Input matching screenshot */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="input-search-vehicles"
              placeholder="Search registration, model or owner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all bg-slate-50/50 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Axle Quick Filters Ribbon */}
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1.5">
              Axle Type:
            </span>
            <button
              onClick={() => setWheelFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                wheelFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Wheels ({vehicles.length})
            </button>
            <button
              onClick={() => setWheelFilter(6)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                wheelFilter === 6
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              6 Wheels ({vehicles.filter((v) => v.wheels === 6).length})
            </button>
            <button
              onClick={() => setWheelFilter(10)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                wheelFilter === 10
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              10 Wheels ({vehicles.filter((v) => v.wheels === 10).length})
            </button>
            <button
              onClick={() => setWheelFilter(12)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                wheelFilter === 12
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              12 Wheels ({vehicles.filter((v) => v.wheels === 12).length})
            </button>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-6 font-bold">Vehicle</th>
                <th className="py-3 px-6 font-bold">Owner</th>
                <th className="py-3 px-6 font-bold text-center">Wheels</th>
                <th className="py-3 px-6 font-bold">Max Capacity</th>
                <th className="py-3 px-6 font-bold">Added</th>
                <th className="py-3 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="max-w-xs mx-auto space-y-2 text-slate-400">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                        <Truck className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-700 text-sm">
                        No vehicles found
                      </p>
                      <p className="text-xs text-slate-400">
                        No registered vehicles match your current search query or filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-50/80 transition-colors group relative"
                  >
                    {/* VEHICLE Column matching screenshot */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        {/* Gold / NAAC Badge Crest matching screenshot */}
                        <div
                          onClick={() => setPhotosModalVehicle(v)}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 p-[1.5px] shrink-0 shadow-xs cursor-pointer group-hover:scale-105 transition-transform"
                          title="Click to view inspection photos"
                        >
                          <div className="w-full h-full rounded-full bg-[#3b120c] flex flex-col items-center justify-center text-center p-0.5 border border-amber-400/40">
                            <span className="text-[9px] font-black text-amber-300 leading-none tracking-tight">
                              A++
                            </span>
                            <span className="text-[7px] font-bold text-amber-100 uppercase tracking-tighter leading-none mt-0.5">
                              NAAC
                            </span>
                          </div>
                        </div>

                        {/* Plate & Model */}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono-plate font-black text-sm tracking-wide text-slate-900 uppercase">
                              {v.registrationNumber}
                            </span>
                            <button
                              onClick={() => handleCopy(v.registrationNumber, 'Vehicle plate')}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 rounded transition-opacity"
                              title="Copy plate number"
                            >
                              {copiedText === v.registrationNumber ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            {v.model}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* OWNER Column matching screenshot */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        {/* Colored Initials Avatar matching screenshot */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                            v.owner.colorBg || 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {v.owner.initials}
                        </div>

                        {/* Owner Name & Contact */}
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900 text-xs">
                            {v.owner.name}
                          </div>
                          <div className="text-xs font-mono-plate text-slate-500 flex items-center gap-1">
                            <span>{v.owner.phone}</span>
                            <button
                              onClick={() => handleCopy(v.owner.phone, 'Owner phone')}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 rounded transition-opacity"
                              title="Copy phone"
                            >
                              <Copy className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* WHEELS Column matching screenshot */}
                    <td className="py-3.5 px-6 text-center">
                      <span className="font-semibold text-slate-700 text-xs">
                        {v.wheels}
                      </span>
                    </td>

                    {/* MAX CAPACITY Column matching screenshot */}
                    <td className="py-3.5 px-6">
                      <span className="font-mono-plate font-semibold text-slate-800 text-xs">
                        {v.maxCapacityCFT} CFT
                      </span>
                    </td>

                    {/* ADDED Column matching screenshot */}
                    <td className="py-3.5 px-6">
                      <span className="text-slate-500 text-xs">
                        {v.addedAgo}
                      </span>
                    </td>

                    {/* ACTIONS Column with 3-dots Menu matching screenshot */}
                    <td className="py-3.5 px-6 text-right relative">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() =>
                            setActiveMenuVehicleId(
                              activeMenuVehicleId === v.id ? null : v.id
                            )
                          }
                          id={`btn-menu-${v.id}`}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Actions menu"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Dropdown Popup matching screenshot */}
                        {activeMenuVehicleId === v.id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100"
                          >
                            <div className="py-1">
                              {/* View photos */}
                              <button
                                onClick={() => {
                                  setActiveMenuVehicleId(null);
                                  setPhotosModalVehicle(v);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                              >
                                <Camera className="w-3.5 h-3.5 text-slate-500" />
                                <span>View photos</span>
                              </button>

                              {/* Edit vehicle */}
                              <button
                                onClick={() => {
                                  setActiveMenuVehicleId(null);
                                  setEditModalVehicle(v);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                                <span>Edit vehicle</span>
                              </button>
                            </div>

                            {/* Delete vehicle */}
                            <div className="pt-1">
                              <button
                                onClick={() => {
                                  setActiveMenuVehicleId(null);
                                  if (
                                    confirm(
                                      `Are you sure you want to delete vehicle ${v.registrationNumber} from the register?`
                                    )
                                  ) {
                                    onDeleteVehicle(v.id);
                                    onShowToast?.(
                                      `Vehicle ${v.registrationNumber} deleted from register`,
                                      'info'
                                    );
                                  }
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>Delete vehicle</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-medium">
          <span>
            Showing 1–{filteredVehicles.length} of {vehicles.length} vehicles
          </span>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>All vehicles verified under Sanghmitra Fleet Compliance Standard</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <VehiclePhotosModal
        isOpen={Boolean(photosModalVehicle)}
        onClose={() => setPhotosModalVehicle(null)}
        vehicle={photosModalVehicle}
      />

      <RegisterVehicleModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegister={(newV) => {
          onRegisterVehicle(newV);
          onShowToast?.(
            `Vehicle ${newV.registrationNumber} successfully added to registry!`,
            'success'
          );
        }}
      />

      <EditVehicleModal
        isOpen={Boolean(editModalVehicle)}
        onClose={() => setEditModalVehicle(null)}
        vehicle={editModalVehicle}
        onUpdate={(vId, updates) => {
          onUpdateVehicle(vId, updates);
          onShowToast?.(`Vehicle record updated`, 'success');
        }}
      />
    </div>
  );
};
