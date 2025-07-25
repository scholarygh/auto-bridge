const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSpecificUser() {
  console.log('🔍 Checking your actual user account...')
  
  const userEmail = 'nanaduah09@gmail.com'
  
  try {
    // Try to sign in with your actual email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: 'admin123'
    })

    if (error) {
      console.log(`❌ Login failed for '${userEmail}': ${error.message}`)
      
      if (error.message.includes('Invalid login credentials')) {
        console.log('\n💡 The user might not exist or password is wrong')
        console.log('🔧 Let\'s create the user with your email...')
        return false
      } else if (error.message.includes('Email not confirmed')) {
        console.log('\n💡 User exists but email not confirmed')
        console.log('🔧 Check your email for confirmation link or disable email confirmation')
        return false
      }
      
      return false
    }

    console.log('✅ Login successful!')
    console.log('👤 User ID:', data.user?.id)
    console.log('📧 Email:', data.user?.email)
    console.log('🔑 Role:', data.user?.user_metadata?.role)
    console.log('✅ Confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No')
    
    // Sign out after testing
    await supabase.auth.signOut()
    return true
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

async function createUserWithYourEmail() {
  console.log('\n🚀 Creating admin user with your email...')
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'nanaduah09@gmail.com',
      password: 'admin123',
      options: {
        data: {
          role: 'admin'
        },
        emailRedirectTo: 'http://localhost:3000/auth/confirm'
      }
    })

    if (error) {
      console.error('❌ Error creating user:', error.message)
      return false
    }

    console.log('✅ User created successfully!')
    console.log('👤 User ID:', data.user?.id)
    console.log('📧 Email:', data.user?.email)
    console.log('🔑 Role:', data.user?.user_metadata?.role)
    console.log('📅 Created:', data.user?.created_at)
    console.log('✅ Confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No')
    
    if (!data.user?.email_confirmed_at) {
      console.log('\n📧 Check your email for confirmation link')
      console.log('🔗 Confirmation link will redirect to: http://localhost:3000/auth/confirm')
    }
    
    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

async function testDifferentPasswords() {
  console.log('\n🔐 Testing different passwords...')
  
  const passwords = ['admin123', 'password', '123456', 'admin', 'nanaduah09']
  const userEmail = 'nanaduah09@gmail.com'
  
  for (const password of passwords) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password
      })

      if (!error) {
        console.log(`✅ Login successful with password: '${password}'`)
        console.log('👤 User ID:', data.user?.id)
        console.log('🔑 Role:', data.user?.user_metadata?.role)
        
        await supabase.auth.signOut()
        return true
      } else {
        console.log(`❌ Password '${password}': ${error.message}`)
      }
    } catch (err) {
      console.log(`❌ Error with password '${password}': ${err.message}`)
    }
  }
  
  return false
}

async function main() {
  console.log('🔍 Checking your actual user account\n')
  
  // First try to login with your email
  const loginSuccess = await checkSpecificUser()
  
  if (!loginSuccess) {
    // Try different passwords
    const passwordSuccess = await testDifferentPasswords()
    
    if (!passwordSuccess) {
      // Create new user with your email
      console.log('\n🔧 Creating new admin user with your email...')
      await createUserWithYourEmail()
    }
  }
  
  console.log('\n📋 Summary:')
  console.log('• Your email: nanaduah09@gmail.com')
  console.log('• If login fails, check email confirmation')
  console.log('• If user doesn\'t exist, we\'ll create it')
  
  console.log('\n🔧 Next steps:')
  console.log('1. Check your email for confirmation link')
  console.log('2. Or disable email confirmation in Supabase dashboard')
  console.log('3. Try logging in with: nanaduah09@gmail.com / admin123')
}

main() 