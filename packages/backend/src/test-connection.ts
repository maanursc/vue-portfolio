import dotenv from "dotenv";
import connectDB from "./config/database.js";
import Project from "./models/Project.js";

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log("🧪 Testing MongoDB connection...");

    // Connect to database
    await connectDB();
    console.log("✅ Database connection successful!");

    // Test creating a simple project
    const testProject = new Project({
      title: "Test Project",
      description: "A test project to verify MongoDB connection",
      fullDescription:
        "This is a test project created to verify that the MongoDB connection and CRUD operations are working correctly.",
      technologies: ["Node.js", "MongoDB", "TypeScript"],
      github: "https://github.com/test/test-project",
      category: "Backend",
      year: 2025,
    });

    await testProject.save();
    console.log("✅ Test project created successfully!");
    console.log("📝 Project ID:", testProject._id);

    // Count total projects
    const projectCount = await Project.countDocuments();
    console.log("📊 Total projects in database:", projectCount);

    // Clean up test project
    await Project.findByIdAndDelete(testProject._id);
    console.log("🧹 Test project cleaned up");

    console.log("\n🎉 MongoDB CRUD setup is working perfectly!");
    console.log(
      "🚀 You can now start your backend server with: npm run dev:backend"
    );

    process.exit(0);
  } catch (error: any) {
    console.error("❌ MongoDB connection test failed!");

    if (
      error.code === "ECONNREFUSED" ||
      error.message?.includes("ECONNREFUSED")
    ) {
      console.error("\n🔍 **MongoDB Connection Error**");
      console.error("MongoDB is not running on your local machine.\n");

      console.error("📥 **To install MongoDB:**");
      console.error(
        "1. Download from: https://www.mongodb.com/try/download/community"
      );
      console.error(
        "2. Choose Windows platform and download the .msi installer"
      );
      console.error(
        "3. Run installer and check 'Install MongoDB as a Service'"
      );
      console.error("4. MongoDB should start automatically\n");

      console.error("🚀 **To start MongoDB manually:**");
      console.error("   net start MongoDB\n");

      console.error("📋 **Check installation guide:**");
      console.error("   See: MONGODB_INSTALLATION.md\n");

      console.error("🧪 **Test again after installation:**");
      console.error("   npm run test-db");
    } else {
      console.error("Error details:", error);
    }

    process.exit(1);
  }
};

// Run the test
testConnection();
