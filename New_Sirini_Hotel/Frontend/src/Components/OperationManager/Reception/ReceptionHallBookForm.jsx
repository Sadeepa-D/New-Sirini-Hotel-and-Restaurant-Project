import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Calander from "../../Calander";

const eventTypes = ["Wedding", "Birthday", "Corporate", "Anniversary", "Other"];
const eventTimes = ["Day (9am - 4pm)", "Night (7pm - 1am)"];

const parseLocalDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const CustomSelect = ({ value, onChange, options, placeholder, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderRadius: "16px" }}
        className={`flex items-center gap-3 border border-gray-200 px-4 py-3 bg-white hover:border-amber-400/80 hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 ${
          isOpen ? "border-amber-500 ring-2 ring-amber-500/10 scale-[1.01]" : ""
        }`}
      >
        {Icon && <Icon size={15} className="text-amber-400 shrink-0" />}
        <span className={`text-sm select-none ${value ? "text-gray-800 font-semibold" : "text-gray-500"}`}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 ml-auto transition-transform duration-300 pointer-events-none ${
            isOpen ? "transform rotate-180 text-amber-500" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div
          style={{ borderRadius: "12px" }}
          className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl z-50 max-h-60 overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {options.map((opt) => {
            const optVal = typeof opt === "object" ? opt.value : opt;
            const optLabel = typeof opt === "object" ? opt.label : opt;
            const isSelected = value === optVal;
            return (
              <div
                key={optVal}
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
                style={{ borderRadius: "8px" }}
                className={`px-3 py-2.5 text-sm cursor-pointer transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.97] ease-in-out ${
                  isSelected
                    ? "bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20"
                    : "text-gray-600 hover:bg-amber-50 hover:text-amber-700 hover:font-medium"
                }`}
              >
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ReceptionHallBookForm = ({
  fetchBookings,
  onClose,
  editData = null,
  AllBookings = [],
  packages = [],
  initialEventDate = "",
}) => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [loadingBookedDates, setLoadingBookedDates] = useState(true);
  const datePickerRef = useRef(null);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState("");
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
    paymentMethod: "Cash",
    paymentProofUrl: "",
    paymentProofPublicId: "",
    status: "Confirmed",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await axios.get(
          `${VITE_URL}/api/receptionhall/booking/dates`,
        );

        const normalized = response.data.map((item) => {
          const date = new Date(item.eventDate);
          const y = date.getUTCFullYear();
          const m = String(date.getUTCMonth() + 1).padStart(2, "0");
          const d = String(date.getUTCDate()).padStart(2, "0");
          return { dateStr: `${y}-${m}-${d}`, time: item.eventTime };
        });

        setBookedDates(normalized);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      } finally {
        setLoadingBookedDates(false);
      }
    };

    fetchBookedDates();
  }, [VITE_URL]);

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (formData.paymentMethod === "Cash" && (!formData.amountPayed || Number(formData.amountPayed) <= 0)) {
      toast.error("Please enter the amount paid for cash payments.");
      return;
    }

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
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          payload.append(key, value);
        }
      });

      if (formData.paymentMethod === "Cash") {
        payload.set("amountPayed", formData.amountPayed || 0);
      } else {
        payload.set("amountPayed", formData.amountPayed || 0);
        if (paymentProofFile) {
          payload.append("paymentProof", paymentProofFile);
        } else if (formData.paymentProofUrl) {
          payload.append("paymentProofUrl", formData.paymentProofUrl);
          payload.append("paymentProofPublicId", formData.paymentProofPublicId || "");
        }
      }

      if (editData) {
        await axios.put(
          `${VITE_URL}/api/receptionhall/booking/update/${editData._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        await axios.post(
          `${VITE_URL}/api/receptionhall/booking/add`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }
      toast.success(`${editData ? "Updated" : "Created"} booking successfully`);
      fetchBookings();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to save booking";
      toast.error(errorMessage);
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
        paymentMethod: editData.paymentMethod || "Cash",
        paymentProofUrl: editData.paymentProofUrl || "",
        paymentProofPublicId: editData.paymentProofPublicId || "",
        status: editData.status,
      });
      setPaymentProofPreview(editData.paymentProofUrl || "");
      setPaymentProofFile(null);
    } else if (initialEventDate) {
      setFormData((prev) => ({
        ...prev,
        eventDate: initialEventDate,
      }));
    }
  }, [editData, initialEventDate]);

  const handleDateSelect = (selectedDate) => {
    const formatted = formatLocalDate(selectedDate);
    setFormData((prev) => ({ ...prev, eventDate: formatted }));
    setShowDatePicker(false);
  };

  const handlePaymentMethodChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value,
      paymentProofUrl: value === "Cash" ? "" : prev.paymentProofUrl,
      paymentProofPublicId: value === "Cash" ? "" : prev.paymentProofPublicId,
    }));

    if (value === "Cash") {
      setPaymentProofFile(null);
      setPaymentProofPreview("");
    }
  };

  const handlePaymentProofChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPaymentProofFile(file);
    setPaymentProofPreview(URL.createObjectURL(file));
  };

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
    "w-full text-sm text-gray-700 outline-none placeholder-gray-300 bg-transparent transition-colors focus:text-amber-600";
  const wrapClass =
    "flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 hover:border-amber-400/80 hover:scale-[1.01] transition-all duration-300 ease-in-out bg-white";

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
            <div ref={datePickerRef}>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Event Date
              </label>
              <div className="relative">
                <div className={wrapClass}>
                  <CalendarDays size={15} className="text-amber-400 shrink-0" />
                  <input
                    type="text"
                    name="eventDate"
                    value={formData.eventDate}
                    readOnly
                    placeholder="YYYY-MM-DD"
                    required
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDatePicker((prev) => !prev)}
                    className="ml-auto text-amber-500 hover:text-amber-600"
                    aria-label="Open calendar"
                  >
                    <CalendarDays size={16} />
                  </button>
                </div>
                {showDatePicker && (
                  <div className="absolute z-[60] mt-2 w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                    <Calander
                      BookedDates={bookedDates}
                      loading={loadingBookedDates}
                      selectedDateValue={formData.eventDate ? parseLocalDate(formData.eventDate) : null}
                      onDateSelect={handleDateSelect}
                      title="Choose Event Date"
                      subtitle="Only open dates can be selected"
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Event Time
              </label>
              <CustomSelect
                value={formData.eventTime}
                onChange={(val) => setFormData((prev) => ({ ...prev, eventTime: val }))}
                options={eventTimes}
                placeholder="Select Time"
                icon={Clock}
              />
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
              <CustomSelect
                value={formData.eventType}
                onChange={(val) => setFormData((prev) => ({ ...prev, eventType: val }))}
                options={eventTypes}
                placeholder="Select Type"
                icon={Tag}
              />
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
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Selected Package
              </label>
              <CustomSelect
                value={formData.selectedPackage}
                onChange={(val) => {
                  const matchedPackage = packages.find((pkg) => pkg.name === val);
                  setFormData((prev) => ({
                    ...prev,
                    selectedPackage: val,
                    amountPayed: matchedPackage
                      ? matchedPackage.price * prev.numberOfGuests
                      : "",
                  }));
                }}
                options={packages.map((pkg) => ({
                  value: pkg.name,
                  label: `${pkg.name} - Rs: ${pkg.price}`,
                }))}
                placeholder="Select Package"
                icon={Tag}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Payment Method
              </label>
              <CustomSelect
                value={formData.paymentMethod}
                onChange={handlePaymentMethodChange}
                options={["Cash", "Online Transfer"]}
                placeholder="Select Payment Method"
                icon={Tag}
              />
            </div>
            {formData.paymentMethod === "Cash" ? (
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                  Amount paid
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
            ) : (
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                  Upload Payment Proof
                </label>
                <div className={`${wrapClass} flex-col items-start`}>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-600">
                    <Upload size={15} />
                    {paymentProofFile ? paymentProofFile.name : "Choose image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePaymentProofChange}
                      className="hidden"
                    />
                  </label>
                  {paymentProofPreview && (
                    <img
                      src={paymentProofPreview}
                      alt="Payment proof preview"
                      className="mt-3 h-24 w-full rounded-xl border border-gray-200 object-cover"
                    />
                  )}
                  {!paymentProofPreview && formData.paymentProofUrl && (
                    <a
                      href={formData.paymentProofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 text-xs font-semibold text-amber-600 underline"
                    >
                      View existing payment proof
                    </a>
                  )}
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5 font-medium">
                Request Status
              </label>
              <CustomSelect
                value={formData.status}
                onChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
                options={["Confirmed", "Booked", "Cancelled"]}
                placeholder="Request Status"
                icon={Tag}
              />
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
              style={{ borderRadius: "12px" }}
              className="w-full sm:w-1/2 py-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 text-sm font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ borderRadius: "12px" }}
              className="w-full sm:w-1/2 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold uppercase tracking-widest transition-all duration-200 shadow-md transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
