const RoomModel = require("../../models/Rooms/RoomModel");
const cloudinary = require("cloudinary");

const createRoom = async (req, res) => {
  try {
    let {
      roomNumber,
      roomType,
      price,
      shortStayPrice,
      bedType,
      capacity,
      status,
      description,
      condition,
      facilities,
    } = req.body;

    // Parse facilities if it's a JSON string
    if (typeof facilities === "string") {
      try {
        facilities = JSON.parse(facilities);
      } catch (e) {
        facilities = [];
      }
    }

    if (!roomNumber || !roomType || !price || !bedType || !capacity) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const image = req.file ? req.file.url : null;
    const imagePublicId = req.file ? req.file.public_id : null;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newRoom = new RoomModel({
      roomNumber,
      roomType,
      price,
      shortStayPrice: shortStayPrice || 1500,
      bedType,
      capacity,
      image,
      status: status || "available",
      description,
      condition: condition || "Fan",
      imagePublicId,
      facilities: facilities || [],
      availability: true,
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating room", error: error.message });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.find().sort({ createdAt: -1 });
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }
    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching rooms", error: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    let updates = req.body;

    
    if (updates.facilities && typeof updates.facilities === "string") {
      try {
        updates.facilities = JSON.parse(updates.facilities);
      } catch (e) {
        updates.facilities = [];
      }
    }

    const existingRoom = await RoomModel.findById(id);
    if (!existingRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (req.file) {
      if (existingRoom.imagePublicId) {
        await cloudinary.v2.uploader.destroy(existingRoom.imagePublicId);
      }
      updates.image = req.file.secure_url;
      updates.imagePublicId = req.file.public_id;
    }

    const updatedRoom = await RoomModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { returnDocument: "after" },
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(updatedRoom);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating room", error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Room ID is required" });
    }
    const room = await RoomModel.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (room.imagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(room.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }
    await RoomModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting room", error: error.message });
  }
};

const toggleRoomAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.status = room.status === "available" ? "reserved" : "available";
    await room.save();
    res.status(200).json(room);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error toggling status", error: error.message });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
  toggleRoomAvailability,
};
