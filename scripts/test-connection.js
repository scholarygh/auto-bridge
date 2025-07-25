const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('vehicles').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful')
    
    // Test auth configuration
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Auth configuration issue:', authError.message)
      return false
    }
    
    console.log('✅ Auth configuration successful')
    console.log('📊 Current session:', authData.session ? 'Active' : 'None')
    
    return true
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

async function listUsers() {
  console.log('\n👥 Checking users in database...')
  
  try {
    // Note: This requires admin privileges, so we'll just test the connection
    const { data, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.log('ℹ️  Cannot list users (requires admin key)')
      console.log('💡 This is normal - we only have anon key')
      return
    }
    
    console.log('✅ Users found:', data.users?.length || 0)
    
  } catch (error) {
    console.log('ℹ️  Cannot list users (requires admin key)')
  }
}

async function main() {
  console.log('🚀 Auto-Bridge Supabase Connection Test\n')
  
  const connectionOk = await testConnection()
  
  if (connectionOk) {
    await listUsers()
    
    console.log('\n✅ All tests passed!')
    console.log('\n📋 Next steps:')
    console.log('1. Check your email for confirmation link')
    console.log('2. Click the link to confirm your account')
    console.log('3. Try logging in at: http://localhost:3000/admin-login')
    console.log('4. Or disable email confirmation in Supabase dashboard')
  } else {
    console.log('\n❌ Connection failed!')
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check your internet connection')
    console.log('2. Verify Supabase project is active')
    console.log('3. Check if database schema was created')
  }
}

main() 