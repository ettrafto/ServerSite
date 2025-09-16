"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    // Create a default admin user
    const adminEmail = 'admin@evantrafton.me';
    const adminPassword = 'admin123';
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });
    if (existingAdmin) {
        console.log('👤 Admin user already exists');
        return;
    }
    // Hash password
    const passwordHash = await bcrypt_1.default.hash(adminPassword, 12);
    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            passwordHash
        }
    });
    console.log('✅ Created admin user:', {
        id: admin.id,
        email: admin.email
    });
    console.log('🔑 Default credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
}
main()
    .catch((e) => {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('❌ Seed failed:', msg);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    console.log('🌱 Database seed completed');
});
