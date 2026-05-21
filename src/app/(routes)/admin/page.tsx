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

type TabType = "buses" | "routes" | "schedules" | "bookings";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("buses");
  const [loading, setLoading] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Data states
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Edit states
  const [editingBusId, setEditingBusId] = useState<string | null>(null);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  // Form states
  const [busForm, setBusForm] = useState({
    name: "",
    registration_number: "",
    total_seats: "",
  });

  const [routeForm, setRouteForm] = useState({
    from_location: "",
    to_location: "",
  });

  const [scheduleForm, setScheduleForm] = useState({
    bus_id: "",
    route_id: "",
    departure_time: "",
    arrival_time: "",
    fare_price: "",
    available_seats: "",
    departure_date: "",
  });

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "ccadmin";

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [busesRes, routesRes, schedulesRes, bookingsRes] = await Promise.all(
        [getBuses(), getRoutes(), getSchedules(), getBookings()]
      );

      if (busesRes.success && busesRes.data) setBuses(busesRes.data);
      if (routesRes.success && routesRes.data) setRoutes(routesRes.data);
      if (schedulesRes.success && schedulesRes.data) setSchedules(schedulesRes.data);
      if (bookingsRes.success && bookingsRes.data) setBookings(bookingsRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Load data and admin auth state on mount
  useEffect(() => {
    const savedAuth = typeof window !== "undefined" ? sessionStorage.getItem("cc-admin-auth") : null;
    if (savedAuth === "true") {
      setTimeout(() => {
        setAdminAuthenticated(true);
        loadAllData();
      }, 0);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === ADMIN_PASSWORD) {
      setAdminAuthenticated(true);
      setAuthError(null);
      sessionStorage.setItem("cc-admin-auth", "true");
      loadAllData();
      return;
    }
    setAuthError("Incorrect admin passcode.");
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("cc-admin-auth");
    setAdminAuthenticated(false);
    setAdminPasscode("");
  };

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!busForm.name || !busForm.registration_number || !busForm.total_seats) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      let result;
      if (editingBusId) {
        result = await updateBus(editingBusId, {
          name: busForm.name,
          registration_number: busForm.registration_number,
          total_seats: parseInt(busForm.total_seats),
        });
      } else {
        result = await createBus({
          name: busForm.name,
          registration_number: busForm.registration_number,
          total_seats: parseInt(busForm.total_seats),
        });
      }

      if (result.success) {
        toast.success(editingBusId ? "Bus updated successfully" : "Bus created successfully");
        setBusForm({ name: "", registration_number: "", total_seats: "" });
        setEditingBusId(null);
        await loadAllData();
      } else {
        toast.error(result.error || "Failed to save bus");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeForm.from_location || !routeForm.to_location) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      let result;
      if (editingRouteId) {
        result = await updateRoute(editingRouteId, {
          from_location: routeForm.from_location,
          to_location: routeForm.to_location,
        });
      } else {
        result = await createRoute({
          from_location: routeForm.from_location,
          to_location: routeForm.to_location,
        });
      }

      if (result.success) {
        toast.success(editingRouteId ? "Route updated successfully" : "Route created successfully");
        setRouteForm({ from_location: "", to_location: "" });
        setEditingRouteId(null);
        await loadAllData();
      } else {
        toast.error(result.error || "Failed to save route");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !scheduleForm.bus_id ||
      !scheduleForm.route_id ||
      !scheduleForm.departure_time ||
      !scheduleForm.arrival_time ||
      !scheduleForm.fare_price ||
      !scheduleForm.available_seats ||
      !scheduleForm.departure_date
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      let result;
      if (editingScheduleId) {
        result = await updateSchedule(editingScheduleId, {
          bus_id: scheduleForm.bus_id,
          route_id: scheduleForm.route_id,
          departure_time: scheduleForm.departure_time,
          arrival_time: scheduleForm.arrival_time,
          fare_price: parseFloat(scheduleForm.fare_price),
          available_seats: parseInt(scheduleForm.available_seats),
          departure_date: scheduleForm.departure_date,
        });
      } else {
        result = await createSchedule({
          bus_id: scheduleForm.bus_id,
          route_id: scheduleForm.route_id,
          departure_time: scheduleForm.departure_time,
          arrival_time: scheduleForm.arrival_time,
          fare_price: parseFloat(scheduleForm.fare_price),
          available_seats: parseInt(scheduleForm.available_seats),
          departure_date: scheduleForm.departure_date,
        });
      }

      if (result.success) {
        toast.success(editingScheduleId ? "Schedule updated successfully" : "Schedule created successfully");
        resetScheduleForm();
        await loadAllData();
      } else {
        toast.error(result.error || "Failed to save schedule");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditBus = (bus: Bus) => {
    setEditingBusId(bus.id);
    setBusForm({
      name: bus.name,
      registration_number: bus.registration_number,
      total_seats: String(bus.total_seats),
    });
  };

  const handleDeleteBus = async (busId: string) => {
    if (!confirm("Delete this bus? This action cannot be undone.")) return;
    setLoading(true);
    const result = await deleteBus(busId);
    setLoading(false);
    if (result.success) {
      toast.success("Bus deleted successfully");
      await loadAllData();
    } else {
      toast.error(result.error || "Failed to delete bus");
    }
  };

  const handleEditRoute = (route: Route) => {
    setEditingRouteId(route.id);
    setRouteForm({
      from_location: route.from_location,
      to_location: route.to_location,
    });
  };

  const handleDeleteRoute = async (routeId: string) => {
    if (!confirm("Delete this route? This action cannot be undone.")) return;
    setLoading(true);
    const result = await deleteRoute(routeId);
    setLoading(false);
    if (result.success) {
      toast.success("Route deleted successfully");
      await loadAllData();
    } else {
      toast.error(result.error || "Failed to delete route");
    }
  };

  const handleEditSchedule = (schedule: BusSchedule) => {
    setEditingScheduleId(schedule.id);
    setScheduleForm({
      bus_id: schedule.bus_id || "",
      route_id: schedule.route_id || "",
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
      fare_price: String(schedule.fare_price),
      available_seats: String(schedule.available_seats),
      departure_date: schedule.departure_date,
    });
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm("Delete this schedule? This action cannot be undone.")) return;
    setLoading(true);
    const result = await deleteSchedule(scheduleId);
    setLoading(false);
    if (result.success) {
      toast.success("Schedule deleted successfully");
      await loadAllData();
    } else {
      toast.error(result.error || "Failed to delete schedule");
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Delete this booking? This action cannot be undone.")) return;
    setLoading(true);
    const result = await deleteBooking(bookingId);
    setLoading(false);
    if (result.success) {
      toast.success("Booking deleted successfully");
      await loadAllData();
    } else {
      toast.error(result.error || "Failed to delete booking");
    }
  };

  const resetBusForm = () => {
    setEditingBusId(null);
    setBusForm({ name: "", registration_number: "", total_seats: "" });
  };

  const resetRouteForm = () => {
    setEditingRouteId(null);
    setRouteForm({ from_location: "", to_location: "" });
  };

  const resetScheduleForm = () => {
    setEditingScheduleId(null);
    setScheduleForm({
      bus_id: "",
      route_id: "",
      departure_time: "",
      arrival_time: "",
      fare_price: "",
      available_seats: "",
      departure_date: "",
    });
  };

  if (!adminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900/95 border border-purple-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Admin Access</CardTitle>
            <CardDescription className="text-purple-300">
              Enter the admin passcode to manage the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Admin Passcode
                </label>
                <Input
                  type="password"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  className="bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300"
                />
              </div>
              {authError ? (
                <p className="text-sm text-rose-400">{authError}</p>
              ) : null}
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                Unlock Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <Toaster />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faShield}
              className="text-purple-400 text-3xl"
            />
            <div>
              <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-purple-200">Manage buses, routes, schedules, and bookings</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleAdminLogout}
            className="border border-white/20 bg-white/10 text-white hover:bg-white/15"
          >
            <FontAwesomeIcon icon={faUnlock} className="mr-2" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { id: "buses", label: "Buses", icon: faBus },
            { id: "routes", label: "Routes", icon: faMapMarkerAlt },
            { id: "schedules", label: "Schedules", icon: faCalendar },
            { id: "bookings", label: "Bookings", icon: faTicket },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`p-4 rounded-lg backdrop-blur-md border transition-all ${
                activeTab === tab.id
                  ? "bg-purple-600/50 border-purple-400 text-white"
                  : "bg-white/10 border-white/20 text-purple-200 hover:bg-white/20"
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Buses Tab */}
        {activeTab === "buses" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 text-white lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} />
                  Add New Bus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateBus} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Bus Name
                    </label>
                    <Input
                      value={busForm.name}
                      onChange={(e) =>
                        setBusForm({ ...busForm, name: e.target.value })
                      }
                      placeholder="e.g., Express XL"
                      disabled={loading}
                      className="bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Registration Number
                    </label>
                    <Input
                      value={busForm.registration_number}
                      onChange={(e) =>
                        setBusForm({
                          ...busForm,
                          registration_number: e.target.value,
                        })
                      }
                      placeholder="e.g., ABC-123-XY"
                      disabled={loading}
                      className="bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Total Seats
                    </label>
                    <Input
                      type="number"
                      value={busForm.total_seats}
                      onChange={(e) =>
                        setBusForm({
                          ...busForm,
                          total_seats: e.target.value,
                        })
                      }
                      placeholder="e.g., 50"
                      disabled={loading}
                      className="bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    >
                      {editingBusId ? "Update Bus" : "Save Bus"}
                    </Button>
                    {editingBusId ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetBusForm}
                        className="flex-1 text-white border-white/20"
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faList} />
                All Buses
              </h3>
              {buses.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                  <CardContent className="p-8 text-center text-purple-300">
                    No buses yet. Create one to get started!
                  </CardContent>
                </Card>
              ) : (
                buses.map((bus) => (
                  <Card
                    key={bus.id}
                    className="bg-white/10 backdrop-blur-md border-purple-400/30"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-white">
                            {bus.name}
                          </h4>
                          <p className="text-purple-300 text-sm">
                            {bus.registration_number}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-400">
                            {bus.total_seats}
                          </p>
                          <p className="text-purple-300 text-xs">seats</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleEditBus(bus)}
                          className="border border-white/10 text-purple-100 hover:bg-white/10"
                        >
                          <FontAwesomeIcon icon={faPen} className="mr-2" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleDeleteBus(bus.id)}
                          className="border border-rose-300/20 text-rose-200 hover:bg-rose-500/10"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Routes Tab */}
        {activeTab === "routes" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 text-white lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} />
                  Add New Route
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateRoute} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      From Location
                    </label>
                    <Input
                      value={routeForm.from_location}
                      onChange={(e) =>
                        setRouteForm({
                          ...routeForm,
                          from_location: e.target.value,
                        })
                      }
                      placeholder="e.g., Lagos"
                      disabled={loading}
                      className="bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      To Location
                    </label>
                    <Input
                      value={routeForm.to_location}
                      onChange={(e) =>
                        setRouteForm({
                          ...routeForm,
                          to_location: e.target.value,
                        })
                      }
                      placeholder="e.g., Abuja"
                      disabled={loading}
                      className="bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    >
                      {editingRouteId ? "Update Route" : "Save Route"}
                    </Button>
                    {editingRouteId ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetRouteForm}
                        className="flex-1 text-white border-white/20"
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faList} />
                All Routes
              </h3>
              {routes.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                  <CardContent className="p-8 text-center text-purple-300">
                    No routes yet. Create one to get started!
                  </CardContent>
                </Card>
              ) : (
                routes.map((route) => (
                  <Card
                    key={route.id}
                    className="bg-white/10 backdrop-blur-md border-purple-400/30"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 justify-between flex-wrap">
                        <div className="flex-1 min-w-[180px]">
                          <p className="text-white font-bold">
                            {route.from_location}
                          </p>
                          <p className="text-purple-300 text-xs">From</p>
                        </div>
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="text-purple-400"
                        />
                        <div className="flex-1 min-w-[180px] text-right">
                          <p className="text-white font-bold">
                            {route.to_location}
                          </p>
                          <p className="text-purple-300 text-xs">To</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleEditRoute(route)}
                          className="border border-white/10 text-purple-100 hover:bg-white/10"
                        >
                          <FontAwesomeIcon icon={faPen} className="mr-2" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleDeleteRoute(route.id)}
                          className="border border-rose-300/20 text-rose-200 hover:bg-rose-500/10"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Schedules Tab */}
        {activeTab === "schedules" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 text-white lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} />
                  Add Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSchedule} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Bus
                    </label>
                    <Select
                      value={scheduleForm.bus_id}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          bus_id: e.target.value,
                        })
                      }
                      disabled={loading}
                      className="bg-white/10 border-purple-400/30 text-white"
                    >
                      <option value="">Select Bus</option>
                      {buses.map((bus) => (
                        <option key={bus.id} value={bus.id} className="bg-gray-900">
                          {bus.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Route
                    </label>
                    <Select
                      value={scheduleForm.route_id}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          route_id: e.target.value,
                        })
                      }
                      disabled={loading}
                      className="bg-white/10 border-purple-400/30 text-white"
                    >
                      <option value="">Select Route</option>
                      {routes.map((route) => (
                        <option key={route.id} value={route.id} className="bg-gray-900">
                          {route.from_location} → {route.to_location}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Departure Date
                    </label>
                    <Input
                      type="date"
                      value={scheduleForm.departure_date}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          departure_date: e.target.value,
                        })
                      }
                      disabled={loading}
                      className="bg-white/10 border-purple-400/30 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-2">
                        Departure Time
                      </label>
                      <Input
                        type="time"
                        value={scheduleForm.departure_time}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            departure_time: e.target.value,
                          })
                        }
                        disabled={loading}
                        className="bg-white/10 border-purple-400/30 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-2">
                        Arrival Time
                      </label>
                      <Input
                        type="time"
                        value={scheduleForm.arrival_time}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            arrival_time: e.target.value,
                          })
                        }
                        disabled={loading}
                        className="bg-white/10 border-purple-400/30 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-2">
                        Fare Price
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={scheduleForm.fare_price}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            fare_price: e.target.value,
                          })
                        }
                        placeholder="5000"
                        disabled={loading}
                        className="bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-2">
                        Available Seats
                      </label>
                      <Input
                        type="number"
                        value={scheduleForm.available_seats}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            available_seats: e.target.value,
                          })
                        }
                        placeholder="50"
                        disabled={loading}
                        className="bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    >
                      {editingScheduleId ? "Update Schedule" : "Save Schedule"}
                    </Button>
                    {editingScheduleId ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetScheduleForm}
                        className="flex-1 text-white border-white/20"
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faList} />
                All Schedules
              </h3>
              {schedules.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                  <CardContent className="p-8 text-center text-purple-300">
                    No schedules yet. Create one to get started!
                  </CardContent>
                </Card>
              ) : (
                schedules.map((schedule) => (
                  <Card
                    key={schedule.id}
                    className="bg-white/10 backdrop-blur-md border-purple-400/30"
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-purple-300 text-xs">Route</p>
                          <p className="text-white font-bold">
                            {schedule.route?.from_location} →{" "}
                            {schedule.route?.to_location}
                          </p>
                        </div>
                        <div>
                          <p className="text-purple-300 text-xs">Bus</p>
                          <p className="text-white font-bold">
                            {schedule.bus?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-purple-300 text-xs">Date</p>
                          <p className="text-white font-bold">
                            {formatDate(schedule.departure_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-purple-300 text-xs">Time</p>
                          <p className="text-white font-bold">
                            {formatTime(schedule.departure_time)}
                          </p>
                        </div>
                        <div>
                          <p className="text-purple-300 text-xs">Fare</p>
                          <p className="text-purple-400 font-bold">
                            {formatCurrency(schedule.fare_price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-purple-300 text-xs">Available</p>
                          <p className="text-blue-400 font-bold">
                            {schedule.available_seats} seats
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleEditSchedule(schedule)}
                          className="border border-white/10 text-purple-100 hover:bg-white/10"
                        >
                          <FontAwesomeIcon icon={faPen} className="mr-2" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="border border-rose-300/20 text-rose-200 hover:bg-rose-500/10"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faList} />
              All Bookings
            </h3>
            {bookings.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                <CardContent className="p-8 text-center text-purple-300">
                  No bookings yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="bg-white/10 backdrop-blur-md border-purple-400/30"
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <p className="text-purple-300 text-xs font-medium">
                            PASSENGER
                          </p>
                          <p className="text-white font-bold">
                            {booking.passenger_name}
                          </p>
                          <p className="text-purple-300 text-xs">
                            {booking.passenger_email}
                          </p>
                        </div>
                        <div>
                          <p className="text-purple-300 text-xs font-medium">
                            ROUTE
                          </p>
                          <p className="text-white font-bold">
                            {booking.schedule?.route?.from_location} →{" "}
                            {booking.schedule?.route?.to_location}
                          </p>
                          <p className="text-purple-300 text-xs">
                            {formatDate(
                              booking.schedule?.departure_date || ""
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-purple-300 text-xs font-medium">
                            SEATS
                          </p>
                          <p className="text-white font-bold">
                            {booking.seats.join(", ")}
                          </p>
                          <p className="text-purple-300 text-xs">
                            {booking.seats.length} seat(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-purple-300 text-xs font-medium">
                            PAYMENT
                          </p>
                          <p className="text-purple-400 font-bold">
                            {formatCurrency(booking.total_price || 0)}
                          </p>
                          <span
                            className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                              booking.payment_status === "completed"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-yellow-500/20 text-yellow-300"
                            }`}
                          >
                            {booking.payment_status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="border border-rose-300/20 text-rose-200 hover:bg-rose-500/10"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Delete Booking
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
