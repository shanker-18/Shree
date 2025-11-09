# Shree Raga SWAAD GHAR

A React-based web application built with Vite, TypeScript, and Tailwind CSS.

## Features

- Modern React with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons

- MongoDB Data API for order storage
- Local storage fallback for offline functionality

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment

### Render

This project is configured for deployment on Render. The deployment uses:

- Node.js 20.18.0
- Build command: `npm ci && npm run build`
- Start command: `npm start` (serves static files from `dist` directory)

### Vercel (Recommended)

The project is configured for deployment on Vercel with the included `vercel.json` file. For detailed deployment instructions, see the [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) guide.

Key features of the Vercel deployment:
- Automatic HTTPS and CDN
- Serverless functions for the backend API
- Environment variable management
- Continuous deployment from Git

## Service Configuration



### MongoDB Data API Setup

The application uses MongoDB Data API for order storage with local storage fallback:

1. Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and enable the Data API
3. Create a database named `raagaswaad` with a collection named `orders`
4. Generate an API key and update the configuration in `src/services/mongodb.ts`:
   ```typescript
   const MONGODB_DATA_API_URL = 'https://data.mongodb-api.com/app/data-api/endpoint/data/v1/action';
   const MONGODB_API_KEY = 'YOUR_MONGODB_DATA_API_KEY';
   const MONGODB_DATA_SOURCE = 'YOUR_CLUSTER_NAME';
   ```

## Supabase Setup (Legacy)

### Fixing RLS Policy Issues

If you encounter the error `unrecognized configuration parameter "app.current_user_id"` when creating orders, you need to fix the Row Level Security (RLS) policies for the orders table:

1. Add your Supabase service key to the `.env` file:
   ```
   SUPABASE_SERVICE_KEY=your_service_key_here
   ```

2. Run the fix script:
   ```bash
   node scripts/apply_orders_fix.js
   ```

This script will apply the correct RLS policies to the orders table, allowing both authenticated users and guests to create orders.

## Project Structure

```
src/
├── components/     # React components
├── App.tsx        # Main app component
├── main.tsx       # App entry point
└── index.css      # Global styles

public/            # Static assets
dist/              # Production build output
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
