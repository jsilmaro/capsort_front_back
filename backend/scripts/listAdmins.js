const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAdmins() {
  try {
    console.log('\n🔍 Fetching all admin accounts...\n');

    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: {
        id: true,
        fullName: true,
        email: true,
        contactNumber: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (admins.length === 0) {
      console.log('⚠️  No admin accounts found in the database.\n');
      return;
    }

    console.log(`📋 Found ${admins.length} Admin Account(s):\n`);
    
    admins.forEach((admin, index) => {
      console.log(`Admin #${index + 1}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('ID:', admin.id);
      console.log('Name:', admin.fullName);
      console.log('Email:', admin.email);
      console.log('Contact:', admin.contactNumber);
      console.log('Created:', admin.createdAt.toLocaleString());
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    });

    console.log('🔐 Login URL: http://localhost:3001/signstudent');
    console.log('📝 Use the Admin tab to login\n');

  } catch (error) {
    console.error('❌ Error fetching admins:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
listAdmins();
