#!/usr/bin/env node
/**
 * Validates seeded sample data presence, counts, and edge-case coverage.
 * Exits 0 on success, 1 on failure (suitable for CI).
 */
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const SEED_DATA_PATH = path.join(__dirname, "..", "db", "seed-data", "seed-data.json");

function loadExpected() {
  return JSON.parse(fs.readFileSync(SEED_DATA_PATH, "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function validateCounts(expected) {
  const [roleCount, userCount, jobCount, applicationCount] = await Promise.all([
    prisma.role.count(),
    prisma.user.count({ where: { id: { in: expected.users.map((u) => u.id) } } }),
    prisma.job.count({ where: { id: { in: expected.jobs.map((j) => j.id) } } }),
    prisma.application.count({ where: { id: { in: expected.applications.map((a) => a.id) } } }),
  ]);

  assert(roleCount >= expected.roles.length, `Expected at least ${expected.roles.length} roles, found ${roleCount}`);
  assert(userCount === expected.users.length, `Expected ${expected.users.length} seed users, found ${userCount}`);
  assert(jobCount === expected.jobs.length, `Expected ${expected.jobs.length} seed jobs, found ${jobCount}`);
  assert(
    applicationCount === expected.applications.length,
    `Expected ${expected.applications.length} seed applications, found ${applicationCount}`
  );

  return { roleCount, userCount, jobCount, applicationCount };
}

async function validateReferentialIntegrity() {
  const orphanJobs = await prisma.$queryRaw`
    SELECT j.id FROM jobs j
    LEFT JOIN users u ON u.id = j.employer_user_id
    WHERE u.id IS NULL
    LIMIT 1
  `;
  assert(orphanJobs.length === 0, "Found job with missing employer user");

  const orphanApplications = await prisma.$queryRaw`
    SELECT a.id FROM applications a
    LEFT JOIN jobs j ON j.id = a.job_id
    LEFT JOIN users u ON u.id = a.candidate_user_id
    WHERE j.id IS NULL OR u.id IS NULL
    LIMIT 1
  `;
  assert(orphanApplications.length === 0, "Found application with missing job or candidate");
}

async function validateEdgeCases(expected) {
  const noJobEmployer = await prisma.job.count({
    where: { employerUserId: "a1111111-1111-4111-8111-111111111105" },
  });
  assert(noJobEmployer === 0, "Edge case: inactive employer should have zero jobs");

  const noAppCandidate = await prisma.application.count({
    where: { candidateUserId: "a1111111-1111-4111-8111-111111111107" },
  });
  assert(noAppCandidate === 0, "Edge case: new-grad candidate should have zero applications");

  const noAppJob = await prisma.application.count({
    where: { jobId: "f2222222-2222-4222-8222-222222222204" },
  });
  assert(noAppJob === 0, "Edge case: Product Manager job should have zero applications");

  const draftJobApps = await prisma.application.count({
    where: { jobId: "f2222222-2222-4222-8222-222222222202" },
  });
  assert(draftJobApps === 0, "Edge case: draft DevOps job should have zero applications");

  const suspendedUser = await prisma.user.findUnique({
    where: { id: "a1111111-1111-4111-8111-111111111108" },
  });
  assert(suspendedUser?.status === "suspended", "Edge case: suspended employer status missing");

  const multiRoleCount = await prisma.userRole.count({
    where: { userId: "a1111111-1111-4111-8111-111111111109" },
  });
  assert(multiRoleCount === 2, "Edge case: multi-role user should have two role assignments");

  const statuses = await prisma.application.findMany({
    select: { status: true },
    distinct: ["status"],
  });
  const statusSet = new Set(statuses.map((s) => s.status));
  for (const required of ["submitted", "in_review", "shortlisted", "rejected", "withdrawn", "hired"]) {
    assert(statusSet.has(required), `Missing application status coverage: ${required}`);
  }

  const jobStatuses = await prisma.job.findMany({
    where: { id: { in: expected.jobs.map((job) => job.id) } },
    select: { status: true },
    distinct: ["status"],
  });
  const jobStatusSet = new Set(jobStatuses.map((j) => j.status));
  for (const required of ["draft", "published", "closed", "archived"]) {
    assert(jobStatusSet.has(required), `Missing job status coverage: ${required}`);
  }
}

async function validateIdempotencyMarker(expected) {
  const sampleUser = await prisma.user.findUnique({
    where: { id: expected.users[0].id },
    include: { userRoles: { include: { role: true } } },
  });
  assert(sampleUser?.email === expected.users[0].email, "Primary seed user email mismatch");
  assert(
    sampleUser?.userRoles.some((ur) => ur.role.name === "employer"),
    "Primary seed user missing employer role"
  );
}

async function main() {
  const expected = loadExpected();
  const counts = await validateCounts(expected);
  await validateReferentialIntegrity();
  await validateEdgeCases(expected);
  await validateIdempotencyMarker(expected);

  console.log("Seed validation passed.");
  console.log(
    `  roles=${counts.roleCount} users=${counts.userCount} jobs=${counts.jobCount} applications=${counts.applicationCount}`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error("Seed validation failed:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  });
