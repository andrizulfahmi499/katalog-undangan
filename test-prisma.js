const { PrismaClient } = require('@prisma/client');

async function testConnection(url) {
  console.log('Testing URL:', url);
  const prisma = new PrismaClient({ datasourceUrl: url });
  try {
    const admin = await prisma.admin.findFirst();
    console.log('Success!', admin ? admin.email : 'No admin found');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  await testConnection('postgresql://postgres.dnmrsucumekjehcspgbu:K%40talogundang4n@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=10');
  await testConnection('postgresql://postgres.dnmrsucumekjehcspgbu:K%40talogundang4n@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?connect_timeout=10');
}

run();
