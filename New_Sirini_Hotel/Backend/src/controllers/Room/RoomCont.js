const RoomModel = require("../../models/Rooms/RoomModel");

// ── 1. Create New Room ──
const createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, price, bedType, capacity, status, description } = req.body;

    // අත්‍යවශ්‍ය දත්ත තිබේදැයි පරීක්ෂාව
    if (!roomNumber || !roomType || !price || !bedType || !capacity) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const image = req.file ? req.file.path : null;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newRoom = new RoomModel({
      roomNumber,
      roomType,
      price,
      bedType,
      capacity,
      image,
      status: status || "available", // පෝරමයෙන් එන status එක සුරකියි (available/reserved/maintenance)
      description, // පෝරමයෙන් එන description එක සුරකියි
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: "Error creating room", error: error.message });
  }
};

// ── 2. Get All Rooms ──
const getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.find().sort({ createdAt: -1 });
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
};

// ── 3. Update Room ──
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const updates = req.body;

    // පින්තූරයක් ඇත්නම් එය update කරමු
    if (req.file) {
      updates.image = req.file.path;
    }

    const updatedRoom = await RoomModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { returnDocument: 'after' } // Mongoose warning එක ඉවත් කිරීමට සහ අලුත් දත්ත ලබා ගැනීමට
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: "Error updating room", error: error.message });
  }
};

// ── 4. Delete Room ──
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Room ID is required" });
    }
    await RoomModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error: error.message });
  }
};

// ── 5. Toggle Status (මෙය optional, නමුත් status 3ක් ඇති නිසා පෝරමයෙන් update කිරීම වඩාත් සුදුසුයි) ──
const toggleRoomAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    
    // මෙය සරල toggle එකක් ලෙස තවදුරටත් ක්‍රියා නොකරයි (status 3ක් ඇති නිසා)
    // අවශ්‍ය නම් "available" <-> "reserved" මාරු කිරීමට මෙය භාවිතා කළ හැක
    room.status = room.status === "available" ? "reserved" : "available";
    await room.save();
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error toggling status", error: error.message });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
  toggleRoomAvailability,
};