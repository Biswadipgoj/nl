const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');
const path = require('path');

async function main() {
  const dbPath = path.join(process.cwd(), 'dev.db');
  console.log('dbPath:', dbPath);
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  const prisma = new PrismaClient({ adapter });

  try {
    const links = await prisma.link.findMany();
    console.log('links:', links);
  } catch (e) {
    console.error('Prisma Error:', e);
  }
}

main();
