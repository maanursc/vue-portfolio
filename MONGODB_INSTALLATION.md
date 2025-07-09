# 🗄️ MongoDB Installation Guide for Windows

## 📥 **Installing MongoDB on Windows**

### **Option 1: Download from MongoDB Website (Recommended)**

1. **Go to MongoDB Download Center**

   - Visit: https://www.mongodb.com/try/download/community
   - Select: **Windows** as your platform
   - Choose: **MongoDB Community Server** (latest version)
   - Download the `.msi` installer

2. **Run the Installer**

   - Double-click the downloaded `.msi` file
   - Choose **Complete** installation
   - ✅ **Check "Install MongoDB as a Service"** (important!)
   - ✅ **Check "Run service as Network Service user"**
   - ✅ **Install MongoDB Compass** (GUI tool - optional but recommended)

3. **Verify Installation**
   ```cmd
   # Open Command Prompt as Administrator
   mongod --version
   mongo --version
   ```

### **Option 2: Using Chocolatey (Package Manager)**

If you have Chocolatey installed:

```cmd
# Open Command Prompt as Administrator
choco install mongodb
```

### **Option 3: Using winget (Windows Package Manager)**

```cmd
# Open Command Prompt as Administrator
winget install MongoDB.Server
```

## 🚀 **Starting MongoDB**

### **If Installed as Service (Recommended)**

MongoDB should start automatically. Check if it's running:

```cmd
# Check service status
sc query MongoDB

# Start MongoDB service (if not running)
net start MongoDB

# Stop MongoDB service (if needed)
net stop MongoDB
```

### **Manual Start (Alternative)**

If not installed as service:

```cmd
# Create data directory
mkdir C:\data\db

# Start MongoDB manually
mongod --dbpath C:\data\db
```

## 🧪 **Test Your Installation**

### **Method 1: Using MongoDB Shell**

```cmd
# Connect to MongoDB
mongosh

# Or if using older version
mongo
```

You should see:

```
Current Mongosh Log ID: xxxxxxxxxxxxx
Connecting to: mongodb://127.0.0.1:27017/?directConnection=true
Using MongoDB: x.x.x
Using Mongosh: x.x.x
```

### **Method 2: Test with Our Project**

```cmd
cd c:\Users\Emmanuel\Projects\vue-portfolio\packages\backend
npm run test-db
```

## 🔧 **Default Configuration**

- **Host**: `localhost` or `127.0.0.1`
- **Port**: `27017`
- **Connection URL**: `mongodb://localhost:27017`
- **Data Directory**: `C:\Program Files\MongoDB\Server\x.x\data\`
- **Log Directory**: `C:\Program Files\MongoDB\Server\x.x\log\`

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Port 27017 already in use**

   ```cmd
   # Check what's using port 27017
   netstat -ano | findstr :27017

   # Kill process if needed (replace PID)
   taskkill /PID [PID] /F
   ```

2. **Service won't start**

   ```cmd
   # Check MongoDB service logs
   # Look in: C:\Program Files\MongoDB\Server\x.x\log\mongod.log
   ```

3. **Permission issues**
   - Run Command Prompt as Administrator
   - Make sure MongoDB service has proper permissions

### **Alternative: MongoDB Atlas (Cloud)**

If local installation doesn't work, you can use MongoDB Atlas (free tier):

1. Go to: https://www.mongodb.com/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vue-portfolio
   ```

## 📱 **MongoDB Compass (GUI Tool)**

MongoDB Compass provides a visual interface:

- **Connection**: `mongodb://localhost:27017`
- **Database**: `vue-portfolio`
- **Collections**: `projects`, `contacts`

## ✅ **Next Steps After Installation**

1. **Verify MongoDB is running:**

   ```cmd
   mongosh
   ```

2. **Test our project connection:**

   ```cmd
   cd c:\Users\Emmanuel\Projects\vue-portfolio\packages\backend
   npm run test-db
   ```

3. **Seed sample data:**

   ```cmd
   npm run seed
   ```

4. **Start development:**
   ```cmd
   npm run dev
   ```

---

**Choose the installation method that works best for you and let me know when MongoDB is installed and running! 🚀**
