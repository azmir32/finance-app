# Expense Tracker AI

A modern expense tracking application with AI-powered insights.

## Features

- 🔐 **Authentication** - Secure user authentication with Clerk
- 💰 **Expense Tracking** - Add, view, and manage expense records
- 🤖 **AI-Powered Features** - Automatic category suggestions and financial insights
- 📊 **Data Visualization** - Charts and analytics for spending patterns
- 🌙 **Dark/Light Theme** - Theme toggle functionality
- 📱 **Responsive Design** - Mobile-optimized interface
- 📱 **Progressive Web App (PWA)** - Installable app with offline support and push notifications

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI API
- **Charts**: Chart.js with react-chartjs-2
- **PWA**: Service Worker, Web App Manifest, Push Notifications
- **Testing**: Jest, React Testing Library, Playwright

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- Clerk account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Testing

This project includes comprehensive testing setup with Jest, React Testing Library, and Playwright.

### Unit and Integration Tests

Run unit and integration tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

### End-to-End Tests

Install Playwright browsers (first time only):
```bash
npx playwright install
```

Run E2E tests:
```bash
npm run test:e2e
```

Run E2E tests with UI:
```bash
npm run test:e2e:ui
```

Run E2E tests in headed mode:
```bash
npm run test:e2e:headed
```

### Test Structure

```
├── __tests__/
│   ├── components/          # Component tests
│   ├── actions/            # Server action tests
│   └── utils/              # Test utilities
├── tests/
│   └── e2e/               # End-to-end tests
├── jest.config.js         # Jest configuration
├── jest.setup.js          # Jest setup
└── playwright.config.ts   # Playwright configuration
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Progressive Web App (PWA)

This application is built as a Progressive Web App with the following features:

### PWA Features
- **Installable**: Can be installed on desktop and mobile devices
- **Offline Support**: Works offline with cached resources
- **Push Notifications**: Real-time notifications for expense alerts and insights
- **App-like Experience**: Standalone window with native app feel

### PWA Setup

1. **Icons**: Add PWA icons to `/public/icons/` directory (see `/public/icons/placeholder.txt`)
2. **Screenshots**: Add app screenshots to `/public/screenshots/` directory
3. **VAPID Keys**: For push notifications, add these environment variables:
   ```env
   VAPID_EMAIL="your-email@example.com"
   VAPID_PRIVATE_KEY="your-vapid-private-key"
   NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-vapid-public-key"
   ```

### Testing PWA

1. **Browser Testing**: Use the PWA test script in browser console
2. **Installation**: Look for install prompt in browser address bar
3. **Offline Testing**: Disconnect internet and test functionality
4. **Push Notifications**: Use the PWA components to test notifications

### PWA Files
- `app/manifest.ts` - Web App Manifest
- `public/sw.js` - Service Worker
- `app/actions.ts` - Push notification actions
- `app/components/PwaComponents.tsx` - PWA UI components

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `VAPID_EMAIL` | Email for VAPID push notifications | No |
| `VAPID_PRIVATE_KEY` | VAPID private key for push notifications | No |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | VAPID public key for push notifications | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.

<!-- Force rebuild for Vercel deployment -->