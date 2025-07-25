# 🚀 Supabase Setup Guide for Auto-Bridge

## 📋 **Step 1: Set Up Database Schema**

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `tsmigimqbuccodyhfqpi`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Database Schema**
   - Copy the entire content from `database-schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - `users`
     - `vehicles`
     - `inquiries`
     - `sourcing`
     - `customers`
     - `orders`
     - `shipping`

## 🔐 **Step 2: Set Up Authentication**

1. **Go to Authentication Settings**
   - Click "Authentication" → "Settings" in the left sidebar

2. **Configure Email Auth**
   - Enable "Enable email confirmations" (optional for development)
   - Set "Secure email change" to false for now
   - Save changes

3. **Create Admin User**
   - Go to "Authentication" → "Users"
   - Click "Add user"
   - Email: `admin@autobridge.com`
   - Password: `admin123`
   - In "User Metadata" add: `{"role": "admin"}`
   - Click "Create user"

## 🗄️ **Step 3: Set Up Storage (Optional)**

1. **Create Storage Bucket**
   - Go to "Storage" in the left sidebar
   - Click "New bucket"
   - Name: `vehicle-images`
   - Make it public
   - Click "Create bucket"

2. **Set Storage Policies**
   - Click on the `vehicle-images` bucket
   - Go to "Policies" tab
   - Add policy for public read access

## 🔧 **Step 4: Test the Integration**

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Test Admin Login**
   - Go to: `http://localhost:3000/admin-login`
   - Use credentials:
     - Email: `admin@autobridge.com`
     - Password: `admin123`

3. **Check Dashboard**
   - You should be redirected to `/admin/dashboard`
   - The dashboard should now show real data from Supabase

## 🚨 **Troubleshooting**

### **If login doesn't work:**
1. Check browser console for errors
2. Verify the admin user was created correctly
3. Check Supabase project URL and key are correct

### **If data doesn't load:**
1. Check Row Level Security (RLS) policies
2. Verify tables have data (check Table Editor)
3. Check browser console for API errors

### **If you get CORS errors:**
1. Go to Supabase Dashboard → Settings → API
2. Add `http://localhost:3000` to allowed origins

## 📊 **What's Now Working**

✅ **Real Authentication** - No more mock login  
✅ **Database Storage** - All data persists  
✅ **Real-time Updates** - Live data changes  
✅ **Secure Access** - Role-based permissions  
✅ **Type Safety** - Full TypeScript support  

## 🎯 **Next Steps**

1. **Replace Mock Data** - Update all admin pages to use real Supabase data
2. **Add File Upload** - Implement vehicle image uploads
3. **Real-time Features** - Add live notifications
4. **Email Integration** - Set up email notifications
5. **Payment Processing** - Integrate payment gateways

## 🔗 **Useful Links**

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Supabase Docs**: https://supabase.com/docs
- **API Reference**: https://supabase.com/docs/reference/javascript

---

**Need help?** Check the browser console for errors or let me know what specific issue you're facing! 