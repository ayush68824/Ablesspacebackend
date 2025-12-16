require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query test successful:', result)
    
    await prisma.$disconnect()
    console.log('✅ Disconnected successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Connection failed:')
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

testConnection()



