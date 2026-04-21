import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@helpdeskexpert.com";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("⚠️  Admin user already exists:", email);
    return;
  }

  const password = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      email,
      password,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Admin user created:");
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Password: Admin@123`);
  console.log(`   Role:     ${admin.role}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
