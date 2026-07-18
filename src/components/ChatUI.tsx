'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiPlus, FiSend, FiX } from 'react-icons/fi';

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
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Sorry, I encountered an error. Please try again.' }] }]);
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
          style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '4px', marginTop: '8px', border: '1px solid #333' }} 
        />
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-geist-sans), sans-serif', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      
      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Dynamic Chat / Input Layout */}
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 500, marginBottom: '24px', letterSpacing: '-0.02em' }}>What can I help you with?</h2>
            
            <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column' }}>
              {filePreview && (
                <div style={{ alignSelf: 'flex-start', marginBottom: '12px', position: 'relative', display: 'inline-block' }}>
                  <img src={filePreview} alt="preview" style={{ height: '64px', objectFit: 'contain', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)' }} />
                  <button 
                    onClick={removeFile}
                    style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--foreground)', color: 'var(--background)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', boxShadow: 'var(--shadow-sm)' }}
                  ><FiX /></button>
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ 
                display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '4px 8px', width: '100%', boxShadow: 'var(--shadow-sm)'
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
                  style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%' }}
                  className="hover-bg-surface"
                >
                  <FiPlus />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything..." 
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--foreground)', fontSize: '15px', padding: '10px', outline: 'none' }}
                />
                <button 
                  type="submit" 
                  disabled={loading || (!input.trim() && !selectedFile)}
                  style={{ background: input.trim() || selectedFile ? 'var(--foreground)' : 'transparent', border: 'none', color: input.trim() || selectedFile ? 'var(--background)' : '#888', fontSize: '16px', cursor: (input.trim() || selectedFile) && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', transition: 'all 0.2s' }}
                >
                  <FiSend />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Chat History */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '100px', paddingTop: '32px' }}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '4px', flexShrink: 0, 
                      background: msg.role === 'user' ? 'var(--border)' : 'var(--foreground)',
                      color: msg.role === 'user' ? 'var(--foreground)' : 'var(--background)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px'
                    }}>
                      {msg.role === 'user' ? 'U' : 'AI'}
                    </div>
                    <div style={{ 
                      maxWidth: '85%', 
                      padding: '0px',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: 'var(--foreground)',
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                      {msg.parts.map((p, i) => renderPart(p, i))}
                    </div>
                  </div>
                ))}
                {loading && messages[messages.length - 1]?.role !== 'model' && (
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '4px', flexShrink: 0, background: 'var(--foreground)', color: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                      AI
                    </div>
                    <div className="typing-indicator" style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '28px' }}>
                      <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom Input Area */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px', display: 'flex', justifyContent: 'center', background: 'linear-gradient(to top, var(--background) 80%, transparent)' }}>
              <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column' }}>
                
                {filePreview && (
                  <div style={{ alignSelf: 'flex-start', marginBottom: '8px', position: 'relative', display: 'inline-block' }}>
                    <img src={filePreview} alt="preview" style={{ height: '56px', objectFit: 'contain', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)' }} />
                    <button 
                      onClick={removeFile}
                      style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--foreground)', color: 'var(--background)', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', boxShadow: 'var(--shadow-sm)' }}
                    ><FiX /></button>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ 
                  display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '4px 8px', width: '100%', boxShadow: 'var(--shadow-sm)'
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
                    style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%' }}
                    className="hover-bg-surface"
                  >
                    <FiPlus />
                  </button>

                  <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask anything..." 
                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--foreground)', fontSize: '15px', padding: '10px', outline: 'none' }}
                  />
                  
                  <button 
                    type="submit" 
                    disabled={loading || (!input.trim() && !selectedFile)}
                    style={{ background: input.trim() || selectedFile ? 'var(--foreground)' : 'transparent', border: 'none', color: input.trim() || selectedFile ? 'var(--background)' : '#888', fontSize: '16px', cursor: (input.trim() || selectedFile) && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', transition: 'all 0.2s' }}
                  >
                    <FiSend />
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg-surface:hover { background-color: var(--border) !important; color: var(--foreground) !important; }
        .typing-indicator .dot {
          width: 5px; height: 5px; background: #888; border-radius: 50%;
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
        .markdown-body p:last-child { margin-bottom: 0; }
        .markdown-body pre { background: var(--surface); padding: 16px; border-radius: 4px; overflow-x: auto; margin-bottom: 16px; border: 1px solid var(--border); }
        .markdown-body code { font-family: monospace; background: var(--surface); padding: 2px 4px; border-radius: 4px; border: 1px solid var(--border); }
        .markdown-body pre code { background: transparent; padding: 0; border: none; }
        .markdown-body ul, .markdown-body ol { margin-top: 0; margin-bottom: 16px; padding-left: 20px; }
        .markdown-body li { margin-bottom: 4px; }
        .markdown-body strong { font-weight: 600; color: var(--foreground); }
        .markdown-body a { color: var(--foreground); text-decoration: underline; }
      `}} />
    </div>
  );
}
