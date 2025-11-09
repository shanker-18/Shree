# Vercel Deployment Guide for Shree Raaga SWAAD GHAR

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. [Git](https://git-scm.com/) installed on your computer
3. [Node.js](https://nodejs.org/) (v16 or later) installed on your computer
4. [Vercel CLI](https://vercel.com/cli) (optional but recommended)

## Setup

### 1. Prepare Your Project

Your project has been configured with a `vercel.json` file that tells Vercel how to build and deploy your application. This configuration handles:

- Building the React frontend
- Setting up the Node.js backend
- Configuring routes for the API and frontend

### 2. Environment Variables

You'll need to set up the following environment variables in your Vercel project:

#### MongoDB Connection
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/raagaswaad
```

#### EmailJS Configuration
```
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_WAREHOUSE=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_TEMPLATE_WAREHOUSE=your_warehouse_template_id
VITE_EMAILJS_TEMPLATE_CUSTOMER=your_customer_template_id
VITE_WAREHOUSE_EMAIL=warehouse@example.com
```

#### Firebase Configuration
The Firebase configuration is already included in the code, but if you need to use a different Firebase project, update the `src/lib/firebase.ts` file.

## Deployment Options

### Option 1: Deploy with Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the prompts to set up your project. When asked about environment variables, you can either:
   - Set them up during the CLI process
   - Skip and add them later in the Vercel dashboard

5. Once deployed, Vercel will provide you with a URL to access your application.

### Option 2: Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Log in to your [Vercel dashboard](https://vercel.com/dashboard).

3. Click "New Project".

4. Import your repository.

5. Configure your project:
   - Framework Preset: Select "Other"
   - Build Command: Leave as default (it will use the one in vercel.json)
   - Output Directory: Leave as default (it will use the one in vercel.json)
   - Install Command: `npm install`

6. Add the environment variables listed above in the "Environment Variables" section.

7. Click "Deploy".

## Post-Deployment

### Checking Your Deployment

1. Once deployed, Vercel will provide you with a URL to access your application.

2. Verify that both the frontend and backend are working correctly:
   - Frontend: Visit the provided URL
   - Backend: Visit `{your-url}/api/orders` (should return JSON data or an appropriate response)

### Troubleshooting

If you encounter issues with your deployment:

1. Check the Vercel deployment logs in your dashboard.

2. Verify that all environment variables are set correctly.

3. For MongoDB connection issues:
   - Ensure your MongoDB Atlas cluster has network access rules that allow connections from Vercel's IP ranges
   - Verify your connection string is correct

4. For EmailJS issues:
   - Verify your API keys and template IDs
   - Check that your templates are set up correctly in the EmailJS dashboard

## Custom Domain Setup (Optional)

1. In your Vercel dashboard, go to your project settings.

2. Navigate to the "Domains" tab.

3. Add your custom domain and follow the verification steps.

4. Update your DNS settings as instructed by Vercel.

## Continuous Deployment

Vercel automatically sets up continuous deployment from your Git repository. Any changes pushed to your main branch will trigger a new deployment.

To change this behavior or set up preview deployments for other branches, configure the Git settings in your Vercel project dashboard.