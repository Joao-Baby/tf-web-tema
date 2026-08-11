-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'CLIENTE',
ADD COLUMN     "senha" TEXT;

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "whatsappLink" TEXT;
