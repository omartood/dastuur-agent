import { v4 as uuidv4 } from 'uuid';

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'dastuur_chats';
const ACTIVE_CHAT_KEY = 'dastuur_active_chat';

/**
 * Load all chats from localStorage
 */
export function loadChats(): Chat[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const chats = JSON.parse(stored) as Chat[];
    return chats.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Error loading chats:', error);
    return [];
  }
}

/**
 * Save all chats to localStorage
 */
export function saveChats(chats: Chat[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error('Error saving chats:', error);
  }
}

/**
 * Get the active chat ID
 */
export function getActiveChatId(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(ACTIVE_CHAT_KEY);
  } catch (error) {
    console.error('Error getting active chat:', error);
    return null;
  }
}

/**
 * Set the active chat ID
 */
export function setActiveChatId(chatId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(ACTIVE_CHAT_KEY, chatId);
  } catch (error) {
    console.error('Error setting active chat:', error);
  }
}

/**
 * Create a new empty chat
 */
export function createNewChat(): Chat {
  const now = Date.now();
  return {
    id: uuidv4(),
    title: "Sheeko cusub",
    messages: [
      {
        role: "assistant",
        content: "👋 **Kusoo dhawow!** \n\nWaxaan ahay **Kaaliyaha Dastuurka**. \nMaxaan kaa caawin karaa maanta? \n\n*Tusaale: \"Qodobka 1aad maxuu ka hadlayaa?\"*"
      }
    ],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Generate a title from the first user message
 */
export function generateChatTitle(messages: Message[]): string {
  const firstUserMessage = messages.find(m => m.role === 'user');
  
  if (!firstUserMessage) {
    return "Sheeko cusub";
  }
  
  // Take first 50 characters of the first user message
  const title = firstUserMessage.content.slice(0, 50);
  return title.length < firstUserMessage.content.length ? `${title}...` : title;
}

/**
 * Update a chat's messages and title
 */
export function updateChat(chats: Chat[], chatId: string, messages: Message[]): Chat[] {
  return chats.map(chat => {
    if (chat.id === chatId) {
      return {
        ...chat,
        messages,
        title: generateChatTitle(messages),
        updatedAt: Date.now(),
      };
    }
    return chat;
  });
}

/**
 * Delete a chat by ID
 */
export function deleteChat(chats: Chat[], chatId: string): Chat[] {
  return chats.filter(chat => chat.id !== chatId);
}

/**
 * Get a chat by ID
 */
export function getChatById(chats: Chat[], chatId: string): Chat | undefined {
  return chats.find(chat => chat.id === chatId);
}
