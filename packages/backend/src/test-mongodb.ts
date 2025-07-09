import mongoose from "mongoose";

const testMongoDB = async () => {
  try {
    console.log("🔌 Testing MongoDB connection...");

    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/vue-portfolio";
    console.log(`📍 Connecting to: ${mongoURI}`);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB connection successful!");
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    console.log(`📡 Port: ${mongoose.connection.port}`);

    // Test if we can query the database
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      console.log(`📚 Collections found: ${collections.length}`);
      collections.forEach((col) => console.log(`  - ${col.name}`));
    }
  } catch (error: any) {
    console.error("❌ MongoDB connection failed!");

    if (error.code === "ECONNREFUSED") {
      console.error("\n🚨 MongoDB is not running!");
      console.error("💡 To start MongoDB:");
      console.error("   Windows: net start MongoDB");
      console.error("   Or manually: mongod");
    } else {
      console.error("🔍 Error details:", error.message);
    }
  } finally {
    await mongoose.disconnect();
    console.log("\n🔒 Connection test completed.");
    process.exit(0);
  }
};

testMongoDB();
