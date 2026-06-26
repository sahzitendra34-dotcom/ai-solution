const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Initialize OpenAI client if key is configured
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Local Semantic/Keyword Responder
function getLocalResponse(message) {
  const msg = message.toLowerCase().trim();

  if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey') || msg.startsWith('hi')) {
    return "Hello! Welcome to AI-Solutions. I am your virtual digital assistant. How can I help you improve your digital employee experience or create rapid prototypes today?";
  }
  
  if (msg.includes('sunderland') || msg.includes('uk') || msg.includes('location') || msg.includes('where')) {
    return "AI-Solutions is proudly headquartered at the Software Centre in Sunderland, Tyne and Wear, United Kingdom. We are dedicated to driving innovation in the North East region and globally!";
  }

  if (msg.includes('service') || msg.includes('offer') || msg.includes('product') || msg.includes('what do you do')) {
    return "We specialize in leveraging AI to optimize the digital employee experience. Our offerings include:\n1. Proactive IT issue identification and automated diagnostics.\n2. Design and engineering acceleration tools.\n3. Affordable, rapid AI-driven application prototyping.\nCheck out our Services page for more info!";
  }

  if (msg.includes('prototype') || msg.includes('prototyping') || msg.includes('cost') || msg.includes('affordable')) {
    return "Our AI-powered prototyping services are highly cost-effective and built for speed. We can help you turn your business ideas into functional web and mobile prototypes in days instead of months. Submit an inquiry through our Contact Form to get a free estimate!";
  }

  if (msg.includes('contact') || msg.includes('inquiry') || msg.includes('form') || msg.includes('email') || msg.includes('submit')) {
    return "You can easily submit a detailed inquiry by visiting our Contact Us page. Please fill out the form (name, email, phone, company, and project details) and our Sunderland engineering team will get back to you within 24 hours.";
  }

  if (msg.includes('about') || msg.includes('mission') || msg.includes('vision') || msg.includes('values')) {
    return "At AI-Solutions, our mission is to empower organizations by streamlining their workplace technologies. We envision a digital-first workplace where technology issues are proactively resolved before employees even notice them, accelerating overall team innovation.";
  }

  if (msg.includes('pricing') || msg.includes('price') || msg.includes('cost')) {
    return "Our core software diagnostic platforms are subscription-based, tailored to organization size. Our prototyping starts as low as £999 for full-featured MVPs. Please submit a request on our Contact Us page for a bespoke quote.";
  }

  if (msg.includes('thank') || msg.includes('thanks') || msg.includes('great')) {
    return "You're very welcome! Let me know if there's anything else I can clarify about AI-Solutions.";
  }

  // Default generic help response
  return "I'm here to help you with questions about AI-Solutions, our services, our Sunderland headquarters, or our rapid prototyping solutions. If you need standard consulting, please fill out our Contact Us form and we'll connect you with an expert.";
}

// @route   POST api/chatbot
// @desc    Interact with the virtual assistant
// @access  Public
router.post('/', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ msg: 'Please provide a message' });
  }

  // Fallback to local response if OpenAI is not configured or fails
  if (!openai) {
    const reply = getLocalResponse(message);
    return res.json({ reply, mode: 'local' });
  }

  try {
    // Construct system and conversational history messages for GPT
    const systemPrompt = `You are a helpful and professional AI Virtual Assistant for "AI-Solutions", a startup headquartered in Sunderland, United Kingdom. 
AI-Solutions designs software that uses Artificial Intelligence to improve the digital employee experience, proactively identify technology bottlenecks, and offer rapid prototyping services.
Keep your answers brief, professional, and invite the user to contact us or submit an inquiry on the Contact page if they need custom development.`;

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Append history (if provided)
    if (history && Array.isArray(history)) {
      history.slice(-6).forEach(h => {
        messages.push({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.text });
      });
    }

    // Append current user message
    messages.push({ role: 'user', content: message });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 250,
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;
    res.json({ reply, mode: 'openai' });
  } catch (err) {
    console.error('OpenAI Error, falling back to local NLP logic:', err.message);
    const reply = getLocalResponse(message);
    res.json({ reply, mode: 'local-fallback' });
  }
});

module.exports = router;
