/**
 * Idempotent Prisma seed for Job Portal development and test data.
 * Reads canonical records from db/seed-data/seed-data.json (fixed UUIDs).
 */
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const SEED_DATA_PATH = path.join(__dirname, "..", "db", "seed-data", "seed-data.json");

function loadSeedData() {
  const raw = fs.readFileSync(SEED_DATA_PATH, "utf8");
  return JSON.parse(raw);
}

async function seedRoles(roles) {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      create: role,
      update: { description: role.description },
    });
  }
}

async function seedUsers(users, passwordHash) {
  for (const user of users) {
    const { roles: _roles, ...userFields } = user;
    await prisma.user.upsert({
      where: { id: user.id },
      create: {
        ...userFields,
        passwordHash,
        emailVerifiedAt: user.emailVerifiedAt ? new Date(user.emailVerifiedAt) : null,
      },
      update: {
        email: user.email,
        passwordHash,
        displayName: user.displayName,
        emailVerifiedAt: user.emailVerifiedAt ? new Date(user.emailVerifiedAt) : null,
        status: user.status,
        metadata: user.metadata,
      },
    });
  }
}

async function seedUserRoles(users, adminUserId) {
  const roleRecords = await prisma.role.findMany();
  const roleByName = Object.fromEntries(roleRecords.map((r) => [r.name, r.id]));

  for (const user of users) {
    for (const roleName of user.roles) {
      const roleId = roleByName[roleName];
      if (!roleId) {
        throw new Error(`Unknown role "${roleName}" for user ${user.email}`);
      }

      await prisma.userRole.upsert({
        where: {
          userId_roleId: { userId: user.id, roleId },
        },
        create: {
          userId: user.id,
          roleId,
          grantedBy: roleName === "admin" ? null : adminUserId,
        },
        update: {
          grantedBy: roleName === "admin" ? null : adminUserId,
        },
      });
    }
  }
}

async function seedJobs(jobs) {
  for (const job of jobs) {
    await prisma.job.upsert({
      where: { id: job.id },
      create: {
        ...job,
        publishedAt: job.publishedAt ? new Date(job.publishedAt) : null,
        closesAt: job.closesAt ? new Date(job.closesAt) : null,
      },
      update: {
        employerUserId: job.employerUserId,
        title: job.title,
        description: job.description,
        location: job.location,
        employmentType: job.employmentType,
        salaryMinCents: job.salaryMinCents,
        salaryMaxCents: job.salaryMaxCents,
        currencyCode: job.currencyCode,
        status: job.status,
        publishedAt: job.publishedAt ? new Date(job.publishedAt) : null,
        closesAt: job.closesAt ? new Date(job.closesAt) : null,
        metadata: job.metadata,
      },
    });
  }
}

async function seedApplications(applications) {
  for (const application of applications) {
    await prisma.application.upsert({
      where: { id: application.id },
      create: application,
      update: {
        jobId: application.jobId,
        candidateUserId: application.candidateUserId,
        status: application.status,
        coverLetter: application.coverLetter,
        resumeUrl: application.resumeUrl,
        metadata: application.metadata,
      },
    });
  }
}

async function main() {
  const data = loadSeedData();
  const adminUser = data.users.find((u) => u.roles.includes("admin"));
  if (!adminUser) {
    throw new Error("Seed data must include at least one admin user.");
  }

  await seedRoles(data.roles);
  await seedUsers(data.users, data.meta.devPasswordHash);
  await seedUserRoles(data.users, adminUser.id);
  await seedJobs(data.jobs);
  await seedApplications(data.applications);

  console.log(
    `Seed complete: ${data.roles.length} roles, ${data.users.length} users, ${data.jobs.length} jobs, ${data.applications.length} applications.`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
