const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;
const originalLocalDbPath = path.join(__dirname, 'local_db.json');
const localDbPath = process.env.VERCEL 
  ? '/tmp/local_db.json' 
  : originalLocalDbPath;

// Initialize local JSON DB file if it doesn't exist
if (!fs.existsSync(localDbPath)) {
  if (process.env.VERCEL && fs.existsSync(originalLocalDbPath)) {
    try {
      fs.copyFileSync(originalLocalDbPath, localDbPath);
    } catch (err) {
      console.error('Failed to copy seed database to /tmp:', err);
    }
  } else {
    fs.writeFileSync(localDbPath, JSON.stringify({
      admins: [],
      inquiries: [],
      testimonials: [],
      blogs: [],
      events: [],
      gallery: []
    }, null, 2));
  }
}

function getLocalData() {
  try {
    const raw = fs.readFileSync(localDbPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { admins: [], inquiries: [], testimonials: [], blogs: [], events: [], gallery: [] };
  }
}

function saveLocalData(data) {
  fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2));
}

const connectDB = async () => {
  if (process.env.USE_LOCAL_FALLBACK_DB === 'true') {
    console.log('⚠️ USE_LOCAL_FALLBACK_DB is set to true. Bypassing MongoDB connection and using local JSON database.');
    isMongoConnected = false;
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    // Attempting MongoDB connection
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-solutions', {
      serverSelectionTimeoutMS: 2000 // Fast fail if Mongo daemon is not running
    });
    console.log('🔌 Connected to MongoDB successfully.');
    isMongoConnected = true;
    return true;
  } catch (error) {
    console.log(`❌ MongoDB Connection Failed: ${error.message}`);
    console.log('⚠️ Utilizing local JSON database fallback (server/config/local_db.json). Ready to operate!');
    isMongoConnected = false;
    return false;
  }
};

const isMongo = () => isMongoConnected;

module.exports = {
  connectDB,
  isMongo,
  getLocalData,
  saveLocalData
};
