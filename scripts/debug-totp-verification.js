const speakeasy = require('speakeasy')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugTOTPVerification() {
  console.log('🔐 Debugging TOTP Verification Step by Step...\n')

  try {
    // 1. Sign in to get user
    console.log('1️⃣ Signing in...')
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

    // 2. Get the stored secret from database
    console.log('\n2️⃣ Getting stored secret from database...')
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('totp_secret, totp_enabled')
      .eq('id', user.id)
      .single()

    if (userError || !userData?.totp_secret) {
      console.error('❌ No TOTP secret found:', userError?.message || 'No secret in database')
      return
    }

    const storedSecret = userData.totp_secret
    console.log('✅ Stored secret found:', storedSecret)
    console.log('✅ TOTP enabled:', userData.totp_enabled)

    // 3. Generate current token with the stored secret
    console.log('\n3️⃣ Generating current token...')
    const currentToken = speakeasy.totp({
      secret: storedSecret,
      encoding: 'base32'
    })
    console.log('✅ Current token generated:', currentToken)

    // 4. Test verification with the exact same logic as the web app
    console.log('\n4️⃣ Testing verification with web app logic...')
    
    // This is the exact same logic as ThreeFactorAuth.verifyTOTP
    const verified = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: currentToken,
      window: 3 // Same as web app
    })

    console.log('✅ Verification result:', verified)

    // 5. Test with different windows
    console.log('\n5️⃣ Testing with different windows...')
    const window0 = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: currentToken,
      window: 0
    })
    console.log('   Window 0:', window0)

    const window1 = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: currentToken,
      window: 1
    })
    console.log('   Window 1:', window1)

    const window2 = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: currentToken,
      window: 2
    })
    console.log('   Window 2:', window2)

    const window3 = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: currentToken,
      window: 3
    })
    console.log('   Window 3:', window3)

    // 6. Generate tokens for different time periods
    console.log('\n6️⃣ Generating tokens for different time periods...')
    const now = Math.floor(Date.now() / 1000)
    const tokenNow = speakeasy.totp({
      secret: storedSecret,
      encoding: 'base32',
      time: now
    })
    const tokenPrev = speakeasy.totp({
      secret: storedSecret,
      encoding: 'base32',
      time: now - 30
    })
    const tokenNext = speakeasy.totp({
      secret: storedSecret,
      encoding: 'base32',
      time: now + 30
    })

    console.log('   Current time:', new Date(now * 1000).toLocaleString())
    console.log('   Token (now):', tokenNow)
    console.log('   Token (prev):', tokenPrev)
    console.log('   Token (next):', tokenNext)

    // 7. Test verification with all tokens
    console.log('\n7️⃣ Testing verification with all tokens...')
    const verifyNow = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: tokenNow,
      window: 3
    })
    console.log('   Verify (now):', verifyNow)

    const verifyPrev = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: tokenPrev,
      window: 3
    })
    console.log('   Verify (prev):', verifyPrev)

    const verifyNext = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: tokenNext,
      window: 3
    })
    console.log('   Verify (next):', verifyNext)

    // 8. Test with a known invalid token
    console.log('\n8️⃣ Testing with invalid token...')
    const verifyInvalid = speakeasy.totp.verify({
      secret: storedSecret,
      encoding: 'base32',
      token: '123456',
      window: 3
    })
    console.log('   Verify (invalid):', verifyInvalid)

    console.log('\n🎯 Summary:')
    console.log(`   Stored Secret: ${storedSecret}`)
    console.log(`   Current Token: ${currentToken}`)
    console.log(`   Verification Result: ${verified}`)
    console.log(`   All tokens should be valid with window 3`)

    console.log('\n📱 Next Steps:')
    console.log('1. Use the current token above in your authenticator app')
    console.log('2. Compare it with what your app shows')
    console.log('3. If they match, the issue is in the web app logic')
    console.log('4. If they don\'t match, there\'s a secret mismatch')

  } catch (error) {
    console.error('❌ Debug error:', error)
  }
}

debugTOTPVerification() 