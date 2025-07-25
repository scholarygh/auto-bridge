const { createClient } = require('@supabase/supabase-js')

// Use the same credentials as in lib/supabase.ts
const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

// For admin operations, we'll use the anon key (this should work for basic operations)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

    // 2. Check if admin_security table exists
    console.log('🔍 Checking if admin_security table exists...')
    const { data: tableCheck, error: tableError } = await supabase
      .from('admin_security')
      .select('count')
      .limit(1)

    if (tableError) {
      console.log('❌ admin_security table does not exist.')
      console.log('Please run the SQL commands in your Supabase SQL Editor first:')
      console.log('\n1. Go to your Supabase Dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Copy and run the contents of database-3fa-schema-fixed.sql')
      console.log('4. Then run this script again')
      return
    }

    console.log('✅ admin_security table exists')

    // 3. Insert or update admin security settings
    console.log('⚙️  Setting up admin security settings...')
    
    // First, try to delete any existing record
    await supabase
      .from('admin_security')
      .delete()
      .eq('user_id', adminUser.id)

    // Then insert new settings
    const { error: insertError } = await supabase
      .from('admin_security')
      .insert({
        user_id: adminUser.id,
        security_level: '3fa',
        totp_required: true,
        device_verification_required: true,
        max_login_attempts: 5,
        session_timeout_minutes: 480,
        lockout_duration_minutes: 30
      })

    if (insertError) {
      console.error('❌ Error setting up admin security:', insertError)
      console.log('This might be because the table structure is incorrect.')
      console.log('Please run the SQL commands in database-3fa-schema-fixed.sql')
      return
    }

    console.log('✅ Admin security settings configured')

    // 4. Test the setup
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