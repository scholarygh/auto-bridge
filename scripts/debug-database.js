const { createClient } = require('@supabase/supabase-js')

// Use the same credentials as in lib/supabase.ts
const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugDatabase() {
  console.log('🔍 Debugging Database...')

  try {
    // 1. List all tables
    console.log('\n📋 Checking what tables exist...')
    
    // Try to access different tables
    const tables = ['users', 'auth.users', 'profiles', 'user_profiles']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`)
        } else {
          console.log(`✅ ${table}: ${data.length} rows, columns: ${Object.keys(data[0] || {}).join(', ')}`)
        }
      } catch (e) {
        console.log(`❌ ${table}: ${e.message}`)
      }
    }

    // 2. Check auth.users (Supabase's built-in auth table)
    console.log('\n🔐 Checking auth.users...')
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      if (authError) {
        console.log('❌ Cannot access auth.users:', authError.message)
      } else {
        console.log(`✅ auth.users: ${authUsers.users.length} users`)
        authUsers.users.forEach(user => {
          console.log(`   - ${user.email} (${user.id})`)
        })
      }
    } catch (e) {
      console.log('❌ Cannot access auth.users:', e.message)
    }

    // 3. Try to sign in to see what user data we get
    console.log('\n🔑 Testing sign in...')
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'nanaduah09@gmail.com',
        password: 'Admin123'
      })
      
      if (signInError) {
        console.log('❌ Sign in failed:', signInError.message)
      } else {
        console.log('✅ Sign in successful!')
        console.log('User data:', {
          id: signInData.user.id,
          email: signInData.user.email,
          role: signInData.user.user_metadata?.role
        })
        
        // Sign out
        await supabase.auth.signOut()
      }
    } catch (e) {
      console.log('❌ Sign in error:', e.message)
    }

    // 4. Check if we can access the public.users table with specific columns
    console.log('\n👥 Checking public.users table structure...')
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, role, created_at')
        .limit(5)
      
      if (userError) {
        console.log('❌ Cannot access users table:', userError.message)
      } else {
        console.log(`✅ users table: ${userData.length} rows`)
        userData.forEach(user => {
          console.log(`   - ${user.email} (${user.id}) - ${user.role}`)
        })
      }
    } catch (e) {
      console.log('❌ users table error:', e.message)
    }

  } catch (error) {
    console.error('❌ Error debugging database:', error)
  }
}

debugDatabase() 