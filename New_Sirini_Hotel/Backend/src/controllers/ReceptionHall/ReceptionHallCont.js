const ReceptionAppointment = require("../../models/Reception/ReciptionAppointModel");

const createReceptionAppointment = async (req, res) => {
  try {
    const { name, email, phone, date } = req.body;
    if (!name || !email || !phone || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newAppointment = new ReceptionAppointment({
      name,
      email,
      phone,
      date,
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
    const { name, email, phone, date } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }
    if (!name || !email || !phone || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updatedAppointment = await ReceptionAppointment.findByIdAndUpdate(
      id,
      { name, email, phone, date },
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

module.exports = {
  createReceptionAppointment,
  getReceptionAppointments,
  deleteReceptionAppointment,
  updateReceptionAppointment,
};
