"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Scale, User, Bot, Sparkles, Loader2, BookOpen, Info } from "lucide-react";
import clsx from "clsx";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Sidebar from "./components/Sidebar";
import {
  Chat,
  Message,
  loadChats,
  saveChats,
  createNewChat,
  updateChat,
  deleteChat as deleteChatUtil,
  getChatById,
  getActiveChatId,
  setActiveChatId,
} from "@/lib/chatStorage";

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize chats from localStorage
  useEffect(() => {
    const loadedChats = loadChats();
    
    if (loadedChats.length === 0) {
      // Create initial chat if none exist
      const initialChat = createNewChat();
      setChats([initialChat]);
      setCurrentChatId(initialChat.id);
      saveChats([initialChat]);
      setActiveChatId(initialChat.id);
    } else {
      setChats(loadedChats);
      const activeChatId = getActiveChatId();
      const activeChat = activeChatId && getChatById(loadedChats, activeChatId);
      setCurrentChatId(activeChat ? activeChat.id : loadedChats[0].id);
    }
    
    setIsInitialized(true);
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && chats.length > 0) {
      saveChats(chats);
    }
  }, [chats, isInitialized]);

  // Save active chat ID whenever it changes
  useEffect(() => {
    if (isInitialized && currentChatId) {
      setActiveChatId(currentChatId);
    }
  }, [currentChatId, isInitialized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChatId, chats]);

  const currentChat = getChatById(chats, currentChatId);
  const messages = currentChat?.messages || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !currentChatId) return;

    const userMessage = input.trim();
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    
    // Update chat with user message
    setChats(prev => updateChat(prev, currentChatId, newMessages));
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
        const assistantMessage: Message = { role: "assistant", content: data.answer };
        setChats(prev => updateChat(prev, currentChatId, [...newMessages, assistantMessage]));
      } else {
        const errorMessage: Message = { role: "assistant", content: "⚠️ **Raalli ahoow**, cilad ayaa dhacday." };
        setChats(prev => updateChat(prev, currentChatId, [...newMessages, errorMessage]));
      }
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { role: "assistant", content: "⚠️ **Raalli ahoow**, cilad ayaa dhacday." };
      setChats(prev => updateChat(prev, currentChatId, [...newMessages, errorMessage]));
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    const newChat = createNewChat();
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => {
      const updated = deleteChatUtil(prev, chatId);
      
      // If deleting the active chat, switch to another or create new
      if (chatId === currentChatId) {
        if (updated.length > 0) {
          setCurrentChatId(updated[0].id);
        } else {
          const newChat = createNewChat();
          setCurrentChatId(newChat.id);
          return [newChat];
        }
      }
      
      return updated;
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Premium Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/60 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 ml-12 lg:ml-0">
              <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 text-white p-2 rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/20">
                <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                  Dastuur Agent
                </h1>
                <p className="text-[10px] sm:text-xs font-medium text-slate-500 flex items-center gap-1">
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
        <div className="p-3 sm:p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative group shadow-lg shadow-slate-200/40 rounded-2xl bg-white">
              <input
                type="text"
                className="w-full bg-transparent border-2 border-transparent focus:border-blue-500/30 rounded-2xl pl-4 sm:pl-5 pr-12 sm:pr-14 py-3 sm:py-4 focus:outline-none focus:ring-0 transition-all placeholder:text-slate-400 text-slate-700 text-sm sm:text-base"
                placeholder="Weydii su'aal..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 text-white rounded-xl transition-all flex items-center justify-center shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:scale-105 active:scale-95"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
            <p className="text-center text-xs text-slate-400 mt-3">
              Dastuur Agent waxaa ku shaqeeya Gemini & Memvid AI. Fadlan hubi macluumaadka.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
