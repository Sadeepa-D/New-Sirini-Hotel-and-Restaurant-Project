import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  UserX,
  UserCheck,
  Mail,
  ShieldCheck,
  Filter,
  Phone,
  UserCog,
  X,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const VITE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${VITE_URL}/api/users/getall/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateuserrole = async (id) => {
    const loadingtoast = toast.loading("Updating user role...");
    try {
      const response = await axios.put(`${VITE_URL}/api/users/update/role`, {
        userId: id,
        newRole: newRole,
      });
      toast.dismiss(loadingtoast);
      toast.success("User role updated successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleuserstatus = async (users) => {
    const newStatus = users.Status === "Active" ? "Suspended" : "Active";
    const loadingtoast = toast.loading(
      users.Status === "Active" ? "Suspending user..." : "Activating user...",
    );
    try {
      const response = await axios.put(
        `${VITE_URL}/api/users/update/userstatus`,
        {
          userId: users._id,
          newStatus: newStatus,
        },
      );
      toast.dismiss(loadingtoast);
      toast.success("User status updated successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status.");
    }
  };

  const deleteuser = async (users) => {
    const loadingtoast = toast.loading("Deleting user...");
    try {
      const response = await axios.put(`${VITE_URL}/api/users/delete/user`, {
        userId: users._id,
        deleteStatus: "Deleted",
      });
      toast.dismiss(loadingtoast);
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">User Accounts</h2>
          <p className="text-gray-500 text-sm">
            Manage system access levels and staff credentials.
          </p>
        </div>
        <button
          onClick={() => navigate("/register")}
          className="flex items-center justify-center gap-2 bg-black text-yellow-500 px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-lg w-full md:w-auto"
        >
          <UserPlus size={20} /> Add New User
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search accounts..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-yellow-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Unified Responsive Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-3xl border border-gray-100 p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all group"
          >
            {/* LEFT: Identity Section (35% width on desktop) */}
            <div className="flex items-center gap-4 md:w-[35%] min-w-0">
              <div
                className={`w-1.5 h-12 rounded-full hidden md:block ${user.Status === "Active" ? "bg-green-500" : "bg-red-500"}`}
              />
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-black text-lg shadow-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <h3 className="font-bold text-gray-900 truncate">
                  {user.name}
                </h3>
                <div className="flex flex-col text-[11px] text-gray-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Mail size={11} /> {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={11} /> {user.Phone}
                  </span>
                </div>
              </div>
            </div>

            {/* MIDDLE: Role & Status (Centered on desktop) */}
            <div className="flex flex-1 items-center justify-between md:justify-center gap-4 px-2">
              <div className="flex flex-row md:flex-col items-center md:items-center gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 whitespace-nowrap">
                  <ShieldCheck size={12} className="text-gray-400" />
                  {user.Role}
                </span>
                <span
                  className={`text-[9px] font-black uppercase px-3 py-0.5 rounded-full border ${
                    user.Status === "Active"
                      ? "bg-green-50 text-green-600 border-green-100"
                      : "bg-red-50 text-red-500 border-red-100"
                  }`}
                >
                  {user.Status}
                </span>
              </div>
            </div>

            {/* RIGHT: Actions Hub (Fixed width on desktop) */}
            <div className="flex items-center justify-end md:w-[30%] shrink-0">
              <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 gap-1 w-full md:w-auto justify-around md:justify-end">
                <button
                  title="Edit"
                  className="p-2 rounded-xl text-blue-500 hover:bg-white hover:shadow-sm transition-all"
                >
                  <Edit3 size={17} />
                </button>

                <button
                  onClick={() => toggleuserstatus(user)}
                  title="Status"
                  className={`p-2 rounded-xl transition-all hover:bg-white hover:shadow-sm ${user.Status === "Active" ? "text-orange-500" : "text-green-600"}`}
                >
                  {user.Status === "Active" ? (
                    <UserX size={17} />
                  ) : (
                    <UserCheck size={17} />
                  )}
                </button>

                <button
                  onClick={() => deleteuser(user)}
                  title="Delete"
                  className="p-2 rounded-xl text-red-500 hover:bg-white hover:shadow-sm transition-all"
                >
                  <Trash2 size={17} />
                </button>

                <div className="w-px h-6 bg-gray-200 mx-1 hidden md:block" />

                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setNewRole(user.Role);
                    setIsPromoteModalOpen(true);
                  }}
                  className="p-2 rounded-xl text-indigo-600 hover:bg-white hover:shadow-sm transition-all"
                >
                  <UserCog size={17} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role Modal */}
      {isPromoteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">Change Role</h3>
              <button
                onClick={() => setIsPromoteModalOpen(false)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 mb-8">
              {["User", "Manager", "Operational Manager", "Admin"].map(
                (role) => (
                  <label
                    key={role}
                    className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${newRole === role ? "border-yellow-500 bg-yellow-50" : "border-gray-50"}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={newRole === role}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-4 h-4 accent-yellow-600"
                    />
                    <span className="font-bold text-sm text-gray-700">
                      {role}
                    </span>
                  </label>
                ),
              )}
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  updateuserrole(selectedUser._id);
                  setIsPromoteModalOpen(false);
                }}
                className="w-full py-4 bg-black text-yellow-500 font-black rounded-2xl shadow-xl active:scale-95 transition-all"
              >
                Update Access
              </button>
              <button
                onClick={() => setIsPromoteModalOpen(false)}
                className="w-full py-4 text-gray-400 font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
