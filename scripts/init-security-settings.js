const { createClient } = require('@supabase/supabase-js')

// Use the same credentials as in lib/supabase.ts
const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function initSecuritySettings() {
  console.log('🔐 Initializing Security Settings...')

  try {
    // 1. Sign in to get authenticated session
    console.log('🔑 Signing in...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'nanaduah09@gmail.com',
      password: 'Admin123'
    })
    
    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message)
      return
    }

    const user = signInData.user
    console.log('✅ Sign in successful!')
    console.log(`User ID: ${user.id}`)

    // 2. Initialize admin security settings
    console.log('\n⚙️  Setting up admin security settings...')
    const { error: upsertError } = await supabase
      .from('admin_security')
      .upsert({
        user_id: user.id,
        security_level: '3fa',
        totp_required: true,
        device_verification_required: true,
        max_login_attempts: 5,
        session_timeout_minutes: 480,
        lockout_duration_minutes: 30
      }, {
        onConflict: 'user_id'
      })

    if (upsertError) {
      console.error('❌ Error setting up security settings:', upsertError.message)
      return
    }

    console.log('✅ Admin security settings initialized')

    // 3. Verify the settings
    console.log('\n🧪 Verifying settings...')
    const { data: security, error: verifyError } = await supabase
      .from('admin_security')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (verifyError) {
      console.error('❌ Error verifying settings:', verifyError.message)
      return
    }

    console.log('✅ Security settings verified:')
    console.log(`  Security Level: ${security.security_level}`)
    console.log(`  TOTP Required: ${security.totp_required}`)
    console.log(`  Device Verification: ${security.device_verification_required}`)
    console.log(`  Max Login Attempts: ${security.max_login_attempts}`)
    console.log(`  Session Timeout: ${security.session_timeout_minutes} minutes`)
    console.log(`  Lockout Duration: ${security.lockout_duration_minutes} minutes`)

    // 4. Sign out
    await supabase.auth.signOut()
    console.log('🔓 Signed out')

    console.log('\n🎉 Security settings initialization complete!')
    console.log('\n🎯 Next steps:')
    console.log('1. Start the app: npm run dev')
    console.log('2. Go to: http://localhost:3000/admin/security')
    console.log('3. Set up TOTP using the "Setup TOTP" button')
    console.log('4. Configure additional security policies as needed')

  } catch (error) {
    console.error('❌ Error initializing security settings:', error)
  }
}

initSecuritySettings() 