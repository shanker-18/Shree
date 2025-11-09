# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Shree Raga SWAAD GHAR is a React-based e-commerce web application for traditional South Indian food products (spices, mixes, pickles, etc.). The application features user authentication, shopping cart functionality, order management, and email notifications.

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion  
- **Icons**: Lucide React
- **Authentication**: Firebase Auth (with Google OAuth)
- **Database**: Supabase (with MongoDB Data API fallback)
- **Email Services**: EmailJS, SendGrid, Nodemailer
- **Deployment**: Vercel (recommended) or Render
- **Backend APIs**: Node.js/Express serverless functions

## Development Commands

```powershell
# Install dependencies
npm install

# Start development server (frontend only)
npm run dev

# Start backend server (for API development)
npm run server
npm run dev:server  # with nodemon for auto-restart

# Build for production  
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Test order creation (backend testing)
npm run test:order
npm run test:api

# Test single component/feature
npm run dev  # then navigate to specific routes like /debug/discount
```

## Architecture Overview

### Frontend Architecture

The application follows a modern React architecture with context-based state management:

**Core Contexts:**
- `AuthContext` - Manages user authentication state, profiles, and address data using Firebase Auth
- `CartContext` - Handles shopping cart operations, discount calculations, and pricing logic  
- `TempSamplesContext` - Manages free sample selections and eligibility
- `DemoContext` - Handles demo/test data for development

**Key Components Structure:**
- `src/components/` - All React components including pages and modals
- `src/contexts/` - React Context providers for global state
- `src/services/` - External API integrations (MongoDB, email services, WhatsApp)
- `src/hooks/` - Custom React hooks (popup management, sample eligibility)
- `src/data/` - Static data definitions (product categories)

### Backend Architecture

The backend uses a hybrid approach with multiple database fallbacks:

**Database Priority:**
1. Supabase (primary) - Full-featured PostgreSQL database
2. MongoDB Data API (fallback) - Via server-side proxy
3. In-memory storage (emergency fallback) - For development/testing

**API Structure:**
- `/api/index.js` - Health check and API info endpoint  
- `/api/orders.js` - Full CRUD operations for orders with multiple DB fallbacks
- `/api/whatsapp.js` - WhatsApp integration for notifications
- `/api/webhook.js` - Webhook handlers for external services

### State Management Patterns

**User Authentication Flow:**
- Firebase handles authentication 
- User profiles stored in localStorage with userId key
- Address data separately stored per user
- Production safety: clears demo data on production domains

**Shopping Cart Logic:**
- Context-based cart state with persistent localStorage
- Complex discount system: first-order 50% off, free sample 10% off
- Minimum order requirements: ₹100 (logged in) vs ₹200 (guests)
- Free sample eligibility tracking per user

**Order Processing:**
- Multi-step form: Cart → Address → Summary → Confirmation
- Order data saved to multiple databases with fallbacks
- Email notifications sent to warehouse via EmailJS/SendGrid
- WhatsApp notifications for order updates

## Important Configuration

### Environment Variables Required

```env
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
MONGODB_URI=mongodb://localhost:27017/raagaswaad

# Email Services  
EMAILJS_SERVICE_ID=service_id
EMAILJS_TEMPLATE_WAREHOUSE=template_id
EMAILJS_PUBLIC_KEY=public_key
EMAILJS_PRIVATE_KEY=private_key
SENDGRID_API_KEY=your_sendgrid_key

# Development
PORT=5001
```

### Firebase Configuration

Firebase is configured in `src/lib/firebase.ts` and handles:
- Email/password authentication
- Google OAuth with popup resolution
- User profile management  
- Email verification

### Database Schema

**Orders Collection/Table:**
- `order_id` (string) - Unique order identifier
- `user_id` (string, nullable) - Firebase user ID or null for guests  
- `guest_name`, `guest_phone`, `guest_address` - Customer details
- `items` (array) - Order line items with name/quantity
- `total_price` (number) - Final price after discounts
- `payment_status` (string) - Payment processing status
- `delivery_date` (string) - Expected delivery date
- `created_at`, `updated_at` - Timestamps

## Development Patterns

### Adding New Products

Products are defined in `src/data/categories.ts` with this structure:
```typescript
interface Category {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;        // Tailwind gradient classes
  bgColor: string;         // Background color  
  borderColor: string;     // Border color
  textColor: string;       // Text color  
  items: string[];         // Product descriptions with details
}
```

### Working with Discounts

The discount system is complex and centralized in `CartContext`:
- First-order discounts: 50% off with minimum order requirements
- Free sample discounts: 10% off when cart has both samples and paid items
- User eligibility tracked via localStorage flags
- Production cleanup removes discount flags for fresh visitors

### Email Integration

Multiple email services are configured for redundancy:
- **EmailJS** - Primary warehouse notifications  
- **SendGrid** - Transactional emails and backups
- **Nodemailer** - Server-side email fallback

Email templates should include: order details, customer info, delivery address, and item breakdown.

### Error Handling

The application implements graceful degradation:
- Database operations try Supabase → MongoDB → in-memory
- Email services have multiple fallback providers
- Frontend handles offline scenarios with localStorage
- Production domains auto-clean demo/test data

## Testing Strategies

### Manual Testing Routes

- `/debug/discount` - Debug discount calculation logic
- `/email-test` - Test email service integrations  
- Backend: `npm run test:order` and `npm run test:api`

### Key Test Scenarios

1. **User Flow**: Registration → Login → Add to Cart → Checkout → Order Confirmation
2. **Discount Logic**: First-order vs returning customer pricing
3. **Database Failover**: Test with Supabase down, MongoDB unavailable
4. **Email Delivery**: Verify warehouse notifications sent successfully  
5. **Authentication**: Google OAuth, email verification, profile updates

## Deployment Notes

### Vercel Deployment (Recommended)

The project includes `vercel.json` configuration and is optimized for Vercel's serverless functions. See `VERCEL_DEPLOYMENT.md` for detailed steps.

### Environment-Specific Behavior

Production domains (`shreeraagaswaadghar.com`) trigger automatic cleanup of demo data and discount flags to ensure fresh user experiences.

## Troubleshooting

### Common Issues

**"unrecognized configuration parameter" Supabase Error:**
Run the RLS policy fix script: `node scripts/apply_orders_fix.js`

**Email Delivery Failures:**  
Check EmailJS template configuration matches the expected variables in `SETUP.md`

**Discount Not Applying:**
Verify localStorage flags: `firstOrderDiscountClaimed`, `firstOrderDiscountUsed`, and user authentication status

**Database Connection Issues:**
Check console logs for database fallback chain: Supabase → MongoDB → in-memory storage