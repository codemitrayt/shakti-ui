import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ScanLine,
  Plus,
  Truck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Radio,
  MapPin,
  Building2,
  Users,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

import { Trip, DeviceApproval, UserAccount, MetricItem, TripStatus } from './types';
import {
  initialTrips,
  initialDeviceApprovals,
  initialUsers,
  initialMetrics,
  sampleRegisteredVehicles,
} from './data/mockData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { TripsSection } from './components/TripsSection';
import { TripsPage } from './components/TripsPage';
import { DeviceApprovalsCard } from './components/DeviceApprovalsCard';
import { NewestUsersCard } from './components/NewestUsersCard';
import { CreateTripModal } from './components/CreateTripModal';
import { CheckVehicleModal } from './components/CheckVehicleModal';
import { TripDetailModal } from './components/TripDetailModal';
import { DeviceReviewModal } from './components/DeviceReviewModal';

export default function App() {
  // State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [searchQuery, setSearchQuery] = useState('');

  // Domain data state
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [deviceApprovals, setDeviceApprovals] = useState<DeviceApproval[]>(initialDeviceApprovals);
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);

  // Modals
  const [createTripOpen, setCreateTripOpen] = useState(false);
  const [checkVehicleOpen, setCheckVehicleOpen] = useState(false);
  const [deviceReviewOpen, setDeviceReviewOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Dynamic counts
  const pendingApprovalsCount = deviceApprovals.filter((d) => d.status === 'Pending').length;
  const openTripsCount = trips.filter((t) => t.status !== 'Closed').length;

  // Synced Metrics
  const dynamicMetrics: MetricItem[] = useMemo(() => {
    return [
      {
        id: 'open-trips',
        title: language === 'hi' ? 'सक्रिय ट्रिप्स' : 'Open trips',
        value: openTripsCount,
        subtext: language === 'hi' ? 'अभी तक बंद नहीं' : 'Not yet closed',
        iconName: 'Route',
        badge: `${openTripsCount} in transit`,
      },
      {
        id: 'need-action',
        title: language === 'hi' ? 'कार्रवाई आवश्यक' : 'Need action',
        value: 0,
        subtext: language === 'hi' ? 'कोई समस्या नहीं' : 'Nothing flagged',
        iconName: 'AlertTriangle',
        badge: '100% clean',
      },
      {
        id: 'vehicles',
        title: language === 'hi' ? 'वाहन' : 'Vehicles',
        value: sampleRegisteredVehicles.length + 8, // 11
        subtext: language === 'hi' ? 'रजिस्टर पर' : 'On the register',
        iconName: 'Truck',
        badge: '9 operational',
      },
      {
        id: 'devices',
        title: language === 'hi' ? 'उपकरण' : 'Devices',
        value: pendingApprovalsCount,
        subtext:
          pendingApprovalsCount > 0
            ? language === 'hi'
              ? 'लॉगिन अनुमति प्रतीक्षारत...'
              : 'Someone cannot sign in...'
            : 'All devices verified',
        iconName: 'Smartphone',
        highlight: pendingApprovalsCount > 0,
        highlightColor: 'amber',
        badge: pendingApprovalsCount > 0 ? 'Approval req.' : 'Secure',
      },
      {
        id: 'users',
        title: language === 'hi' ? 'उपयोगकर्ता' : 'Users',
        value: users.length,
        subtext: language === 'hi' ? 'सिस्टम पर सभी खाते' : 'All accounts on the system',
        iconName: 'Users',
        badge: `${users.length} active`,
      },
      {
        id: 'roles',
        title: language === 'hi' ? 'भूमिकाएं' : 'Roles',
        value: 2,
        subtext: language === 'hi' ? 'अनुमति सेट' : 'Permission sets',
        iconName: 'ShieldCheck',
        badge: 'RBAC active',
      },
    ];
  }, [openTripsCount, pendingApprovalsCount, users.length, language]);

  // Handlers
  const handleCreateTrip = (newTripData: Omit<Trip, 'id' | 'timestamp'>) => {
    const id = `TRIP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTrip: Trip = {
      ...newTripData,
      id,
      timestamp: 'Just now',
    };
    setTrips([newTrip, ...trips]);
    showToast(`Trip ${id} created for ${newTrip.vehicleNumber} successfully!`);
  };

  const handleUpdateTripStatus = (tripId: string, newStatus: TripStatus) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: newStatus } : t))
    );
    if (selectedTrip?.id === tripId) {
      setSelectedTrip((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Trip ${tripId} status updated to ${newStatus}`);
  };

  const handleApproveDevice = (id: string) => {
    const dev = deviceApprovals.find((d) => d.id === id);
    setDeviceApprovals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Approved' } : d))
    );
    showToast(`Device approved for ${dev?.userName || 'user'}! Login token issued.`);
  };

  const handleRejectDevice = (id: string) => {
    const dev = deviceApprovals.find((d) => d.id === id);
    setDeviceApprovals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Rejected' } : d))
    );
    showToast(`Device access denied for ${dev?.userName || 'user'}.`, 'info');
  };

  const handleMetricCardClick = (metricId: string) => {
    if (metricId === 'open-trips') setActiveItem('trips');
    else if (metricId === 'devices') setDeviceReviewOpen(true);
    else if (metricId === 'vehicles') setActiveItem('vehicles');
    else if (metricId === 'users') setActiveItem('users');
  };

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'hi') {
      if (hour < 12) return 'शुभ प्रभात, सुपर';
      if (hour < 17) return 'शुभ दोपहर, सुपर';
      return 'शुभ संध्या, सुपर';
    }
    if (hour < 12) return 'Good morning, Super';
    if (hour < 17) return 'Good afternoon, Super';
    return 'Good evening, Super';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col antialiased">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-700 text-xs font-medium"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          pendingApprovalsCount={pendingApprovalsCount}
          openTripsCount={openTripsCount}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
        />

        {/* Content Wrapper */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-[260px]'
          }`}
        >
          {/* Header */}
          <Header
            sidebarCollapsed={sidebarCollapsed}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            activeItem={activeItem}
            language={language}
            setLanguage={setLanguage}
            onOpenDeviceReview={() => setDeviceReviewOpen(true)}
            pendingApprovalsCount={pendingApprovalsCount}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Main Dashboard Canvas */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* Active view condition */}
            {activeItem === 'dashboard' ? (
              <>
                {/* Greeting & Action Row matching screenshot */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {getGreeting()}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      {language === 'hi'
                        ? 'आज के बेड़े की परिचालन स्थिति और ट्रिप प्रबंधन सारांश।'
                        : "Here's an overview of today's fleet activity, trips, and pending verifications."}
                    </p>
                  </div>

                  {/* Top Right Action Buttons */}
                  <div className="flex items-center gap-2.5">
                    {/* Secondary Button: Check a vehicle */}
                    <button
                      id="btn-check-vehicle"
                      onClick={() => setCheckVehicleOpen(true)}
                      className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-300 rounded-xl shadow-2xs transition-all hover:border-slate-400 active:scale-98"
                    >
                      <ScanLine className="w-4 h-4 text-slate-500" />
                      <span>{language === 'hi' ? 'वाहन जांचें' : 'Check a vehicle'}</span>
                    </button>

                    {/* Primary Button: + Create trip */}
                    <button
                      id="btn-create-trip"
                      onClick={() => setCreateTripOpen(true)}
                      className="flex items-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-sm transition-all hover:shadow-md active:scale-98"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>{language === 'hi' ? 'ट्रिप बनाएं' : 'Create trip'}</span>
                    </button>
                  </div>
                </motion.div>

                {/* Metric Cards Row */}
                <MetricCards metrics={dynamicMetrics} onCardClick={handleMetricCardClick} />

                {/* Main 2-Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Trips Hub (approx 65% width) */}
                  <div className="lg:col-span-8 space-y-6">
                    <TripsSection
                      trips={trips}
                      onTripSelect={(trip) => setSelectedTrip(trip)}
                      onCreateTrip={() => setCreateTripOpen(true)}
                      searchFilter={searchQuery}
                      onViewAllTrips={() => setActiveItem('trips')}
                    />

                    {/* Operational Telemetry Banner */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                          <Radio className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>Check-Post Gate RFIDs</span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                              Online
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400">
                            Automatic number plate recognition & weighbridge integration active across Sites 01 & 02.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveItem('check-posts')}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors whitespace-nowrap self-start sm:self-auto"
                      >
                        Gate Log View
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Approvals & Users (approx 35% width) */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Device approvals card */}
                    <DeviceApprovalsCard
                      devices={deviceApprovals}
                      onReview={() => setDeviceReviewOpen(true)}
                      onApprove={handleApproveDevice}
                      onReject={handleRejectDevice}
                    />

                    {/* Newest users card */}
                    <NewestUsersCard
                      users={users}
                      onViewAllUsers={() => setActiveItem('users')}
                      onUserClick={(user) => {
                        showToast(`User: ${user.name} (${user.role})`);
                      }}
                    />

                    {/* Fleet Quick Status Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                          Quick Dispatch Stats
                        </span>
                        <span className="text-emerald-600 font-semibold">98.4% On-time</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 font-medium">Site 01 Loading Dock</span>
                          <span className="font-mono-plate font-bold text-slate-800">4 Active</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full w-[70%] rounded-full" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 font-medium">Site 02 Weighbridge</span>
                          <span className="font-mono-plate font-bold text-slate-800">2 In Queue</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full w-[40%] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : activeItem === 'trips' ? (
              <TripsPage
                trips={trips}
                onCreateTrip={() => setCreateTripOpen(true)}
                onTripSelect={(trip) => setSelectedTrip(trip)}
                onUpdateStatus={handleUpdateTripStatus}
              />
            ) : activeItem === 'vehicles' ? (
              /* Vehicles View */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Vehicle Registry</h2>
                    <p className="text-xs text-slate-500">Fleet records, fitness certifications, and active drivers</p>
                  </div>
                  <button
                    onClick={() => setCheckVehicleOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    <ScanLine className="w-4 h-4" />
                    <span>Verify Vehicle</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sampleRegisteredVehicles.map((v) => (
                    <div
                      key={v.plate}
                      className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="bg-slate-900 text-white px-2.5 py-1 rounded-lg font-mono-plate font-bold text-sm">
                          {v.plate}
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {v.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{v.type}</h4>
                        <p className="text-xs text-slate-500">{v.transporter}</p>
                      </div>
                      <div className="text-xs text-slate-600 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span>Driver: <strong>{v.driver}</strong></span>
                        <span className="font-mono-plate">{v.capacity}</span>
                      </div>
                      <button
                        onClick={() => {
                          setCheckVehicleOpen(true);
                        }}
                        className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
                      >
                        Inspect Documentation
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeItem === 'users' ? (
              /* Users View */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
                    <p className="text-xs text-slate-500">Authorized personnel and role-based access control</p>
                  </div>
                  <button
                    onClick={() => showToast('Invite link generated')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Invite New User</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <div key={u.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 font-bold text-slate-800 font-mono-plate flex items-center justify-center">
                            {u.initials}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Generic structured section view */
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 capitalize">
                    {activeItem.replace('-', ' ')}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Operational module for {activeItem}. All records are synchronized with the central logistics server.
                  </p>
                </div>
                <button
                  onClick={() => setActiveItem('dashboard')}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-black transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals & Slide-overs */}
      <CreateTripModal
        isOpen={createTripOpen}
        onClose={() => setCreateTripOpen(false)}
        onSubmit={handleCreateTrip}
      />

      <CheckVehicleModal
        isOpen={checkVehicleOpen}
        onClose={() => setCheckVehicleOpen(false)}
        onDispatchVehicle={(plate) => {
          setCreateTripOpen(true);
        }}
      />

      <TripDetailModal
        trip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
        onUpdateStatus={handleUpdateTripStatus}
      />

      <DeviceReviewModal
        isOpen={deviceReviewOpen}
        onClose={() => setDeviceReviewOpen(false)}
        devices={deviceApprovals}
        onApprove={handleApproveDevice}
        onReject={handleRejectDevice}
      />
    </div>
  );
}
