const ReceptionAppointment = require("../../models/Reception/ReciptionAppointModel");

const createReceptionAppointment = async (req, res) => {
  try {
    const userId = req.userData.id;
    const { name, email, phone, date, noOfGuests, eventType } = req.body;
    if (!name || !email || !phone || !date || !noOfGuests || !eventType) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newAppointment = new ReceptionAppointment({
      userId,
      name,
      email,
      phone,
      date,
      noOfGuests,
      eventType,
      status: "Pending",
    });
    await newAppointment.save();
    res
      .status(201)
      .json({ message: "Reception appointment created successfully" });
  } catch (error) {
    console.error("Error creating reception appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getReceptionAppointments = async (req, res) => {
  try {
    const appointments = await ReceptionAppointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching reception appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteReceptionAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }
    const deletedAppointment = await ReceptionAppointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting reception appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateReceptionAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (!id) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }
    const updatedAppointment = await ReceptionAppointment.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating reception appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateReceptionAppointmentasCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }
    const updatedAppointment = await ReceptionAppointment.findByIdAndUpdate(
      id,
      { status: "Completed" },
      { new: true },
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({
      message: "Appointment status updated to Completed",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating reception appointment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateReceptionAppointmentasCancelled = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }
    const updatedAppointment = await ReceptionAppointment.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
      { new: true },
    );
    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({
      message: "Appointment status updated to Cancelled",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating reception appointment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getPendingReceptionAppointments = async (req, res) => {
  try {
    const pendingAppointments = await ReceptionAppointment.find({
      status: "Pending",
    });
    if (pendingAppointments.length === 0) {
      return res.status(404).json({ message: "No pending appointments found" });
    }
    res.status(200).json(pendingAppointments);
  } catch (error) {
    console.error("Error fetching pending reception appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getCompletedReceptionAppointments = async (req, res) => {
  try {
    const completedAppointments = await ReceptionAppointment.find({
      status: "Completed",
    });
    if (completedAppointments.length === 0) {
      return res
        .status(404)
        .json({ message: "No completed appointments found" });
    }
    res.status(200).json(completedAppointments);
  } catch (error) {
    console.error("Error fetching completed reception appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getCancelledReceptionAppointments = async (req, res) => {
  try {
    const cancelledAppointments = await ReceptionAppointment.find({
      status: "Cancelled",
    });
    if (cancelledAppointments.length === 0) {
      return res
        .status(404)
        .json({ message: "No cancelled appointments found" });
    }
    res.status(200).json(cancelledAppointments);
  } catch (error) {
    console.error("Error fetching cancelled reception appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getOverdueReceptionAppointments = async (req, res) => {
  try {
    const OverdueAppointments = await ReceptionAppointment.find({
      status: "Overdue",
    });
    if (OverdueAppointments.length === 0) {
      return res.status(404).json({ message: "No overdue appointments found" });
    }
    res.status(200).json(OverdueAppointments);
  } catch (error) {
    console.error("Error fetching overdue reception appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getSpecificUserReceptionAppointments = async (req, res) => {
  try {
    // 1. Get the logged-in user's ID from your auth middleware
    const userId = req.userData.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    // 2. Find only the appointments that belong to this specific userId
    const userAppointments = await ReceptionAppointment.find({
      userId: userId,
    });

    // 3. Send the filtered appointments back to the frontend
    res.status(200).json(userAppointments);
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createReceptionAppointment,
  getReceptionAppointments,
  deleteReceptionAppointment,
  updateReceptionAppointment,
  updateReceptionAppointmentasCompleted,
  updateReceptionAppointmentasCancelled,
  getPendingReceptionAppointments,
  getCompletedReceptionAppointments,
  getCancelledReceptionAppointments,
  getOverdueReceptionAppointments,
  getSpecificUserReceptionAppointments,
};
