const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedAnalyticsData() {
  console.log('🌱 Seeding comprehensive analytics data...');

  try {
    // Create admin user if not exists
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@capsort.com' },
      update: {},
      create: {
        fullName: 'System Administrator',
        contactNumber: '+1234567890',
        email: 'admin@capsort.com',
        password: hashedAdminPassword,
        role: 'admin',
      },
    });

    // Create multiple student users
    const students = [];
    const studentData = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Johnson', email: 'bob@example.com' },
      { name: 'Alice Brown', email: 'alice@example.com' },
      { name: 'Charlie Wilson', email: 'charlie@example.com' },
      { name: 'Diana Prince', email: 'diana@example.com' },
      { name: 'Edward Norton', email: 'edward@example.com' },
      { name: 'Fiona Green', email: 'fiona@example.com' },
    ];

    const hashedStudentPassword = await bcrypt.hash('student123', 10);
    
    for (const studentInfo of studentData) {
      const student = await prisma.user.upsert({
        where: { email: studentInfo.email },
        update: {},
        create: {
          fullName: studentInfo.name,
          contactNumber: '+1234567891',
          email: studentInfo.email,
          password: hashedStudentPassword,
          role: 'student',
        },
      });
      students.push(student);
    }

    console.log(`✅ Created ${students.length} student users`);

    // Create comprehensive project data across multiple years and fields (only Database and IoT)
    const projectsData = [
      // 2020 Projects
      { title: 'Smart Agriculture IoT System', author: 'Maria Garcia', year: 2020, field: 'IoT' },
      { title: 'Student Information Database', author: 'James Wilson', year: 2020, field: 'Database' },
      { title: 'IoT Greenhouse Monitoring', author: 'Sarah Johnson', year: 2020, field: 'IoT' },
      
      // 2021 Projects
      { title: 'IoT Weather Monitoring Station', author: 'Michael Brown', year: 2021, field: 'IoT' },
      { title: 'Hospital Management Database', author: 'Lisa Davis', year: 2021, field: 'Database' },
      { title: 'Smart Irrigation IoT System', author: 'David Miller', year: 2021, field: 'IoT' },
      { title: 'University Database System', author: 'Emma Wilson', year: 2021, field: 'Database' },
      { title: 'IoT Security Framework', author: 'Alex Thompson', year: 2021, field: 'IoT' },
      
      // 2022 Projects
      { title: 'Smart Home Automation System', author: 'Jennifer Lee', year: 2022, field: 'IoT' },
      { title: 'Inventory Management Database', author: 'Robert Taylor', year: 2022, field: 'Database' },
      { title: 'IoT Air Quality Monitor', author: 'Michelle Anderson', year: 2022, field: 'IoT' },
      { title: 'E-commerce Database Design', author: 'Kevin Martinez', year: 2022, field: 'Database' },
      { title: 'IoT Smart Lighting System', author: 'Amanda White', year: 2022, field: 'IoT' },
      { title: 'Banking Database Security', author: 'Daniel Harris', year: 2022, field: 'Database' },
      
      // 2023 Projects
      { title: 'IoT Smart City Infrastructure', author: 'Rachel Green', year: 2023, field: 'IoT' },
      { title: 'Library Management System', author: 'Christopher Clark', year: 2023, field: 'Database' },
      { title: 'IoT Waste Management System', author: 'Stephanie Lewis', year: 2023, field: 'IoT' },
      { title: 'Healthcare Database Analytics', author: 'Matthew Walker', year: 2023, field: 'Database' },
      { title: 'IoT Smart Grid System', author: 'Nicole Hall', year: 2023, field: 'IoT' },
      { title: 'Financial Database Optimization', author: 'Andrew Young', year: 2023, field: 'Database' },
      { title: 'IoT Environmental Monitoring', author: 'Samantha King', year: 2023, field: 'IoT' },
      { title: 'Customer Relationship Database', author: 'Joshua Wright', year: 2023, field: 'Database' },
      
      // 2024 Projects
      { title: 'Smart Traffic Management IoT', author: 'Lauren Lopez', year: 2024, field: 'IoT' },
      { title: 'Healthcare Records Database', author: 'Brandon Hill', year: 2024, field: 'Database' },
      { title: 'IoT Smart Building System', author: 'Megan Scott', year: 2024, field: 'IoT' },
      { title: 'Supply Chain Database', author: 'Tyler Adams', year: 2024, field: 'Database' },
      { title: 'IoT Predictive Maintenance', author: 'Kimberly Baker', year: 2024, field: 'IoT' },
      { title: 'Data Warehouse Architecture', author: 'Jonathan Nelson', year: 2024, field: 'Database' },
      { title: 'IoT Smart Parking System', author: 'Ashley Carter', year: 2024, field: 'IoT' },
      { title: 'Real-time Analytics Database', author: 'Ryan Mitchell', year: 2024, field: 'Database' },
      { title: 'IoT Energy Management System', author: 'Brittany Perez', year: 2024, field: 'IoT' },
      { title: 'Distributed Database System', author: 'Justin Roberts', year: 2024, field: 'Database' },
      { title: 'IoT Smart Factory Automation', author: 'Courtney Turner', year: 2024, field: 'IoT' },
      { title: 'NoSQL Database Performance', author: 'Sean Phillips', year: 2024, field: 'Database' },
    ];

    const createdProjects = [];
    for (const projectData of projectsData) {
      // Randomly assign uploader (admin or random student)
      const uploader = Math.random() > 0.3 ? students[Math.floor(Math.random() * students.length)] : admin;
      
      const project = await prisma.project.upsert({
        where: { 
          title_author: {
            title: projectData.title,
            author: projectData.author
          }
        },
        update: {},
        create: {
          ...projectData,
          fileUrl: `https://example.com/${projectData.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
          uploadedBy: uploader.id,
        },
      });
      createdProjects.push(project);
    }

    console.log(`✅ Created ${createdProjects.length} projects`);

    // Create saved projects (students saving various projects)
    const savedProjectsData = [];
    
    // Each student saves 3-8 random projects
    for (const student of students) {
      const numSaves = Math.floor(Math.random() * 6) + 3; // 3-8 saves
      const shuffledProjects = [...createdProjects].sort(() => 0.5 - Math.random());
      const projectsToSave = shuffledProjects.slice(0, numSaves);
      
      for (const project of projectsToSave) {
        savedProjectsData.push({
          userId: student.id,
          projectId: project.id,
        });
      }
    }

    // Create saved projects
    for (const saveData of savedProjectsData) {
      await prisma.savedProject.upsert({
        where: {
          userId_projectId: {
            userId: saveData.userId,
            projectId: saveData.projectId,
          }
        },
        update: {},
        create: saveData,
      });
    }

    console.log(`✅ Created ${savedProjectsData.length} saved project relationships`);

    console.log('🎉 Analytics data seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${students.length + 1} users (${students.length} students + 1 admin)`);
    console.log(`   - ${createdProjects.length} projects`);
    console.log(`   - ${savedProjectsData.length} saved project relationships`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

seedAnalyticsData()
  .catch((e) => {
    console.error('❌ Analytics seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });