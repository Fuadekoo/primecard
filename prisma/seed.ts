import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding admin user...");

  const hashedPassword = bcrypt.hashSync("admin1234", 10);

  await prisma.user.create({
    data: {
      username: "dudu1234",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user seeded.");
}

main()
  .catch((e) => {
    console.error("An error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Prisma client disconnected.");
  });
