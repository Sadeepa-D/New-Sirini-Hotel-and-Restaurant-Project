import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, BedDouble, Users, DollarSign, CheckCircle, XCircle } from "lucide-react";

// ── Initial Dummy Data ─────────────────────────────────────
const initialRooms = [
  { id: 1, roomNumber: "01", type: "Single", price: 3500, capacity: 1, status: "available", description: "Cozy single room with garden view" },
  { id: 2, roomNumber: "02", type: "Double", price: 6500, capacity: 2, status: "occupied", description: "Spacious double room with balcony" },
  { id: 3, roomNumber: "03", type: "Suite", price: 15000, capacity: 4, status: "available", description: "Luxury suite with ocean view" },
  { id: 4, roomNumber: "04", type: "Single", price: 3500, capacity: 1, status: "maintenance", description: "Single room under renovation" },
];

// ── Room Form Modal ────────────────────────────────────────
const RoomFormModal = ({ initialData, onSubmit, onClose }) => {
  const [form, setForm] = useState(
    initialData || { roomNumber: "", type: "Single", price: "", capacity: "", status: "available", description: "" }
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.roomNumber || !form.price || !form.capacity) {
      alert("Please fill in all required fields.");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Room" : "Add New Room"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Room Number *</label>
              <input
                name="roomNumber"
                value={form.roomNumber}
                onChange={handleChange}
                placeholder="e.g. 101"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Room Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              >
                <option>Single</option>
                <option>Double</option>
                <option>Suite</option>
                <option>Family</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Price (Rs.) *</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Capacity *</label>
              <input
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                placeholder="e.g. 2"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Room description..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-yellow-500 text-black font-bold text-sm hover:bg-yellow-400 transition"
          >
            {initialData ? "Update Room" : "Add Room"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Status Badge ───────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    available: "bg-green-100 text-green-700",
    occupied: "bg-red-100 text-red-700",
    maintenance: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

// ── Main Rooms Component ───────────────────────────────────
const RoomOperation = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRooms = rooms.filter(
    (r) =>
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

  const available = rooms.filter((r) => r.status === "available").length;
  const occupied = rooms.filter((r) => r.status === "occupied").length;
  const maintenance = rooms.filter((r) => r.status === "maintenance").length;

  return (
    <div className="p-4 md:p-6">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Available", value: available, color: "bg-green-50 text-green-700", dot: "bg-green-500" },
          { label: "Occupied", value: occupied, color: "bg-red-50 text-red-700", dot: "bg-red-500" },
          { label: "Maintenance", value: maintenance, color: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color} flex items-center gap-3`}>
            <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`}></span>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-100">
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition"
        >
          <Plus size={18} /> Add Room
        </button>
        <input
          type="text"
          placeholder="Search by room no, type, status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-gray-50"
        />
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Room</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Capacity</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Description</th>
                <th className="text-center px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 font-medium">No rooms found.</td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-bold text-gray-900">#{room.roomNumber}</td>
                    <td className="px-5 py-4 text-gray-600">{room.type}</td>
                    <td className="px-5 py-4 text-gray-800 font-semibold">Rs.{Number(room.price).toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-600">{room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}</td>
                    <td className="px-5 py-4"><StatusBadge status={room.status} /></td>
                    <td className="px-5 py-4 text-gray-500 max-w-[180px] truncate">{room.description}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
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