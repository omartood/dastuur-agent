"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Scale, User, Bot, Sparkles, Loader2, BookOpen, Info } from "lucide-react";
import clsx from "clsx";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "👋 **Kusoo dhawow!** \n\nWaxaan ahay **Kaaliyaha Dastuurka**. \nMaxaan kaa caawin karaa maanta? \n\n*Tusaale: \"Qodobka 1aad maxuu ka hadlayaa?\"*" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "⚠️ **Raalli ahoow**, cilad ayaa dhacday." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ **Raalli ahoow**, cilad ayaa dhacday." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 text-white p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Dastuurka AI
              </h1>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-lg">
             <Info size={20} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 sm:px-6 max-w-4xl mx-auto w-full scroll-smooth">
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 opacity-60">
             <BookOpen size={64} strokeWidth={1} className="mb-4 text-slate-300"/>
             <p className="text-lg">Waxba lama helin weli</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={clsx(
              "flex gap-4 group",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            <div
              className={clsx(
                "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105",
                msg.role === "user" 
                  ? "bg-slate-900 text-white" 
                  : "bg-white border border-slate-200 text-blue-600"
              )}
            >
              {msg.role === "user" ? <User size={20} /> : <div className="relative"><Sparkles size={20} className="text-blue-500" /></div>}
            </div>
            
            {/* Message Bubble */}
            <div
              className={clsx(
                "relative p-4 sm:p-5 rounded-2xl max-w-[85%] sm:max-w-[75%] text-[15px] sm:text-base leading-7 shadow-sm transition-all duration-200",
                msg.role === "user"
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm"
                  : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-sm shadow-slate-200/50"
              )}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:underline prose-strong:text-slate-900 prose-ul:my-2 prose-li:my-0.5">
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                   </ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
           <div className="flex gap-4">
             <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles size={20} className="text-blue-500 animate-pulse" />
             </div>
             <div className="bg-white border border-slate-200 px-6 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
               <div className="flex gap-1">
                 <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></span>
                 <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></span>
                 <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></span>
               </div>
               <span className="text-sm text-slate-400 font-medium ml-2">Jawaab ayaa la diyaarinayaa...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group shadow-lg shadow-slate-200/40 rounded-2xl bg-white">
            <input
              type="text"
              className="w-full bg-transparent border-2 border-transparent focus:border-blue-500/30 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-0 transition-all placeholder:text-slate-400 text-slate-700"
              placeholder="Weydii su'aal ku saabsan Dastuurka..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 text-white rounded-xl transition-all flex items-center justify-center shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:scale-105 active:scale-95"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-3">
             Kaaliyaha Dastuurka waxaa ku shaqeeya AI. Fadlan hubi macluumaadka.
          </p>
        </div>
      </div>
    </div>
  );
}
