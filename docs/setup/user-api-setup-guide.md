# User API Setup Guide
**Required for Epic 1 - Story 1.2**  
**Estimated Time:** 1 hour  
**Prerequisite:** Valid email addresses and payment method for OpenAI

## Overview
This guide walks you through setting up all required external service accounts and API keys needed for the PDF-to-Anki Japanese Learning Tool. These are **human-only tasks** that cannot be automated and must be completed before development can begin.

---

## 🔑 **STEP 1: Google Cloud Platform Setup**
**Duration:** 20 minutes  
**Cost:** Free (within limits)

### 1.1 Create Google Cloud Account
1. **Navigate to:** [console.cloud.google.com](https://console.cloud.google.com)
2. **Sign in** with your Google account (create one if needed)
3. **Accept** Google Cloud terms of service
4. **Complete** the setup wizard (skip billing for now - free tier is sufficient)

### 1.2 Create New Project
1. **Click** the project dropdown (top left, next to "Google Cloud")
2. **Click** "New Project"
3. **Enter project name:** `PDF-Anki-Tool`
4. **Click** "Create"
5. **Wait** for project creation (30-60 seconds)
6. **Select** your new project from the dropdown

### 1.3 Enable Vision API
1. **Navigate to:** APIs & Services > Library
2. **Search for:** "Cloud Vision API"
3. **Click** on "Cloud Vision API"
4. **Click** "Enable"
5. **Wait** for API to be enabled (1-2 minutes)

### 1.4 Create Service Account
1. **Navigate to:** APIs & Services > Credentials
2. **Click** "Create Credentials" > "Service Account"
3. **Enter details:**
   - Service account name: `pdf-anki-ocr`
   - Service account ID: `pdf-anki-ocr` (auto-filled)
   - Description: `OCR processing for PDF to Anki tool`
4. **Click** "Create and Continue"
5. **Skip** role assignment (click "Continue")
6. **Skip** user access (click "Done")

### 1.5 Generate API Key
1. **Click** on your newly created service account
2. **Go to** "Keys" tab
3. **Click** "Add Key" > "Create new key"
4. **Select** "JSON" format
5. **Click** "Create"
6. **Download** the JSON file (save as `google-credentials.json`)
7. **Keep this file secure** - it contains your API credentials

### ✅ **Verification Steps:**
- [ ] Google Cloud project created and selected
- [ ] Vision API enabled
- [ ] Service account created
- [ ] JSON credentials file downloaded and saved securely
- [ ] Can access Google Cloud Console dashboard

---

## 🤖 **STEP 2: OpenAI API Setup**
**Duration:** 15 minutes  
**Cost:** Pay-per-use (estimate $10-50/month for development)

### 2.1 Create OpenAI Account
1. **Navigate to:** [platform.openai.com](https://platform.openai.com)
2. **Click** "Sign up" (or "Log in" if you have an account)
3. **Complete** registration with your email
4. **Verify** your email address
5. **Complete** phone number verification

### 2.2 Add Payment Method
1. **Navigate to:** Settings > Billing
2. **Click** "Add payment method"
3. **Enter** credit card information
4. **Set up** usage limits (recommended):
   - Soft limit: $25/month
   - Hard limit: $50/month
5. **Save** payment information

### 2.3 Generate API Key
1. **Navigate to:** API Keys section
2. **Click** "Create new secret key"
3. **Enter name:** `PDF-Anki-Tool-Dev`
4. **Set permissions:** All (default)
5. **Click** "Create secret key"
6. **Copy the key immediately** (it won't be shown again)
7. **Save securely** - you'll need this for environment variables

### 2.4 Verify GPT-4 Access
1. **Navigate to:** Settings > Limits
2. **Check** that GPT-4 models are available
3. **If not available:** You may need to add more billing credit or wait for approval

### ✅ **Verification Steps:**
- [ ] OpenAI account created and verified
- [ ] Payment method added with usage limits
- [ ] API key generated and saved securely
- [ ] GPT-4 access confirmed
- [ ] Can access OpenAI platform dashboard

---

## 🔐 **STEP 3: Clerk Authentication Setup**
**Duration:** 15 minutes  
**Cost:** Free (up to 10,000 monthly active users)

### 3.1 Create Clerk Account
1. **Navigate to:** [clerk.com](https://clerk.com)
2. **Click** "Get started for free"
3. **Sign up** with your email or GitHub account
4. **Verify** your email if required
5. **Complete** the onboarding survey (optional)

### 3.2 Create New Application
1. **Click** "Add application" or "Create Application"
2. **Enter application name:** `PDF Anki Tool`
3. **Select sign-in methods:**
   - ✅ Email
   - ✅ Google
   - ✅ GitHub
   - ❌ Phone (optional)
4. **Click** "Create application"

### 3.3 Configure Application Settings
1. **Navigate to:** Configure > Settings
2. **Set application name:** `PDF to Anki - Japanese Learning Tool`
3. **Add application logo:** (optional - can use default)
4. **Configure domains:**
   - Development: `http://localhost:3000`
   - Production: (will be added later after Vercel deployment)

### 3.4 Get API Keys
1. **Navigate to:** Configure > API Keys
2. **Copy** the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)
3. **Save both keys securely**

### ✅ **Verification Steps:**
- [ ] Clerk account created
- [ ] Application created with correct sign-in methods
- [ ] API keys copied and saved securely
- [ ] Can access Clerk dashboard
- [ ] Application settings configured

---

## 🚀 **STEP 4: Vercel Deployment Setup**
**Duration:** 10 minutes  
**Cost:** Free (Hobby plan)

### 4.1 Create Vercel Account
1. **Navigate to:** [vercel.com](https://vercel.com)
2. **Click** "Sign up"
3. **Choose** "Continue with GitHub" (recommended)
4. **Authorize** Vercel to access your GitHub account
5. **Complete** account setup

### 4.2 Connect GitHub Repository
1. **Click** "Add New..." > "Project"
2. **Import** your project repository (will be created in Epic 1)
3. **Configure** project settings:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
4. **Click** "Deploy" (will fail initially - that's expected)

### 4.3 Configure Environment Variables
**Note:** This will be done after Epic 1 Story 1.4, but prepare the interface:
1. **Navigate to:** Project Settings > Environment Variables
2. **Prepare to add** the following variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `GOOGLE_CLOUD_CREDENTIALS`

### ✅ **Verification Steps:**
- [ ] Vercel account created and connected to GitHub
- [ ] Project deployment configured (may fail initially)
- [ ] Environment variables interface accessed
- [ ] Can access Vercel dashboard

---

## 📊 **STEP 5: Supabase Database Setup**
**Duration:** 10 minutes  
**Cost:** Free (up to 500MB database)

### 5.1 Create Supabase Account
1. **Navigate to:** [supabase.com](https://supabase.com)
2. **Click** "Start your project"
3. **Sign in** with GitHub (recommended)
4. **Authorize** Supabase access

### 5.2 Create New Project
1. **Click** "New project"
2. **Select** your organization (or create one)
3. **Enter project details:**
   - Name: `pdf-anki-tool`
   - Database Password: Generate a strong password and save it
   - Region: Choose closest to your location
4. **Click** "Create new project"
5. **Wait** for project setup (2-3 minutes)

### 5.3 Get Project Credentials
1. **Navigate to:** Settings > API
2. **Copy** the following:
   - **Project URL**
   - **anon public key**
   - **service_role secret key** (keep secure)
3. **Save all credentials securely**

### 5.4 Configure Database Access
1. **Navigate to:** Settings > Database
2. **Note** the connection string (for future reference)
3. **Navigate to:** Authentication > Settings
4. **Enable** email confirmations: OFF (for development)
5. **Enable** email change confirmations: OFF (for development)

### ✅ **Verification Steps:**
- [ ] Supabase account created
- [ ] Project created and setup completed
- [ ] API keys and project URL copied
- [ ] Database connection confirmed
- [ ] Can access Supabase dashboard

---

## 📋 **FINAL CHECKLIST & HANDOFF**

### ✅ **All Services Configured:**
- [ ] Google Cloud Platform with Vision API enabled
- [ ] OpenAI account with GPT-4 access and API key
- [ ] Clerk authentication application configured
- [ ] Vercel deployment account ready
- [ ] Supabase database project created

### 📝 **Credentials Collected:**
Create a secure document with the following information:

```
=== PDF-to-Anki Tool - API Credentials ===

GOOGLE CLOUD:
- Project ID: pdf-anki-tool
- Service Account Email: pdf-anki-ocr@pdf-anki-tool.iam.gserviceaccount.com
- Credentials File: google-credentials.json (location: _______)

OPENAI:
- API Key: sk-... (starts with sk-)
- Organization ID: (if applicable)
- Usage Limits: Soft $25, Hard $50

CLERK:
- Publishable Key: pk_test_...
- Secret Key: sk_test_...
- Application ID: app_...

SUPABASE:
- Project URL: https://[project-id].supabase.co
- Anon Key: eyJ...
- Service Role Key: eyJ... (keep secure)
- Database Password: [password]

VERCEL:
- Account: Connected to GitHub
- Project: Ready for deployment
```

### 🔒 **Security Notes:**
- **Never commit API keys to git**
- **Use environment variables only**
- **Keep the credentials document secure**
- **Don't share screenshots with visible keys**
- **Regenerate keys if accidentally exposed**

### 🚨 **Common Issues & Solutions:**

**Google Cloud:**
- If Vision API quota exceeded: Check usage limits in console
- If service account permissions denied: Ensure Vision API is enabled

**OpenAI:**
- If no GPT-4 access: Add more billing credit or contact support
- If rate limited: Implement proper error handling in code

**Clerk:**
- If sign-in not working: Check domain configuration
- If webhook issues: Verify endpoint URLs

**Supabase:**
- If connection failed: Check database password
- If RLS issues: Review row-level security policies

### ✅ **Ready for Development:**
Once all credentials are collected and verified, the development team can proceed with Epic 1 Story 1.4 (Environment Configuration) to integrate these services into the application.

**Estimated Total Setup Time:** 60-90 minutes  
**Next Step:** Provide credentials to development team for Epic 1 Story 1.4
