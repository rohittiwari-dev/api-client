# 🚀 Api Studio

A modern, powerful API testing and development tool built with Next.js 16 and React 19. Test, debug, and manage your APIs with a beautiful, intuitive interface.

![Api Studio](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🔐 Comprehensive Authentication Support

Full support for all major authentication methods with server-side processing for maximum reliability:

| Auth Type        | Description        | Features              |
| ---------------- | ------------------ | --------------------- |
| **Basic Auth**   | Username/Password  | Base64 encoding       |
| **Bearer Token** | JWT/API tokens     | Direct token usage    |
| **API Key**      | Key-Value pairs    | Header or Query param |
| **Digest Auth**  | Challenge-response | MD5 hash computation  |
| **OAuth 1.0**    | 3-legged auth      | HMAC-SHA1 signatures  |
| **OAuth 2.0**    | Modern OAuth       | Multiple grant types  |

- ✅ Server-side auth processing (no browser crypto issues)
- ✅ Required field indicators with helpful tooltips
- ✅ Environment variable support in all auth fields

### 📋 Request Management

- **Multiple HTTP Methods**: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- **Request Body Types**:
  - JSON with syntax highlighting
  - Form Data (including file uploads)
  - URL Encoded
  - Raw text
- **Headers Management**: Add, edit, enable/disable headers
- **Query Parameters**: Visual parameter builder
- **Request History**: Track all your requests

### 📦 Workspaces & Collections

- **Workspaces**: Organize projects separately
- **Collections**: Group related requests
- **Folders**: Hierarchical organization
- **Drag & Drop**: Reorder with ease

### 🌍 Environment Variables

- **Multiple Environments**: Dev, Staging, Production, etc.
- **Variable Substitution**: Use `{{variable}}` syntax anywhere
- **Auto-complete**: Smart suggestions while typing
- **Secret Masking**: Hide sensitive values

### 🍪 Cookie Management

- **Automatic Cookie Handling**: Parse and store cookies from responses
- **Cookie Jar**: View all stored cookies by domain
- **Cookie Attributes**: See HttpOnly, Secure, SameSite, Partitioned flags
- **3rd Party Detection**: Identify cross-site cookies

### 📊 Response Viewer

- **Syntax Highlighting**: JSON, XML, HTML, and more
- **Multiple Views**: Pretty, Raw, Preview
- **Response Headers**: Full header inspection
- **Timing Information**: Request duration and size
- **Status Indicators**: Visual status code display

### 🎨 Modern UI/UX

- **Dark/Light Mode**: System-aware theming
- **Resizable Panels**: Customize your workspace
- **Keyboard Shortcuts**: Ctrl+Enter to send, Ctrl+S to save
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Works on all screen sizes

## 🛠️ Tech Stack

| Category          | Technology                 |
| ----------------- | -------------------------- |
| **Framework**     | Next.js 16 (App Router)    |
| **UI Library**    | React 19                   |
| **Styling**       | Tailwind CSS 4             |
| **Components**    | Radix UI Primitives        |
| **State**         | Zustand                    |
| **Data Fetching** | TanStack Query             |
| **Database**      | PostgreSQL + Prisma ORM    |
| **Auth**          | Better Auth                |
| **Animations**    | Framer Motion              |
| **Icons**         | Lucide React, Tabler Icons |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Redis (optional, for caching)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rohittiwari-dev/api-client.git
   cd api-client
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/api_studio"
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**

   ```bash
   bun run db:push
   # or
   npx prisma db push
   ```

5. **Start the development server**

   ```bash
   bun run dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🐳 Self-Hosting

Want to deploy your own instance? Check out the [Self-Hosting Guide](SELF_HOSTING.md) for Docker and VPS deployment instructions.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── proxy/         # Request proxy (handles auth)
│   ├── workspace/         # Workspace pages
│   └── (auth)/            # Auth pages
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── modules/              # Feature modules
│   ├── authentication/   # User auth
│   ├── collections/      # Collection management
│   ├── cookies/          # Cookie handling
│   ├── environment/      # Env variables
│   ├── requests/         # Request builder
│   ├── response/         # Response viewer
│   └── workspace/        # Workspace management
├── lib/                  # Utilities
└── store/               # Global state
```

## 🔧 Key Components

### Proxy API (`/api/proxy`)

All requests are routed through a server-side proxy that:

- Handles CORS issues
- Computes authentication headers (MD5, HMAC-SHA1)
- Manages cookies
- Provides accurate timing

### Auth Component

Comprehensive authentication UI with:

- Required field markers (red asterisks)
- Helpful tooltips and descriptions
- Environment variable support
- Visual configuration for all auth types

### Request Builder

Full-featured request configuration:

- Method selection with color coding
- URL with environment variable support
- Tabbed interface for params, headers, body, auth

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Lucide](https://lucide.dev/) for icons
- [Postman](https://www.postman.com/) for inspiration

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/rohittiwari-dev">Rohit Tiwari</a>
</p>
