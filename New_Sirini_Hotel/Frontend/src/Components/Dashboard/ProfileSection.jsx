import React from "react";
import { Camera, Lock } from "lucide-react";
import { InputField } from "./SharedUI";

const ProfileSection = () => {
    return(
  <div className="space-y-10 animate-in fade-in duration-300">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div className="relative group cursor-pointer">
        <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
          <span className="text-3xl font-bold text-indigo-700">JD</span>
          {/* Replace span with img tag when backend is connected */}
        </div>
        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="text-white" size={24} />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
        <p className="text-gray-500">
          Update your photo and personal details here.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField label="First Name" defaultValue="John" />
      <InputField label="Last Name" defaultValue="Doe" />
      <InputField
        label="Email Address"
        type="email"
        defaultValue="john.doe@example.com"
      />
      <InputField
        label="Phone Number"
        type="tel"
        defaultValue="+1 234 567 890"
      />
    </div>

    <div className="pt-6 border-t border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Lock size={20} className="text-gray-400" /> Change Password
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Current Password"
          type="password"
          placeholder="••••••••"
        />
        <InputField
          label="New Password"
          type="password"
          placeholder="••••••••"
        />
      </div>
    </div>

    <div className="flex justify-end pt-4">
      <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors">
        Save Changes
      </button>
    </div>
  </div>
);
}
export default ProfileSection;
