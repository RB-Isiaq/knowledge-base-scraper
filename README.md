# 🔍 Knowledge Base Scraper

A powerful web scraping application for extracting and organizing content from blogs, websites, and PDFs into your knowledge base. Built with Next.js frontend and Node.js backend.

## ✨ Features

### 🌐 Web Scraping

- **Single URL Scraping** - Extract content from individual blog posts or articles
- **Bulk URL Processing** - Scrape multiple URLs with concurrency control
- **Substack Support** - Handle newsletter modals and subscription prompts
- **Smart Content Detection** - Automatically detect blog listings vs individual articles

### 📄 PDF Processing

- **PDF Upload & Processing** - Extract text from PDF files
- **Intelligent Chunking** - Automatically split content by chapters or sections
- **Metadata Extraction** - Extract author, title, and other metadata

### 🎯 Content Processing

- **Markdown Conversion** - Clean HTML to Markdown transformation
- **Code Block Detection** - Preserve and format code snippets
- **Content Cleaning** - Remove navigation, ads, and irrelevant content
- **Multiple Content Types** - Support for blogs, guides, tutorials, books

### 🚀 Modern Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript, Puppeteer, Cheerio
- **Deployment**: Vercel (both frontend and backend)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (Next.js)     │───▶│   (Express)     │───▶│   Websites      │
│                 │    │                 │    │   & PDFs        │
│ • Web Interface │    │ • Scraping APIs │    │                 │
│ • File Upload   │    │ • PDF Processing│    │ • Blogs         │
│ • Results View  │    │ • Content Clean │    │ • Substack      │
└─────────────────┘    └─────────────────┘    │ • Any Website   │
                                              └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd knowledge-base-scraper
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

```bash
# Frontend environment
cd frontend
cp .env.example .env
# Edit .env with your configuration

# Backend environment (if needed)
cd ../backend
# Add any required environment variables
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Open Application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)
- API Documentation: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

## 💻 Development

### Available Scripts

#### Backend

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
```

#### Frontend

```bash
npm run dev         # Start Next.js development server
npm run build       # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

### Development Workflow

1. **Backend Development**

   - API routes in `backend/routes/`
   - Business logic in `backend/services/`
   - Controllers in `backend/controllers/`
   - Middleware in `backend/middleware/`

2. **Frontend Development**

   - Pages in `frontend/app/`
   - Components in `frontend/components/`
   - Hooks in `frontend/hooks/`
   - Services in `frontend/services/`

3. **Testing**
   - Test scraping with various websites
   - Upload different PDF formats
   - Verify markdown output quality

## 📚 API Documentation

### Interactive Documentation

- **Swagger UI**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- **Postman Collection**: `backend/postman/Web-Scraper-API.postman_collection.json`

### Quick API Reference

#### Scrape Single URL

```bash
POST /api/scrape-url
Content-Type: application/json

{
  "url": "https://example.com/blog",
  "team_id": "your-team-id",
  "user_id": "your-user-id"
}
```

#### Scrape Multiple URLs

```bash
POST /api/scrape-bulk
Content-Type: application/json

{
  "urls": ["https://site1.com", "https://site2.com"],
  "team_id": "your-team-id",
  "user_id": "your-user-id"
}
```

#### Process PDF

```bash
POST /api/scrape-pdf
Content-Type: multipart/form-data

pdf: <file>
team_id: your-team-id
user_id: your-user-id
```

## 📁 Project Structure

```
knowledge-base-scraper/
├── backend/               # Express.js API server
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── docs/              # API documentation
│   ├── interface/         # TypeScript interfaces
│   ├── logic/             # Core scraping logic
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   ├── server.ts          # Main server file
│   ├── package.json       # Backend dependencies
│   └── vercel.json        # Vercel deployment config
│
├── frontend/              # Next.js web application
│   ├── app/               # Next.js 13+ app directory
│   ├── components/        # React components
│   ├── layouts/           # UI widgets
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── public/            # Static assets
│   ├── services/          # API service functions
│   ├── package.json       # Frontend dependencies
│   └── next.config.ts     # Next.js configuration
│
└── README.md              # This file
```

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Web Scraping**: Puppeteer, Cheerio
- **PDF Processing**: pdf-parse
- **HTML to Markdown**: Turndown
- **Documentation**: Swagger/OpenAPI

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier (recommended)
- **Type Checking**: TypeScript
- **Process Manager**: Nodemon

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Follow existing code style
- Test with multiple websites/PDFs

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

_Happy scraping! 🕷️_
