# CloudImage - AI-Powered Cloud Storage & Image Management

A full-stack web application for managing, organizing, and enhancing images in the cloud with AI-powered assistance.

## 🚀 البدء السريع (بالعربية)

شغّل المشروع بأمرين فقط (يتطلب Node.js 20+ و Docker):

```bash
npm run setup   # ينسخ .env، يثبّت الحزم، يشغّل قاعدة البيانات، ويضيف الحساب التجريبي
npm run dev     # يشغّل التطبيق على http://localhost:3000
```

- بيانات الدخول التجريبية: `demo@cloudimage.app` / `Demo123!`
- إن لم يكن Docker متاحًا، شغّل PostgreSQL بنفسك وعدّل `DATABASE_URL` في ملف `.env` ثم أعد `npm run setup`.
- المفاتيح الاختيارية (OpenAI و AWS) غير مطلوبة: المحادثة الذكية تعمل برد محلي تجريبي، والتخزين يعمل محليًا.
- **عبر GitHub Codespaces**: اضغط **Code ← Codespaces ← Create codespace on main**، سيتم التثبيت وتجهيز قاعدة البيانات تلقائيًا، ثم نفّذ `npm run dev`.

## 🚀 Quick Start (English)

Run the project with two commands (requires Node.js 20+ and Docker):

```bash
npm run setup   # copies .env, installs packages, starts PostgreSQL, seeds the demo account
npm run dev     # serves the app on http://localhost:3000
```

- Demo credentials: `demo@cloudimage.app` / `Demo123!`
- Without Docker, start your own PostgreSQL, update `DATABASE_URL` in `.env` and re-run `npm run setup`.
- Optional keys (OpenAI, AWS) are not required: the AI chat falls back to a local mock reply and storage stays local.
- **GitHub Codespaces**: click **Code → Codespaces → Create codespace on main**; dependencies, database and seed data are prepared automatically, then run `npm run dev`.

## JNOOOBY Frontend (Arabic, RTL)

The app ships with a modern Arabic RTL interface signed by أبو تيم:

- **الرئيسية (`/`)** — pastel gradient landing page (baby blue, soft purple, mint green) with a large welcome title, an «ابدأ الآن» button leading to the chat, and three cards: رفع الملفات، إدارة الصور، الدخول للمحادثة الذكية.
- **المحادثة الذكية (`/chat`)** — soft dark theme with transparent bubbles (light purple for the user, sky blue for the AI), a modern input bar with send, image upload, and quick commands, plus demo image upload with a per-image «تحسين الصورة» action inside glass cards.
- **الوسائط (`/media`)** — organized sections for videos (user + AI), images (user + AI with before/after), and character cards showing image, name, media count, «عرض الكل» and «إضافة وسائط جديدة», with a detail panel offering type filters, sorting, and demo enhancement tools.

All three pages are responsive, interactive locally (no backend required), and carry a small signature at the start and end of each page.

## Project Features

### 🔐 Page 1: Authentication & Profile
- User registration and login with JWT authentication
- Password hashing with bcryptjs
- Project identification card showing features overview
- Demo account credentials for testing

### 🤖 Page 2: AI Chat Assistant
- Real-time chat interface with AI assistant
- Specialized in cloud storage, image organization, and enhancement
- Conversation history storage
- Support for English and Arabic languages
- Helpful recommendations for image organization

### 📁 Page 3: Storage Management
- Beautiful gallery view for image browsing
- Project-based organization
- Drag-and-drop file upload support
- Search and filtering capabilities (by type, name, size, date)
- File metadata display
- Bulk operations support
- Storage usage statistics

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Beautiful, responsive UI
- **React Hooks** - State management

### Backend
- **Next.js API Routes** - Serverless endpoints
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Libraries
- `jsonwebtoken` - JWT generation and verification
- `bcryptjs` - Secure password hashing
- `sharp` - Image processing (ready for integration)
- `axios` - HTTP client for API calls

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── chat/
│   │   │   └── message/route.ts
│   │   ├── projects/
│   │   └── files/
│   ├── login/
│   ├── chat/
│   ├── storage/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── auth.ts
│   ├── db.ts
└── components/
prisma/
├── schema.prisma
```

## Setup Instructions

### Prerequisites
- Node.js 20+
- Docker (optional, provides PostgreSQL via `docker-compose.yml`)
- npm

### Installation

1. **Clone the repository**
   ```bash
   cd JNOOOBY
   ```

2. **Run the setup command**
   ```bash
   npm run setup
   ```
   It creates `.env` from `.env.example`, installs dependencies, starts the
   PostgreSQL container (when Docker is available), applies the Prisma schema
   and seeds the demo account.

3. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Manual environment setup (optional)

`.env` holds every supported variable; only `DATABASE_URL` is required:

```env
DATABASE_URL="postgresql://cloudimage:cloudimage@localhost:5432/cloudimage"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY=""            # optional: empty means local mock replies
OPENAI_MODEL="gpt-4o-mini"
AWS_ACCESS_KEY_ID=""         # optional: empty means local storage behaviour
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
AWS_S3_BUCKET=""
```

## Demo Credentials

For testing purposes, you can use:
- **Email:** demo@cloudimage.app
- **Password:** Demo123!

## Features in Detail

### Authentication Flow
- Users can register with email and password
- Passwords are hashed using bcryptjs (10 salt rounds)
- JWT tokens are generated upon login (7-day expiration)
- Tokens are stored in localStorage for client-side persistence

### AI Assistant
The AI assistant is pre-configured to help with:
- Cloud storage best practices
- Image organization strategies
- Photo enhancement techniques
- File naming conventions
- Folder structure optimization

*(Integrates with OpenAI API - configuration ready)*

### Storage Management
- Display images in a responsive grid gallery
- Sort by: name, size, date
- Filter by: all files, images only, documents only
- View file metadata: size, type, upload date
- Delete files
- Create and manage projects

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Chat
- `POST /api/chat/message` - Send message to AI assistant

### Projects (Ready for implementation)
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `DELETE /api/projects/:id` - Delete project

### Files (Ready for implementation)
- `GET /api/files` - List files
- `POST /api/files/upload` - Upload file
- `DELETE /api/files/:id` - Delete file
- `POST /api/files/enhance` - Enhance image

## RTL Support

The application includes full support for Right-to-Left languages (Arabic):
- CSS includes RTL utilities
- Layout system supports both LTR and RTL
- Can be toggled via the `dir` attribute on the root HTML element

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Protected API routes
- ✅ CORS enabled
- ✅ Environment variable isolation
- ✅ Input validation on forms
- ✅ SQL injection protection via Prisma ORM

## Performance Optimization

- Image lazy loading ready
- Server-side rendering with Next.js
- Responsive image handling
- Client-side caching with React hooks
- Database query optimization with Prisma

## Future Enhancements

- [ ] OpenAI/Claude API integration for real AI responses
- [ ] AWS S3 integration for cloud storage
- [ ] Image processing with Sharp library
- [ ] Advanced image enhancement features
- [ ] Social authentication (Google, GitHub)
- [ ] File sharing and permissions
- [ ] Image metadata extraction
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Collaboration features

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# One-command setup (env, deps, database, seed)
npm run setup

# Start only the PostgreSQL container
npm run db:up

# Apply the Prisma schema / seed the demo account
npm run db:push
npm run db:seed

# Run Prisma migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## Deployment

### Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@cloudimage.app or open an issue in the repository.

---

**Built with ❤️ for better image management in the cloud**
