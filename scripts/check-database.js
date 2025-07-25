const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabaseTables() {
  console.log('🗄️  Checking database tables...')
  
  try {
    // Check if tables exist
    const tables = ['users', 'vehicles', 'inquiries', 'customers', 'sourcing', 'shipping', 'orders']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true })
        
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`)
        } else {
          console.log(`✅ Table '${table}': Exists`)
        }
      } catch (err) {
        console.log(`❌ Table '${table}': Not found`)
      }
    }
  } catch (error) {
    console.error('❌ Error checking tables:', error.message)
  }
}

async function checkAuthUsers() {
  console.log('\n👥 Checking authentication users...')
  
  try {
    // Try to get current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ Session error:', sessionError.message)
    } else {
      console.log('📊 Current session:', sessionData.session ? 'Active' : 'None')
    }

    // Try to sign in with different emails to see what exists
    const testEmails = [
      'admin@autobridge.com',
      'admin@example.com',
      'test@autobridge.com'
    ]

    for (const email of testEmails) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'admin123'
        })

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            console.log(`❌ User '${email}': Not found`)
          } else if (error.message.includes('Email not confirmed')) {
            console.log(`⚠️  User '${email}': Exists but not confirmed`)
          } else {
            console.log(`❌ User '${email}': ${error.message}`)
          }
        } else {
          console.log(`✅ User '${email}': Login successful`)
          console.log(`   ID: ${data.user?.id}`)
          console.log(`   Role: ${data.user?.user_metadata?.role}`)
          console.log(`   Confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}`)
          
          // Sign out after testing
          await supabase.auth.signOut()
        }
      } catch (err) {
        console.log(`❌ Error testing '${email}': ${err.message}`)
      }
    }
  } catch (error) {
    console.error('❌ Error checking auth users:', error.message)
  }
}

async function checkUsersTable() {
  console.log('\n👤 Checking users table (if exists)...')
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      console.log('❌ Users table error:', error.message)
    } else {
      console.log(`✅ Users table has ${data?.length || 0} records`)
      if (data && data.length > 0) {
        data.forEach((user, index) => {
          console.log(`   ${index + 1}. ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`)
        })
      }
    }
  } catch (error) {
    console.log('❌ Users table not accessible or not found')
  }
}

async function createSimpleUser() {
  console.log('\n🚀 Creating a simple admin user...')
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@autobridge.com',
      password: 'admin123',
      options: {
        data: {
          role: 'admin'
        }
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
    
    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

async function main() {
  console.log('🔍 Auto-Bridge Database Inspection\n')
  
  await checkDatabaseTables()
  await checkAuthUsers()
  await checkUsersTable()
  
  console.log('\n📋 Summary:')
  console.log('• If tables don\'t exist, run the database schema first')
  console.log('• If users don\'t exist, we need to create them')
  console.log('• If email confirmation is enabled, disable it in Supabase dashboard')
  
  console.log('\n🔧 Quick fixes:')
  console.log('1. Run database schema: Copy database-schema.sql to Supabase SQL Editor')
  console.log('2. Disable email confirmation: Supabase Dashboard → Auth → Settings')
  console.log('3. Create admin user: node scripts/setup-admin.js create')
}

main() 