import React from 'react';
import { Clock, XCircle } from 'lucide-react';
import { StatusBadge } from './SharedUI'; 

const RestaurantSection = ({ data }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Restaurant Orders</h2>
    {data.map((order) => (
      <div
        key={order.id}
        className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-colors bg-gray-50/30 gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 text-base">
              {order.items}
            </h3>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Clock size={14} /> {order.date}
          </p>
          <p className="text-sm text-gray-500 mt-1">Order ID: {order.id}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-900 text-lg">{order.total}</span>
          {order.status === "Preparing" && (
            <button className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors text-sm">
              <XCircle size={16} /> Cancel
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default RestaurantSection;