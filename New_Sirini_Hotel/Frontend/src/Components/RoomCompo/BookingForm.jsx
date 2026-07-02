import React, { useState, useEffect } from "react";
import axios from "axios";
import GuestDetail from "./GuestDetail";
import BookingSuccess from "../RoomCompo/SuccessMsg";
import DayUseCalender from "./DayUseCalender";
import ChoosePackage, { PACKAGES } from "./ChoosePackage";

const addDays = (dateStr, n) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + n));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
};

function BookingForm({
  selectedRoom,
  onClose,
  onConfirmed,
  isLoggedIn,
  onRequireLogin,
}) {
  const VITE_URL = import.meta.env.VITE_API_URL;

  const [step, setStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingMode, setBookingMode] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    checkInDate: "",
    checkOutDate: "",
  });

  useEffect(() => {
    if (!bookingMode) return;
    const pkg = PACKAGES.find((p) => p.id === bookingMode);
    if (!pkg) return;
    const basePrice =
      bookingMode === "day"
        ? selectedRoom.shortStayPrice || 1500
        : selectedRoom.price;
    if (
      bookingMode === "fullday" &&
      formData.checkInDate &&
      formData.checkOutDate
    ) {
      const [y1, m1, d1] = formData.checkInDate.split("-").map(Number);
      const [y2, m2, d2] = formData.checkOutDate.split("-").map(Number);
      const days = Math.round(
        (Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) /
          (1000 * 60 * 60 * 24),
      );
      setTotalPrice(days > 0 ? basePrice * days : 0);
    } else {
      setTotalPrice(basePrice);
    }
  }, [
    bookingMode,
    formData.checkInDate,
    formData.checkOutDate,
    selectedRoom.price,
    selectedRoom.shortStayPrice,
  ]);

  // Fetch user data when step 2 is reached
  useEffect(() => {
    if (step === 2 && isLoggedIn && !userData) {
      fetchUserData();
    }
  }, [step, isLoggedIn]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${VITE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data;
      setUserData(user);

      // Pre-fill form with user data (Phone is uppercase in model)
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.Phone || "", // Note: Phone is uppercase in the model
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSelectMode = (mode) => {
    setBookingMode(mode);
    setFormData({
      name: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.Phone || "", // Note: Phone is uppercase in the model
      guests: 1,
      checkInDate: "",
      checkOutDate: "",
    });
    setStep(1);
  };

  const handleDateSelect = (dateStr) => {
    if (bookingMode === "fullday") {
      if (
        !formData.checkInDate ||
        (formData.checkInDate && formData.checkOutDate)
      ) {
        setFormData({ ...formData, checkInDate: dateStr, checkOutDate: "" });
      } else {
        if (dateStr > formData.checkInDate) {
          setFormData({ ...formData, checkOutDate: dateStr });
        } else {
          setFormData({ ...formData, checkInDate: dateStr, checkOutDate: "" });
        }
      }
    } else {
      setFormData({
        ...formData,
        checkInDate: dateStr,
        checkOutDate: addDays(dateStr, 1),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${VITE_URL}/api/rooms/book`,
        {
          ...formData,
          room: selectedRoom._id,
          roomNumber: selectedRoom.roomNumber,
          totalAmount: totalPrice,
          numberOfGuests: formData.guests,
          bookingType: "day-use",
          timeSlot: bookingMode,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      onConfirmed(selectedRoom._id);
      setShowSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Booking failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ----- Render -----
  if (showSuccess)
    return (
      <BookingSuccess
        selectedRoom={selectedRoom}
        onClose={onClose}
        totalPrice={totalPrice}
        bookingMode={bookingMode}
      />
    );

  const selectedPkg = PACKAGES.find((p) => p.id === bookingMode);
  const nightBasePrice = selectedPkg
    ? selectedPkg.id === "day"
      ? selectedRoom.shortStayPrice || 1500
      : selectedRoom.price
    : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-white/60 backdrop-blur-xl"
        onClick={onClose}
      />

      {/*Package Selector*/}
      {step === 0 && (
        <ChoosePackage
          selectedRoom={selectedRoom}
          onSelectMode={handleSelectMode}
          onClose={onClose}
        />
      )}

      {/*Date Picker*/}
      {step === 1 && selectedPkg && (
        <DayUseCalender
          selectedDate={formData.checkInDate}
          selectedCheckOut={formData.checkOutDate}
          onDateSelect={handleDateSelect}
          onNext={() => {
            if (!isLoggedIn) {
              onRequireLogin();
            } else {
              setStep(2);
            }
          }}
          onClose={onClose}
          onBack={() => setStep(0)}
          roomNumber={selectedRoom.roomNumber}
          pkg={selectedPkg}
          timeSlot={bookingMode}
          totalPrice={totalPrice}
        />
      )}

      {/* Guest Details*/}
      {step === 2 && (
        <GuestDetail
          formData={formData}
          setFormData={setFormData}
          maxCapacity={selectedRoom.capacity}
          totalPrice={totalPrice}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
          loading={loading}
          onClose={onClose}
          bookingMode={bookingMode}
          selectedPkg={selectedPkg}
        />
      )}
    </div>
  );
}

export default BookingForm;
