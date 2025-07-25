const { createClient } = require('@supabase/supabase-js')

// Use the same credentials as in lib/supabase.ts
const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabase() {
  console.log('🔍 Checking Database Structure for 3FA...')

  try {
    // 1. Check if users table exists and has the right structure
    console.log('\n📋 Checking users table...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (usersError) {
      console.error('❌ Error accessing users table:', usersError)
      return
    }

    console.log('✅ Users table exists')
    console.log('📊 Users table columns:', Object.keys(users[0] || {}))

    // 2. Check for specific user
    console.log('\n👤 Checking for admin user...')
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'nanaduah09@gmail.com')
      .single()

    if (adminError) {
      console.error('❌ Error finding admin user:', adminError)
      return
    }

    if (!adminUser) {
      console.error('❌ Admin user not found')
      return
    }

    console.log('✅ Admin user found:')
    console.log(`   ID: ${adminUser.id}`)
    console.log(`   Email: ${adminUser.email}`)
    console.log(`   Role: ${adminUser.role}`)

    // 3. Check if admin_security table exists
    console.log('\n🔒 Checking admin_security table...')
    const { data: security, error: securityError } = await supabase
      .from('admin_security')
      .select('*')
      .limit(1)

    if (securityError) {
      console.log('❌ admin_security table does not exist or is not accessible')
      console.log('Error:', securityError.message)
      console.log('\n📝 You need to run the SQL commands in your Supabase SQL Editor:')
      console.log('1. Go to your Supabase Dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Copy and run the contents of database-3fa-schema-fixed.sql')
      return
    }

    console.log('✅ admin_security table exists')
    if (security.length > 0) {
      console.log('📊 admin_security table columns:', Object.keys(security[0]))
    }

    // 4. Check if login_audit table exists
    console.log('\n📊 Checking login_audit table...')
    const { data: audit, error: auditError } = await supabase
      .from('login_audit')
      .select('*')
      .limit(1)

    if (auditError) {
      console.log('❌ login_audit table does not exist or is not accessible')
      console.log('Error:', auditError.message)
    } else {
      console.log('✅ login_audit table exists')
      if (audit.length > 0) {
        console.log('📊 login_audit table columns:', Object.keys(audit[0]))
      }
    }

    // 5. Check existing security settings for admin user
    console.log('\n⚙️  Checking existing security settings...')
    const { data: existingSecurity, error: existingError } = await supabase
      .from('admin_security')
      .select('*')
      .eq('user_id', adminUser.id)
      .single()

    if (existingError) {
      console.log('ℹ️  No existing security settings found')
    } else {
      console.log('✅ Existing security settings found:')
      console.log(`   Security Level: ${existingSecurity.security_level}`)
      console.log(`   TOTP Required: ${existingSecurity.totp_required}`)
      console.log(`   Device Verification: ${existingSecurity.device_verification_required}`)
    }

    console.log('\n🎯 Database check complete!')
    console.log('\nNext steps:')
    if (securityError) {
      console.log('1. Run the SQL commands in database-3fa-schema-fixed.sql')
      console.log('2. Run: node scripts/setup-3fa-complete.js')
    } else {
      console.log('1. Run: node scripts/setup-3fa-complete.js')
      console.log('2. Start the app: npm run dev')
      console.log('3. Go to: http://localhost:3000/admin/setup-3fa')
    }

  } catch (error) {
    console.error('❌ Error checking database:', error)
  }
}

checkDatabase() 