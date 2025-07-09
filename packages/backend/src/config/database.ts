import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/vue-portfolio";

    console.log(`🔌 Attempting to connect to MongoDB...`);
    console.log(
      `📍 Connection URI: ${mongoURI.replace(/\/\/.*@/, "//*****@")}`
    );

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error: any) {
    console.error("❌ MongoDB connection failed!");

    if (error.code === "ECONNREFUSED") {
      console.error("\n🚨 MongoDB is not running on your local machine!");
      console.error("📋 To fix this:");
      console.error("   1. Install MongoDB Community Server");
      console.error("   2. Start MongoDB service: net start MongoDB");
      console.error("   3. Or start manually: mongod --dbpath C:\\data\\db");
      console.error("   4. See MONGODB_SETUP.md for detailed instructions");
    } else {
      console.error("🔍 Error details:", error.message);
    }

    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("🔒 MongoDB connection closed through app termination");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during MongoDB disconnection:", error);
    process.exit(1);
  }
});

export default connectDB;
