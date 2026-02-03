"use client";

import { Chat } from "@/lib/chatStorage";
import { MessageSquarePlus, Trash2, MessageSquare, Menu, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

interface SidebarProps {
  chats: Chat[];
  activeChatId: string;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (confirm("Ma hubtaa inaad tirtirto sheekan?")) {
      onDeleteChat(chatId);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Maanta";
    if (days === 1) return "Shalay";
    if (days < 7) return `${days} maalmood ka hor`;
    return date.toLocaleDateString("so-SO", { month: "short", day: "numeric" });
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all transform hover:scale-105 active:scale-95"
        >
          <MessageSquarePlus size={20} />
          Sheeko Cusub
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {chats.length === 0 ? (
          <div className="text-center text-slate-400 text-sm mt-8 px-4">
            <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
            <p>Weli sheeko ma jirto</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                onSelectChat(chat.id);
                setIsOpen(false);
              }}
              className={clsx(
                "group relative p-3 rounded-xl cursor-pointer transition-all",
                activeChatId === chat.id
                  ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-sm"
                  : "hover:bg-slate-50 border-2 border-transparent"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3
                    className={clsx(
                      "text-sm font-medium truncate",
                      activeChatId === chat.id
                        ? "text-blue-900"
                        : "text-slate-700"
                    )}
                  >
                    {chat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDate(chat.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all text-slate-400 hover:text-red-600"
                  aria-label="Delete chat"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 text-xs text-slate-400 text-center">
        {chats.length} sheeko{chats.length !== 1 ? "od" : ""}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed lg:static inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
