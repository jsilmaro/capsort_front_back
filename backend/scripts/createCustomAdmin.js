const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createCustomAdmin() {
  try {
    console.log('🔧 Create New Admin Account\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Get admin details from user
    const fullName = await question('Full Name: ');
    const contactNumber = await question('Contact Number (e.g., +639123456789): ');
    const email = await question('Email: ');
    const password = await question('Password (min 6 chars, uppercase, lowercase, number): ');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Validate inputs
    if (!fullName || !contactNumber || !email || !password) {
      console.log('❌ All fields are required!');
      rl.close();
      return;
    }

    // Validate password
    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters long!');
      rl.close();
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      console.log('❌ Password must contain uppercase, lowercase, and number!');
      rl.close();
      return;
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log('❌ An account with this email already exists!');
      console.log('📧 Email:', email);
      rl.close();
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    console.log('💾 Creating admin account...');
    const admin = await prisma.user.create({
      data: {
        fullName,
        contactNumber,
        email,
        password: hashedPassword,
        role: 'admin'
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        contactNumber: true,
        role: true,
        createdAt: true
      }
    });

    console.log('\n✅ Admin account created successfully!\n');
    console.log('📋 Admin Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ID:', admin.id);
    console.log('Name:', admin.fullName);
    console.log('Email:', admin.email);
    console.log('Contact:', admin.contactNumber);
    console.log('Password:', password);
    console.log('Role:', admin.role);
    console.log('Created:', admin.createdAt);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🔐 Login URL: http://localhost:3001/signstudent');
    console.log('📝 Use the Admin tab to login\n');
    console.log('⚠️  IMPORTANT: Save these credentials securely!\n');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Run the script
createCustomAdmin();
