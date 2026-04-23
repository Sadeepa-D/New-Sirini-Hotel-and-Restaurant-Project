import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User, Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";

function RoomConfirmedBooking({ refreshKey, onActionCompleted }) {
  const [combinedList, setCombinedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllBookings = useCallback(async () => {
    try {
      // ✅ API දෙකම එකවර කැඳවන්න, නමුත් එකක් fail වුවහොත් අනෙක පෙන්වීමට හැකි වන සේ සකසමු
      const responses = await Promise.allSettled([
        axios.get("http://localhost:5000/api/rooms/viewconfirmedbookings"),
        axios.get("http://localhost:5000/api/rooms/viewcancelledbookings"),
      ]);

      // සාර්ථක වූ දත්ත පමණක් ලබා ගැනීම
      const confirmedData =
        responses[0].status === "fulfilled" ? responses[0].value.data : [];
      const cancelledData =
        responses[1].status === "fulfilled" ? responses[1].value.data : [];

      // Array දෙක එකතු කර updatedAt අනුව sort කිරීම
      const combined = [...confirmedData, ...cancelledData].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      );

      setCombinedList(combined);
    } catch (err) {
      console.error("General Fetch Error:", err);
      setCombinedList([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings, refreshKey]);

  const handleRejectBack = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    const actionToast = toast.loading("Updating status...");
    try {
      // ✅ මෙන්න මෙතැන නිවැරදි කළා: 'cancelbooking' route එක භාවිතා කරන්න
      await axios.put(`http://localhost:5000/api/rooms/cancelbooking/${id}`);

      toast.success("Booking status changed to Cancelled", { id: actionToast });

      fetchAllBookings(); // වගුව refresh කරන්න
      if (onActionCompleted) onActionCompleted(); // Dashboard stats refresh කරන්න
    } catch (err) {
      toast.error("Failed to cancel booking", { id: actionToast });
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-400 font-medium italic">
        Loading records...
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-in fade-in duration-500 mt-8">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Customer Details
              </th>
              <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Room No
              </th>
              <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Check-In / Out
              </th>
              <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                Status
              </th>
              <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {combinedList.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-16 text-gray-400 font-medium italic"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              combinedList.map((req) => (
                <tr
                  key={req._id}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition ${req.status === "Cancelled" ? "bg-red-50/30 opacity-80" : ""}`}
                >
                  {/* Customer Info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${req.status === "Cancelled" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                      >
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{req.name}</p>
                        <p className="text-gray-500 text-[11px] font-mono">
                          {req.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Room No */}
                  <td className="px-5 py-4 font-mono font-bold text-gray-700 italic">
                    #{req.roomNumber}
                  </td>

                  {/* Dates */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col text-[11px] font-medium text-gray-600">
                      <span>
                        In: {new Date(req.checkInDate).toLocaleDateString()}
                      </span>
                      <span>
                        Out: {new Date(req.checkOutDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-4 text-center">
                    {req.status === "Cancelled" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-600 border border-red-200">
                        <XCircle size={12} /> Cancelled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-600 border border-green-100">
                        <CheckCircle2 size={12} /> Approved
                      </span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {req.status !== "Cancelled" ? (
                        <button
                          onClick={() => handleRejectBack(req._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Reject and Cancel"
                        >
                          <XCircle size={16} strokeWidth={2.5} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-bold uppercase italic tracking-tighter">
                          History Only
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RoomConfirmedBooking;
