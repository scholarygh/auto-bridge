# 🔐 3-Factor Authentication Setup Guide

Auto-Bridge now features enterprise-grade 3-factor authentication for enhanced security.

## 🎯 What is 3FA?

3-Factor Authentication combines three different types of verification:

1. **What You Know** - Password (already implemented)
2. **What You Have** - TOTP (Time-based One-Time Password) via authenticator app
3. **What You Are** - Device fingerprinting (browser/device characteristics)

## 🚀 Quick Setup

### Step 1: Database Setup

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Copy and run the contents of `database-3fa-schema-fixed.sql`**
4. **Copy and run the contents of `database-fix-rls-complete.sql`**

These files contain the corrected SQL with proper unique constraints and RLS policies that will fix all the security issues.

### Step 2: Run Setup Script

```bash
node scripts/setup-3fa-complete.js
```

### Step 3: Configure TOTP

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Go to the 3FA setup page:**
   ```
   http://localhost:3000/admin/setup-3fa
   ```

3. **Install an authenticator app:**
   - **Google Authenticator** (iOS/Android)
   - **Authy** (iOS/Android/Desktop)
   - **Microsoft Authenticator** (iOS/Android)
   - **1Password** (if you use it)

4. **Scan the QR code** or manually enter the secret key

5. **Verify the setup** by entering the 6-digit code

## 🔒 Security Features

### Login Attempt Protection
- **Max attempts:** 5 failed logins
- **Lockout duration:** 30 minutes
- **Automatic reset:** On successful login

### Device Fingerprinting
- **Canvas fingerprinting:** Browser rendering characteristics
- **WebGL fingerprinting:** Graphics card identification
- **Browser characteristics:** User agent, screen resolution, timezone
- **Automatic storage:** First device is trusted

### Audit Logging
- **All login attempts** are logged
- **Success/failure tracking**
- **IP address recording**
- **Device fingerprint storage**
- **TOTP usage tracking**

### Session Management
- **Session timeout:** 8 hours (configurable)
- **Automatic logout** on timeout
- **Device verification** on each login

## 📱 Authenticator App Setup

### Google Authenticator
1. Download from App Store/Google Play
2. Tap the "+" button
3. Choose "Scan QR code"
4. Point camera at the QR code
5. The account will appear in your list

### Authy
1. Download Authy
2. Add account
3. Scan QR code or enter secret manually
4. Verify with the generated code

### Manual Entry
If QR code doesn't work:
1. Copy the secret key from the setup page
2. In your authenticator app, choose "Enter key manually"
3. Paste the secret key
4. Set account name to "Auto-Bridge Admin"

## 🧪 Testing the Setup

### Test Login Flow
1. Go to `/admin-login`
2. Enter credentials: `nanaduah09@gmail.com` / `Admin123`
3. Enter TOTP code from your authenticator app
4. Verify device fingerprint
5. Access dashboard

### Test Security Features
- **Try wrong password:** Should increment attempt counter
- **Try wrong TOTP:** Should show error
- **Try from different device:** Should require device verification
- **Check audit logs:** Should see all attempts logged

## 🔧 Configuration Options

### Security Levels
- **Basic:** Password only
- **2FA:** Password + TOTP
- **3FA:** Password + TOTP + Device verification

### Customization
You can modify security settings in the `admin_security` table:
- `max_login_attempts`: Number of failed attempts before lockout
- `lockout_duration_minutes`: How long to lock account
- `session_timeout_minutes`: Session duration
- `totp_required`: Whether TOTP is mandatory
- `device_verification_required`: Whether device verification is mandatory

## 🚨 Troubleshooting

### Common Issues

**"TOTP not configured"**
- Make sure you completed the setup at `/admin/setup-3fa`
- Check that `totp_enabled` and `totp_verified` are `true` in the database

**"Device not recognized"**
- This is expected for new devices
- The first device is automatically trusted
- Subsequent devices require verification

**"Account locked"**
- Wait for the lockout period to expire (30 minutes)
- Or reset manually in the database: `UPDATE users SET login_attempts = 0, locked_until = NULL WHERE email = 'nanaduah09@gmail.com'`

**QR code not working**
- Use manual entry instead
- Copy the secret key and enter it manually in your authenticator app

### Database Queries

**Check user TOTP status:**
```sql
SELECT email, totp_enabled, totp_verified FROM users WHERE email = 'nanaduah09@gmail.com';
```

**Check security settings:**
```sql
SELECT * FROM admin_security WHERE user_id = (SELECT id FROM users WHERE email = 'nanaduah09@gmail.com');
```

**View login audit:**
```sql
SELECT * FROM login_audit ORDER BY login_time DESC LIMIT 10;
```

**Reset user security:**
```sql
UPDATE users SET 
  login_attempts = 0, 
  locked_until = NULL,
  totp_enabled = FALSE,
  totp_verified = FALSE
WHERE email = 'nanaduah09@gmail.com';
```

## 🎉 Success!

Once setup is complete, your Auto-Bridge admin account will have enterprise-grade security with:

- ✅ **3-factor authentication**
- ✅ **Device fingerprinting**
- ✅ **Login attempt protection**
- ✅ **Comprehensive audit logging**
- ✅ **Session management**
- ✅ **Automatic security monitoring**

Your admin dashboard is now protected by the same level of security used by major financial institutions and government systems! 