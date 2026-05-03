/**
 * Script untuk test CleanApp Theme API endpoints
 * 
 * Usage:
 *   npx tsx scripts/test-cleanapp-api.ts
 */

async function testAPI() {
  const baseURL = 'http://localhost:3000'
  
  console.log('🧪 Testing CleanApp Theme API Endpoints...\n')

  // Test 1: GET /api/public/settings
  console.log('1️⃣ Testing GET /api/public/settings?slug=demo-cleanapp')
  try {
    const response = await fetch(`${baseURL}/api/public/settings?slug=demo-cleanapp`)
    const data = await response.json()
    
    if (response.ok) {
      console.log('   ✅ Status:', response.status)
      console.log('   ✅ Theme:', data.theme)
      console.log('   ✅ Config keys:', Object.keys(data.config || {}))
      console.log('   ✅ Hero title:', data.config?.hero?.title)
    } else {
      console.log('   ❌ Error:', data.error)
    }
  } catch (error) {
    console.log('   ❌ Request failed:', error)
  }

  console.log('\n2️⃣ Testing POST /api/orders (Valid Data)')
  try {
    const response = await fetch(`${baseURL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '081234567890',
        eventType: 'Pernikahan',
        message: 'Test message'
      })
    })
    const data = await response.json()
    
    if (response.ok) {
      console.log('   ✅ Status:', response.status)
      console.log('   ✅ Success:', data.success)
      console.log('   ✅ Message:', data.message)
      console.log('   ✅ Order ID:', data.data?.orderId)
    } else {
      console.log('   ❌ Error:', data.error)
    }
  } catch (error) {
    console.log('   ❌ Request failed:', error)
  }

  console.log('\n3️⃣ Testing POST /api/orders (Invalid Data)')
  try {
    const response = await fetch(`${baseURL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A', // Too short
        email: 'invalid-email',
        phone: '123', // Invalid format
        eventType: 'InvalidType'
      })
    })
    const data = await response.json()
    
    if (!response.ok) {
      console.log('   ✅ Status:', response.status, '(Expected 400)')
      console.log('   ✅ Validation errors:', data.errors?.length || 0, 'errors')
      console.log('   ✅ Error fields:', data.errors?.map((e: any) => e.field).join(', '))
    } else {
      console.log('   ❌ Should have failed validation')
    }
  } catch (error) {
    console.log('   ❌ Request failed:', error)
  }

  console.log('\n✨ API Testing Complete!')
  console.log('\n📝 Next Steps:')
  console.log('   1. Open http://localhost:3000/demo-cleanapp in browser')
  console.log('   2. Follow testing guide in docs/CLEANAPP_TESTING_GUIDE.md')
  console.log('   3. Test all features manually')
}

// Run tests
testAPI().catch(console.error)
