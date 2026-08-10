-- CreateTable
CREATE TABLE "Categoria" (
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Produto" (
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL(65,30) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "categoriaId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Tamanho" (
    "codigo" TEXT NOT NULL,
    "faixa" TEXT NOT NULL,
    "idadeMinima" INTEGER,
    "idadeMaxima" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tamanho_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Cor" (
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cor_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Grade" (
    "codigo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "observacao" TEXT,
    "produtoId" TEXT NOT NULL,
    "tamanhoId" TEXT NOT NULL,
    "corId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Interesse" (
    "codigo" TEXT NOT NULL,
    "dataInteresse" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mensagem" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "clienteId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interesse_pkey" PRIMARY KEY ("codigo")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_nome_key" ON "Produto"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Tamanho_faixa_key" ON "Tamanho"("faixa");

-- CreateIndex
CREATE UNIQUE INDEX "Cor_nome_key" ON "Cor"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_produtoId_tamanhoId_corId_key" ON "Grade"("produtoId", "tamanhoId", "corId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_whatsapp_key" ON "Cliente"("whatsapp");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_tamanhoId_fkey" FOREIGN KEY ("tamanhoId") REFERENCES "Tamanho"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_corId_fkey" FOREIGN KEY ("corId") REFERENCES "Cor"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interesse" ADD CONSTRAINT "Interesse_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interesse" ADD CONSTRAINT "Interesse_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;
