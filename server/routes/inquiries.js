const express = require('express');
const router = express.Router();
const { validateInquiry } = require('../middleware/validate');
const { Inquiry, MongooseInquiry } = require('../models/db_models');
const auth = require('../middleware/auth');
const { isMongo } = require('../config/db');

// @route   POST api/inquiries
// @desc    Submit a new contact inquiry
// @access  Public
router.post('/', validateInquiry, async (req, res) => {
  try {
    const newInquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, data: newInquiry });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/inquiries
// @desc    Get all inquiries with search & filter
// @access  Private
router.get('/', auth, async (req, res) => {
  const { search, country } = req.query;

  try {
    let inquiries = [];

    if (isMongo()) {
      // Direct Mongoose implementation
      const filter = {};
      if (country) {
        filter.country = country;
      }
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
          { fullName: searchRegex },
          { email: searchRegex },
          { companyName: searchRegex },
          { jobTitle: searchRegex },
          { jobDetails: searchRegex }
        ];
      }
      inquiries = await MongooseInquiry.find(filter).sort({ createdAt: -1 });
    } else {
      // Local JSON Database implementation
      inquiries = await Inquiry.find();
      
      if (country) {
        inquiries = inquiries.filter(item => item.country === country);
      }
      
      if (search) {
        const searchStr = search.toLowerCase();
        inquiries = inquiries.filter(item => 
          item.fullName.toLowerCase().includes(searchStr) ||
          item.email.toLowerCase().includes(searchStr) ||
          (item.companyName && item.companyName.toLowerCase().includes(searchStr)) ||
          (item.jobTitle && item.jobTitle.toLowerCase().includes(searchStr)) ||
          item.jobDetails.toLowerCase().includes(searchStr)
        );
      }
    }

    res.json(inquiries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/inquiries/:id
// @desc    Delete an inquiry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ msg: 'Inquiry not found' });
    }

    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: 'Inquiry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
