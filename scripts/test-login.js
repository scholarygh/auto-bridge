const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
  console.log('🔐 Testing admin login...')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@autobridge.com',
      password: 'admin123'
    })

    if (error) {
      console.error('❌ Login failed:', error.message)
      
      if (error.message.includes('Email not confirmed')) {
        console.log('\n💡 Solution: Disable email confirmation in Supabase dashboard')
        console.log('   Go to: https://supabase.com/dashboard/project/tsmigimqbuccodyhfqpi/auth/settings')
        console.log('   Turn OFF "Enable email confirmations"')
      } else if (error.message.includes('Invalid login credentials')) {
        console.log('\n💡 Solution: Create admin user first')
        console.log('   Run: node scripts/setup-admin.js create')
      }
      
      return false
    }

    console.log('✅ Login successful!')
    console.log('👤 User ID:', data.user?.id)
    console.log('🔑 Role:', data.user?.user_metadata?.role)
    console.log('📧 Email:', data.user?.email)
    
    // Test sign out
    await supabase.auth.signOut()
    console.log('✅ Sign out successful')
    
    return true
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Auto-Bridge Login Test\n')
  
  const loginOk = await testLogin()
  
  if (loginOk) {
    console.log('\n🎉 Login test passed!')
    console.log('✅ Your authentication is working correctly')
  } else {
    console.log('\n❌ Login test failed!')
    console.log('🔧 Follow the suggested solutions above')
  }
}

main() 