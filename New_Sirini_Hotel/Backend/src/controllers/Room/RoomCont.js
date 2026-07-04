const RoomModel = require("../../models/Rooms/RoomModel");
const cloudinary = require("cloudinary");

const createRoom = async (req, res) => {
  try {
    let {
      roomNumber,
      roomType,
      price,
      nightPackagePrice,
      shortStayPrice,
      dayPackagePrice,
      bedType,
      capacity,
      status,
      description,
      condition,
      facilities,
    } = req.body;

    const finalNightPrice = nightPackagePrice || price;
    const finalDayPrice = dayPackagePrice || shortStayPrice;

    // Parse facilities if it's a JSON string
    if (typeof facilities === "string") {
      try {
        facilities = JSON.parse(facilities);
      } catch (e) {
        facilities = [];
      }
    }

    if (!roomNumber || !roomType || !finalNightPrice || !bedType || !capacity) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const image = req.files?.image?.[0]?.secure_url || null;
    const imagePublicId = req.files?.image?.[0]?.public_id || null;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Get gallery images if provided
    const galleryImages =
      req.files?.galleryImages?.map((file) => file.secure_url) || [];
    const galleryImagePublicIds =
      req.files?.galleryImages?.map((file) => file.public_id) || [];

    const newRoom = new RoomModel({
      roomNumber,
      roomType,
      nightPackagePrice: finalNightPrice,
      dayPackagePrice: finalDayPrice || 1500,
      bedType,
      capacity,
      image,
      galleryImages,
      status: status || "available",
      description,
      condition: condition || "Fan",
      imagePublicId,
      galleryImagePublicIds,
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

    if (updates.price) {
      updates.nightPackagePrice = updates.price;
      delete updates.price;
    }
    if (updates.shortStayPrice) {
      updates.dayPackagePrice = updates.shortStayPrice;
      delete updates.shortStayPrice;
    }

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

    // Handle main image update
    if (req.files?.image?.[0]) {
      if (existingRoom.imagePublicId) {
        await cloudinary.v2.uploader.destroy(existingRoom.imagePublicId);
      }
      updates.image = req.files.image[0].secure_url;
      updates.imagePublicId = req.files.image[0].public_id;
    }

    // Handle gallery images update with selective deletion
    if (req.body.keptGalleryImages || req.files?.galleryImages?.[0]) {
      let keptImages = [];
      let keptPublicIds = [];

      // Parse kept gallery images from request body
      if (req.body.keptGalleryImages) {
        try {
          keptImages = JSON.parse(req.body.keptGalleryImages);
        } catch (e) {
          keptImages = [];
        }
      }

      // Find public IDs of images to keep
      if (keptImages.length > 0 && existingRoom.galleryImages) {
        keptPublicIds = existingRoom.galleryImages
          .map((img, idx) => {
            if (keptImages.includes(img)) {
              return existingRoom.galleryImagePublicIds?.[idx];
            }
            return null;
          })
          .filter((id) => id !== null);
      }

      // Delete images that are not being kept
      if (
        existingRoom.galleryImagePublicIds &&
        existingRoom.galleryImagePublicIds.length > 0
      ) {
        for (let i = 0; i < existingRoom.galleryImagePublicIds.length; i++) {
          const publicId = existingRoom.galleryImagePublicIds[i];
          if (!keptPublicIds.includes(publicId)) {
            await cloudinary.v2.uploader.destroy(publicId);
          }
        }
      }

      // Add new gallery images if provided
      if (req.files?.galleryImages?.[0]) {
        const newImages = req.files.galleryImages.map(
          (file) => file.secure_url,
        );
        const newPublicIds = req.files.galleryImages.map(
          (file) => file.public_id,
        );

        updates.galleryImages = keptImages.concat(newImages);
        updates.galleryImagePublicIds = keptPublicIds.concat(newPublicIds);
      } else {
        // Only kept images, no new uploads
        updates.galleryImages = keptImages;
        updates.galleryImagePublicIds = keptPublicIds;
      }
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

    // Delete main image from Cloudinary
    if (room.imagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(room.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }

    // Delete gallery images from Cloudinary
    if (room.galleryImagePublicIds && room.galleryImagePublicIds.length > 0) {
      for (const publicId of room.galleryImagePublicIds) {
        try {
          await cloudinary.v2.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          console.error(
            "Error deleting gallery image from Cloudinary:",
            cloudinaryError,
          );
        }
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
