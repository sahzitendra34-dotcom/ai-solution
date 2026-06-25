const mongoose = require('mongoose');
const { isMongo, getLocalData, saveLocalData } = require('../config/db');

// ==========================================
// 1. Mongoose Schema Definitions
// ==========================================

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const InquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  companyName: { type: String },
  country: { type: String, required: true },
  jobTitle: { type: String },
  jobDetails: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String, required: true },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  image: { type: String, default: '' },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String, default: '' },
  capacity: { type: Number, default: 50 },
  createdAt: { type: Date, default: Date.now }
});

const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, default: 'Corporate' },
  date: { type: Date, default: Date.now }
});

// Create Mongoose Models
const MongooseAdmin = mongoose.model('Admin', AdminSchema);
const MongooseInquiry = mongoose.model('Inquiry', InquirySchema);
const MongooseTestimonial = mongoose.model('Testimonial', TestimonialSchema);
const MongooseBlog = mongoose.model('Blog', BlogSchema);
const MongooseEvent = mongoose.model('Event', EventSchema);
const MongooseGallery = mongoose.model('Gallery', GallerySchema);

// ==========================================
// 2. Repository Pattern / Unified Database Wrapper
// ==========================================

const makeRepo = (mongooseModel, dbKey) => {
  return {
    find: async (filter = {}) => {
      if (isMongo()) {
        return await mongooseModel.find(filter).sort({ createdAt: -1 });
      } else {
        const list = getLocalData()[dbKey] || [];
        // Support simple filtering
        const filtered = list.filter(item => {
          for (let key in filter) {
            if (item[key] !== filter[key]) return false;
          }
          return true;
        });
        // Sort by date / createdAt desc by default
        return filtered.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
      }
    },
    findOne: async (filter = {}) => {
      if (isMongo()) {
        return await mongooseModel.findOne(filter);
      } else {
        const list = getLocalData()[dbKey] || [];
        return list.find(item => {
          for (let key in filter) {
            if (item[key] !== filter[key]) return false;
          }
          return true;
        }) || null;
      }
    },
    findById: async (id) => {
      if (isMongo()) {
        return await mongooseModel.findById(id);
      } else {
        const list = getLocalData()[dbKey] || [];
        return list.find(item => item._id === id || item.id === id) || null;
      }
    },
    create: async (data) => {
      if (isMongo()) {
        return await mongooseModel.create(data);
      } else {
        const dbData = getLocalData();
        const newRecord = {
          _id: new mongoose.Types.ObjectId().toString(),
          createdAt: new Date().toISOString(),
          ...data
        };
        dbData[dbKey].push(newRecord);
        saveLocalData(dbData);
        return newRecord;
      }
    },
    findByIdAndDelete: async (id) => {
      if (isMongo()) {
        return await mongooseModel.findByIdAndDelete(id);
      } else {
        const dbData = getLocalData();
        const list = dbData[dbKey] || [];
        const index = list.findIndex(item => item._id === id || item.id === id);
        if (index > -1) {
          const removed = list.splice(index, 1);
          saveLocalData(dbData);
          return removed[0];
        }
        return null;
      }
    },
    // Used for approving testimonials or updating models
    findByIdAndUpdate: async (id, updateData) => {
      if (isMongo()) {
        return await mongooseModel.findByIdAndUpdate(id, updateData, { new: true });
      } else {
        const dbData = getLocalData();
        const list = dbData[dbKey] || [];
        const record = list.find(item => item._id === id || item.id === id);
        if (record) {
          Object.assign(record, updateData);
          saveLocalData(dbData);
          return record;
        }
        return null;
      }
    },
    countDocuments: async (filter = {}) => {
      if (isMongo()) {
        return await mongooseModel.countDocuments(filter);
      } else {
        const list = getLocalData()[dbKey] || [];
        return list.filter(item => {
          for (let key in filter) {
            if (item[key] !== filter[key]) return false;
          }
          return true;
        }).length;
      }
    }
  };
};

module.exports = {
  Admin: makeRepo(MongooseAdmin, 'admins'),
  Inquiry: makeRepo(MongooseInquiry, 'inquiries'),
  Testimonial: makeRepo(MongooseTestimonial, 'testimonials'),
  Blog: makeRepo(MongooseBlog, 'blogs'),
  Event: makeRepo(MongooseEvent, 'events'),
  Gallery: makeRepo(MongooseGallery, 'gallery'),
  // Direct access to mongoose models if needed
  MongooseAdmin,
  MongooseInquiry,
  MongooseTestimonial,
  MongooseBlog,
  MongooseEvent,
  MongooseGallery
};
