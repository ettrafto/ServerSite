import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create a default admin user
  const adminEmail = 'admin@evantrafton.me'
  const adminPassword = 'admin123'

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('👤 Admin user already exists')
    return
  }

  // Hash password
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash
    }
  })

  console.log('✅ Created admin user:', {
    id: admin.id,
    email: admin.email
  })
  console.log('🔑 Default credentials:')
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Password: ${adminPassword}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🌱 Database seed completed')
  })
