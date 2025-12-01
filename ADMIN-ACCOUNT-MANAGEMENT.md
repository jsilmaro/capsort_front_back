# Admin Account Management Guide

## 🎉 New Admin Account Created!

### ✅ Admin Credentials

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Admin Account Details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ID: 3
Name: New Admin
Email: newadmin@capsort.com
Password: NewAdmin123!
Role: admin
Created: November 30, 2025

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 🔐 Login Instructions

1. **Go to:** http://localhost:3001/signstudent
2. **Select:** Admin tab
3. **Enter:**
   - Email: `newadmin@capsort.com`
   - Password: `NewAdmin123!`
4. **Click:** Sign in
5. **Expected:** Redirect to `/admindash`

---

## 🛠️ Creating Additional Admin Accounts

### Method 1: Quick Admin Creation (Pre-configured)

Run the quick script with default values:

```bash
cd backend
node scripts/createAdmin.js
```

**Default Admin:**
- Email: `admin@capsort.com`
- Password: `Admin123!`

To create with different credentials, edit `backend/scripts/createAdmin.js` and change:
```javascript
const adminData = {
  fullName: 'Your Admin Name',
  contactNumber: '+639123456789',
  email: 'youradmin@capsort.com',
  password: 'YourPassword123!',
  role: 'admin'
};
```

### Method 2: Interactive Admin Creation (Custom)

Run the interactive script:

```bash
cd backend
node scripts/createCustomAdmin.js
```

You'll be prompted to enter:
1. Full Name
2. Contact Number
3. Email
4. Password

**Example:**
```
🔧 Create New Admin Account

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full Name: John Doe
Contact Number (e.g., +639123456789): +639123456789
Email: john@capsort.com
Password (min 6 chars, uppercase, lowercase, number): JohnAdmin123!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Admin account created successfully!
```

### Method 3: Direct Database Insert (Advanced)

Using Prisma Studio:

```bash
cd backend
npx prisma studio
```

1. Open User table
2. Click "Add record"
3. Fill in:
   - fullName: "Admin Name"
   - contactNumber: "+639123456789"
   - email: "admin@example.com"
   - password: (use bcrypt hash - see below)
   - role: "admin"

**Generate Password Hash:**
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123!', 12).then(hash => console.log(hash));"
```

---

## 📋 Password Requirements

All admin passwords must meet these requirements:
- ✅ Minimum 6 characters
- ✅ At least one lowercase letter (a-z)
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one number (0-9)

**Valid Examples:**
- `Admin123!`
- `SecurePass1`
- `MyAdmin99`

**Invalid Examples:**
- `admin123` (no uppercase)
- `ADMIN123` (no lowercase)
- `AdminPass` (no number)
- `Admin1` (too short)

---

## 🔍 List All Admin Accounts

### Using Prisma Studio:
```bash
cd backend
npx prisma studio
```
- Open User table
- Filter by role = "admin"

### Using Node Script:

Create `backend/scripts/listAdmins.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAdmins() {
  const admins = await prisma.user.findMany({
    where: { role: 'admin' },
    select: {
      id: true,
      fullName: true,
      email: true,
      contactNumber: true,
      createdAt: true
    }
  });

  console.log('\n📋 Admin Accounts:\n');
  admins.forEach(admin => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ID:', admin.id);
    console.log('Name:', admin.fullName);
    console.log('Email:', admin.email);
    console.log('Contact:', admin.contactNumber);
    console.log('Created:', admin.createdAt);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  await prisma.$disconnect();
}

listAdmins();
```

Run:
```bash
cd backend
node scripts/listAdmins.js
```

---

## 🔄 Update Admin Password

### Method 1: Using Script

Create `backend/scripts/updateAdminPassword.js`:
```javascript
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePassword() {
  const email = 'admin@capsort.com'; // Change this
  const newPassword = 'NewPassword123!'; // Change this

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  console.log('✅ Password updated for:', email);
  await prisma.$disconnect();
}

updatePassword();
```

### Method 2: Using Password Reset Flow

1. Go to http://localhost:3001/signstudent
2. Click "Forgot Password?" (Student tab only)
3. Note: Admins cannot use student password reset
4. Admin passwords must be reset manually or through scripts

---

## 🗑️ Delete Admin Account

### Using Prisma Studio:
```bash
cd backend
npx prisma studio
```
- Open User table
- Find admin by email
- Click delete icon

### Using Script:

Create `backend/scripts/deleteAdmin.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteAdmin() {
  const email = 'admin@example.com'; // Change this

  await prisma.user.delete({
    where: { email }
  });

  console.log('✅ Admin deleted:', email);
  await prisma.$disconnect();
}

deleteAdmin();
```

---

## 🔐 Security Best Practices

### 1. Strong Passwords
- Use unique passwords for each admin
- Minimum 12 characters recommended
- Include special characters
- Don't reuse passwords

### 2. Limit Admin Accounts
- Only create admin accounts for authorized personnel
- Remove admin access when no longer needed
- Regularly audit admin accounts

### 3. Secure Storage
- Never commit admin credentials to git
- Store credentials in secure password manager
- Don't share passwords via email or chat

### 4. Regular Updates
- Change admin passwords periodically
- Update passwords if compromised
- Monitor admin login activity

### 5. Access Control
- Admins have full system access
- Students cannot access admin features
- Protected routes enforce role-based access

---

## 🧪 Testing Admin Account

### Test Login:
```bash
# 1. Ensure servers are running
cd backend && npm run dev
cd frontend && npm start

# 2. Open browser
http://localhost:3001/signstudent

# 3. Select Admin tab

# 4. Enter credentials
Email: newadmin@capsort.com
Password: NewAdmin123!

# 5. Click Sign in

# 6. Should redirect to /admindash
```

### Test Admin Features:
- ✅ Access admin dashboard
- ✅ View analytics
- ✅ Manage projects (CRUD operations)
- ✅ View all users
- ✅ Access admin profile
- ✅ Cannot use student password reset

---

## 📊 Current Admin Accounts

### Admin 1:
- **Email:** admin@capsort.com
- **Password:** Admin123!
- **Status:** Active

### Admin 2 (NEW):
- **Email:** newadmin@capsort.com
- **Password:** NewAdmin123!
- **Status:** Active
- **Created:** November 30, 2025

---

## 🛠️ Troubleshooting

### Issue: "Admin account already exists"
**Solution:** Use a different email or update existing admin password

### Issue: "Invalid credentials"
**Solution:** 
- Verify email is correct
- Check password meets requirements
- Ensure using Admin tab, not Student tab

### Issue: "Cannot create admin"
**Solution:**
- Check database connection
- Verify Prisma schema is up to date
- Run `npx prisma generate`

### Issue: "Password validation failed"
**Solution:**
- Ensure password has uppercase, lowercase, and number
- Minimum 6 characters required
- Check for typos

---

## 📝 Quick Commands Reference

```bash
# Create admin (pre-configured)
cd backend && node scripts/createAdmin.js

# Create admin (interactive)
cd backend && node scripts/createCustomAdmin.js

# List all admins
cd backend && node scripts/listAdmins.js

# Open Prisma Studio
cd backend && npx prisma studio

# Generate password hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Password123!', 12).then(hash => console.log(hash));"
```

---

## ✅ Summary

- ✅ New admin account created successfully
- ✅ Email: newadmin@capsort.com
- ✅ Password: NewAdmin123!
- ✅ Scripts available for creating more admins
- ✅ Interactive and pre-configured options
- ✅ Security best practices documented
- ✅ Troubleshooting guide included

**Ready to login at:** http://localhost:3001/signstudent (Admin tab)
