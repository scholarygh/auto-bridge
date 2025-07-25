const speakeasy = require('speakeasy')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSpecificToken() {
  console.log('🔐 Testing specific token: 058843\n')

  try {
    // 1. Sign in to get user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'nanaduah09@gmail.com',
      password: 'Admin123'
    })

    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message)
      return
    }

    const user = signInData.user
    console.log('✅ Sign in successful:', user.email)

    // 2. Get the stored secret
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('totp_secret')
      .eq('id', user.id)
      .single()

    if (userError || !userData?.totp_secret) {
      console.error('❌ No TOTP secret found')
      return
    }

    const storedSecret = userData.totp_secret
    console.log('✅ Stored secret found')

    // 3. Test the specific token with different windows
    const tokenToTest = '058843'
    console.log(`🔍 Testing token: ${tokenToTest}`)

    const window0 = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: tokenToTest,
      window: 0
    })
    console.log(`   Window 0: ${window0}`)

    const window1 = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: tokenToTest,
      window: 1
    })
    console.log(`   Window 1: ${window1}`)

    const window2 = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: tokenToTest,
      window: 2
    })
    console.log(`   Window 2: ${window2}`)

    const window3 = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: tokenToTest,
      window: 3
    })
    console.log(`   Window 3: ${window3}`)

    const window4 = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: tokenToTest,
      window: 4
    })
    console.log(`   Window 4: ${window4}`)

    console.log('\n🎯 Result:')
    if (window3) {
      console.log('✅ Token 058843 should be accepted with window 3')
    } else {
      console.log('❌ Token 058843 is not being accepted with window 3')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testSpecificToken() 