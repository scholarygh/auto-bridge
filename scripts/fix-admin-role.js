const { createClient } = require('@supabase/supabase-js')

// Use the same credentials as in lib/supabase.ts
const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixAdminRole() {
  console.log('🔧 Fixing Admin Role...')

  try {
    // 1. Sign in to get current user data
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
    console.log('Current user data:')
    console.log(`  ID: ${user.id}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Current metadata:`, user.user_metadata)
    console.log(`  Current role: ${user.user_metadata?.role}`)

    // 2. Update user metadata to ensure admin role
    console.log('\n🔧 Updating user metadata...')
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      data: {
        role: 'admin'
      }
    })

    if (updateError) {
      console.error('❌ Error updating user metadata:', updateError.message)
      return
    }

    console.log('✅ User metadata updated!')
    console.log('New user data:')
    console.log(`  ID: ${updateData.user.id}`)
    console.log(`  Email: ${updateData.user.email}`)
    console.log(`  New metadata:`, updateData.user.user_metadata)
    console.log(`  New role: ${updateData.user.user_metadata?.role}`)

    // 3. Verify the update by getting the session again
    console.log('\n🔍 Verifying update...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Error getting session:', sessionError.message)
      return
    }

    console.log('✅ Session verification:')
    console.log(`  User: ${session?.user?.email}`)
    console.log(`  Role: ${session?.user?.user_metadata?.role}`)
    console.log(`  Is Admin: ${session?.user?.user_metadata?.role === 'admin'}`)

    // 4. Sign out
    await supabase.auth.signOut()
    console.log('🔓 Signed out')

    console.log('\n🎉 Admin role fix complete!')
    console.log('\n🎯 Next steps:')
    console.log('1. Start the app: npm run dev')
    console.log('2. Go to: http://localhost:3000/admin-login')
    console.log('3. Sign in with: nanaduah09@gmail.com / Admin123')
    console.log('4. You should now be recognized as admin and redirected to dashboard')

  } catch (error) {
    console.error('❌ Error fixing admin role:', error)
  }
}

fixAdminRole() 