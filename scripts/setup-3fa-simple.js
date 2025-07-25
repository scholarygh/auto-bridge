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
    // 1. Get admin user first
    console.log('👤 Finding admin user...')
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', 'nanaduah09@gmail.com')

    if (userError || !users || users.length === 0) {
      console.error('❌ Admin user not found. Please create the user first.')
      console.log('Run: node scripts/test-correct-login.js to create the user')
      return
    }

    const adminUser = users[0]
    console.log(`✅ Found admin user: ${adminUser.email}`)

    // 2. Insert admin security settings
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
      console.log('This might be because the admin_security table doesn\'t exist yet.')
      console.log('Please run the SQL commands in your Supabase SQL Editor first:')
      console.log('\n1. Go to your Supabase Dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Run the contents of database-3fa-schema.sql')
      console.log('4. Then run this script again')
      return
    }

    console.log('✅ Admin security settings configured')

    // 3. Test the setup
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