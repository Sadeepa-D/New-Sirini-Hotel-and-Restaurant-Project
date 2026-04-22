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
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            User Accounts
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">
            Manage access levels and staff credentials.
          </p>
        </div>
        <button
          onClick={() => navigate("/register")}
          className="flex items-center justify-center gap-2 bg-black text-yellow-400 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-md text-sm w-full sm:w-auto"
        >
          <UserPlus size={17} />
          Add New User
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400/30 border border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* User cards */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow duration-200"
          >
            {/* Status stripe */}
            <div
              className={`hidden sm:block w-1 self-stretch rounded-full ${user.Status === "Active" ? "bg-green-400" : "bg-red-400"}`}
            />

            {/* Avatar */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-11 h-11 shrink-0 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-black text-base">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-sm truncate">
                  {user.name}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 truncate">
                    <Mail size={11} /> {user.email}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Phone size={11} /> {user.Phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Role + Status badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                <ShieldCheck size={12} className="text-gray-400" />
                {user.Role}
              </span>
              <span
                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                  user.Status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {user.Status}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                title="Edit"
                className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Edit3 size={16} />
              </button>

              <button
                title={user.Status === "Active" ? "Suspend" : "Activate"}
                onClick={() => toggleuserstatus(user)}
                className={`p-2 rounded-xl transition-colors ${
                  user.Status === "Active"
                    ? "text-orange-500 hover:bg-orange-50"
                    : "text-green-500 hover:bg-green-50"
                }`}
              >
                {user.Status === "Active" ? (
                  <UserX size={16} />
                ) : (
                  <UserCheck size={16} />
                )}
              </button>

              <button
                title="Delete"
                onClick={() => deleteuser(user)}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>

              <div className="w-px h-5 bg-gray-200" />

              <button
                title="Change Role"
                onClick={() => {
                  setSelectedUser(user);
                  setNewRole(user.Role);
                  setIsPromoteModalOpen(true);
                }}
                className="p-2 rounded-xl text-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                <UserCog size={16} />
              </button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No users found
          </div>
        )}
      </div>

      {/* Promote Role Modal */}
      {isPromoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">
                Change Role —{" "}
                <span className="text-yellow-600">{selectedUser?.name}</span>
              </h3>
              <button
                onClick={() => setIsPromoteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              {["user", "manager", "admin"].map((role) => (
                <label
                  key={role}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                    newRole === role
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={newRole === role}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-4 h-4 accent-yellow-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 capitalize">
                    {role}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsPromoteModalOpen(false)}
                className="flex-1 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateuserrole(selectedUser._id);
                  setIsPromoteModalOpen(false);
                }}
                className="flex-1 py-2.5 text-sm font-bold text-black bg-yellow-400 rounded-xl hover:bg-yellow-500 transition-colors shadow-md shadow-yellow-400/20"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
