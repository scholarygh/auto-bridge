const speakeasy = require('speakeasy')
const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')

const supabaseUrl = 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function quickTOTPTest() {
  console.log('🔐 Quick TOTP Test\n')

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
    console.log('✅ TOTP secret found\n')

    // 3. Generate current token
    const now = Math.floor(Date.now() / 1000)
    const currentToken = speakeasy.totp({
      secret: storedSecret,
      encoding: 'base32',
      time: now
    })

    const timeRemaining = 30 - (now % 30)
    const currentTime = new Date(now * 1000).toLocaleTimeString()

    console.log('📱 Current Server Token:')
    console.log(`   Token: ${currentToken}`)
    console.log(`   Time: ${currentTime}`)
    console.log(`   Remaining: ${timeRemaining} seconds`)
    console.log('\n🔍 Check your authenticator app now!')
    console.log('   If it shows the same code, we can test it.')

    // 4. Ask user what their app shows
    rl.question('\n📱 What code does your authenticator app show? ', async (userToken) => {
      console.log(`\n🔍 Testing your token: ${userToken}`)
      console.log(`🔍 Against server token: ${currentToken}`)

      // 5. Test verification
      const verified = speakeasy.totp.verify({
        secret: storedSecret,
        encoding: 'base32',
        token: userToken,
        window: 3
      })

      console.log(`\n🎯 Verification Result: ${verified ? '✅ VALID' : '❌ INVALID'}`)

      if (verified) {
        console.log('✅ Your token is valid! The issue is in the web app.')
        console.log('\n🌐 Test the web app now:')
        console.log('   Go to: http://localhost:3000/admin/test-totp')
        console.log(`   Enter: ${userToken}`)
        console.log('   Check browser console for logs')
      } else {
        console.log('❌ Your token is invalid. Possible issues:')
        console.log('   - Time synchronization problem')
        console.log('   - Secret mismatch')
        console.log('   - Token expired')
      }

      rl.close()
    })

  } catch (error) {
    console.error('❌ Error:', error)
    rl.close()
  }
}

quickTOTPTest() 