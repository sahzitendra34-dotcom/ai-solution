const express = require('express');
const router = express.Router();
const { Testimonial, Blog, Event, Gallery, Inquiry } = require('../models/db_models');
const auth = require('../middleware/auth');

// ==========================================
// Testimonials Routes
// ==========================================

// @route   GET api/content/testimonials
// @desc    Get all approved testimonials
// @access  Public
router.get('/testimonials', async (req, res) => {
  try {
    const list = await Testimonial.find({ approved: true });
    res.json(list);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/content/testimonials
// @desc    Submit a testimonial (auto-approved for immediate demo display)
// @access  Public
router.post('/testimonials', async (req, res) => {
  try {
    const { name, company, rating, feedback } = req.body;
    if (!name || !rating || !feedback) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    const newTestimonial = await Testimonial.create({
      name,
      company,
      rating: Number(rating),
      feedback,
      approved: true // Set to true to show instantly in the web dashboard
    });

    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ==========================================
// Admin Content Management
// ==========================================

// @route   GET api/content/admin/testimonials
// @desc    Get all testimonials for admin management
// @access  Private
router.get('/admin/testimonials', auth, async (req, res) => {
  try {
    const list = await Testimonial.find();
    res.json(list);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/content/testimonials/:id
// @desc    Update a testimonial
// @access  Private
router.put('/testimonials/:id', auth, async (req, res) => {
  try {
    const { name, company, rating, feedback, approved } = req.body;
    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        name,
        company,
        rating: Number(rating),
        feedback,
        approved: approved === true
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ msg: 'Testimonial not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/content/testimonials/:id
// @desc    Delete a testimonial
// @access  Private
router.delete('/testimonials/:id', auth, async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Testimonial not found' });
    }
    res.json({ success: true, msg: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ==========================================
// Blogs Routes
// ==========================================

// @route   GET api/content/blogs
// @desc    Get all blogs
// @access  Public
router.get('/blogs', async (req, res) => {
  try {
    const list = await Blog.find();
    res.json(list);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/content/admin/blogs
// @desc    Get all blogs for admin management
// @access  Private
router.get('/admin/blogs', auth, async (req, res) => {
  try {
    const list = await Blog.find();
    res.json(list);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/content/blogs
// @desc    Create a new blog post
// @access  Private
router.post('/blogs', auth, async (req, res) => {
  try {
    const { title, summary, content, author, image, tags } = req.body;
    if (!title || !summary || !content) {
      return res.status(400).json({ msg: 'Title, summary and content are required' });
    }
    const newBlog = await Blog.create({
      title,
      summary,
      content,
      author: author || 'Admin',
      image,
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((tag) => tag.trim()).filter(Boolean)
    });
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/content/blogs/:id
// @desc    Update a blog post
// @access  Private
router.put('/blogs/:id', auth, async (req, res) => {
  try {
    const { title, summary, content, author, image, tags } = req.body;
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        summary,
        content,
        author,
        image,
        tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((tag) => tag.trim()).filter(Boolean)
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/content/blogs/:id
// @desc    Delete a blog post
// @access  Private
router.delete('/blogs/:id', auth, async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.json({ success: true, msg: 'Blog deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ==========================================
// Events Routes
// ==========================================

// @route   GET api/content/events
// @desc    Get all events
// @access  Public
router.get('/events', async (req, res) => {
  try {
    const list = await Event.find();
    res.json(list);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/content/admin/events
// @desc    Get all events for admin management
// @access  Private
router.get('/admin/events', auth, async (req, res) => {
  try {
    const list = await Event.find();
    res.json(list);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/content/events
// @desc    Create a new event
// @access  Private
router.post('/events', auth, async (req, res) => {
  try {
    const { title, description, location, date, image, capacity } = req.body;
    if (!title || !description || !location || !date) {
      return res.status(400).json({ msg: 'Title, description, location and date are required' });
    }
    const newEvent = await Event.create({
      title,
      description,
      location,
      date: new Date(date),
      image,
      capacity: Number(capacity) || 0
    });
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/content/events/:id
// @desc    Update an event
// @access  Private
router.put('/events/:id', auth, async (req, res) => {
  try {
    const { title, description, location, date, image, capacity } = req.body;
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        location,
        date: new Date(date),
        image,
        capacity: Number(capacity) || 0
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/content/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/events/:id', auth, async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json({ success: true, msg: 'Event deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ==========================================
// Gallery Routes
// ==========================================

// @route   GET api/content/gallery
// @desc    Get all gallery images
// @access  Public
router.get('/gallery', async (req, res) => {
  try {
    const list = await Gallery.find();
    res.json(list);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/content/admin/gallery
// @desc    Get all gallery images for admin management
// @access  Private
router.get('/admin/gallery', auth, async (req, res) => {
  try {
    const list = await Gallery.find();
    res.json(list);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/content/gallery
// @desc    Create a new gallery item
// @access  Private
router.post('/gallery', auth, async (req, res) => {
  try {
    const { title, imageUrl, category, date } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ msg: 'Title and image URL are required' });
    }
    const newGallery = await Gallery.create({
      title,
      imageUrl,
      category: category || 'Corporate',
      date: date ? new Date(date) : new Date()
    });
    res.status(201).json(newGallery);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/content/gallery/:id
// @desc    Update a gallery item
// @access  Private
router.put('/gallery/:id', auth, async (req, res) => {
  try {
    const { title, imageUrl, category, date } = req.body;
    const updated = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        title,
        imageUrl,
        category,
        date: date ? new Date(date) : new Date()
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/content/gallery/:id
// @desc    Delete a gallery item
// @access  Private
router.delete('/gallery/:id', auth, async (req, res) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Gallery item not found' });
    }
    res.json({ success: true, msg: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ==========================================
// Admin Statistics Route
// ==========================================

// @route   GET api/content/stats
// @desc    Get summary counts and trends for dashboard charting
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find();
    
    // 1. Total count
    const totalInquiries = inquiries.length;
    const totalTestimonials = await Testimonial.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalGallery = await Gallery.countDocuments();

    // 2. Country-wise analysis
    const countriesMap = {};
    inquiries.forEach(i => {
      const country = i.country || 'Unknown';
      countriesMap[country] = (countriesMap[country] || 0) + 1;
    });
    const countryStats = Object.keys(countriesMap).map(name => ({
      country: name,
      count: countriesMap[name]
    })).sort((a, b) => b.count - a.count);

    // 3. Monthly statistics (Last 6 Months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = {};

    // Seed the map with last 6 months to ensure they always render in correct order
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyMap[label] = 0;
    }

    inquiries.forEach(i => {
      const date = new Date(i.createdAt);
      const label = `${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
      if (monthlyMap[label] !== undefined) {
        monthlyMap[label]++;
      }
    });

    const monthlyStats = Object.keys(monthlyMap).map(name => ({
      month: name,
      count: monthlyMap[name]
    }));

    res.json({
      totalInquiries,
      totalTestimonials,
      totalEvents,
      totalBlogs,
      totalGallery,
      countryStats,
      monthlyStats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
