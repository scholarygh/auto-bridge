const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  console.log('Please ensure you have:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setup3FA() {
  console.log('🔐 Setting up 3-Factor Authentication...')

  try {
    // 1. Add 3FA fields to users table
    console.log('📝 Adding 3FA fields to users table...')
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_secret TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_enabled BOOLEAN DEFAULT FALSE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_verified BOOLEAN DEFAULT FALSE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_ip INET;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_device TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS security_questions JSONB;
      `
    })

    if (alterError) {
      console.log('⚠️  Some columns may already exist, continuing...')
    }

    // 2. Create admin_security table
    console.log('🔒 Creating admin_security table...')
    const { error: securityError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_security (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          security_level TEXT CHECK (security_level IN ('basic', '2fa', '3fa')) DEFAULT 'basic',
          totp_required BOOLEAN DEFAULT FALSE,
          device_verification_required BOOLEAN DEFAULT FALSE,
          ip_whitelist TEXT[],
          allowed_devices JSONB,
          session_timeout_minutes INTEGER DEFAULT 480,
          max_login_attempts INTEGER DEFAULT 5,
          lockout_duration_minutes INTEGER DEFAULT 30,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (securityError) {
      console.log('⚠️  admin_security table may already exist, continuing...')
    }

    // 3. Create login_audit table
    console.log('📊 Creating login_audit table...')
    const { error: auditError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS login_audit (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          ip_address INET,
          user_agent TEXT,
          device_fingerprint TEXT,
          success BOOLEAN,
          failure_reason TEXT,
          totp_used BOOLEAN DEFAULT FALSE,
          device_verified BOOLEAN DEFAULT FALSE,
          location_data JSONB
        );
      `
    })

    if (auditError) {
      console.log('⚠️  login_audit table may already exist, continuing...')
    }

    // 4. Create indexes
    console.log('📈 Creating indexes...')
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_users_totp_enabled ON users(totp_enabled);
        CREATE INDEX IF NOT EXISTS idx_login_audit_user_time ON login_audit(user_id, login_time);
        CREATE INDEX IF NOT EXISTS idx_admin_security_user ON admin_security(user_id);
      `
    })

    if (indexError) {
      console.log('⚠️  Some indexes may already exist, continuing...')
    }

    // 5. Enable RLS on new tables
    console.log('🔐 Enabling Row Level Security...')
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE admin_security ENABLE ROW LEVEL SECURITY;
        ALTER TABLE login_audit ENABLE ROW LEVEL SECURITY;
      `
    })

    if (rlsError) {
      console.log('⚠️  RLS may already be enabled, continuing...')
    }

    // 6. Create RLS policies
    console.log('📋 Creating RLS policies...')
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Admin access all security" ON admin_security;
        CREATE POLICY "Admin access all security" ON admin_security FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
        
        DROP POLICY IF EXISTS "Admin access all audit" ON login_audit;
        CREATE POLICY "Admin access all audit" ON login_audit FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
      `
    })

    if (policyError) {
      console.log('⚠️  Some policies may already exist, continuing...')
    }

    // 7. Get admin user
    console.log('👤 Finding admin user...')
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', 'nanaduah09@gmail.com')

    if (userError || !users || users.length === 0) {
      console.error('❌ Admin user not found. Please create the user first.')
      return
    }

    const adminUser = users[0]
    console.log(`✅ Found admin user: ${adminUser.email}`)

    // 8. Insert admin security settings
    console.log('⚙️  Setting up admin security settings...')
    const { error: insertError } = await supabase
      .from('admin_security')
      .upsert({
        user_id: adminUser.id,
        security_level: '3fa',
        totp_required: true,
        device_verification_required: true,
        max_login_attempts: 5,
        session_timeout_minutes: 480,
        lockout_duration_minutes: 30
      }, {
        onConflict: 'user_id'
      })

    if (insertError) {
      console.error('❌ Error setting up admin security:', insertError)
      return
    }

    console.log('✅ Admin security settings configured')

    // 9. Test the setup
    console.log('🧪 Testing 3FA setup...')
    const { data: security, error: testError } = await supabase
      .from('admin_security')
      .select('*')
      .eq('user_id', adminUser.id)
      .single()

    if (testError) {
      console.error('❌ Error testing setup:', testError)
      return
    }

    console.log('✅ 3FA setup completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`- Admin user: ${adminUser.email}`)
    console.log(`- Security level: ${security.security_level}`)
    console.log(`- TOTP required: ${security.totp_required}`)
    console.log(`- Device verification: ${security.device_verification_required}`)
    console.log(`- Max login attempts: ${security.max_login_attempts}`)
    console.log(`- Session timeout: ${security.session_timeout_minutes} minutes`)
    console.log(`- Lockout duration: ${security.lockout_duration_minutes} minutes`)

    console.log('\n🎯 Next steps:')
    console.log('1. Run the app: npm run dev')
    console.log('2. Go to: http://localhost:3000/admin/setup-3fa')
    console.log('3. Set up TOTP with your authenticator app')
    console.log('4. Test the enhanced login flow')

  } catch (error) {
    console.error('❌ Error setting up 3FA:', error)
  }
}

setup3FA() 