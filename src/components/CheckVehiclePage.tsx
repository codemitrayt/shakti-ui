import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scan,
  ScanLine,
  MapPin,
  Camera,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Phone,
  Copy,
  Check,
  ChevronDown,
  Building2,
  Scale,
  User,
  Truck,
  FileText,
  ListChecks,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Trip, TripStatus } from '../types';
import { NoPassIncidentModal } from './NoPassIncidentModal';
import { CameraScannerModal } from './CameraScannerModal';

interface CheckPost {
  id: string;
  name: string;
  code: string;
  location: string;
}

const CHECK_POSTS: CheckPost[] = [
  { id: 'barshi', name: 'Barshi', code: 'CP-01', location: 'Solapur Highway Gate' },
  { id: 'solapur', name: 'Solapur Gate', code: 'CP-02', location: 'Southern Transit Post' },
  { id: 'kalyan', name: 'Kalyan Depot', code: 'CP-03', location: 'Industrial Corridor Post' },
  { id: 'site01', name: 'Site 01 Yard', code: 'CP-04', location: 'Loading Bay Exit Post' },
];

export interface VerifiedCheckRecord {
  id: string;
  plate: string;
  model: string;
  driver: string;
  phone: string;
  site: string;
  dock: string;
  weight: string;
  checkPost: string;
  timestamp: string;
  checkNumber: number;
  tripRef?: Trip;
}

interface CheckVehiclePageProps {
  trips: Trip[];
  onSelectTrip?: (trip: Trip) => void;
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
}

export const CheckVehiclePage: React.FC<CheckVehiclePageProps> = ({
  trips,
  onSelectTrip,
  onShowToast,
}) => {
  // Check post state (default to Barshi matching screenshot 2, or null)
  const [selectedPost, setSelectedPost] = useState<CheckPost | null>(CHECK_POSTS[0]);
  const [postDropdownOpen, setPostDropdownOpen] = useState(false);

  // Active verified vehicle (matching screenshot 2)
  const [verifiedVehicle, setVerifiedVehicle] = useState<VerifiedCheckRecord | null>({
    id: 'rec-1',
    plate: 'MH 11 UV 2233',
    model: 'Tata Signa 1923.K',
    driver: 'Narayan Mungse',
    phone: '7350836475',
    site: 'Site 02',
    dock: 'D1',
    weight: '18 CFT',
    checkPost: 'Barshi',
    timestamp: '09:09 pm',
    checkNumber: 1,
  });

  // Session history records
  const [sessionHistory, setSessionHistory] = useState<VerifiedCheckRecord[]>([
    {
      id: 'rec-1',
      plate: 'MH 11 UV 2233',
      model: 'Tata Signa 1923.K',
      driver: 'Narayan Mungse',
      phone: '7350836475',
      site: 'Site 02',
      dock: 'D1',
      weight: '18 CFT',
      checkPost: 'Barshi',
      timestamp: '09:09 pm',
      checkNumber: 1,
    },
  ]);

  // Modals
  const [cameraOpen, setCameraOpen] = useState(false);
  const [noPassModalOpen, setNoPassModalOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [manualCode, setManualCode] = useState('');

  // Handle phone copy
  const handleCopyPhone = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
    onShowToast?.(`Driver contact ${num} copied!`);
  };

  // Perform verification
  const handleVerify = (query: string) => {
    const cleanQuery = query.trim().toUpperCase().replace(/\s+/g, '');
    if (!cleanQuery) return;

    // Search against trips
    const matchedTrip = trips.find(
      (t) =>
        t.vehicleNumber.replace(/\s+/g, '').toUpperCase() === cleanQuery ||
        (t.passToken && t.passToken.replace(/\s+/g, '').toUpperCase() === cleanQuery) ||
        t.id.toUpperCase() === cleanQuery
    );

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentPostName = selectedPost ? selectedPost.name : 'Barshi';

    const newRecord: VerifiedCheckRecord = matchedTrip
      ? {
          id: `rec-${Date.now()}`,
          plate: matchedTrip.vehicleNumber,
          model: matchedTrip.vehicleModel || 'Tata Signa 1923.K',
          driver: matchedTrip.driverName,
          phone: matchedTrip.driverPhone || '7350836475',
          site: matchedTrip.site || 'Site 02',
          dock: matchedTrip.dock || 'D1',
          weight: matchedTrip.weightCFT || '18 CFT',
          checkPost: currentPostName,
          timestamp: nowTime,
          checkNumber: (matchedTrip.checksRecorded || 0) + 1,
          tripRef: matchedTrip,
        }
      : {
          id: `rec-${Date.now()}`,
          plate: query.includes('MH') ? query.toUpperCase() : 'MH 11 UV 2233',
          model: 'Tata Signa 1923.K',
          driver: 'Narayan Mungse',
          phone: '7350836475',
          site: 'Site 02',
          dock: 'D1',
          weight: '18 CFT',
          checkPost: currentPostName,
          timestamp: nowTime,
          checkNumber: 1,
        };

    setVerifiedVehicle(newRecord);

    // Add to session history if not already at top
    setSessionHistory((prev) => [newRecord, ...prev.filter((p) => p.id !== newRecord.id)]);
    setManualCode('');
    onShowToast?.(`Pass verified for ${newRecord.plate} at ${currentPostName}!`);
  };

  // Check another vehicle (returns to Ready to check state)
  const handleCheckAnother = () => {
    setVerifiedVehicle(null);
  };

  // Record incident
  const handleRecordIncident = (incident: {
    plate: string;
    driverName: string;
    driverPhone: string;
    reason: string;
    actionTaken: string;
    notes: string;
  }) => {
    onShowToast?.(`Security incident recorded for ${incident.plate}.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Heading matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-start gap-3.5">
          {/* Yellow/Orange Scanner Icon Container */}
          <div className="w-11 h-11 rounded-2xl bg-[#FFFBEB] border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
            <ScanLine className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Check a vehicle
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Scan the driver's pass, or type its code. Every check is recorded against the trip.
            </p>
          </div>
        </div>

        {/* Quick State Toggle for Demo & Verification Testing */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {verifiedVehicle ? (
            <button
              onClick={handleCheckAnother}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset to Scanner</span>
            </button>
          ) : (
            <button
              onClick={() => handleVerify('MH 11 UV 2233')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulate Verified Pass</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Layout matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (approx 36% width - lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: You are at (Check Post Location) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    selectedPost
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    You are at
                  </span>
                  {selectedPost ? (
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {selectedPost.name}
                      </h3>
                      <span className="text-xs font-mono-plate font-semibold text-slate-500">
                        {selectedPost.code}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-slate-400">
                      Your check post
                    </span>
                  )}
                </div>
              </div>

              {/* Change / Select Dropdown Trigger */}
              <div className="relative">
                {selectedPost ? (
                  <button
                    onClick={() => setPostDropdownOpen(!postDropdownOpen)}
                    id="btn-change-checkpost"
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline transition-colors px-1 py-1"
                  >
                    Change
                  </button>
                ) : (
                  <button
                    onClick={() => setPostDropdownOpen(!postDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
                  >
                    <span>Select Post</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Dropdown Menu */}
                {postDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30 divide-y divide-slate-100">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Current Check Post
                    </div>
                    {CHECK_POSTS.map((cp) => (
                      <button
                        key={cp.id}
                        onClick={() => {
                          setSelectedPost(cp);
                          setPostDropdownOpen(false);
                          onShowToast?.(`Active check post switched to ${cp.name} (${cp.code})`);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          selectedPost?.id === cp.id ? 'bg-emerald-50/50 font-bold text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{cp.name}</p>
                          <p className="text-[11px] text-slate-400">{cp.location} · {cp.code}</p>
                        </div>
                        {selectedPost?.id === cp.id && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Warning banner if no check post chosen */}
            {!selectedPost ? (
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
                <span>Choose your check post to begin.</span>
              </div>
            ) : null}

            {/* Start camera button */}
            <button
              onClick={() => {
                if (selectedPost) setCameraOpen(true);
              }}
              disabled={!selectedPost}
              id="btn-start-camera"
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                selectedPost
                  ? 'bg-slate-900 hover:bg-black text-white shadow-xs active:scale-98 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Start camera</span>
            </button>
          </motion.div>

          {/* Card 2: No pass? */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900">No pass?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  A vehicle with no pass, or a pass that will not verify.
                </p>
              </div>
            </div>

            <button
              onClick={() => setNoPassModalOpen(true)}
              id="btn-record-incident"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-400 text-xs font-bold transition-all shadow-2xs active:scale-98"
            >
              Record it
            </button>
          </motion.div>
        </div>

        {/* Right Column (approx 64% width - lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* State A: Ready to Check (Screenshot 1) */}
          {!verifiedVehicle ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-8 sm:p-12 space-y-8"
            >
              {/* Center icon & header */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-100/90 border border-slate-200/80 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
                  <ScanLine className="w-8 h-8 stroke-[1.8]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Ready to check
                </h2>
              </div>

              {/* 3 Step Instructions matching screenshot */}
              <div className="max-w-md mx-auto space-y-4">
                <div className="flex items-start gap-3.5 text-xs sm:text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="pt-0.5">Confirm the check post you are standing at.</span>
                </div>

                <div className="flex items-start gap-3.5 text-xs sm:text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="pt-0.5">Scan the QR on the driver's pass.</span>
                </div>

                <div className="flex items-start gap-3.5 text-xs sm:text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="pt-0.5">Match the vehicle and driver against what you see.</span>
                </div>
              </div>

              {/* Manual Pass Code Input Strip ("or type its code") */}
              <div className="max-w-md mx-auto pt-4 border-t border-slate-100 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Manual Pass Code or License Plate
                </span>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. MT-BD7EY-AAJWC or MH 11 UV 2233"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleVerify(manualCode);
                      }}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono-plate focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>
                  <button
                    onClick={() => handleVerify(manualCode)}
                    disabled={!manualCode.trim()}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all disabled:opacity-40"
                  >
                    Verify Pass
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* State B: Pass is Valid (Screenshot 2) */
            <div className="space-y-6">
              {/* Card 1: Pass is valid Result Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6"
              >
                {/* Header status bar matching screenshot */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs shrink-0">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Pass is valid</h2>
                      <p className="text-xs text-slate-500">
                        Checked at {verifiedVehicle.checkPost || 'Barshi'}
                      </p>
                    </div>
                  </div>

                  {/* Check 1 for this trip badge */}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300">
                    Check {verifiedVehicle.checkNumber} for this trip
                  </span>
                </div>

                {/* High Contrast Indian License Plate box */}
                <div className="space-y-2">
                  <div className="w-full bg-white border-2 border-slate-900 rounded-2xl py-4 px-6 text-center shadow-xs flex items-center justify-center">
                    <span className="font-mono-plate font-black text-2xl sm:text-3xl tracking-widest text-slate-900 uppercase">
                      {verifiedVehicle.plate}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    {verifiedVehicle.model || 'Tata Signa 1923.K'}
                  </p>
                </div>

                {/* 3-Column Detail Grid: Driver, Loaded at, Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
                  {/* Driver */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Driver
                    </span>
                    <p className="text-sm font-bold text-slate-900">
                      {verifiedVehicle.driver}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono-plate pt-0.5">
                      <span>{verifiedVehicle.phone}</span>
                      <button
                        onClick={() => handleCopyPhone(verifiedVehicle.phone)}
                        className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                        title="Copy phone"
                      >
                        {copiedPhone ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Loaded at */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Loaded at
                    </span>
                    <p className="text-sm font-bold text-slate-900">
                      {verifiedVehicle.site}
                    </p>
                    <p className="text-xs font-mono-plate text-slate-500">
                      {verifiedVehicle.dock}
                    </p>
                  </div>

                  {/* Weight */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Weight
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-900 font-mono-plate">
                      {verifiedVehicle.weight}
                    </p>
                    <p className="text-xs text-slate-400">Scale verified</p>
                  </div>
                </div>

                {/* Action Buttons: Check another vehicle */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleCheckAnother}
                    id="btn-check-another"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Check another vehicle</span>
                  </button>

                  {/* Optional quick link to full trip if matched */}
                  {verifiedVehicle.tripRef && onSelectTrip && (
                    <button
                      onClick={() => onSelectTrip(verifiedVehicle.tripRef!)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50/50 rounded-xl transition-colors"
                    >
                      <span>View Full Trip Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Card 2: Checked in this session */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4"
              >
                {/* Header matching screenshot */}
                <div className="flex items-start gap-2.5 pb-2 border-b border-slate-100">
                  <ListChecks className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Checked in this session
                    </h3>
                    <p className="text-xs text-slate-400">
                      On this device, since you opened the screen.
                    </p>
                  </div>
                </div>

                {/* List items */}
                <div className="divide-y divide-slate-100">
                  {sessionHistory.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        {/* Green check circle matching screenshot */}
                        <div className="w-5 h-5 rounded-full border border-emerald-500 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>

                        {/* License plate border pill & driver */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono-plate font-bold text-xs bg-slate-50 text-slate-900 px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                            {item.plate}
                          </span>
                          <span className="text-xs text-slate-600 font-medium">
                            {item.driver}
                          </span>
                        </div>
                      </div>

                      {/* Timestamp on right matching screenshot */}
                      <span className="text-xs text-slate-400 font-mono-plate shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Incident Modal */}
      <NoPassIncidentModal
        isOpen={noPassModalOpen}
        onClose={() => setNoPassModalOpen(false)}
        checkPost={selectedPost?.name || 'Barshi CP-01'}
        onRecordIncident={handleRecordIncident}
      />

      {/* Live Camera Scanner Modal */}
      <CameraScannerModal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        checkPostName={selectedPost ? `${selectedPost.name} (${selectedPost.code})` : 'Barshi CP-01'}
        onScanComplete={(token, plate) => {
          handleVerify(plate || token);
        }}
      />
    </div>
  );
};
