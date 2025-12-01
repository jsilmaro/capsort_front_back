const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔧 Creating new admin account...\n');

    // Admin details - You can customize these
    const adminData = {
      fullName: 'New Admin',
      contactNumber: '+639987654321',
      email: 'newadmin@capsort.com',
      password: 'NewAdmin123!',
      role: 'admin'
    };

    console.log('Creating admin with email:', adminData.email);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log('📧 Email:', adminData.email);
      console.log('\nDo you want to update the password? (You can modify this script)\n');
      
      // Uncomment below to update password
      // const hashedPassword = await bcrypt.hash(adminData.password, 12);
      // await prisma.user.update({
      //   where: { email: adminData.email },
      //   data: { password: hashedPassword }
      // });
      // console.log('✅ Password updated successfully!');
      
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        fullName: adminData.fullName,
        contactNumber: adminData.contactNumber,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    console.log('✅ Admin account created successfully!\n');
    console.log('📋 Admin Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ID:', admin.id);
    console.log('Name:', admin.fullName);
    console.log('Email:', admin.email);
    console.log('Password:', adminData.password);
    console.log('Role:', admin.role);
    console.log('Created:', admin.createdAt);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🔐 Login URL: http://localhost:3001/signstudent');
    console.log('📝 Use the Admin tab to login\n');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createAdmin();
