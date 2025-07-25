# 🌍 Environment Variables Setup Guide

## **Required Environment Variables for Auto-Bridge**

### **1. Supabase Configuration**
These are the most important variables for your app to function:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tsmigimqbuccodyhfqpi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### **2. Optional AI Features**
For PDF extraction and AI features:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### **3. Additional Security (Optional)**
For enhanced security features:

```bash
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-domain.vercel.app
```

## **🚀 How to Set Environment Variables in Vercel**

### **Method 1: Vercel Dashboard (Recommended)**

1. **Go to your Vercel Dashboard**
2. **Select your Auto-Bridge project**
3. **Go to Settings → Environment Variables**
4. **Add each variable:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://tsmigimqbuccodyhfqpi.supabase.co`
   - **Environment**: Production, Preview, Development
5. **Repeat for all variables**
6. **Redeploy your project**

### **Method 2: Vercel CLI**

```bash
# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Redeploy
vercel --prod
```

## **🔐 Security Notes**

- **NEXT_PUBLIC_** variables are exposed to the browser
- **Service Role Key** should be kept secret (server-side only)
- **Never commit environment variables to Git**
- **Use different keys for development and production**

## **✅ Verification**

After setting environment variables:

1. **Redeploy your project**
2. **Test all features that use Supabase**
3. **Check browser console for any errors**
4. **Verify admin login works**
5. **Test image uploads and form submissions**

## **🆘 Troubleshooting**

### **Common Issues:**

1. **"Supabase client not initialized"**
   - Check if environment variables are set correctly
   - Verify the URL and key are valid

2. **"Authentication failed"**
   - Ensure service role key is set for admin features
   - Check if RLS policies are configured

3. **"Image upload failed"**
   - Verify storage bucket permissions
   - Check if storage policies are set up

### **Testing Commands:**

```bash
# Test Supabase connection
curl -X GET "https://tsmigimqbuccodyhfqpi.supabase.co/rest/v1/vehicles?select=*" \
  -H "apikey: your_anon_key" \
  -H "Authorization: Bearer your_anon_key"
```

## **📞 Support**

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Test Supabase connection directly
4. Check browser console for errors 