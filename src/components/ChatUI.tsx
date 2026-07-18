'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiPlus, FiX, FiSend } from 'react-icons/fi';

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      let lastUserIdx = -1;
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          lastUserIdx = i;
          break;
        }
      }
      if (lastUserIdx !== -1) {
        const el = document.getElementById(`msg-${lastUserIdx}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }, [messages.length]); 

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
          style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '16px', marginTop: '8px' }} 
        />
      );
    }
    return null;
  };

  const isPill = !filePreview;
  const inputStyle = {
    width: '100%', 
    maxWidth: '700px', 
    display: 'flex', 
    flexDirection: 'column' as const, 
    background: 'var(--surface)', 
    borderRadius: isPill ? '50px' : '24px', 
    padding: isPill ? '8px 16px' : '16px', 
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-md)',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-geist-sans), sans-serif', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        
        {messages.length === 0 ? (
          // Empty State - Perfectly Centered
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
            <div style={inputStyle}>
              {filePreview && (
                <div style={{ alignSelf: 'flex-start', marginBottom: '16px', position: 'relative', display: 'inline-block' }}>
                  <img src={filePreview} alt="preview" style={{ height: '80px', objectFit: 'contain', borderRadius: '12px' }} />
                  <button 
                    onClick={removeFile}
                    style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--foreground)', color: 'var(--background)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', boxShadow: 'var(--shadow-sm)' }}
                  ><FiX /></button>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'transparent', border: 'none', color: 'var(--foreground)', opacity: 0.7, fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }} className="hover-bg-border">
                  <FiPlus />
                </button>

                <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask eAs" style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--foreground)', fontSize: '16px', outline: 'none', padding: '8px 0' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button type="submit" disabled={loading || (!input.trim() && !selectedFile)} style={{ background: 'transparent', border: 'none', color: (input.trim() || selectedFile) ? 'var(--foreground)' : 'var(--border)', fontSize: '20px', cursor: (input.trim() || selectedFile) && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', transition: 'all 0.2s', boxShadow: 'none' }}>
                    <FiSend />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          // Chat State - Input at bottom
          <>
            <div ref={messagesContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '160px', paddingTop: '32px' }}>
                {messages.map((msg, idx) => (
                  <div key={idx} id={`msg-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}>
                    
                    {msg.role === 'user' ? (
                      <div style={{ maxWidth: '85%', background: 'var(--surface)', padding: '12px 20px', borderRadius: '24px', fontSize: '16px', lineHeight: '1.6', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                        {msg.parts.map((p, i) => renderPart(p, i))}
                      </div>
                    ) : (
                      <div style={{ width: '100%' }}>
                        <div style={{ width: '100%', fontSize: '16px', lineHeight: '1.6', color: 'var(--foreground)' }}>
                          {msg.parts.map((p, i) => renderPart(p, i))}
                        </div>
                      </div>
                    )}

                  </div>
                ))}

                {loading && messages[messages.length - 1]?.role !== 'model' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    <div className="typing-indicator" style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '28px' }}>
                      <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(to top, var(--background) 70%, transparent)' }}>
              <div style={inputStyle}>
                {filePreview && (
                  <div style={{ alignSelf: 'flex-start', marginBottom: '16px', position: 'relative', display: 'inline-block' }}>
                    <img src={filePreview} alt="preview" style={{ height: '80px', objectFit: 'contain', borderRadius: '12px' }} />
                    <button 
                      onClick={removeFile}
                      style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--foreground)', color: 'var(--background)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', boxShadow: 'var(--shadow-sm)' }}
                    ><FiX /></button>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
                  <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'transparent', border: 'none', color: 'var(--foreground)', opacity: 0.7, fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }} className="hover-bg-border">
                    <FiPlus />
                  </button>

                  <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask eAs" style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--foreground)', fontSize: '16px', outline: 'none', padding: '8px 0' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button type="submit" disabled={loading || (!input.trim() && !selectedFile)} style={{ background: 'transparent', border: 'none', color: (input.trim() || selectedFile) ? 'var(--foreground)' : 'var(--border)', fontSize: '20px', cursor: (input.trim() || selectedFile) && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', transition: 'all 0.2s', boxShadow: 'none' }}>
                    <FiSend />
                  </button>
                </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg-border:hover { background-color: var(--border) !important; opacity: 1 !important; }
        .typing-indicator .dot {
          width: 6px; height: 6px; background: var(--foreground); opacity: 0.6; border-radius: 50%;
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
        .markdown-body pre { background: var(--surface); padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 16px; border: 1px solid var(--border); }
        .markdown-body code { font-family: monospace; background: var(--surface); padding: 2px 4px; border-radius: 4px; border: 1px solid var(--border); }
        .markdown-body pre code { background: transparent; padding: 0; border: none; }
        .markdown-body ul, .markdown-body ol { margin-top: 0; margin-bottom: 16px; padding-left: 20px; }
        .markdown-body li { margin-bottom: 4px; }
        .markdown-body strong { font-weight: 600; color: var(--foreground); }
        .markdown-body a { color: var(--primary); text-decoration: underline; }
      `}} />
    </div>
  );
}
