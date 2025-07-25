const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

async function debugSession() {
  console.log('🔍 Debugging Session State...\n')

  try {
    // 1. Check current session
    console.log('1️⃣ Checking current session...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError.message)
    } else if (session) {
      console.log('✅ Session found:')
      console.log(`   User ID: ${session.user.id}`)
      console.log(`   Email: ${session.user.email}`)
      console.log(`   Role: ${session.user.user_metadata?.role}`)
      console.log(`   Created: ${session.user.created_at}`)
      console.log(`   Last Sign In: ${session.user.last_sign_in_at}`)
      console.log(`   Session Expires: ${new Date(session.expires_at * 1000).toLocaleString()}`)
      console.log(`   Access Token: ${session.access_token ? 'Present' : 'Missing'}`)
      console.log(`   Refresh Token: ${session.refresh_token ? 'Present' : 'Missing'}`)
    } else {
      console.log('❌ No session found')
    }

    // 2. Check if we can sign in
    console.log('\n2️⃣ Testing sign in...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'nanaduah09@gmail.com',
      password: 'Admin123'
    })

    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message)
    } else {
      console.log('✅ Sign in successful:')
      console.log(`   User: ${signInData.user?.email}`)
      console.log(`   Role: ${signInData.user?.user_metadata?.role}`)
      console.log(`   Session: ${signInData.session ? 'Created' : 'Missing'}`)
    }

    // 3. Check session again after sign in
    console.log('\n3️⃣ Checking session after sign in...')
    const { data: { session: newSession }, error: newSessionError } = await supabase.auth.getSession()
    
    if (newSessionError) {
      console.error('❌ New session error:', newSessionError.message)
    } else if (newSession) {
      console.log('✅ New session found:')
      console.log(`   User: ${newSession.user.email}`)
      console.log(`   Role: ${newSession.user.user_metadata?.role}`)
      console.log(`   Expires: ${new Date(newSession.expires_at * 1000).toLocaleString()}`)
    } else {
      console.log('❌ Still no session after sign in')
    }

    // 4. Check user in database
    console.log('\n4️⃣ Checking user in database...')
    if (signInData.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', signInData.user.id)
        .single()

      if (userError) {
        console.error('❌ Database user error:', userError.message)
      } else if (userData) {
        console.log('✅ User found in database:')
        console.log(`   ID: ${userData.id}`)
        console.log(`   Email: ${userData.email}`)
        console.log(`   Role: ${userData.role}`)
        console.log(`   Created: ${userData.created_at}`)
      } else {
        console.log('❌ User not found in database')
      }
    }

    // 5. Test admin security settings
    console.log('\n5️⃣ Checking admin security settings...')
    if (signInData.user) {
      const { data: securityData, error: securityError } = await supabase
        .from('admin_security')
        .select('*')
        .eq('user_id', signInData.user.id)
        .single()

      if (securityError && securityError.code !== 'PGRST116') {
        console.error('❌ Security settings error:', securityError.message)
      } else if (securityData) {
        console.log('✅ Security settings found:')
        console.log(`   Security Level: ${securityData.security_level}`)
        console.log(`   TOTP Required: ${securityData.totp_required}`)
        console.log(`   Device Verification: ${securityData.device_verification_required}`)
      } else {
        console.log('❌ No security settings found')
      }
    }

    // 6. Sign out
    console.log('\n6️⃣ Signing out...')
    await supabase.auth.signOut()
    console.log('✅ Signed out')

  } catch (error) {
    console.error('❌ Debug error:', error)
  }
}

debugSession() 