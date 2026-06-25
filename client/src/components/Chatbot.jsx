import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am your AI-Solutions virtual assistant. Ask me anything about our digital employee experience software, quick prototyping services, or location in Sunderland!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  const faqChips = [
    "What services do you offer?",
    "Tell me about rapid prototyping.",
    "Where are you based?",
    "How can I submit an inquiry?"
  ];

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages
        })
      });
      
      const data = await response.json();
      setIsTyping(false);

      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply
      };
      
      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      const errorReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "I am having difficulty reaching my main brain right now. However, I can let you know we offer AI Diagnostics and Rapid Prototyping services. Please fill out our Contact Us form for a full response!"
      };
      setMessages(prev => [...prev, errorReply]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <>
      {/* Floating launcher bubble */}
      <div className="chatbot-bubble" onClick={() => setIsOpen(!isOpen)} aria-label="Open virtual assistant">
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </div>

      {/* Chat pane */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="d-flex align-items-center gap-2">
              <Bot size={22} className="text-white" />
              <div>
                <div className="fw-bold small">AI-Solutions Agent</div>
                <div className="text-muted" style={{ fontSize: '0.7rem', color: '#a5b4fc' }}>Sunderland, UK</div>
              </div>
            </div>
            <button className="btn p-0 text-white border-0" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chatbot-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-message ${m.sender === 'bot' ? 'bot' : 'user'} d-flex gap-2 align-items-start`}
              >
                {m.sender === 'bot' ? (
                  <Bot size={14} className="mt-1 flex-shrink-0 text-info" />
                ) : (
                  <User size={14} className="mt-1 flex-shrink-0 text-white" />
                )}
                <span>{m.text}</span>
              </div>
            ))}
            
            {isTyping && (
              <div className="chat-message bot d-flex gap-2 align-items-center">
                <Bot size={14} className="text-info" />
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* FAQ chips suggestion */}
          <div className="chip-container">
            {faqChips.map((chip, idx) => (
              <span
                key={idx}
                className="faq-chip"
                onClick={() => handleSendMessage(chip)}
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Chat Form Input */}
          <form onSubmit={handleFormSubmit} className="chatbot-input-area">
            <input
              type="text"
              className="form-control form-control-sm form-control-custom py-1.5"
              placeholder="Ask a question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              className="btn btn-sm btn-primary-custom d-flex align-items-center justify-content-center p-2"
              disabled={!inputText.trim() || isTyping}
              style={{ borderRadius: '10px' }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
