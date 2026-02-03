# 🇸🇴 Dastuur Agent - Somali Constitution AI Assistant

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=flat&logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)

An intelligent AI-powered assistant that helps users understand and navigate the Somali Provisional Constitution. Built with Next.js, Google Gemini, and Memvid AI.

![Dastuur Agent](https://img.shields.io/badge/Status-Active-success)

---

## ✨ Features

### 🤖 **AI-Powered Constitutional Assistant**

- Natural language understanding in Somali
- Accurate answers based on the Somali Provisional Constitution
- Context-aware responses using RAG technology

### 💬 **Advanced Chat Interface**

- **Multi-chat support** - Create and manage multiple conversation threads
- **Chat history** - Persistent storage using localStorage
- **Sidebar navigation** - Easy access to all your conversations
- **Real-time responses** - Streaming AI responses with loading indicators
- **Markdown support** - Rich text formatting in responses

### 🎨 **Premium UI/UX**

- Modern, glassmorphic design
- Smooth animations and transitions
- Responsive layout for all devices
- Dark mode ready
- Accessible and user-friendly interface

### 🔍 **Intelligent Search**

- Hybrid search combining vector embeddings and keyword matching
- Special optimization for article number queries (e.g., "Qodobka 3aad")
- Contextual relevance scoring
- Top-K retrieval for accurate results

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/omartood/Dastuur-agent-.git
   cd Dastuur-agent-
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Prepare the knowledge base**

   Place your Somali Constitution PDF in the `pdf/` directory:

   ```
   pdf/Dastuurka_KMG_Soomaaliya.pdf
   ```

5. **Generate embeddings**

   Run the ingestion script to process the PDF and create embeddings:

   ```bash
   npm run ingest
   ```

   This will:
   - Extract text from the PDF
   - Split content into chunks
   - Generate embeddings using Google Gemini
   - Store the vector database in `data/store.json`

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
dastur-agents/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   └── ask/                  # Chat endpoint
│   ├── components/               # React components
│   │   └── Sidebar.tsx          # Chat history sidebar
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main chat interface
├── lib/                          # Core libraries
│   ├── chatStorage.ts           # Chat persistence utilities
│   ├── gemini.ts                # Gemini API integration
│   └── memvid.ts                # Vector search & RAG
├── scripts/                      # Utility scripts
│   ├── ingest.ts                # PDF ingestion & embedding
│   ├── test-search.ts           # Search testing utility
│   └── ...
├── data/                         # Generated data
│   └── store.json               # Vector database
├── pdf/                          # Source documents
│   └── Dastuurka_KMG_Soomaaliya.pdf
├── .env                          # Environment variables
├── package.json                  # Dependencies
├── tsconfig.json                # TypeScript config
└── README.md                     # This file
```

---

## 🛠️ Technology Stack

### Frontend

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - Markdown rendering

### AI & Backend

- **[Google Gemini AI](https://ai.google.dev/)** - Large language model
- **[Memvid AI](https://github.com/omartood/memvid)** - Intelligent vector search & RAG pipeline
- **[pdf-parse](https://www.npmjs.com/package/pdf-parse)** - PDF text extraction
- **Custom RAG Implementation** - Context-aware retrieval
- **Vector Embeddings** - Semantic search with cosine similarity

### Storage

- **LocalStorage** - Client-side chat persistence
- **JSON Store** - Vector database storage

---

## 🧠 How It Works

### 1. **Document Ingestion**

```typescript
// scripts/ingest.ts
1. Load PDF → Extract text
2. Split into semantic chunks
3. Generate embeddings via Gemini
4. Store in vector database
```

### 2. **Query Processing**

```typescript
// app/api/ask/route.ts
1. User asks question
2. Generate query embedding
3. Search vector database (hybrid: vector + keyword)
4. Retrieve top-K relevant chunks
5. Send to Gemini with context
6. Return AI-generated answer
```

### 3. **Hybrid Search Algorithm**

```typescript
// lib/memvid.ts
Score = (0.6 × Vector_Similarity) + (0.4 × Keyword_Match)
+ Special boost for article number queries
```

---

## 📝 Available Scripts

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `npm run dev`    | Start development server            |
| `npm run build`  | Build for production                |
| `npm start`      | Start production server             |
| `npm run lint`   | Run ESLint                          |
| `npm run ingest` | Process PDF and generate embeddings |

---

## 🔧 Configuration

### Adjusting Search Parameters

Edit `lib/memvid.ts` to customize:

```typescript
// Number of results to retrieve
const topK = 5;

// Vector vs Keyword weighting
score = cosine * 0.6 + kwScore * 0.4;

// Chunk size for document splitting
const chunkSize = 1000;
```

### Customizing the UI

- **Colors**: Edit `tailwind.config.ts`
- **Styles**: Modify `app/globals.css`
- **Components**: Update files in `app/components/`

---

## 🌟 Key Features Explained

### **Multi-Chat Support**

Users can create multiple conversation threads, each with its own history. Chats are automatically saved and can be switched between seamlessly.

### **Intelligent Article Search**

The system recognizes Somali article patterns (e.g., "Qodobka 3aad") and applies special scoring to ensure the correct article is retrieved, not just table of contents entries.

### **Context-Aware Responses**

Using RAG, the AI retrieves relevant sections from the constitution before generating answers, ensuring accuracy and grounding in the actual document.

### **Persistent Chat History**

All conversations are saved in the browser's localStorage, allowing users to return to previous discussions anytime.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Omar Tood**

- GitHub: [@omartood](https://github.com/omartood)

---

## 🙏 Acknowledgments

- Google Gemini AI for providing the language model
- The Somali government for making the constitution publicly available
- The open-source community for amazing tools and libraries

---

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Contact the maintainer

---

## 🔮 Future Enhancements

- [ ] Multi-language support (English, Arabic)
- [ ] Voice input/output
- [ ] Export chat history
- [ ] Share conversations
- [ ] Advanced search filters
- [ ] Mobile app version
- [ ] Offline mode
- [ ] User authentication
- [ ] Cloud sync for chat history

---

<div align="center">

**Made with ❤️ for the Somali people**

⭐ Star this repo if you find it helpful!

</div>
