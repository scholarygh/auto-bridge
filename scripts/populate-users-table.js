const { createClient } = require('@supabase/supabase-js')

// Use the same credentials as in lib/supabase.ts
const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function populateUsersTable() {
  console.log('👥 Populating Users Table...')

  try {
    // 1. Sign in to get user data
    console.log('🔑 Signing in to get user data...')
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

    // 2. Check if user already exists in users table
    console.log('\n🔍 Checking if user exists in users table...')
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking users table:', checkError.message)
      return
    }

    if (existingUser) {
      console.log('✅ User already exists in users table')
      console.log('User data:', existingUser)
    } else {
      console.log('📝 User not found in users table, creating...')
      
      // 3. Insert user into users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          role: user.user_metadata?.role || 'admin',
          created_at: user.created_at,
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('❌ Error inserting user:', insertError.message)
        return
      }

      console.log('✅ User created in users table!')
    }

    // 4. Verify the user now exists
    console.log('\n✅ Verifying user exists...')
    const { data: verifiedUser, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (verifyError) {
      console.error('❌ Error verifying user:', verifyError.message)
      return
    }

    console.log('✅ User verified in users table:')
    console.log(`   ID: ${verifiedUser.id}`)
    console.log(`   Email: ${verifiedUser.email}`)
    console.log(`   Role: ${verifiedUser.role}`)
    console.log(`   Created: ${verifiedUser.created_at}`)

    // 5. Sign out
    await supabase.auth.signOut()
    console.log('🔓 Signed out')

    console.log('\n🎉 Users table population complete!')
    console.log('\nNext steps:')
    console.log('1. Run: node scripts/setup-3fa-complete.js')
    console.log('2. Start the app: npm run dev')
    console.log('3. Go to: http://localhost:3000/admin/setup-3fa')

  } catch (error) {
    console.error('❌ Error populating users table:', error)
  }
}

populateUsersTable() 