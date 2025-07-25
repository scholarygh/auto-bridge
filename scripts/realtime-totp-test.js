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

async function realtimeTOTPTest() {
  console.log('🔐 Real-time TOTP Test\n')
  console.log('This will continuously show the current server token.')
  console.log('When your authenticator app shows the same code, test it immediately!\n')

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

    // 3. Start real-time monitoring
    console.log('🔄 Starting real-time token monitoring...')
    console.log('Press Ctrl+C to stop\n')

    let lastToken = ''
    let lastTime = 0

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000)
      const currentToken = speakeasy.totp({
        secret: storedSecret,
        encoding: 'base32',
        time: now
      })

      const timeRemaining = 30 - (now % 30)
      const currentTime = new Date(now * 1000).toLocaleTimeString()

      // Only show if token changed
      if (currentToken !== lastToken) {
        console.clear()
        console.log('🔐 Real-time TOTP Test\n')
        console.log(`⏰ Current Time: ${currentTime}`)
        console.log(`🔄 Time Remaining: ${timeRemaining} seconds`)
        console.log(`🔢 Current Token: ${currentToken}`)
        console.log('\n📱 Check your authenticator app now!')
        console.log('   If it shows the same code, test it immediately!')
        console.log('\n🌐 Test URL: http://localhost:3000/admin/test-totp')
        console.log('\nPress Ctrl+C to stop')
        
        lastToken = currentToken
        lastTime = now
      }
    }, 1000)

    // Wait for user input to stop
    rl.question('\nPress Enter to stop monitoring...', () => {
      clearInterval(interval)
      rl.close()
      console.log('\n✅ Monitoring stopped')
    })

  } catch (error) {
    console.error('❌ Error:', error)
    rl.close()
  }
}

realtimeTOTPTest() 