const { createClient } = require('@supabase/supabase-js')

// Use the same credentials as in lib/supabase.ts
const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setup3FAFull() {
  console.log('🔐 Setting up 3-Factor Authentication (Complete Setup)...')

  try {
    // Step 1: Sign in to get authenticated session
    console.log('\n🔑 Step 1: Authenticating...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'nanaduah09@gmail.com',
      password: 'Admin123'
    })
    
    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message)
      return
    }

    console.log('✅ Sign in successful!')
    const user = signInData.user
    console.log(`User ID: ${user.id}`)
    console.log(`Email: ${user.email}`)
    console.log(`Role: ${user.user_metadata?.role}`)

    // Step 2: Check if admin_security table exists
    console.log('\n🔒 Step 2: Checking admin_security table...')
    const { data: security, error: securityError } = await supabase
      .from('admin_security')
      .select('*')
      .limit(1)

    if (securityError) {
      console.log('❌ admin_security table does not exist.')
      console.log('Please run the SQL commands in your Supabase SQL Editor:')
      console.log('\n1. Go to your Supabase Dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Copy and run the contents of database-3fa-schema-fixed.sql')
      console.log('4. Copy and run the contents of database-fix-rls.sql')
      console.log('5. Then run this script again')
      return
    }

    console.log('✅ admin_security table exists')

    // Step 3: Check if user exists in users table
    console.log('\n👤 Step 3: Checking users table...')
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.log('❌ User not found in users table or RLS issue.')
      console.log('Please run the SQL commands in database-fix-rls.sql first.')
      return
    }

    console.log('✅ User found in users table:')
    console.log(`   ID: ${userData.id}`)
    console.log(`   Email: ${userData.email}`)
    console.log(`   Role: ${userData.role}`)

    // Step 4: Set up admin security settings
    console.log('\n⚙️  Step 4: Setting up admin security settings...')
    
    // Delete any existing settings first
    await supabase
      .from('admin_security')
      .delete()
      .eq('user_id', user.id)

    // Insert new settings
    const { error: insertError } = await supabase
      .from('admin_security')
      .insert({
        user_id: user.id,
        security_level: '3fa',
        totp_required: true,
        device_verification_required: true,
        max_login_attempts: 5,
        session_timeout_minutes: 480,
        lockout_duration_minutes: 30
      })

    if (insertError) {
      console.error('❌ Error setting up admin security:', insertError.message)
      return
    }

    console.log('✅ Admin security settings configured')

    // Step 5: Verify the setup
    console.log('\n🧪 Step 5: Verifying setup...')
    const { data: finalSecurity, error: verifyError } = await supabase
      .from('admin_security')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (verifyError) {
      console.error('❌ Error verifying setup:', verifyError.message)
      return
    }

    console.log('✅ 3FA setup completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`- Admin user: ${userData.email}`)
    console.log(`- Security level: ${finalSecurity.security_level}`)
    console.log(`- TOTP required: ${finalSecurity.totp_required}`)
    console.log(`- Device verification: ${finalSecurity.device_verification_required}`)
    console.log(`- Max login attempts: ${finalSecurity.max_login_attempts}`)
    console.log(`- Session timeout: ${finalSecurity.session_timeout_minutes} minutes`)
    console.log(`- Lockout duration: ${finalSecurity.lockout_duration_minutes} minutes`)

    // Step 6: Sign out
    await supabase.auth.signOut()
    console.log('🔓 Signed out')

    console.log('\n🎉 3FA setup complete!')
    console.log('\n🎯 Next steps:')
    console.log('1. Start the app: npm run dev')
    console.log('2. Go to: http://localhost:3000/admin/setup-3fa')
    console.log('3. Set up TOTP with your authenticator app')
    console.log('4. Test the enhanced login flow at /admin-login')

  } catch (error) {
    console.error('❌ Error setting up 3FA:', error)
  }
}

setup3FAFull() 