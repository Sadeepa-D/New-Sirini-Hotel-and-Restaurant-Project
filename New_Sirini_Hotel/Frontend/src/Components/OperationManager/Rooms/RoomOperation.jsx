import React, { useState } from "react";
import RoomStatsRow from "./RoomStatsRow";
import RoomTableHeader from "./RoomTableHeader";
// import RoomTable from "./RoomTable";
// import RoomFormModal from "./RoomFormModal";

const initialRooms = [
  { id: 1, roomNumber: "01", type: "Single",  price: 3500,  capacity: 1, status: "available",   description: "Cozy single room with garden view" },
  { id: 2, roomNumber: "02", type: "Double",  price: 6500,  capacity: 2, status: "occupied",     description: "Spacious double room with balcony" },
  { id: 3, roomNumber: "03", type: "Suite",   price: 15000, capacity: 4, status: "available",    description: "Luxury suite with ocean view" },
  { id: 4, roomNumber: "04", type: "Single",  price: 3500,  capacity: 1, status: "maintenance",  description: "Single room under renovation" },
];

const RoomOperation = () => {
  const [rooms, setRooms]           = useState(initialRooms);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRooms = rooms.filter((r) =>
    r.roomNumber.includes(searchTerm) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  };

  const handleSave = (formData) => {
    if (editingRoom) {
      setRooms(rooms.map((r) => (r.id === editingRoom.id ? { ...formData, id: editingRoom.id } : r)));
    } else {
      setRooms([...rooms, { ...formData, id: Date.now() }]);
    }
    setIsFormOpen(false);
    setEditingRoom(null);
  };

  const stats = {
    available:   rooms.filter((r) => r.status === "available").length,
    occupied:    rooms.filter((r) => r.status === "occupied").length,
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

      <RoomTable
        rooms={filteredRooms}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <RoomFormModal
          initialData={editingRoom}
          onSubmit={handleSave}
          onClose={() => { setIsFormOpen(false); setEditingRoom(null); }}
        />
      )}
    </div>
  );
};

export default RoomOperation;