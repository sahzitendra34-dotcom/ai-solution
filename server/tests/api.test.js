const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { isMongo } = require('../config/db');

describe('AI-Solutions Backend API Integration Tests', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });
  
  describe('GET /', () => {
    it('should return API status online message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('online');
    });
  });

  describe('POST /api/inquiries (Contact Form Submissions)', () => {
    it('should block inquiry with missing fields', async () => {
      const res = await request(app)
        .post('/api/inquiries')
        .send({ fullName: 'John Doe' }); // Missing details, phone, country
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should block inquiry with invalid email and phone format', async () => {
      const res = await request(app)
        .post('/api/inquiries')
        .send({
          fullName: 'John Doe',
          email: 'not-an-email',
          phone: 'abc', // Invalid phone
          country: 'United Kingdom',
          jobDetails: 'We need rapid AI prototyping.'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.errors.some(err => err.path === 'email')).toBeTruthy();
      expect(res.body.errors.some(err => err.path === 'phone')).toBeTruthy();
    });

    it('should accept valid inquiries and save them', async () => {
      const res = await request(app)
        .post('/api/inquiries')
        .send({
          fullName: 'Test User',
          email: 'test@user.co.uk',
          phone: '+44 7700 900011',
          companyName: 'Test Corp',
          country: 'United Kingdom',
          jobTitle: 'Developer',
          jobDetails: 'This is a valid test inquiry containing more than 10 characters.'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.fullName).toEqual('Test User');
    });
  });

  describe('POST /api/auth/login (Security Login Check)', () => {
    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistent', password: 'badpassword' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.errors[0].msg).toContain('Invalid');
    });
  });

  describe('POST /api/chatbot (AI Assistant Reply Check)', () => {
    it('should reply to hello matching keywords', async () => {
      const res = await request(app)
        .post('/api/chatbot')
        .send({ message: 'Hello assistant!' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('reply');
      expect(res.body.reply.toLowerCase()).toContain('welcome');
    });

    it('should answer Sunderland corporate location queries', async () => {
      const res = await request(app)
        .post('/api/chatbot')
        .send({ message: 'Where is your office based?' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.reply.toLowerCase()).toContain('sunderland');
    });
  });
});
