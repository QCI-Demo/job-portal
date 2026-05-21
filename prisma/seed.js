/**
 * Optional dev seed — canonical roles are already inserted by `000001` SQL / Prisma init migration.
 * This script upserts the same names for idempotency when re-run alone after `db push` workflows.
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ROLES = [
  { name: "candidate", description: "Job seeker: search and apply." },
  { name: "employer", description: "Hiring party: post jobs and review applications." },
  { name: "admin", description: "Platform operator: elevated access." },
];

async function main() {
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      create: role,
      update: { description: role.description },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
