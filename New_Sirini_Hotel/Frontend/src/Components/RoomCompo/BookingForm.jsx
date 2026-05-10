import React, { useState, useEffect } from "react";
import axios from "axios";
import RoomCalender from "../RoomCompo/RoomCalender";
import GuestDetail from "./GuestDetail";
import BookingSuccess from "../RoomCompo/SuccessMsg";


function BookingForm({ selectedRoom, onClose, onConfirmed }) {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(selectedRoom.price);
  const [bookedDates, setBookedDates] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", guests: 1, checkInDate: "", checkOutDate: "" });

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await axios.get(`${VITE_URL}/api/rooms/unavailablerooms/dates/${selectedRoom.roomNumber}`);
        const unavailable = [];
        res.data.forEach(item => {
          let curr = new Date(item.checkInDate);
          const end = new Date(item.checkOutDate);
          while (curr <= end) {
            unavailable.push(curr.toISOString().split('T')[0]);
            curr.setDate(curr.getDate() + 1);
          }
        });
        setBookedDates(unavailable);
      } catch (e) { console.error(e); }
    };
    fetchDates();
  }, [selectedRoom.roomNumber, VITE_URL]);

  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      const nights = Math.ceil((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24));
      setTotalPrice(nights > 0 ? nights * selectedRoom.price : selectedRoom.price);
    }
  }, [formData.checkInDate, formData.checkOutDate, selectedRoom.price]);

  const handleDateSelect = (dateStr) => {
    if (!formData.checkInDate || (formData.checkInDate && formData.checkOutDate)) {
      setFormData({ ...formData, checkInDate: dateStr, checkOutDate: "" });
    } else {
      if (new Date(dateStr) > new Date(formData.checkInDate)) {
        setFormData({ ...formData, checkOutDate: dateStr });
      } else {
        setFormData({ ...formData, checkInDate: dateStr });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${VITE_URL}/api/rooms/book`, 
        { ...formData, room: selectedRoom._id, roomNumber: selectedRoom.roomNumber, totalAmount: totalPrice, numberOfGuests: formData.guests },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      onConfirmed(selectedRoom._id); setShowSuccess(true);
    } catch (error) { alert("Booking failed."); } finally { setLoading(false); }
  };

  if (showSuccess) return <BookingSuccess selectedRoom={selectedRoom} onClose={onClose} totalPrice={totalPrice} />;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-xl" onClick={onClose} />
      
      {step === 1 ? (
        <RoomCalender
          bookedDates={bookedDates} 
          checkIn={formData.checkInDate} 
          checkOut={formData.checkOutDate} 
          onDateSelect={handleDateSelect} 
          onNext={() => setStep(2)}
          onClose={onClose}
          roomNumber={selectedRoom.roomNumber}
        />
      ) : (
        <GuestDetail
          formData={formData} 
          setFormData={setFormData} 
          maxCapacity={selectedRoom.capacity} 
          totalPrice={totalPrice} 
          onBack={() => setStep(1)} 
          onSubmit={handleSubmit}
          loading={loading}
          onClose={onClose}
        />
      )}
    </div>
  );
}

export default BookingForm;