#!/usr/bin/env node

require('dotenv').config();
const prisma = require('../src/config/database');

async function checkForDuplicates() {
  console.log('🔍 Checking for duplicate projects...\n');

  try {
    // Check for duplicates by title, author, and year
    const duplicatesByTitleAuthorYear = await prisma.$queryRaw`
      SELECT title, author, year, COUNT(*) as count
      FROM "Project"
      WHERE "isDeleted" = false
      GROUP BY title, author, year
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `;

    // Check for duplicates by title and year
    const duplicatesByTitleYear = await prisma.$queryRaw`
      SELECT title, year, COUNT(*) as count, 
             STRING_AGG(author, ', ') as authors
      FROM "Project"
      WHERE "isDeleted" = false
      GROUP BY title, year
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `;

    console.log('📊 Duplicate Analysis Results:\n');

    if (duplicatesByTitleAuthorYear.length > 0) {
      console.log('❌ Duplicates by Title + Author + Year:');
      duplicatesByTitleAuthorYear.forEach((dup, index) => {
        console.log(`   ${index + 1}. "${dup.title}" by ${dup.author} (${dup.year}) - ${dup.count} copies`);
      });
      console.log('');
    } else {
      console.log('✅ No duplicates found by Title + Author + Year\n');
    }

    if (duplicatesByTitleYear.length > 0) {
      console.log('⚠️  Duplicates by Title + Year (different authors):');
      duplicatesByTitleYear.forEach((dup, index) => {
        console.log(`   ${index + 1}. "${dup.title}" (${dup.year}) - ${dup.count} versions by: ${dup.authors}`);
      });
      console.log('');
    } else {
      console.log('✅ No duplicates found by Title + Year\n');
    }

    // Get total project count
    const totalProjects = await prisma.project.count({
      where: { isDeleted: false }
    });

    console.log(`📈 Total active projects: ${totalProjects}`);
    
    const totalDuplicates = duplicatesByTitleAuthorYear.length + duplicatesByTitleYear.length;
    
    if (totalDuplicates === 0) {
      console.log('🎉 No duplicates found! Database is clean and ready for duplicate prevention constraints.');
    } else {
      console.log(`\n⚠️  Found ${totalDuplicates} types of duplicates.`);
      console.log('💡 You may need to clean these up before applying strict duplicate prevention.');
      console.log('\nOptions:');
      console.log('1. Manually review and remove duplicates');
      console.log('2. Run the clean-projects-data script to start fresh');
      console.log('3. Apply constraints anyway (may cause migration errors)');
    }

  } catch (error) {
    console.error('❌ Error checking duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkForDuplicates();