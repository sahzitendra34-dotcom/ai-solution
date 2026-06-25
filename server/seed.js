const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');
const { connectDB, isMongo, getLocalData, saveLocalData } = require('./config/db');
const { Admin, Inquiry, Testimonial, Blog, Event, Gallery } = require('./models/db_models');

const seed = async () => {
  console.log('🌱 Starting database seeding process...');

  // Ensure DB connection is established
  await connectDB();

  // If local fallback JSON, clear it
  if (!isMongo()) {
    console.log('🧹 Clearing local JSON data storage...');
    saveLocalData({
      admins: [],
      inquiries: [],
      testimonials: [],
      blogs: [],
      events: [],
      gallery: []
    });
  } else {
    console.log('🧹 Clearing MongoDB collections...');
    const mongoose = require('mongoose');
    try {
      await mongoose.connection.db.dropDatabase();
    } catch (e) {
      console.log('Database drop bypassed.');
    }
  }

  // 1. Seed Admin
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  await Admin.create({
    username: adminUsername,
    passwordHash
  });
  console.log(`🔐 Created Admin account: "${adminUsername}" with password: "${adminPassword}"`);

  // 2. Seed Testimonials
  const testimonials = [
    {
      name: 'Sarah Jenkins',
      company: 'Innovate UK, Newcastle',
      rating: 5,
      feedback: 'AI-Solutions transformed our digital employee experience. Their automated diagnostic tools resolved key desktop bottlenecks, increasing developer throughput by 20%!',
      approved: true
    },
    {
      name: 'Dr. Marcus Vance',
      company: 'Sunderland Engineering Lab',
      rating: 5,
      feedback: 'The prototyping service is exceptional. We received a functional, AI-integrated pilot web application in less than 5 days. Truly affordable and professional!',
      approved: true
    },
    {
      name: 'Liam Henderson',
      company: 'Digital North East Enterprise',
      rating: 4,
      feedback: 'Very responsive team and reliable software diagnostics. The virtual assistant was a game changer for answering staff support inquiries during our cloud migration.',
      approved: true
    }
  ];

  for (const t of testimonials) {
    await Testimonial.create(t);
  }
  console.log(`💬 Seeded ${testimonials.length} Customer Testimonials`);

  // 3. Seed Blogs
  const blogs = [
    {
      title: 'How AI is Redefining the Digital Employee Experience (DEX)',
      summary: 'Explore the key technological shifts driving workplace optimization and employee retention in 2026.',
      content: 'Digital Employee Experience (DEX) is no longer just a term for IT departments; it is a critical driver of company culture and retention. By deploying proactive AI diagnostic models, organizations can monitor background performance lag, identify crash loops, and patch workstation faults silently before users report them. At AI-Solutions, our suite of telemetry tools performs these tasks automatically, keeping your engineering staff focused on creating, not troubleshooting.',
      author: 'Dr. Marcus Vance',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      tags: ['AI', 'Workplace', 'DEX', 'Innovation']
    },
    {
      title: 'Accelerating MVPs with AI-Driven Prototyping',
      summary: 'How startups can validate design concepts in record time using intelligent code orchestration.',
      content: 'Traditional prototyping cycles take months and cost tens of thousands of pounds. With AI-assisted software generation and template scaffolding, AI-Solutions enables startups in Sunderland and beyond to launch feature-complete minimum viable products (MVPs) in a fraction of the time. This article breaks down our design sprint methodology, demonstrating how mockups are instantly mapped to fully functional React interfaces connected to serverless backends.',
      author: 'Sunderland Innovation Hub',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      tags: ['Prototyping', 'Startups', 'Vite', 'React']
    },
    {
      title: 'Securing Enterprise Workstations in the Hybrid Work Era',
      summary: 'Best practices for securing digital employee portals without hindering developers productivity.',
      content: 'Hybrid workflows require open networks but strict access. Overbearing local firewalls and monitoring tools often degrade workstation performance. A modern approach combines sandboxed local nodes with AI threat-detection heuristics. We discuss how companies can leverage non-intrusive security audits to verify employee workstation integrity without introducing annoying lags or security holes.',
      author: 'Security Officer, AI-Solutions',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      tags: ['Security', 'Remote Work', 'IT Infrastructure']
    }
  ];

  for (const b of blogs) {
    await Blog.create(b);
  }
  console.log(`📝 Seeded ${blogs.length} Corporate Blog Articles`);

  // 4. Seed Events
  const events = [
    {
      title: 'Sunderland AI & Tech Innovation Summit',
      description: 'Join local tech leaders, researchers from the University of Sunderland, and startups for a full day of AI demos and networking.',
      location: 'Software Centre, Sunderland, SR1 1PB',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days in future
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      capacity: 150
    },
    {
      title: 'Masterclass: Rapid Prototyping for Startups',
      description: 'An interactive developer-focused webinar explaining how to leverage AI tools to construct cloud-connected application pilots in 48 hours.',
      location: 'Online Webinar (Zoom)',
      date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days in future
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      capacity: 500
    }
  ];

  for (const e of events) {
    await Event.create(e);
  }
  console.log(`📅 Seeded ${events.length} Upcoming Corporate Events`);

  // 5. Seed Gallery
  const gallery = [
    {
      title: 'AI-Solutions Office Launch',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      category: 'Office',
      date: new Date('2026-01-15').toISOString()
    },
    {
      title: 'Annual Tech Hackathon in Tyne & Wear',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      category: 'Events',
      date: new Date('2026-03-22').toISOString()
    },
    {
      title: 'Collaborative AI Prototyping Workshop',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      category: 'Workshops',
      date: new Date('2026-04-10').toISOString()
    },
    {
      title: 'Panel Discussion on Workplace Automation',
      imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
      category: 'Events',
      date: new Date('2026-05-05').toISOString()
    }
  ];

  for (const g of gallery) {
    await Gallery.create(g);
  }
  console.log(`🖼️ Seeded ${gallery.length} Gallery Images`);

  // 6. Seed Inquiries (Backdated over 6 months to create dashboard graphs)
  const inquiries = [
    {
      fullName: 'David Miller',
      email: 'd.miller@techtide.co.uk',
      phone: '+44 7700 900077',
      companyName: 'TechTide Solutions',
      country: 'United Kingdom',
      jobTitle: 'VP of Engineering',
      jobDetails: 'Interested in deployment of your telemetry diagnostics agent to monitor 250 remote developer workstations.',
      createdAt: new Date('2026-01-15T10:30:00Z')
    },
    {
      fullName: 'Alice Wang',
      email: 'alice.w@tokyotech.jp',
      phone: '+81 90 1234 5678',
      companyName: 'Tokyo Tech Laboratories',
      country: 'Japan',
      jobTitle: 'Lead Architect',
      jobDetails: 'Requesting details regarding AI prototyping workflows and tech stack support for hybrid mobile applications.',
      createdAt: new Date('2026-02-18T14:20:00Z')
    },
    {
      fullName: 'John Smith',
      email: 'jsmith@cloudcorp.com',
      phone: '+1 202 555 0143',
      companyName: 'CloudCorp Inc',
      country: 'United States',
      jobTitle: 'IT Infrastructure Director',
      jobDetails: 'We are facing high employee friction due to slow VPN connections. Can your AI software analyze and suggest optimizations automatically?',
      createdAt: new Date('2026-03-05T09:15:00Z')
    },
    {
      fullName: 'Klaus Schmidt',
      email: 'klaus.schmidt@berlininno.de',
      phone: '+49 30 123456',
      companyName: 'Berlin Innovation GMBH',
      country: 'Germany',
      jobTitle: 'Founder',
      jobDetails: 'We need an AI chatbot prototype connected to local knowledge bases. Do you provide end-to-end prototyping for this?',
      createdAt: new Date('2026-03-24T16:40:00Z')
    },
    {
      fullName: 'Rohan Sharma',
      email: 'rohan@mumbaitech.in',
      phone: '+91 22 9876 5432',
      companyName: 'Mumbai Digital Hub',
      country: 'India',
      jobTitle: 'Product Manager',
      jobDetails: 'Interested in cost details for developing a react prototype app representing employee workstation health diagnostics.',
      createdAt: new Date('2026-04-12T11:05:00Z')
    },
    {
      fullName: 'Emma Watson',
      email: 'emma@londondx.org',
      phone: '+44 7911 123456',
      companyName: 'London DX Association',
      country: 'United Kingdom',
      jobTitle: 'Operations Manager',
      jobDetails: 'We would love to co-host a webinar regarding digital employee experiences. Please let us know the availability of your experts.',
      createdAt: new Date('2026-04-29T15:55:00Z')
    },
    {
      fullName: 'Jean Dupont',
      email: 'j.dupont@parisconsulting.fr',
      phone: '+33 1 42 27 78 90',
      companyName: 'Paris Consulting Group',
      country: 'France',
      jobTitle: 'IT Specialist',
      jobDetails: 'Looking for details about the performance impacts of your virtual agent workstation agent during runtime audits.',
      createdAt: new Date('2026-05-14T08:30:00Z')
    },
    {
      fullName: 'Kenji Sato',
      email: 'kenji@osakasoft.jp',
      phone: '+81 6 6234 5678',
      companyName: 'Osaka Softworks',
      country: 'Japan',
      jobTitle: 'Engineering Manager',
      jobDetails: 'We need rapid AI-based web UI prototypes for our upcoming logistics optimization system. Can we initiate a design call?',
      createdAt: new Date('2026-05-28T13:45:00Z')
    },
    {
      fullName: 'William Davis',
      email: 'william@nycinnovate.com',
      phone: '+1 212 555 0199',
      companyName: 'NYC Innovate',
      country: 'United States',
      jobTitle: 'Chief Innovation Officer',
      jobDetails: 'How do you handle data isolation when using OpenAI services for company prototypes? Data protection is our number one criteria.',
      createdAt: new Date('2026-06-02T10:00:00Z')
    },
    {
      fullName: 'Sophie Taylor',
      email: 'sophie.taylor@sunderlandcouncil.gov.uk',
      phone: '+44 191 561 1000',
      companyName: 'Sunderland City Council',
      country: 'United Kingdom',
      jobTitle: 'Digital Inclusion Officer',
      jobDetails: 'Exploring how AI virtual assistants can help answer municipal services questions for local residents in Sunderland.',
      createdAt: new Date('2026-06-07T14:00:00Z')
    }
  ];

  for (const i of inquiries) {
    await Inquiry.create(i);
  }
  console.log(`✉️ Seeded ${inquiries.length} Customer Inquiries (distributed over Jan - Jun 2026)`);

  console.log('✅ Seeding completed successfully. Ready to run!');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
