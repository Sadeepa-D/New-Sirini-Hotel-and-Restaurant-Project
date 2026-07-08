const receptionandHallBook = require("../../models/Reception/ReceptionHallBookings");
const { sendReceptionhallBookingEmail } = require("../EmailCont");

const genarateBookingCode = async () => {
  const prefix = "RHB";
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const existing = await receptionandHallBook.findOne({
    refnumber: `${prefix}${randomNum}`,
  });
  if (!existing) {
    return `${prefix}${randomNum}`;
  }
  return genarateBookingCode();
};

const getPaymentDetails = (body, file) => {
  const paymentMethod = body.paymentMethod || "Cash";
  const amountPayed =
    body.amountPayed === undefined || body.amountPayed === null || body.amountPayed === ""
      ? 0
      : Number(body.amountPayed);

  return {
    paymentMethod,
    amountPayed,
    paymentProofUrl:
      paymentMethod === "Online Transfer" && file
        ? file.secure_url || file.path
        : body.paymentProofUrl || "",
    paymentProofPublicId:
      paymentMethod === "Online Transfer" && file
        ? file.public_id || file.filename
        : body.paymentProofPublicId || "",
  };
};

const createReceptionHallBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      eventTime,
      eventType,
      numberOfGuests,
      specialRequests,
      status,
      selectedPackage,
      amountPayed,
    } = req.body;
    const { paymentMethod, amountPayed: normalizedAmount, paymentProofUrl, paymentProofPublicId } = getPaymentDetails(req.body, req.file);

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !eventDate ||
      !eventTime ||
      !eventType ||
      !numberOfGuests ||
      !status ||
      !selectedPackage ||
      (paymentMethod === "Cash" && (!normalizedAmount || Number(normalizedAmount) <= 0))
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    if (paymentMethod === "Online Transfer" && !paymentProofUrl) {
      return res.status(400).json({ message: "Payment proof image is required for online transfer payments" });
    }

    const phoneRegex = /^(?:\+94|0)?(7[0-8]\d{7}|[1-9]\d{8})$/;
    if (!phoneRegex.test(customerPhone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const guests = Number(numberOfGuests);
    if (isNaN(guests) || guests <= 0 || guests > 250) {
      return res.status(400).json({
        message:
          "Invalid number of guests. Please enter a value between 1 and 250.",
      });
    }
    const existingBooking = await receptionandHallBook.findOne({
      eventDate: eventDate,
      eventTime: eventTime,
      status: "Confirmed",
    });
    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Selected date and time slot is already booked" });
    }
    const newBooking = new receptionandHallBook({
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      eventTime,
      eventType,
      numberOfGuests,
      specialRequests,
      status: status || "Confirmed",
      selectedPackage,
      amountPayed: normalizedAmount,
      paymentMethod,
      paymentProofUrl,
      paymentProofPublicId,
      refnumber: await genarateBookingCode(),
    });
    await newBooking.save();
    await sendReceptionhallBookingEmail({
      newBooking,
    });
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getReceptionHallBookings = async (req, res) => {
  try {
    const bookings = await receptionandHallBook.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteReceptionHallBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await receptionandHallBook.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editReceptionHallBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      eventTime,
      eventType,
      numberOfGuests,
      specialRequests,
      status,
      selectedPackage,
      amountPayed,
    } = req.body;
    const { paymentMethod, amountPayed: normalizedAmount, paymentProofUrl, paymentProofPublicId } = getPaymentDetails(req.body, req.file);

    if (paymentMethod === "Online Transfer" && !paymentProofUrl) {
      return res.status(400).json({ message: "Payment proof image is required for online transfer payments" });
    }

    const phoneRegex = /^(?:\+94|0)?(7[0-8]\d{7}|[1-9]\d{8})$/;
    if (!phoneRegex.test(customerPhone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const guests = Number(numberOfGuests);
    if (isNaN(guests) || guests <= 0 || guests > 250) {
      return res.status(400).json({
        message:
          "Invalid number of guests. Please enter a value between 1 and 250.",
      });
    }
    const updatedBooking = await receptionandHallBook.findByIdAndUpdate(
      id,
      {
        customerName,
        customerEmail,
        customerPhone,
        eventDate,
        eventTime,
        eventType,
        numberOfGuests,
        specialRequests,
        status,
        selectedPackage,
        amountPayed: normalizedAmount,
        paymentMethod,
        paymentProofUrl,
        paymentProofPublicId,
      },
      { new: true },
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    if (!id || !status) {
      return res
        .status(400)
        .json({ message: "Booking ID and status are required" });
    }
    if (!["Confirmed", "Booked", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const updatedBooking = await receptionandHallBook.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const GetBookingDates = async (req, res) => {
  try {
    const bookings = await receptionandHallBook.find(
      { status: { $in: ["Confirmed", "Booked"] } },
      "eventDate eventTime",
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createReceptionHallBooking,
  GetBookingDates,
  getReceptionHallBookings,
  deleteReceptionHallBooking,
  editReceptionHallBooking,
  updateBookingStatus,
};
