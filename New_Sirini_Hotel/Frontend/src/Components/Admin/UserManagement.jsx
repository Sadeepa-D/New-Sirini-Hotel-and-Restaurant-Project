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

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            User Accounts
          </h2>
          <p className="text-gray-500 text-sm">
            Manage system access levels and staff credentials.
          </p>
        </div>

        <button
          onClick={() => navigate("/register")}
          className="flex items-center justify-center gap-2 bg-black text-yellow-500 px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg shadow-yellow-500/10 w-full md:w-auto"
        >
          <UserPlus size={20} />
          Add New User
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-yellow-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors text-sm font-semibold">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Added table-fixed here */}
        <table className="w-full text-left table-fixed">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {/* We define widths here on the <th> tags */}
              <th className="w-[40%] px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                Full Name
              </th>
              <th className="w-[20%] px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                Role
              </th>
              <th className="w-[20%] px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="w-[20%] px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                {/* Full Name Cell - Content is truncated if it gets too long */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 truncate">
                        <Mail size={12} className="flex-shrink-0" />
                        {user.email}
                        <span className="text-gray-300 mx-1">|</span>
                        <Phone size={12} className="flex-shrink-0" />
                        {user.Phone}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg w-fit whitespace-nowrap">
                    <ShieldCheck size={14} className="text-gray-400" />
                    {user.Role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`text-[10px] uppercase font-black px-2 py-1 rounded-md whitespace-nowrap ${
                      user.Status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.Status}
                  </span>
                </td>

                {/* Actions Cell - Buttons are centered and tidy */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* Core Management Group */}
                    <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 items-center">
                      {/* Edit - Blue Tint */}
                      <button
                        title="Edit User"
                        className="p-2 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-200"
                      >
                        <Edit3 size={16} />
                      </button>

                      {/* Status Toggle - Orange/Green Tint */}
                      <button
                        title={
                          user.Status === "Active"
                            ? "Suspend User"
                            : "Activate User"
                        }
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          user.Status === "Active"
                            ? "text-orange-500 hover:bg-orange-500 hover:text-white"
                            : "text-green-600 hover:bg-green-600 hover:text-white"
                        }`}
                      >
                        {user.Status === "Active" ? (
                          <UserX size={16} />
                        ) : (
                          <UserCheck size={16} />
                        )}
                      </button>

                      {/* Delete - Red Tint */}
                      <button
                        title="Delete User"
                        className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Role Promotion Group - Separated for clarity */}
                    <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 gap-1">
                      {/* Promote - Light Blue */}
                      <button
                        title="Promote Role"
                        onClick={() => {
                          setSelectedUser(user);
                          setNewRole(user.Role);
                          setIsPromoteModalOpen(true);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-all"
                      >
                        <UserCog size={16} />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id || user.id}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden"
          >
            {/* Side Status Indicator */}
            <div
              className={`absolute top-0 left-0 w-1.5 h-full ${
                user.Status === "Active" ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-2xl bg-black text-yellow-500 flex items-center justify-center font-black text-lg shadow-inner">
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">
                    {user.name}
                  </h3>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                    {user.Role}
                  </span>
                </div>
              </div>
              <button className="p-1 text-gray-300 hover:text-gray-500">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="space-y-1.5 mb-5 px-1">
              <div className="flex items-center gap-2 text-[11px] text-gray-600">
                <Mail size={14} className="text-gray-400" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-600">
                <Phone size={14} className="text-gray-400" />
                {user.Phone || user.phone}
              </div>
            </div>

            {/* 2-Row Action Grid */}
            <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-4">
              {/* Row 1 */}
              <button className="flex flex-col items-center justify-center gap-1 py-2 hover:bg-blue-50 rounded-xl transition-colors group">
                <Edit3
                  size={18}
                  className="text-gray-400 group-hover:text-blue-500"
                />
                <span className="text-[9px] font-bold text-gray-500 uppercase">
                  Edit
                </span>
              </button>

              <button className="flex flex-col items-center justify-center gap-1 py-2 hover:bg-orange-50 rounded-xl transition-colors group">
                {user.Status === "Active" ? (
                  <UserX size={18} className="text-orange-400" />
                ) : (
                  <UserCheck size={18} className="text-green-400" />
                )}
                <span className="text-[9px] font-bold text-gray-500 uppercase">
                  Status
                </span>
              </button>

              <button className="flex flex-col items-center justify-center gap-1 py-2 hover:bg-red-50 rounded-xl transition-colors group">
                <Trash2 size={18} className="text-red-400" />
                <span className="text-[9px] font-bold text-gray-500 uppercase">
                  Delete
                </span>
              </button>

              {/* Row 2 - Promotion Buttons */}
              <button
                className="flex flex-col items-center justify-center gap-1 py-2 hover:bg-blue-50 rounded-xl transition-colors group border border-dashed border-gray-100"
                onClick={() => {
                  setSelectedUser(user);
                  setNewRole(user.Role);
                  setIsPromoteModalOpen(true);
                }}
              >
                <UserCog size={18} className="text-blue-400" />
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                  Promote
                </span>
              </button>

              {/* Placeholder for symmetry */}
              <div className="invisible"></div>
            </div>
          </div>
        ))}
      </div>
      {/* Promote Role Modal */}
      {isPromoteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Change User Role Of {selectedUser?.name}
            </h3>

            {/* Selection Options */}
            <div className="flex flex-col gap-3 mb-6">
              <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="User"
                  checked={newRole === "User"}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  User
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="Operational Manager"
                  checked={newRole === "Operational Manager"}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Operational Manager
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="Manager"
                  checked={newRole === "Manager"}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Manager
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsPromoteModalOpen(false)}
                className="flex-1 py-2 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateuserrole(selectedUser._id, { Role: newRole });
                  setIsPromoteModalOpen(false);
                }}
                className="flex-1 py-2 text-sm font-bold text-black bg-yellow-500 rounded-xl hover:bg-yellow-600 shadow-lg shadow-yellow-500/20"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
