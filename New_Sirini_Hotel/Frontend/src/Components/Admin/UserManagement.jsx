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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editdata, setEditData] = useState({});
  const [showResetField, setShowResetField] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${VITE_URL}/api/users/getall/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateuserrole = async (id) => {
    const loadingtoast = toast.loading("Updating user role...");
    try {
      const response = await axios.put(
        `${VITE_URL}/api/users/update/role`,
        {
          userId: id,
          newRole: newRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      const response = await axios.put(
        `${VITE_URL}/api/users/delete/user`,
        {
          userId: users._id,
          deleteStatus: "Deleted",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.dismiss(loadingtoast);
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const updateuserdetails = async (e) => {
    e.preventDefault();
    const loadingtoast = toast.loading("Updating user details...");
    try {
      const response = await axios.put(
        `${VITE_URL}/api/users/update/userdetails`,
        {
          userId: editdata.id,
          name: editdata.name,
          email: editdata.email,
          Phone: editdata.Phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.dismiss(loadingtoast);
      toast.success("User details updated successfully!");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Failed to update user details.");
      toast.dismiss(loadingtoast);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditData({
      id: user._id,
      name: user.name,
      email: user.email,
      Phone: user.Phone,
    });
    setIsEditModalOpen(true);
  };

  const handlePasswordReset = async () => {
    if (!tempPassword) {
      toast.error("Please enter a new temporary password.");
      return;
    }
    const loadingtoast = toast.loading("Resetting user password...");
    try {
      const response = await axios.put(
        `${VITE_URL}/api/users/reset/userpassword`,
        {
          userId: selectedUser._id,
          newPassword: tempPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.dismiss(loadingtoast);
      toast.success("User password reset successfully!");
      setTempPassword("");
    } catch (error) {
      console.error("Error resetting user password:", error);
      toast.error("Failed to reset user password.");
      toast.dismiss(loadingtoast);
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
              <div className="w-15 h-17 shrink-0 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-black text-lg shadow-sm">
                {/* {user.name?.charAt(0).toUpperCase()} */}
                {!user.image ? (
                  user.name?.charAt(0).toUpperCase()
                ) : (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-2xl border-2 border-yellow-200/50"
                  />
                )}
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
            <div className="flex flex-col items-start md:items-center justify-center gap-2 px-2 md:flex-1">
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

            {/* RIGHT: Actions Hub (Fixed width on desktop) */}
            <div className="flex items-center justify-end md:w-[30%] shrink-0">
              <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 gap-1 w-full md:w-auto justify-around md:justify-end">
                <button
                  title="Edit"
                  className="p-2 rounded-xl text-blue-500 hover:bg-white hover:shadow-sm transition-all"
                  onClick={() => openEditModal(user)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">
                Change Role Of-
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
              {[
                " User",
                " Operation Manager 1 (Restraunt,Liquor)",
                " Operation Manager 2 (Reception, Room)",
              ].map((role) => {
                const updatingrole = role.trim();
                return (
                  <label
                    key={updatingrole}
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                      newRole === updatingrole
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={updatingrole}
                      checked={newRole === updatingrole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-4 h-4 accent-yellow-500"
                    />
                    <span className="text-sm font-semibold text-gray-700 capitalize">
                      {role}
                    </span>
                  </label>
                );
              })}
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
                  updateuserrole(selectedUser._id, newRole);
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
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-black p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-yellow-500">
                  Edit Profile
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Update primary contact details
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={updateuserdetails} className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                  value={editdata.name}
                  onChange={(e) =>
                    setEditData({ ...editdata, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                  value={editdata.email}
                  onChange={(e) =>
                    setEditData({ ...editdata, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                  value={editdata.Phone}
                  onChange={(e) =>
                    setEditData({ ...editdata, phone: e.target.value })
                  }
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                {!showResetField ? (
                  <button
                    type="button"
                    onClick={() => setShowResetField(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2 transition-colors"
                  >
                    <ShieldCheck size={14} />
                    Reset User Password?
                  </button>
                ) : (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase text-indigo-400">
                        Set New Temporary Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowResetField(false);
                          setTempPassword("");
                        }}
                        className="text-[10px] font-bold text-gray-400 hover:text-red-500"
                      >
                        Cancel Reset
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter new password"
                        className="flex-1 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handlePasswordReset}
                        className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-200"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-[9px] text-gray-400 italic">
                      User will need to use this password for their next login.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3 bg-black text-yellow-500 font-bold rounded-2xl shadow-lg shadow-yellow-500/10 active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserManagement;
