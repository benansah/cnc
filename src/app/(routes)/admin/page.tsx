"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form";
import { Toaster, toast } from "sonner";
import {
  createBus,
  createRoute,
  createSchedule,
  getBuses,
  getRoutes,
  getSchedules,
  getBookings,
  updateBus,
  deleteBus,
  updateRoute,
  deleteRoute,
  updateSchedule,
  deleteSchedule,
  deleteBooking,
} from "@/actions";
import { Bus, Route, BusSchedule, Booking } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faMapMarkerAlt,
  faPlus,
  faList,
  faTicket,
  faShield,
  faCalendar,
  faPen,
  faTrash,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type TabType = "buses" | "routes" | "schedules" | "bookings";

const labelClass = "block text-xs font-bold uppercase tracking-wider text-[#425066] mb-2";
const inputClass = "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#425066] placeholder:text-[#80868B] outline-none transition focus:border-[#425066] focus:ring-2 focus:ring-[#425066]/20 disabled:opacity-50";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("buses");
  const [loading, setLoading] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [editingBusId, setEditingBusId] = useState<string | null>(null);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  const [busForm, setBusForm] = useState({ name: "", registration_number: "", total_seats: "" });
  const [routeForm, setRouteForm] = useState({ from_location: "", to_location: "" });
  const [scheduleForm, setScheduleForm] = useState({
    bus_id: "", route_id: "", departure_time: "", arrival_time: "",
    fare_price: "", available_seats: "", departure_date: "",
  });

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "ccadmin";

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [busesRes, routesRes, schedulesRes, bookingsRes] = await Promise.all([getBuses(), getRoutes(), getSchedules(), getBookings()]);
      if (busesRes.success && busesRes.data) setBuses(busesRes.data);
      if (routesRes.success && routesRes.data) setRoutes(routesRes.data);
      if (schedulesRes.success && schedulesRes.data) setSchedules(schedulesRes.data);
      if (bookingsRes.success && bookingsRes.data) setBookings(bookingsRes.data);
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const savedAuth = typeof window !== "undefined" ? sessionStorage.getItem("cc-admin-auth") : null;
    if (savedAuth === "true") {
      setTimeout(() => { setAdminAuthenticated(true); loadAllData(); }, 0);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === ADMIN_PASSWORD) {
      setAdminAuthenticated(true); setAuthError(null);
      sessionStorage.setItem("cc-admin-auth", "true");
      loadAllData(); return;
    }
    setAuthError("Incorrect admin passcode.");
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("cc-admin-auth");
    setAdminAuthenticated(false); setAdminPasscode("");
  };

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!busForm.name || !busForm.registration_number || !busForm.total_seats) { toast.error("Please fill in all fields"); return; }
    try {
      setLoading(true);
      const result = editingBusId
        ? await updateBus(editingBusId, { name: busForm.name, registration_number: busForm.registration_number, total_seats: parseInt(busForm.total_seats) })
        : await createBus({ name: busForm.name, registration_number: busForm.registration_number, total_seats: parseInt(busForm.total_seats) });
      if (result.success) { toast.success(editingBusId ? "Bus updated" : "Bus created"); setBusForm({ name: "", registration_number: "", total_seats: "" }); setEditingBusId(null); await loadAllData(); }
      else toast.error(result.error || "Failed to save bus");
    } finally { setLoading(false); }
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeForm.from_location || !routeForm.to_location) { toast.error("Please fill in all fields"); return; }
    try {
      setLoading(true);
      const result = editingRouteId
        ? await updateRoute(editingRouteId, { from_location: routeForm.from_location, to_location: routeForm.to_location })
        : await createRoute({ from_location: routeForm.from_location, to_location: routeForm.to_location });
      if (result.success) { toast.success(editingRouteId ? "Route updated" : "Route created"); setRouteForm({ from_location: "", to_location: "" }); setEditingRouteId(null); await loadAllData(); }
      else toast.error(result.error || "Failed to save route");
    } finally { setLoading(false); }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const { bus_id, route_id, departure_time, arrival_time, fare_price, available_seats, departure_date } = scheduleForm;
    if (!bus_id || !route_id || !departure_time || !arrival_time || !fare_price || !available_seats || !departure_date) { toast.error("Please fill in all fields"); return; }
    try {
      setLoading(true);
      const payload = { bus_id, route_id, departure_time, arrival_time, fare_price: parseFloat(fare_price), available_seats: parseInt(available_seats), departure_date };
      const result = editingScheduleId ? await updateSchedule(editingScheduleId, payload) : await createSchedule(payload);
      if (result.success) { toast.success(editingScheduleId ? "Schedule updated" : "Schedule created"); resetScheduleForm(); await loadAllData(); }
      else toast.error(result.error || "Failed to save schedule");
    } finally { setLoading(false); }
  };

  const handleEditBus = (bus: Bus) => { setEditingBusId(bus.id); setBusForm({ name: bus.name, registration_number: bus.registration_number, total_seats: String(bus.total_seats) }); };
  const handleDeleteBus = async (id: string) => {
    if (!confirm("Delete this bus?")) return;
    setLoading(true); const r = await deleteBus(id); setLoading(false);
    if (r.success) { toast.success("Bus deleted"); await loadAllData(); } else toast.error(r.error || "Failed to delete bus");
  };

  const handleEditRoute = (route: Route) => { setEditingRouteId(route.id); setRouteForm({ from_location: route.from_location, to_location: route.to_location }); };
  const handleDeleteRoute = async (id: string) => {
    if (!confirm("Delete this route?")) return;
    setLoading(true); const r = await deleteRoute(id); setLoading(false);
    if (r.success) { toast.success("Route deleted"); await loadAllData(); } else toast.error(r.error || "Failed to delete route");
  };

  const handleEditSchedule = (s: BusSchedule) => {
    setEditingScheduleId(s.id);
    setScheduleForm({ bus_id: s.bus_id || "", route_id: s.route_id || "", departure_time: s.departure_time, arrival_time: s.arrival_time, fare_price: String(s.fare_price), available_seats: String(s.available_seats), departure_date: s.departure_date });
  };
  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("Delete this schedule?")) return;
    setLoading(true); const r = await deleteSchedule(id); setLoading(false);
    if (r.success) { toast.success("Schedule deleted"); await loadAllData(); } else toast.error(r.error || "Failed to delete schedule");
  };
  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    setLoading(true); const r = await deleteBooking(id); setLoading(false);
    if (r.success) { toast.success("Booking deleted"); await loadAllData(); } else toast.error(r.error || "Failed to delete booking");
  };

  const resetBusForm = () => { setEditingBusId(null); setBusForm({ name: "", registration_number: "", total_seats: "" }); };
  const resetRouteForm = () => { setEditingRouteId(null); setRouteForm({ from_location: "", to_location: "" }); };
  const resetScheduleForm = () => {
    setEditingScheduleId(null);
    setScheduleForm({ bus_id: "", route_id: "", departure_time: "", arrival_time: "", fare_price: "", available_seats: "", departure_date: "" });
  };

  const emptyCard = (msg: string) => (
    <Card>
      <CardContent className="p-10 text-center text-[#80868B] text-sm">{msg}</CardContent>
    </Card>
  );

  const actionBtn = (label: string, icon: typeof faPen, onClick: () => void, danger = false) => (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:scale-[1.03] ${
        danger
          ? "border-[#FCE8E6] text-[#EA4335] hover:bg-[#FCE8E6]"
          : "border-[#E5E7EB] text-[#425066] hover:border-[#425066] hover:text-[#425066]"
      }`}
    >
      <FontAwesomeIcon icon={icon} className="h-3 w-3" />
      {label}
    </button>
  );

  /* ── Auth gate ─────────────────────────────────────────── */
  if (!adminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <Toaster richColors />
        <div className="w-full max-w-md animate-fade-in">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8ebf0]">
                <FontAwesomeIcon icon={faShield} className="h-7 w-7 text-[#425066]" />
              </div>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Enter the admin passcode to manage the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className={labelClass}>Admin Passcode</label>
                  <Input
                    type="password"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter passcode"
                    className={inputClass}
                  />
                </div>
                {authError && <p className="text-xs text-[#EA4335] font-medium">{authError}</p>}
                <Button type="submit" className="w-full h-11">Unlock Dashboard</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /* ── Dashboard ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Toaster richColors />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/cnc_logo.png" alt="C&C Transport" width={40} height={40} className="object-contain" />
            <div className="leading-tight">
              <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#425066]">C&C Transport</span>
              <span className="block text-sm font-bold text-[#425066]">Admin Dashboard</span>
            </div>
          </Link>
          <Button variant="outline" onClick={handleAdminLogout} size="sm">
            <FontAwesomeIcon icon={faUnlock} className="mr-2 h-3 w-3" />
            Logout
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#425066]">Dashboard</h1>
          <p className="text-sm text-[#425066] mt-1">Manage buses, routes, schedules, and bookings.</p>
        </div>

        {/* Tab bar */}
        <div className="mb-8 flex gap-1 rounded-2xl border border-[#E5E7EB] bg-white p-1.5 shadow-card w-fit">
          {[
            { id: "buses", label: "Buses", icon: faBus },
            { id: "routes", label: "Routes", icon: faMapMarkerAlt },
            { id: "schedules", label: "Schedules", icon: faCalendar },
            { id: "bookings", label: "Bookings", icon: faTicket },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#425066] text-white shadow-sm"
                  : "text-[#425066] hover:bg-[#F3F4F6] hover:text-[#425066]"
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Buses Tab ──────────────────────────────────────── */}
        {activeTab === "buses" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5 text-[#425066]" />
                  {editingBusId ? "Edit Bus" : "Add New Bus"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateBus} className="space-y-4">
                  <div>
                    <label className={labelClass}>Bus Name</label>
                    <Input value={busForm.name} onChange={(e) => setBusForm({ ...busForm, name: e.target.value })} placeholder="e.g., Express XL" disabled={loading} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Registration Number</label>
                    <Input value={busForm.registration_number} onChange={(e) => setBusForm({ ...busForm, registration_number: e.target.value })} placeholder="e.g., ABC-123-XY" disabled={loading} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Total Seats</label>
                    <Input type="number" value={busForm.total_seats} onChange={(e) => setBusForm({ ...busForm, total_seats: e.target.value })} placeholder="e.g., 49" disabled={loading} className={inputClass} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {editingBusId ? "Update" : "Save Bus"}
                    </Button>
                    {editingBusId && (
                      <Button type="button" variant="outline" onClick={resetBusForm} className="flex-1">Cancel</Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-bold text-[#425066] flex items-center gap-2">
                <FontAwesomeIcon icon={faList} className="h-3.5 w-3.5 text-[#425066]" />
                All Buses ({buses.length})
              </h3>
              {buses.length === 0 ? emptyCard("No buses yet. Create one to get started!") : buses.map((bus) => (
                <Card key={bus.id} className="hover-lift">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-[#425066]">{bus.name}</h4>
                        <p className="text-xs text-[#80868B] mt-0.5">{bus.registration_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#425066]">{bus.total_seats}</p>
                        <p className="text-xs text-[#80868B]">seats</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      {actionBtn("Edit", faPen, () => handleEditBus(bus))}
                      {actionBtn("Delete", faTrash, () => handleDeleteBus(bus.id), true)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── Routes Tab ─────────────────────────────────────── */}
        {activeTab === "routes" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5 text-[#425066]" />
                  {editingRouteId ? "Edit Route" : "Add New Route"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateRoute} className="space-y-4">
                  <div>
                    <label className={labelClass}>From Location</label>
                    <Input value={routeForm.from_location} onChange={(e) => setRouteForm({ ...routeForm, from_location: e.target.value })} placeholder="e.g., Accra" disabled={loading} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>To Location</label>
                    <Input value={routeForm.to_location} onChange={(e) => setRouteForm({ ...routeForm, to_location: e.target.value })} placeholder="e.g., Kumasi" disabled={loading} className={inputClass} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {editingRouteId ? "Update" : "Save Route"}
                    </Button>
                    {editingRouteId && (
                      <Button type="button" variant="outline" onClick={resetRouteForm} className="flex-1">Cancel</Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-bold text-[#425066] flex items-center gap-2">
                <FontAwesomeIcon icon={faList} className="h-3.5 w-3.5 text-[#425066]" />
                All Routes ({routes.length})
              </h3>
              {routes.length === 0 ? emptyCard("No routes yet.") : routes.map((route) => (
                <Card key={route.id} className="hover-lift">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex-1 min-w-[140px]">
                        <p className="text-xs text-[#80868B] uppercase tracking-wider">From</p>
                        <p className="font-bold text-[#425066] mt-0.5">{route.from_location}</p>
                      </div>
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#425066] h-4 w-4" />
                      <div className="flex-1 min-w-[140px] text-right">
                        <p className="text-xs text-[#80868B] uppercase tracking-wider">To</p>
                        <p className="font-bold text-[#425066] mt-0.5">{route.to_location}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2 justify-end">
                      {actionBtn("Edit", faPen, () => handleEditRoute(route))}
                      {actionBtn("Delete", faTrash, () => handleDeleteRoute(route.id), true)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── Schedules Tab ──────────────────────────────────── */}
        {activeTab === "schedules" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5 text-[#425066]" />
                  {editingScheduleId ? "Edit Schedule" : "Add Schedule"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSchedule} className="space-y-4">
                  <div>
                    <label className={labelClass}>Bus</label>
                    <Select value={scheduleForm.bus_id} onChange={(e) => setScheduleForm({ ...scheduleForm, bus_id: e.target.value })} disabled={loading} className={inputClass}>
                      <option value="">Select Bus</option>
                      {buses.map((bus) => <option key={bus.id} value={bus.id}>{bus.name}</option>)}
                    </Select>
                  </div>
                  <div>
                    <label className={labelClass}>Route</label>
                    <Select value={scheduleForm.route_id} onChange={(e) => setScheduleForm({ ...scheduleForm, route_id: e.target.value })} disabled={loading} className={inputClass}>
                      <option value="">Select Route</option>
                      {routes.map((r) => <option key={r.id} value={r.id}>{r.from_location} → {r.to_location}</option>)}
                    </Select>
                  </div>
                  <div>
                    <label className={labelClass}>Departure Date</label>
                    <Input type="date" value={scheduleForm.departure_date} onChange={(e) => setScheduleForm({ ...scheduleForm, departure_date: e.target.value })} disabled={loading} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>Dep. Time</label>
                      <Input type="time" value={scheduleForm.departure_time} onChange={(e) => setScheduleForm({ ...scheduleForm, departure_time: e.target.value })} disabled={loading} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Arr. Time</label>
                      <Input type="time" value={scheduleForm.arrival_time} onChange={(e) => setScheduleForm({ ...scheduleForm, arrival_time: e.target.value })} disabled={loading} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>Fare (GH₵)</label>
                      <Input type="number" step="0.01" value={scheduleForm.fare_price} onChange={(e) => setScheduleForm({ ...scheduleForm, fare_price: e.target.value })} placeholder="5000" disabled={loading} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Seats</label>
                      <Input type="number" value={scheduleForm.available_seats} onChange={(e) => setScheduleForm({ ...scheduleForm, available_seats: e.target.value })} placeholder="49" disabled={loading} className={inputClass} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {editingScheduleId ? "Update" : "Save Schedule"}
                    </Button>
                    {editingScheduleId && (
                      <Button type="button" variant="outline" onClick={resetScheduleForm} className="flex-1">Cancel</Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-bold text-[#425066] flex items-center gap-2">
                <FontAwesomeIcon icon={faList} className="h-3.5 w-3.5 text-[#425066]" />
                All Schedules ({schedules.length})
              </h3>
              {schedules.length === 0 ? emptyCard("No schedules yet.") : schedules.map((schedule) => (
                <Card key={schedule.id} className="hover-lift">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-[10px] text-[#80868B] uppercase tracking-wider">Route</p>
                        <p className="font-bold text-[#425066] text-sm mt-0.5">{schedule.route?.from_location} → {schedule.route?.to_location}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#80868B] uppercase tracking-wider">Bus</p>
                        <p className="font-bold text-[#425066] text-sm mt-0.5">{schedule.bus?.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#80868B] uppercase tracking-wider">Date</p>
                        <p className="font-bold text-[#425066] text-sm mt-0.5">{formatDate(schedule.departure_date)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#80868B] uppercase tracking-wider">Time</p>
                        <p className="font-bold text-[#425066] text-sm mt-0.5">{formatTime(schedule.departure_time)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#80868B] uppercase tracking-wider">Fare</p>
                        <p className="font-bold text-[#425066] text-sm mt-0.5">{formatCurrency(schedule.fare_price)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#80868B] uppercase tracking-wider">Available</p>
                        <p className="font-bold text-[#34A853] text-sm mt-0.5">{schedule.available_seats} seats</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2 justify-end">
                      {actionBtn("Edit", faPen, () => handleEditSchedule(schedule))}
                      {actionBtn("Delete", faTrash, () => handleDeleteSchedule(schedule.id), true)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── Bookings Tab ───────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#425066] flex items-center gap-2">
              <FontAwesomeIcon icon={faList} className="h-3.5 w-3.5 text-[#425066]" />
              All Bookings ({bookings.length})
            </h3>
            {bookings.length === 0 ? emptyCard("No bookings yet.") : bookings.map((booking) => (
              <Card key={booking.id} className="hover-lift">
                <CardContent className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div>
                      <p className="text-[10px] text-[#80868B] uppercase tracking-wider font-semibold">Passenger</p>
                      <p className="font-bold text-[#425066] text-sm mt-0.5">{booking.passenger_name}</p>
                      <p className="text-xs text-[#80868B]">{booking.passenger_email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#80868B] uppercase tracking-wider font-semibold">Route</p>
                      <p className="font-bold text-[#425066] text-sm mt-0.5">
                        {booking.schedule?.route?.from_location} → {booking.schedule?.route?.to_location}
                      </p>
                      <p className="text-xs text-[#80868B]">{formatDate(booking.schedule?.departure_date || "")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#80868B] uppercase tracking-wider font-semibold">Seats</p>
                      <p className="font-bold text-[#425066] text-sm mt-0.5">{booking.seats.join(", ")}</p>
                      <p className="text-xs text-[#80868B]">{booking.seats.length} seat(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#80868B] uppercase tracking-wider font-semibold">Payment</p>
                      <p className="font-bold text-[#425066] text-sm mt-0.5">{formatCurrency(booking.total_price || 0)}</p>
                      <span
                        className={`inline-block text-xs px-2.5 py-0.5 rounded-full mt-1 font-semibold ${
                          booking.payment_status === "completed"
                            ? "bg-[#E6F4EA] text-[#34A853]"
                            : "bg-[#FEF9E7] text-[#FBBC04]"
                        }`}
                      >
                        {booking.payment_status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    {actionBtn("Delete", faTrash, () => handleDeleteBooking(booking.id), true)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
