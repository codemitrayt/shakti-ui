import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Truck,
  User,
  Phone,
  Scale,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  QrCode,
  MapPin,
  Clock,
  Printer,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Building2,
  ChevronDown,
  Navigation,
  MessageSquare,
  AlertTriangle,
  Plus,
  Compass,
} from 'lucide-react';
import { Trip, TripStatus, TripHistoryEvent } from '../types';
import { ChallanDocumentModal } from './ChallanDocumentModal';
import { DriverPassModal } from './DriverPassModal';

interface TripDetailPageProps {
  trip: Trip;
  onBack: () => void;
  onUpdateStatus: (tripId: string, newStatus: TripStatus) => void;
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
}

export const TripDetailPage: React.FC<TripDetailPageProps> = ({
  trip,
  onBack,
  onUpdateStatus,
  onShowToast,
}) => {
  const [challanOpen, setChallanOpen] = useState(false);
  const [driverPassOpen, setDriverPassOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedTransporterPhone, setCopiedTransporterPhone] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [newLogNote, setNewLogNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Local state for live events if operator adds an audit entry
  const [historyEvents, setHistoryEvents] = useState<TripHistoryEvent[]>(() => {
    if (trip.history && trip.history.length > 0) {
      return trip.history;
    }
    // Default fallback events matching screenshot
    return [
      {
        id: 'evt-4',
        title: 'Pass verified',
        timestamp: '07:49 am',
        date: 'Sun, 13 Sept, 2026',
        actor: 'Super Admin',
        actorInitials: 'SA',
        location: 'Barshi',
        token: trip.passToken || 'MT-BD7EY-AAJWC',
        type: 'verified',
        isLatest: true,
      },
      {
        id: 'evt-3',
        title: 'Billed at the gate',
        timestamp: '07:49 am',
        date: 'Sun, 13 Sept, 2026',
        actor: 'Super Admin',
        actorInitials: 'SA',
        type: 'billed',
      },
      {
        id: 'evt-2',
        title: 'Pass issued',
        timestamp: '07:49 am',
        date: 'Sun, 13 Sept, 2026',
        actor: 'Super Admin',
        actorInitials: 'SA',
        token: trip.passToken || 'MT-BD7EY-AAJWC',
        type: 'pass_issued',
      },
      {
        id: 'evt-1',
        title: 'Trip created',
        timestamp: '07:27 am',
        date: 'Sun, 13 Sept, 2026',
        actor: 'Super Admin',
        actorInitials: 'SA',
        type: 'created',
      },
    ];
  });

  const passToken = trip.passToken || 'MT-BD7EY-AAJWC';
  const driverPhone = trip.driverPhone || '7499487810';
  const transporterPhone = trip.transporterPhone || '7499487810';

  const copyToClipboard = (text: string, type: 'token' | 'driver' | 'transporter') => {
    navigator.clipboard.writeText(text);
    if (type === 'token') {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
      onShowToast?.(`Pass token ${text} copied to clipboard!`);
    } else if (type === 'driver') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
      onShowToast?.(`Driver phone number copied!`);
    } else {
      setCopiedTransporterPhone(true);
      setTimeout(() => setCopiedTransporterPhone(false), 2000);
      onShowToast?.(`Transporter phone copied!`);
    }
  };

  const handleAddAuditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNote.trim()) return;

    const newEvent: TripHistoryEvent = {
      id: `evt-custom-${Date.now()}`,
      title: newLogNote.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      actor: 'Super Admin',
      actorInitials: 'SA',
      location: 'Site 01 Control Room',
      type: 'verified',
      isLatest: true,
    };

    // Remove latest flag from previous events
    const updated = historyEvents.map((evt) => ({ ...evt, isLatest: false }));
    setHistoryEvents([newEvent, ...updated]);
    setNewLogNote('');
    setAddingNote(false);
    onShowToast?.('Security audit note logged successfully!');
  };

  const getStatusPill = (status: TripStatus) => {
    switch (status) {
      case 'Verified':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          label: 'Verified',
        };
      case 'Billed':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          label: 'Billed',
        };
      case 'Created':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          label: 'Created',
        };
      case 'Action required':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          label: 'Action required',
        };
      case 'Closed':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-500',
          label: 'Closed',
        };
    }
  };

  const statusInfo = getStatusPill(trip.status);

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        {/* Left: Back button & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            id="btn-back-to-trips"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/90 shadow-2xs transition-all hover:border-slate-300 active:scale-98"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back to Trips</span>
          </button>

          <div className="h-4 w-px bg-slate-300 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              onClick={onBack}
              className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
            >
              Trips
            </span>
            <span className="text-slate-300 text-xs">/</span>
            <span className="text-xs font-mono-plate font-bold text-slate-800">
              {trip.uuid || trip.id}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusInfo.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} animate-pulse`} />
              <span>{statusInfo.label}</span>
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Print Slip Button */}
          <button
            onClick={() => setChallanOpen(true)}
            id="btn-open-challan"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-all hover:border-slate-400 active:scale-98"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Challan Document</span>
          </button>

          {/* Digital Pass Button */}
          <button
            onClick={() => setDriverPassOpen(true)}
            id="btn-open-driver-pass"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-all hover:border-slate-400 active:scale-98"
          >
            <QrCode className="w-3.5 h-3.5 text-slate-500" />
            <span>Driver's Pass</span>
          </button>

          {/* Status Progression Dropdown */}
          <div className="relative">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-xs transition-all active:scale-98"
            >
              <span>Update Status</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {statusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30">
                {(['Created', 'Billed', 'Verified', 'Closed'] as TripStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateStatus(trip.id, st);
                      setStatusDropdownOpen(false);
                      onShowToast?.(`Trip status set to ${st}`);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      trip.status === st ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-600'
                    }`}
                  >
                    <span>{st}</span>
                    {trip.status === st && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout matching screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Vehicle, Loading, Check Posts, Pass (approx 62% width) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Vehicle & driver */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Truck className="w-4 h-4 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Vehicle & driver</h3>
                  <p className="text-[11px] text-slate-400">Assigned hauler and licensed driver records</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/80">
                Heavy Tipper
              </span>
            </div>

            {/* Vehicle Row */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Vehicle
                  </span>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      {trip.vehicleModel || 'Tata Signa 1923.K'}
                    </h4>
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                      RC Valid ✓
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    230 HP · 6-Cylinder Turbodiesel · Axle Load Compliant
                  </p>
                </div>

                {/* Indian High Security License Plate */}
                <div className="self-start sm:self-auto">
                  <div className="inline-flex items-center bg-white border-2 border-slate-900 rounded-lg shadow-sm overflow-hidden select-none hover:shadow-md transition-shadow">
                    {/* Blue IND Strip */}
                    <div className="bg-[#002B7F] text-white px-2 py-2 flex flex-col items-center justify-center leading-none">
                      <div className="w-2.5 h-2.5 rounded-full border border-amber-300 flex items-center justify-center mb-0.5">
                        <div className="w-1 h-1 rounded-full bg-amber-300" />
                      </div>
                      <span className="text-[9px] font-black tracking-tighter text-amber-300 font-mono-plate">
                        IND
                      </span>
                    </div>

                    {/* Monospace Embossed License Number */}
                    <div className="px-3.5 py-1.5 flex items-center">
                      <span className="font-mono-plate font-black text-slate-900 text-sm sm:text-base tracking-widest uppercase">
                        {trip.vehicleNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver & Transporter Row */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/30">
              {/* Driver block */}
              <div className="space-y-1.5 p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Driver
                </span>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">{trip.driverName}</p>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    KYC Verified
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-600 font-mono-plate">{driverPhone}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(driverPhone, 'driver')}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="Copy phone"
                    >
                      {copiedPhone ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={`tel:${driverPhone}`}
                      className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      title="Call driver"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Transporter block */}
              <div className="space-y-1.5 p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Transporter
                </span>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">
                    {trip.transporter || 'Shree Logistic'}
                  </p>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    Fleet Partner
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-600 font-mono-plate">
                    {transporterPhone}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(transporterPhone, 'transporter')}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="Copy phone"
                    >
                      {copiedTransporterPhone ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={`tel:${transporterPhone}`}
                      className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      title="Call transporter"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Loading & Weighbridge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Scale className="w-4 h-4 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Loading</h3>
                  <p className="text-[11px] text-slate-400">Dispatch origin, dock bay, and weighbridge telemetry</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Scale Synced</span>
              </span>
            </div>

            {/* Top row: Loaded at & Weight */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100">
              {/* Loaded at */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Loaded at
                </span>
                <div className="flex items-baseline gap-2">
                  <p className="text-base sm:text-lg font-bold text-slate-900">{trip.site}</p>
                  <span className="text-xs font-mono-plate font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {trip.siteCode || 'SITE-01'} · {trip.dock}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Cargo Material: <span className="font-semibold text-slate-700">{trip.material || 'Raw Bauxite Lump'}</span>
                </p>
              </div>

              {/* Weight */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Weight
                </span>
                <div className="flex items-baseline gap-3">
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-plate tracking-tight">
                    {trip.weightCFT || '30 CFT'}
                  </p>
                  <span className="text-xs font-semibold text-slate-500">
                    Net: {trip.netWeight || '28.6 MT'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5 font-mono-plate">
                  <span>Gross: <strong className="text-slate-700">{trip.grossWeight || '41.2 MT'}</strong></span>
                  <span>·</span>
                  <span>Tare: <strong className="text-slate-700">{trip.tareWeight || '12.6 MT'}</strong></span>
                </div>
              </div>
            </div>

            {/* Bottom 3-column row */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50/30">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Checks recorded
                </span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p className="text-sm font-bold text-slate-900">
                    {trip.checksRecorded !== undefined ? `${trip.checksRecorded} check` : '1 check'}
                  </p>
                </div>
                <p className="text-[11px] text-slate-500">Barshi Gate ANPR Verified</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Challan document
                </span>
                <div>
                  <button
                    onClick={() => setChallanOpen(true)}
                    id="btn-open-challan-link"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    <span>Open document</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 font-mono-plate">
                  {trip.challanNumber || 'CH-2026-09-8812'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Created
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {trip.dateFormatted || '13 Sept 2026, 07:27 am'}
                </p>
                <p className="text-[11px] text-slate-500">{trip.timestamp || '10 days ago'}</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Required check posts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Navigation className="w-4 h-4 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Required check posts</h3>
                  <p className="text-[11px] text-slate-400">En-route security checkpoints and RFID gate logs</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Route Verified
              </span>
            </div>

            {/* Check posts content */}
            <div className="p-6">
              {/* If checkpost verified (like in the screenshot's history: Barshi) */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">
                        Barshi Gate Check Post
                      </h4>
                      <span className="text-[10px] font-mono-plate font-semibold text-slate-500">
                        07:49 am · 13 Sept 2026
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Vehicle ANPR matched with high confidence (99.8%). Automated gate barrier lifted.
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <span className="text-slate-500">Verified by:</span>
                      <span className="font-semibold text-slate-800">Super Admin (Camera ANPR-02)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
                  <Compass className="w-4 h-4 text-slate-400" />
                  <span>No further en-route checkpoints required for this destination transit.</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Driver's pass */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <QrCode className="w-4 h-4 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Driver's pass</h3>
                  <p className="text-[11px] text-slate-400">Scannable gate QR token for roadside inspection</p>
                </div>
              </div>

              {/* Open button matching screenshot */}
              <button
                onClick={() => setDriverPassOpen(true)}
                id="btn-open-driver-pass-card"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-all hover:border-slate-400 active:scale-98"
              >
                <QrCode className="w-3.5 h-3.5 text-slate-500" />
                <span>Open</span>
              </button>
            </div>

            {/* Card Content with QR Code matching screenshot */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Visual QR Code Box */}
                <div
                  onClick={() => setDriverPassOpen(true)}
                  className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-400 cursor-pointer transition-all shrink-0 group relative"
                  title="Click to view full pass"
                >
                  <svg
                    className="w-28 h-28"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Outer corner squares */}
                    <rect x="5" y="5" width="28" height="28" rx="3" fill="#0f172a" />
                    <rect x="9" y="9" width="20" height="20" rx="1.5" fill="white" />
                    <rect x="13" y="13" width="12" height="12" rx="1" fill="#0f172a" />

                    <rect x="67" y="5" width="28" height="28" rx="3" fill="#0f172a" />
                    <rect x="71" y="9" width="20" height="20" rx="1.5" fill="white" />
                    <rect x="75" y="13" width="12" height="12" rx="1" fill="#0f172a" />

                    <rect x="5" y="67" width="28" height="28" rx="3" fill="#0f172a" />
                    <rect x="9" y="71" width="20" height="20" rx="1.5" fill="white" />
                    <rect x="13" y="75" width="12" height="12" rx="1" fill="#0f172a" />

                    {/* QR grid points */}
                    <rect x="38" y="6" width="6" height="6" fill="#0f172a" />
                    <rect x="50" y="6" width="8" height="6" fill="#0f172a" />
                    <rect x="38" y="18" width="10" height="6" fill="#0f172a" />
                    <rect x="52" y="18" width="8" height="6" fill="#0f172a" />
                    <rect x="38" y="28" width="20" height="6" fill="#0f172a" />

                    <rect x="6" y="38" width="12" height="6" fill="#0f172a" />
                    <rect x="22" y="38" width="8" height="6" fill="#0f172a" />
                    <rect x="36" y="38" width="14" height="6" fill="#0f172a" />
                    <rect x="56" y="38" width="8" height="6" fill="#0f172a" />
                    <rect x="70" y="38" width="14" height="6" fill="#0f172a" />

                    <rect x="6" y="48" width="8" height="6" fill="#0f172a" />
                    <rect x="18" y="48" width="14" height="6" fill="#0f172a" />
                    <rect x="38" y="48" width="10" height="6" fill="#0f172a" />
                    <rect x="52" y="48" width="16" height="6" fill="#0f172a" />
                    <rect x="74" y="48" width="16" height="6" fill="#0f172a" />

                    <rect x="6" y="58" width="14" height="6" fill="#0f172a" />
                    <rect x="26" y="58" width="6" height="6" fill="#0f172a" />
                    <rect x="38" y="58" width="16" height="6" fill="#0f172a" />
                    <rect x="60" y="58" width="8" height="6" fill="#0f172a" />
                    <rect x="74" y="58" width="14" height="6" fill="#0f172a" />

                    <rect x="38" y="68" width="8" height="6" fill="#0f172a" />
                    <rect x="52" y="68" width="14" height="6" fill="#0f172a" />
                    <rect x="72" y="68" width="18" height="6" fill="#0f172a" />

                    <rect x="38" y="78" width="14" height="6" fill="#0f172a" />
                    <rect x="58" y="78" width="10" height="6" fill="#0f172a" />
                    <rect x="74" y="78" width="16" height="6" fill="#0f172a" />

                    <rect x="38" y="88" width="6" height="6" fill="#0f172a" />
                    <rect x="48" y="88" width="20" height="6" fill="#0f172a" />
                    <rect x="74" y="88" width="14" height="6" fill="#0f172a" />

                    {/* Logo dot */}
                    <circle cx="50" cy="50" r="4.5" fill="#f59e0b" />
                  </svg>
                </div>

                {/* Subtitle and security token information */}
                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700">
                      Checked by scanning this QR at a check post.
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Check-post officers scan this barcode with the Sanghmitra Mobile Terminal to record timestamp and ANPR verification.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className="text-xs text-slate-500">Security Token:</span>
                    <span className="font-mono-plate font-bold text-xs bg-slate-100 text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200">
                      {passToken}
                    </span>
                    <button
                      onClick={() => copyToClipboard(passToken, 'token')}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Copy Pass Token"
                    >
                      {copiedToken ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: History Timeline (approx 38% width) */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden sticky top-24"
          >
            {/* Header matching screenshot */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900">History</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/80">
                {historyEvents.length} events
              </span>
            </div>

            {/* Timeline Content */}
            <div className="p-6 space-y-5">
              {/* Date Group matching screenshot */}
              <div className="text-xs font-bold text-slate-700 pb-1">
                Sun, 13 Sept, 2026
              </div>

              {/* Vertical connected timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {historyEvents.map((evt, idx) => {
                  return (
                    <div key={evt.id || idx} className="relative group">
                      {/* Timeline Node Icon */}
                      <div
                        className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-xs border ${
                          evt.type === 'verified'
                            ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-50'
                            : evt.type === 'billed'
                            ? 'bg-white text-slate-700 border-slate-300'
                            : evt.type === 'pass_issued'
                            ? 'bg-white text-slate-700 border-slate-300'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {evt.type === 'verified' ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : evt.type === 'billed' ? (
                          <span className="font-bold text-[10px] text-slate-600">₹</span>
                        ) : evt.type === 'pass_issued' ? (
                          <QrCode className="w-2.5 h-2.5 text-slate-600" />
                        ) : (
                          <Plus className="w-2.5 h-2.5 text-slate-500" />
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="space-y-1.5">
                        {/* Title and timestamp */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900">
                              {evt.title}
                            </h4>
                            {evt.isLatest && (
                              <span className="text-[9px] font-black uppercase tracking-wider bg-slate-900 text-white px-1.5 py-0.2 rounded">
                                LATEST
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono-plate text-slate-400">
                            {evt.timestamp}
                          </span>
                        </div>

                        {/* Actor badge */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-700">
                            {evt.actorInitials || 'SA'}
                          </span>
                          <span className="font-medium">{evt.actor}</span>
                        </div>

                        {/* Location if present */}
                        {evt.location && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{evt.location}</span>
                          </div>
                        )}

                        {/* Token if present */}
                        {evt.token && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-600 font-mono-plate">
                            <QrCode className="w-3 h-3 text-slate-400" />
                            <span>{evt.token}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Audit Log Note form */}
              <div className="pt-4 border-t border-slate-100">
                {!addingNote ? (
                  <button
                    onClick={() => setAddingNote(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add gate observation note</span>
                  </button>
                ) : (
                  <form onSubmit={handleAddAuditNote} className="space-y-2">
                    <input
                      type="text"
                      value={newLogNote}
                      onChange={(e) => setNewLogNote(e.target.value)}
                      placeholder="e.g. Weighbridge slip re-verified at gate..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
                      autoFocus
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setAddingNote(false);
                          setNewLogNote('');
                        }}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newLogNote.trim()}
                        className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                      >
                        Log Event
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Challan Document Preview Modal */}
      <ChallanDocumentModal
        isOpen={challanOpen}
        onClose={() => setChallanOpen(false)}
        trip={trip}
      />

      {/* Driver Pass Modal */}
      <DriverPassModal
        isOpen={driverPassOpen}
        onClose={() => setDriverPassOpen(false)}
        trip={trip}
      />
    </div>
  );
};
