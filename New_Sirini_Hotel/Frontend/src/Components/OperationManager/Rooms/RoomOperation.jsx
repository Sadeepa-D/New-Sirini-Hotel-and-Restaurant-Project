import React, { useState, useEffect } from "react";
import axios from "axios";
import RoomStatsRow from "./RoomStatsRow";
import RoomTableHeader from "./RoomTableHeader";
import RoomTable from "./RoomTable";
import RoomFormModal from "./RoomFormModal";

const RoomOperation = () => {
  const [rooms, setRooms] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms/viewrooms");
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ✅ Search එකට status එකත් ඇතුළත් කළා
  const filteredRooms = rooms.filter(
    (r) =>
      r.roomNumber?.toString().includes(searchTerm) ||
      r.roomType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.status?.toLowerCase().includes(searchTerm.toLowerCase())
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
        await axios.delete(`http://localhost:5000/api/rooms/deleteroom/${id}`);
        fetchRooms();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleSave = async (formData) => {
    const data = new FormData();
    data.append("roomNumber", formData.roomNumber);
    data.append("roomType", formData.roomType);
    data.append("price", formData.price);
    data.append("bedType", formData.bedType);
    data.append("capacity", formData.capacity);
    data.append("status", formData.status);
    data.append("description", formData.description || "");
    data.append("condition", formData.condition || "Fan");

    if (formData.imageFile) {
      data.append("image", formData.imageFile);
    }

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (editingRoom) {
        await axios.put(
          `http://localhost:5000/api/rooms/updateroom/${editingRoom._id}`,
          data,
          config,
        );
      } else {
        await axios.post("http://localhost:5000/api/rooms/add", data, config);
      }
      fetchRooms();
      setIsFormOpen(false);
      setEditingRoom(null);
    } catch (err) {
      console.error("Save Error:", err.response?.data);
      alert(err.response?.data?.message || "Error saving room");
    }
  };

  // ✅ Stats ගණනය කිරීම status අනුව වෙනස් කළා
  const stats = {
    available: rooms.filter((r) => r.status === "available").length,
    reserved: rooms.filter((r) => r.status === "reserved").length, 
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  };

  return (
    <div className="p-4 md:p-6">
      {/* stats object එක දැන් නිවැරදි අගයන් යවයි */}
      <RoomStatsRow stats={stats} />

      <RoomTableHeader
        onAdd={handleAdd}
        searchTerm={searchTerm}
        onSearch={(e) => setSearchTerm(e.target.value)}
      />

      <RoomTable
        rooms={filteredRooms}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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