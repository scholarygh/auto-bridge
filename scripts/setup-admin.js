const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdminUser() {
  console.log('🚀 Creating admin user...')
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@autobridge.com',
      password: 'admin123',
      options: {
        data: {
          role: 'admin'
        },
        emailRedirectTo: 'http://localhost:3000/auth/confirm'
      }
    })

    if (error) {
      console.error('❌ Error creating admin user:', error.message)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('📧 Check your email to confirm the account')
    console.log('🔗 Confirmation link will redirect to: http://localhost:3000/auth/confirm')
    console.log('👤 User ID:', data.user?.id)
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

async function checkExistingUser() {
  console.log('🔍 Checking if admin user exists...')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@autobridge.com',
      password: 'admin123'
    })

    if (error) {
      console.log('❌ User not found or invalid credentials')
      console.log('💡 Run: node scripts/setup-admin.js create')
      return false
    }

    console.log('✅ Admin user exists and credentials are valid!')
    console.log('👤 User ID:', data.user?.id)
    console.log('🔑 Role:', data.user?.user_metadata?.role)
    return true
    
  } catch (error) {
    console.error('❌ Error checking user:', error)
    return false
  }
}

async function main() {
  const command = process.argv[2]
  
  if (command === 'create') {
    await createAdminUser()
  } else if (command === 'check') {
    await checkExistingUser()
  } else {
    console.log('📋 Usage:')
    console.log('  node scripts/setup-admin.js check   - Check if admin user exists')
    console.log('  node scripts/setup-admin.js create  - Create admin user')
    console.log('')
    console.log('🔧 First, make sure you have:')
    console.log('  1. Run the database schema in Supabase SQL Editor')
    console.log('  2. Disabled email confirmation in Auth Settings')
  }
}

main() 