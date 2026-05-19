import React, { useState, useEffect } from "react";
import axios from "axios";
import RoomStatsRow from "./RoomStatsRow";
import RoomTableHeader from "./RoomTableHeader";
import RoomCards from "./RoomCards";
import RoomFormModal from "./RoomFormModal";
import toast from "react-hot-toast";
import RoomBookedDetails from "./RoomBookedDetails";

const RoomOperation = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const [rooms, setRooms] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  //refresh the tables after booking confirm or cancel
  const [refreshKey, setRefreshKey] = useState(0);

  const [activeTab, setActiveTab] = useState("manage");

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${VITE_URL}/api/rooms/viewrooms`);
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  const handleActionCompleted = () => {
    fetchRooms();
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(
    (r) =>
      r.roomNumber?.toString().includes(searchTerm) ||
      r.roomType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.status?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAdd = () => {
    setEditingRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`${VITE_URL}/api/rooms/deleteroom/${id}`);
        fetchRooms();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleSave = async (formData) => {
    const loadingtoast = toast.loading("Saving room...");
    const data = new FormData();
    data.append("roomNumber", formData.roomNumber);
    data.append("roomType", formData.roomType);
    data.append("price", formData.price);
    data.append("shortStayPrice", formData.shortStayPrice || "1500");
    data.append("bedType", formData.bedType);
    data.append("capacity", formData.capacity);
    data.append("status", formData.status);
    data.append("description", formData.description || "");
    data.append("condition", formData.condition || "Fan");

    // Append facilities as JSON string
    if (formData.facilities && formData.facilities.length > 0) {
      data.append("facilities", JSON.stringify(formData.facilities));
    } else {
      data.append("facilities", JSON.stringify([]));
    }

    if (formData.imageFile) {
      data.append("image", formData.imageFile);
    }

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (editingRoom) {
        await axios.put(
          `${VITE_URL}/api/rooms/updateroom/${editingRoom._id}`,
          data,
          config,
        );
      } else {
        await axios.post(`${VITE_URL}/api/rooms/add`, data, config);
      }
      toast.dismiss(loadingtoast);
      fetchRooms();
      setIsFormOpen(false);
      setEditingRoom(null);
    } catch (err) {
      console.error("Save Error:", err.response?.data);
      alert(err.response?.data?.message || "Error saving room");
    } finally {
      toast.dismiss(loadingtoast);
    }
  };

  const stats = {
    available: rooms.filter((r) => r.status === "available").length,
    reserved: rooms.filter((r) => r.status === "reserved").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  };

  return (
    <div className="p-4 md:p-6">
      <RoomStatsRow stats={stats} />

      <RoomTableHeader
        onAdd={handleAdd}
        searchTerm={searchTerm}
        onSearch={(e) => setSearchTerm(e.target.value)}
      />

      <RoomCards
        rooms={filteredRooms}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="mt-10 animate-in fade-in slide-in-from-left-4 duration-500">
        <div className="mt-10 mb-4">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
            Manage Booking Details
          </h2>
          <p className="text-gray-400 text-xs">
            Manage and monitor confirmed reservations
          </p>
        </div>

        <RoomBookedDetails
          refreshKey={refreshKey}
          onActionCompleted={handleActionCompleted}
        />
      </div>

      {isFormOpen && (
        <RoomFormModal
          initialData={editingRoom}
          onSubmit={handleSave}
          onClose={() => {
            setIsFormOpen(false);
            setEditingRoom(null);
          }}
        />
      )}
    </div>
  );
};

export default RoomOperation;
