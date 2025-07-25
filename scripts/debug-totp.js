const speakeasy = require('speakeasy')
const QRCode = require('qrcode')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugTOTP() {
  console.log('🔐 Debugging TOTP Setup and Verification...\n')

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

    // 2. Generate TOTP secret
    console.log('\n2️⃣ Generating TOTP secret...')
    const secret = speakeasy.generateSecret({
      name: `Auto-Bridge Admin (${user.email})`,
      issuer: 'Auto-Bridge',
      length: 32
    })

    console.log('✅ Secret generated:')
    console.log(`   Base32: ${secret.base32}`)
    console.log(`   OTPAuth URL: ${secret.otpauth_url}`)

    // 3. Generate QR code
    console.log('\n3️⃣ Generating QR code...')
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url)
    console.log('✅ QR code generated')

    // 4. Store secret in database
    console.log('\n4️⃣ Storing secret in database...')
    const { error: updateError } = await supabase
      .from('users')
      .update({
        totp_secret: secret.base32,
        totp_enabled: true
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('❌ Failed to store secret:', updateError.message)
      return
    }

    console.log('✅ Secret stored in database')

    // 5. Generate test tokens
    console.log('\n5️⃣ Generating test tokens...')
    const currentToken = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32'
    })

    const previousToken = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      time: Math.floor(Date.now() / 1000) - 30
    })

    const nextToken = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      time: Math.floor(Date.now() / 1000) + 30
    })

    console.log('✅ Test tokens generated:')
    console.log(`   Current: ${currentToken}`)
    console.log(`   Previous: ${previousToken}`)
    console.log(`   Next: ${nextToken}`)

    // 6. Test verification with different windows
    console.log('\n6️⃣ Testing verification...')
    
    // Test current token
    const verifyCurrent = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: currentToken,
      window: 0
    })
    console.log(`   Current token (window 0): ${verifyCurrent ? '✅ Valid' : '❌ Invalid'}`)

    const verifyCurrentWindow1 = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: currentToken,
      window: 1
    })
    console.log(`   Current token (window 1): ${verifyCurrentWindow1 ? '✅ Valid' : '❌ Invalid'}`)

    // Test previous token
    const verifyPrevious = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: previousToken,
      window: 1
    })
    console.log(`   Previous token (window 1): ${verifyPrevious ? '✅ Valid' : '❌ Invalid'}`)

    // Test next token
    const verifyNext = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: nextToken,
      window: 1
    })
    console.log(`   Next token (window 1): ${verifyNext ? '✅ Valid' : '❌ Invalid'}`)

    // 7. Test with window 2 (what we use in the app)
    console.log('\n7️⃣ Testing with window 2...')
    const verifyCurrentWindow2 = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: currentToken,
      window: 2
    })
    console.log(`   Current token (window 2): ${verifyCurrentWindow2 ? '✅ Valid' : '❌ Invalid'}`)

    const verifyPreviousWindow2 = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: previousToken,
      window: 2
    })
    console.log(`   Previous token (window 2): ${verifyPreviousWindow2 ? '✅ Valid' : '❌ Invalid'}`)

    const verifyNextWindow2 = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: nextToken,
      window: 2
    })
    console.log(`   Next token (window 2): ${verifyNextWindow2 ? '✅ Valid' : '❌ Invalid'}`)

    // 8. Test invalid token
    console.log('\n8️⃣ Testing invalid token...')
    const verifyInvalid = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: '123456',
      window: 2
    })
    console.log(`   Invalid token (123456): ${verifyInvalid ? '❌ Should be invalid' : '✅ Correctly invalid'}`)

    // 9. Get stored secret from database
    console.log('\n9️⃣ Retrieving secret from database...')
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('totp_secret, totp_enabled')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('❌ Failed to retrieve secret:', userError.message)
    } else {
      console.log('✅ Secret retrieved from database:')
      console.log(`   Stored secret: ${userData.totp_secret}`)
      console.log(`   TOTP enabled: ${userData.totp_enabled}`)
      console.log(`   Secrets match: ${userData.totp_secret === secret.base32 ? '✅ Yes' : '❌ No'}`)
    }

    console.log('\n🎯 Instructions:')
    console.log('1. Scan the QR code with your authenticator app')
    console.log('2. Use the current token shown above for testing')
    console.log('3. Try the verification in the app with window 2')

  } catch (error) {
    console.error('❌ Debug error:', error)
  }
}

debugTOTP() 