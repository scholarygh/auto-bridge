# 🚨 Quick Fix for Authentication Error

## **The Issue:**
You're getting a 400 error because the admin user needs email confirmation or email confirmation needs to be disabled.

## **Solution (Choose One):**

### **Option A: Disable Email Confirmation (Easiest)**
1. Go to: https://supabase.com/dashboard/project/tsmigimqbuccodyhfqpi/auth/settings
2. Scroll down to "Email Auth"
3. **Turn OFF** "Enable email confirmations"
4. Click "Save"
5. Try logging in again with:
   - Email: `admin@autobridge.com`
   - Password: `admin123`

### **Option B: Use Email Confirmation with Custom Flow (Better UX)**
1. **Keep email confirmation enabled** in Supabase settings
2. Check your email for a confirmation link
3. Click the link - it will now redirect to: `http://localhost:3000/auth/confirm`
4. The confirmation page will show success/error feedback
5. After confirmation, you'll be redirected to login

## **Test Login:**
After doing either option above, go to: `http://localhost:3000/admin-login`

## **If Still Having Issues:**
Run this command to check the user status:
```bash
node scripts/setup-admin.js check
```

## **New Features Added:**
✅ **Custom confirmation page** at `/auth/confirm`  
✅ **Better error messages** for email confirmation  
✅ **Automatic redirect** after confirmation  
✅ **Visual feedback** during confirmation process  

---
**Recommended:** Use Option B for better user experience, or Option A for quick development. 