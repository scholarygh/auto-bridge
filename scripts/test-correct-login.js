const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testCorrectLogin() {
  console.log('🔐 Testing login with correct credentials...')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'nanaduah09@gmail.com',
      password: 'Admin123'
    })

    if (error) {
      console.error('❌ Login failed:', error.message)
      
      if (error.message.includes('Email not confirmed')) {
        console.log('\n💡 Solution: Check your email for confirmation link')
        console.log('   Or disable email confirmation in Supabase dashboard')
      } else if (error.message.includes('Invalid login credentials')) {
        console.log('\n💡 Solution: Double-check email and password')
      }
      
      return false
    }

    console.log('✅ Login successful!')
    console.log('👤 User ID:', data.user?.id)
    console.log('📧 Email:', data.user?.email)
    console.log('🔑 Role:', data.user?.user_metadata?.role)
    console.log('✅ Confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No')
    console.log('📅 Created:', data.user?.created_at)
    
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
  console.log('🚀 Testing Login with Correct Credentials\n')
  
  const loginSuccess = await testCorrectLogin()
  
  if (loginSuccess) {
    console.log('\n🎉 Login test passed!')
    console.log('✅ Your credentials are working correctly')
    console.log('\n📋 You can now log in at: http://localhost:3000/admin-login')
    console.log('   Email: nanaduah09@gmail.com')
    console.log('   Password: Admin123')
  } else {
    console.log('\n❌ Login test failed!')
    console.log('🔧 Follow the suggested solutions above')
  }
}

main() 