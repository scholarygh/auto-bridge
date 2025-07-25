const { authenticator } = require('otplib')
const QRCode = require('qrcode')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function regenerateTOTP() {
  console.log('🔐 Regenerating TOTP with otplib...\n')

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

    // 2. Generate new TOTP secret with otplib
    console.log('\n2️⃣ Generating new TOTP secret...')
    const secret = authenticator.generateSecret()
    console.log('✅ New secret generated:', secret)

    // 3. Generate QR code
    console.log('\n3️⃣ Generating QR code...')
    const qrCodeUrl = await QRCode.toDataURL(authenticator.keyuri(user.email, 'Auto-Bridge', secret))
    console.log('✅ QR code generated')

    // 4. Store new secret in database
    console.log('\n4️⃣ Storing new secret in database...')
    const { error: updateError } = await supabase
      .from('users')
      .update({
        totp_secret: secret,
        totp_enabled: true,
        totp_verified: false
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('❌ Failed to store secret:', updateError.message)
      return
    }

    console.log('✅ New secret stored in database')

    // 5. Generate current token
    console.log('\n5️⃣ Generating current token...')
    const currentToken = authenticator.generate(secret)
    console.log('✅ Current token:', currentToken)

    // 6. Test verification
    console.log('\n6️⃣ Testing verification...')
    const verified = authenticator.verify({
      token: currentToken,
      secret: secret
    })
    console.log('✅ Verification result:', verified)

    console.log('\n🎯 TOTP Regeneration Complete!')
    console.log('📱 Scan the QR code with your authenticator app')
    console.log('🔢 Current token for testing:', currentToken)
    console.log('\n🌐 Test URL: http://localhost:3000/admin/debug-totp')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

regenerateTOTP() 