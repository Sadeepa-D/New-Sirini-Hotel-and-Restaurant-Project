import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  CalendarDays,
  Users,
  UtensilsCrossed,
  MessageSquare,
  Tag,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const eventTypes = ["Wedding", "Birthday", "Corporate", "Anniversary", "Other"];
const eventTimes = ["Day (9am - 4pm)", "Night (7pm - 1am)"];

const ReceptionHallBookForm = ({
  fetchBookings,
  onClose,
  editData = null,
  AllBookings = [],
  packages = [],
}) => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    eventDate: "",
    eventTime: "",
    eventType: "",
    numberOfGuests: "",
    specialRequests: "",
    amountPayed: "",
    selectedPackage: "",
    status: "Confirmed",
  });

  const handlesubmit = async (e) => {
    e.preventDefault();
    const isconflict = AllBookings.some((booking) => {
      if (booking.status === "Cancelled") return false;
      if (editData && booking._id === editData._id) return false;
      const bookingdate = new Date(booking.eventDate)
        .toISOString()
        .split("T")[0];
      const selectedDate = formData.eventDate;
      return (
        bookingdate === selectedDate && booking.eventTime === formData.eventTime
      );
    });

    if (isconflict) {
      toast.error("Selected date and time slot is already booked");
      return;
    }
    onClose();
    const loadingToast = toast.loading(
      `${editData ? "Updating" : "Creating"} booking...`,
    );

    try {
      const token = localStorage.getItem("token");
      if (editData) {
        await axios.put(
          `${VITE_URL}/api/receptionhall/booking/update/${editData._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        await axios.post(
          `${VITE_URL}/api/receptionhall/booking/add`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }
      toast.success(`${editData ? "Updated" : "Created"} booking successfully`);
      fetchBookings();
    } catch (error) {
      toast.error("Failed to save booking");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        customerName: editData.customerName,
        customerEmail: editData.customerEmail,
        customerPhone: editData.customerPhone,
        eventDate: editData.eventDate ? editData.eventDate.split("T")[0] : "",
        eventTime: editData.eventTime,
        eventType: editData.eventType,
        numberOfGuests: editData.numberOfGuests,
        specialRequests: editData.specialRequests,
        amountPayed: editData.amountPayed,
        selectedPackage: editData.selectedPackage,
        status: editData.status,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "selectedPackage") {
      const matchedPackage = packages.find((pkg) => pkg.name === value);
      setFormData((prev) => ({
        ...prev,
        selectedPackage: value,
        amountPayed: matchedPackage
          ? matchedPackage.price * formData.numberOfGuests
          : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const checkavailability = () => {
    if (!formData.eventDate || !formData.eventTime) return true;

    return !AllBookings.some((booking) => {
      if (booking.status === "Cancelled") return false;
      if (editData && booking._id === editData._id) return false;
      const bookingdate = new Date(booking.eventDate)
        .toISOString()
        .split("T")[0];
      const selectedDate = formData.eventDate;
      return (
        bookingdate === selectedDate && booking.eventTime === formData.eventTime
      );
    });
  };
  const isAvailable = checkavailability();

  const inputClass =
    "w-full text-sm text-gray-700 outline-none placeholder-gray-300 bg-transparent";
  const wrapClass =
    "flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div>
            <p className="text-amber-500 text-xs uppercase tracking-[0.3em] font-medium mb-0.5">
              Reception
            </p>
            <h2 className="font-cinzel text-xl sm:text-2xl text-gray-800 font-semibold">
              {editData
                ? "Edit Reception Hall Booking"
                : "New Reception Hall Booking"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handlesubmit} className="px-6 py-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
              Customer Name
            </label>
            <div className={wrapClass}>
              <User size={15} className="text-amber-400 shrink-0" />
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Email
              </label>
              <div className={wrapClass}>
                <Mail size={15} className="text-amber-400 shrink-0" />
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Phone
              </label>
              <div className={wrapClass}>
                <Phone size={15} className="text-amber-400 shrink-0" />
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="077 123 4567"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Event Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Event Date
              </label>
              <div className={wrapClass}>
                <CalendarDays size={15} className="text-amber-400 shrink-0" />
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Event Time
              </label>
              <div className={wrapClass}>
                <Clock size={18} className="text-amber-400 shrink-0" />
                <select
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  required
                  className={`${inputClass} appearance-none`}
                >
                  <option value="" disabled>
                    Select Time
                  </option>
                  {eventTimes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {!isAvailable && (
              <p className="text-[10px] text-red-500 mt-1 ml-2 font-bold animate-pulse">
                This slot is already reserved!
              </p>
            )}
          </div>

          {/* Event Type + Number of Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Event Type
              </label>
              <div className={wrapClass}>
                <Tag size={15} className="text-amber-400 shrink-0" />
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  className={`${inputClass} appearance-none`}
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Number of Guests
              </label>
              <div className={wrapClass}>
                <Users size={15} className="text-amber-400 shrink-0" />
                <input
                  type="number"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  placeholder="e.g. 250"
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div className={wrapClass}>
              <Tag size={15} className="text-amber-400 shrink-0" />
              <select
                name="selectedPackage"
                value={formData.selectedPackage}
                onChange={handleChange}
                required
                className={`${inputClass} appearance-none`}
              >
                <option value="" disabled>
                  Select Package
                </option>
                {packages.map((pkg) => (
                  <option key={pkg._id} value={pkg.name}>
                    {pkg.name} - Rs: {pkg.price}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Amount payed:
              </label>
              <div className={wrapClass}>
                <Users size={15} className="text-amber-400 shrink-0" />
                <input
                  type="number"
                  name="amountPayed"
                  value={formData.amountPayed}
                  onChange={handleChange}
                  placeholder="Rs: 50000"
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div className={wrapClass}>
              <Tag size={15} className="text-amber-400 shrink-0" />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className={`${inputClass} appearance-none`}
              >
                <option value="" disabled>
                  Request Status
                </option>
                <option value="Confirmed">Confirmed</option>
                <option value="Booked">Booked</option>{" "}
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
              Special Requests
            </label>
            <div className="flex items-start gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-400 transition-colors">
              <MessageSquare
                size={15}
                className="text-amber-400 shrink-0 mt-0.5"
              />
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Any special requirements..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/2 py-3 rounded-full border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-1/2 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold uppercase tracking-widest transition-all duration-300 shadow-md"
            >
              {editData ? "Update" : "Add Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceptionHallBookForm;
