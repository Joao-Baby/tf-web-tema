const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const tables = ["categoria", "produto", "tamanho", "cor", "grade", "cliente", "interesse"];
  for (const t of tables) {
    const count = await prisma[t].count();
    console.log(`${t.padEnd(12)}: ${count}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
