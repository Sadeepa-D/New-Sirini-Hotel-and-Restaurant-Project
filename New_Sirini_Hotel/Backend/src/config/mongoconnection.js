const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Automatically migrate old field names for room prices if they exist
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections({ name: 'rooms' }).toArray();
      if (collections.length > 0) {
        const hasOldFields = await db.collection('rooms').findOne({
          $or: [
            { price: { $exists: true } },
            { shortStayPrice: { $exists: true } }
          ]
        });
        if (hasOldFields) {
          console.log("Migrating rooms collection fields (price -> nightPackagePrice, shortStayPrice -> dayPackagePrice)...");
          await db.collection('rooms').updateMany({}, {
            $rename: {
              price: "nightPackagePrice",
              shortStayPrice: "dayPackagePrice"
            }
          });
          console.log("Database migration complete.");
        }
      }
    } catch (migError) {
      console.error("Database migration error:", migError);
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
