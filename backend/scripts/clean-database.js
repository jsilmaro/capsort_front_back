const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 Cleaning database - removing non-IoT and non-Database projects...');

  try {
    // First, let's see what fields exist in the database
    const allProjects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        field: true
      }
    });

    console.log(`📊 Found ${allProjects.length} total projects`);

    // Group by field to see what we have
    const fieldCounts = {};
    allProjects.forEach(project => {
      fieldCounts[project.field] = (fieldCounts[project.field] || 0) + 1;
    });

    console.log('📈 Current field distribution:');
    Object.entries(fieldCounts).forEach(([field, count]) => {
      console.log(`   - ${field}: ${count} projects`);
    });

    // Find projects that are NOT IoT or Database
    const projectsToDelete = allProjects.filter(project => 
      project.field !== 'IoT' && project.field !== 'Database'
    );

    if (projectsToDelete.length === 0) {
      console.log('✅ No projects to delete - all projects are already IoT or Database');
      return;
    }

    console.log(`🗑️  Found ${projectsToDelete.length} projects to delete:`);
    projectsToDelete.forEach(project => {
      console.log(`   - "${project.title}" (${project.field})`);
    });

    // Get the IDs of projects to delete
    const projectIdsToDelete = projectsToDelete.map(p => p.id);

    // First, delete related saved projects
    const deletedSavedProjects = await prisma.savedProject.deleteMany({
      where: {
        projectId: {
          in: projectIdsToDelete
        }
      }
    });

    console.log(`🗑️  Deleted ${deletedSavedProjects.count} saved project relationships`);

    // Then delete the projects themselves
    const deletedProjects = await prisma.project.deleteMany({
      where: {
        field: {
          notIn: ['IoT', 'Database']
        }
      }
    });

    console.log(`🗑️  Deleted ${deletedProjects.count} projects`);

    // Verify the cleanup
    const remainingProjects = await prisma.project.findMany({
      select: {
        field: true
      }
    });

    const remainingFieldCounts = {};
    remainingProjects.forEach(project => {
      remainingFieldCounts[project.field] = (remainingFieldCounts[project.field] || 0) + 1;
    });

    console.log('✅ Database cleaned successfully!');
    console.log(`📊 Remaining projects: ${remainingProjects.length}`);
    console.log('📈 Final field distribution:');
    Object.entries(remainingFieldCounts).forEach(([field, count]) => {
      console.log(`   - ${field}: ${count} projects`);
    });

  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    throw error;
  }
}

cleanDatabase()
  .catch((e) => {
    console.error('❌ Cleanup failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });