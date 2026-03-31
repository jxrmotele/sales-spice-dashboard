import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const coachPassword = await bcrypt.hash("coach123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@coachview.app" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@coachview.app",
      hashedPassword: adminPassword,
      role: "ADMIN",
    },
  });

  const coach1 = await prisma.user.upsert({
    where: { email: "sarah@coachview.app" },
    update: {},
    create: {
      name: "Sarah Chen",
      email: "sarah@coachview.app",
      hashedPassword: coachPassword,
      role: "COACH",
    },
  });

  const coach2 = await prisma.user.upsert({
    where: { email: "james@coachview.app" },
    update: {},
    create: {
      name: "James Rivera",
      email: "james@coachview.app",
      hashedPassword: coachPassword,
      role: "COACH",
    },
  });

  // Create sample clients
  const client1 = await prisma.client.upsert({
    where: { email: "alex@example.com" },
    update: {},
    create: {
      fullName: "Alex Thompson",
      email: "alex@example.com",
      phone: "+1-555-0101",
      packageTier: "Premium",
      status: "ACTIVE",
      assignedCoachId: coach1.id,
    },
  });

  const client2 = await prisma.client.upsert({
    where: { email: "maria@example.com" },
    update: {},
    create: {
      fullName: "Maria Garcia",
      email: "maria@example.com",
      packageTier: "Standard",
      status: "ACTIVE",
      assignedCoachId: coach1.id,
    },
  });

  const client3 = await prisma.client.upsert({
    where: { email: "david@example.com" },
    update: {},
    create: {
      fullName: "David Kim",
      email: "david@example.com",
      phone: "+1-555-0103",
      packageTier: "Premium",
      status: "PAUSED",
      assignedCoachId: coach2.id,
    },
  });

  // Add sample content entries
  await prisma.contentEntry.createMany({
    data: [
      {
        clientId: client1.id,
        contentType: "FORM",
        contentBody:
          "Goals: Build a sustainable morning routine. Currently struggling with consistency. Want to wake up at 6am daily and include meditation, exercise, and journaling. Have tried before but usually fall off after 2 weeks.",
        sourceLabel: "Google Form — Onboarding Questionnaire",
      },
      {
        clientId: client1.id,
        contentType: "TRANSCRIPT",
        contentBody:
          "Coach: So Alex, tell me about what happened last week with the morning routine.\nAlex: I managed 4 out of 7 days, which is better than before. The meditation part is sticking but I keep skipping the exercise.\nCoach: What gets in the way of the exercise?\nAlex: I think I set the bar too high — I was trying to do a full 45-minute workout. Maybe I should start with just 15 minutes.\nCoach: That sounds like a great adjustment. Small wins build momentum.",
        sourceLabel: "Zoom Call — 10 Feb 2026",
      },
      {
        clientId: client1.id,
        contentType: "NOTE",
        contentBody:
          "Alex seems to be making progress but needs help with all-or-nothing thinking. Consider introducing the concept of minimum viable habits next session.",
        sourceLabel: "Coach Notes",
      },
      {
        clientId: client2.id,
        contentType: "FORM",
        contentBody:
          "Goals: Career transition from marketing to UX design. Currently taking online courses. Need accountability and strategy for building a portfolio and networking.",
        sourceLabel: "Google Form — Onboarding Questionnaire",
      },
      {
        clientId: client3.id,
        contentType: "FORM",
        contentBody:
          "Goals: Improve leadership skills as a new engineering manager. Struggling with delegation and having difficult conversations with direct reports.",
        sourceLabel: "Google Form — Onboarding Questionnaire",
      },
    ],
  });

  console.log("Seed complete:");
  console.log(`  Admin: ${admin.email} (password: admin123)`);
  console.log(`  Coach 1: ${coach1.email} (password: coach123)`);
  console.log(`  Coach 2: ${coach2.email} (password: coach123)`);
  console.log(`  Clients: ${client1.fullName}, ${client2.fullName}, ${client3.fullName}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
