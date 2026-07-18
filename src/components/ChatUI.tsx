'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiPlus, FiSend } from 'react-icons/fi';

type Role = 'user' | 'model';

interface Part {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface Message {
  role: Role;
  parts: Part[];
}

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !selectedFile) return;

    const currentInput = input;
    const currentFile = selectedFile;
    
    setInput('');
    setSelectedFile(null);
    setFilePreview(null);
    setLoading(true);

    const newParts: Part[] = [];
    if (currentInput.trim()) {
      newParts.push({ text: currentInput });
    }

    if (currentFile) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(currentFile);
      });
      const base64Data = await base64Promise;
      newParts.push({
        inlineData: {
          mimeType: currentFile.type,
          data: base64Data,
        }
      });
    }

    const newUserMsg: Message = { role: 'user', parts: newParts };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) throw new Error('No reader available');

      let currentResponse = '';
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        currentResponse += chunk;

        setMessages(prev => {
          const newMsgs = [...prev];
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg.role === 'model') {
            lastMsg.parts = [{ text: currentResponse }];
          }
          return newMsgs;
        });
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Sorry, I encountered an error.' }] }]);
    } finally {
      setLoading(false);
    }
  };

  const renderPart = (part: Part, index: number) => {
    if (part.text) {
      return (
        <div key={index} className="markdown-body" style={{ color: 'inherit' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {part.text}
          </ReactMarkdown>
        </div>
      );
    }
    if (part.inlineData) {
      return (
        <img 
          key={index} 
          src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} 
          alt="User upload" 
          style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', marginTop: '8px' }} 
        />
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter, Roboto, sans-serif' }}>
      
      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 500, margin: 0, color: '#e3e3e3', display: 'flex', alignItems: 'center', gap: '8px' }}>
              EAS AI <span style={{ fontSize: '12px', background: '#333', padding: '2px 8px', borderRadius: '12px', color: '#a8c7fa' }}>Fast</span>
            </h1>
          </div>
        </div>

        {/* Chat History */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', marginBottom: '24px',
                background: 'url("https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg") center/cover'
              }}></div>
              <h2 style={{ fontSize: '36px', fontWeight: 500, margin: 0, background: 'linear-gradient(74deg, #4285f4 0, #9b72cb 9%, #d96570 20%, #d96570 24%, #9b72cb 35%, #4285f4 44%, #9b72cb 50%, #d96570 56%, #131314 75%, #131314 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
                Welcome to EAS AI
              </h2>
              <p style={{ fontSize: '36px', color: '#444746', margin: 0, fontWeight: 500, lineHeight: 1.2 }}>How can I help you today?</p>
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '120px', paddingTop: '24px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, 
                    background: msg.role === 'user' 
                      ? '#444' 
                      : 'url("https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg") center/cover',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
                  }}>
                    {msg.role === 'user' ? 'U' : ''}
                  </div>
                  <div style={{ 
                    maxWidth: '80%', 
                    background: msg.role === 'user' ? '#333537' : 'transparent',
                    padding: msg.role === 'user' ? '12px 20px' : '0px',
                    borderRadius: msg.role === 'user' ? '24px' : '0px',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    color: '#e3e3e3',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}>
                    {msg.parts.map((p, i) => renderPart(p, i))}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role !== 'model' && (
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: 'url("https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg") center/cover' }}></div>
                  <div className="typing-indicator" style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '36px' }}>
                    <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 24px 24px 24px', display: 'flex', justifyContent: 'center', background: 'linear-gradient(to top, #131314 80%, transparent)' }}>
          <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column' }}>
            
            {filePreview && (
              <div style={{ alignSelf: 'flex-start', marginBottom: '12px', position: 'relative' }}>
                <img src={filePreview} alt="preview" style={{ height: '64px', borderRadius: '8px', border: '1px solid #333' }} />
                <button 
                  onClick={removeFile}
                  style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#333', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px' }}
                >×</button>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ 
              display: 'flex', alignItems: 'center', background: '#1e1f20', borderRadius: '32px', padding: '8px 16px', width: '100%',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}>
              
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileSelect} 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                style={{ background: 'transparent', border: 'none', color: '#c4c7c5', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%' }}
                className="hover-bg-333"
              >
                <FiPlus />
              </button>

              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Enter a prompt here" 
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#e3e3e3', fontSize: '16px', padding: '12px', outline: 'none' }}
              />
              
              <button 
                type="submit" 
                disabled={loading || (!input.trim() && !selectedFile)}
                style={{ background: 'transparent', border: 'none', color: input.trim() || selectedFile ? '#a8c7fa' : '#5f6368', fontSize: '20px', cursor: (input.trim() || selectedFile) && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%' }}
                className={input.trim() || selectedFile ? "hover-bg-333" : ""}
              >
                <FiSend />
              </button>
            </form>
            <div style={{ textAlign: 'center', color: '#5f6368', fontSize: '12px', marginTop: '12px' }}>
              EAS AI may display inaccurate info, so double-check its responses.
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg-333:hover { background-color: #333 !important; }
        .typing-indicator .dot {
          width: 6px; height: 6px; background: #c4c7c5; border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .markdown-body { font-family: inherit; }
        .markdown-body p { margin-top: 0; margin-bottom: 16px; }
        .markdown-body pre { background: #1e1f20; padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 16px; }
        .markdown-body code { font-family: monospace; background: #1e1f20; padding: 2px 4px; border-radius: 4px; }
        .markdown-body pre code { background: transparent; padding: 0; }
        .markdown-body ul { margin-top: 0; margin-bottom: 16px; padding-left: 20px; }
        .markdown-body li { margin-bottom: 4px; }
        .markdown-body strong { font-weight: 600; }
      `}} />
    </div>
  );
}
