// =============================================================================
// Tico de Gente — Seed
// Popula todas as tabelas com dados fictícios coerentes com o domínio da
// loja de roupa infantil. Respeita a ordem das chaves estrangeiras:
// pais primeiro (Categoria, Tamanho, Cor, Cliente), filhos depois.
// =============================================================================
const { PrismaClient } = require("@prisma/client");
const { Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed da Tico de Gente...\n");

  // Idempotência: se já houver categorias populadas, o banco já está seedado
  const jaExistem = await prisma.categoria.count();
  if (jaExistem > 0) {
    console.log("Banco já populado. Pulando seed.");
    return;
  }

  // 1) Pais ---------------------------------------------------------------
  const catBebe = await prisma.categoria.create({
    data: {
      nome: "Bebês (0-24 meses)",
      descricao: "Peças confortáveis para recém-nascidos e bebês.",
    },
  });
  const catMenina = await prisma.categoria.create({
    data: {
      nome: "Meninas (2-12 anos)",
      descricao: "Vestidos, conjuntos e peças coloridas para meninas.",
    },
  });
  const catMenino = await prisma.categoria.create({
    data: {
      nome: "Meninos (2-12 anos)",
      descricao: "Camisetas, calças e conjuntos para meninos.",
    },
  });
  const catAcessorios = await prisma.categoria.create({
    data: {
      nome: "Acessórios",
      descricao: "Meias, laços, gorros e outros complementos.",
    },
  });
  console.log("✓ Categorias criadas:", catBebe.nome, "|", catMenina.nome, "|", catMenino.nome, "|", catAcessorios.nome);

  const tamBebP = await prisma.tamanho.create({ data: { faixa: "Bebê P" } });
  const tamBebM = await prisma.tamanho.create({ data: { faixa: "Bebê M", idadeMinima: 3, idadeMaxima: 6 } });
  const tamBebG = await prisma.tamanho.create({ data: { faixa: "Bebê G", idadeMinima: 6, idadeMaxima: 9 } });
  const tamG12M = await prisma.tamanho.create({ data: { faixa: "12 meses", idadeMinima: 9, idadeMaxima: 12 } });
  const tam24M = await prisma.tamanho.create({ data: { faixa: "24 meses", idadeMinima: 18, idadeMaxima: 24 } });
  const tam24a = await prisma.tamanho.create({ data: { faixa: "2 a 4 anos", idadeMinima: 2, idadeMaxima: 4 } });
  const tam46a = await prisma.tamanho.create({ data: { faixa: "4 a 6 anos", idadeMinima: 4, idadeMaxima: 6 } });
  const tam68a = await prisma.tamanho.create({ data: { faixa: "6 a 8 anos", idadeMinima: 6, idadeMaxima: 8 } });
  const tam810a = await prisma.tamanho.create({ data: { faixa: "8 a 10 anos", idadeMinima: 8, idadeMaxima: 10 } });
  console.log("✓ Tamanhos criados:", tamBebP.faixa, "→", tam810a.faixa);

  const corRosaBebe = await prisma.cor.create({ data: { nome: "Rosa Bebê" } });
  const corAzulMarinho = await prisma.cor.create({ data: { nome: "Azul Marinho" } });
  const corAmareloClaro = await prisma.cor.create({ data: { nome: "Amarelo Claro" } });
  const corBranco = await prisma.cor.create({ data: { nome: "Branco" } });
  const corVerdeMenta = await prisma.cor.create({ data: { nome: "Verde Menta" } });
  const corEstampadoDino = await prisma.cor.create({ data: { nome: "Estampado Dino" } });
  console.log("✓ Cores criadas:", corRosaBebe.nome, "|", corEstampadoDino.nome);

  const cli1 = await prisma.cliente.create({
    data: { nome: "Camila Ribeiro", whatsapp: "5551999887766", email: "camila.ribeiro@email.com" },
  });
  const cli2 = await prisma.cliente.create({
    data: { nome: "Fernanda Souza", whatsapp: "5551988776655" }, // sem e-mail: nem todo cliente informa
  });
  const cli3 = await prisma.cliente.create({
    data: { nome: "Juliana Martins", whatsapp: "5551977665544", email: "juliana.m@email.com" },
  });
  console.log("✓ Clientes criados:", cli1.nome, "|", cli2.nome, "|", cli3.nome);

  // 2) Filhos — Produtos ----------------------------------------------------
  const vestFloral = await prisma.produto.create({
    data: {
      nome: "Vestido Floral Jardim",
      descricao: "Vestido de algodão com estampa floral, ideal para festas infantis.",
      preco: new Prisma.Decimal("89.90"),
      ativo: true,
      categoriaId: catMenina.codigo,
    },
  });
  const conjBebe = await prisma.produto.create({
    data: {
      nome: "Body Tricô Coração",
      descricao: "Body em tricô macio para recém-nascidos.",
      preco: new Prisma.Decimal("49.90"),
      ativo: true,
      categoriaId: catBebe.codigo,
    },
  });
  const camisaDino = await prisma.produto.create({
    data: {
      nome: "Camiseta Dino Explorer",
      preco: new Prisma.Decimal("39.90"), // sem descrição: peça simples do catálogo
      ativo: true,
      categoriaId: catMenino.codigo,
    },
  });
  const calcLegging = await prisma.produto.create({
    data: {
      nome: "Calça Legging Colorida",
      preco: new Prisma.Decimal("45.90"),
      ativo: true,
      categoriaId: catMenina.codigo,
    },
  });
  const gorroTrico = await prisma.produto.create({
    data: {
      nome: "Gorro Tricô Inverno",
      preco: new Prisma.Decimal("29.90"),
      ativo: false, // fora da galeria: esgotado
      categoriaId: catAcessorios.codigo,
    },
  });
  console.log("✓ Produtos criados:", vestFloral.nome, "|", conjBebe.nome, "|", camisaDino.nome, "|", calcLegging.nome, "|", gorroTrico.nome);

  // 3) Filhos — Grade (Produto × Tamanho × Cor) com quantidades ------------
  const grades = [
    // Vestido Floral Jardim: rosa nas faixas de menina
    { produtoId: vestFloral.codigo, tamanhoId: tam24a.codigo, corId: corRosaBebe.codigo, quantidade: 8 },
    { produtoId: vestFloral.codigo, tamanhoId: tam46a.codigo, corId: corRosaBebe.codigo, quantidade: 5 },
    { produtoId: vestFloral.codigo, tamanhoId: tam68a.codigo, corId: corRosaBebe.codigo, quantidade: 2, observacao: "Últimas peças" },
    { produtoId: vestFloral.codigo, tamanhoId: tam46a.codigo, corId: corBranco.codigo, quantidade: 3, observacao: "Sob encomenda" },
    // Body Tricô Coração: branco e amarelo nas faixas de bebê
    { produtoId: conjBebe.codigo, tamanhoId: tamBebP.codigo, corId: corBranco.codigo, quantidade: 10 },
    { produtoId: conjBebe.codigo, tamanhoId: tamBebM.codigo, corId: corAmareloClaro.codigo, quantidade: 6 },
    { produtoId: conjBebe.codigo, tamanhoId: tamG12M.codigo, corId: corBranco.codigo, quantidade: 4 },
    // Camiseta Dino Explorer: azul marinho e estampa
    { produtoId: camisaDino.codigo, tamanhoId: tam24a.codigo, corId: corAzulMarinho.codigo, quantidade: 7 },
    { produtoId: camisaDino.codigo, tamanhoId: tam46a.codigo, corId: corAzulMarinho.codigo, quantidade: 4 },
    { produtoId: camisaDino.codigo, tamanhoId: tam46a.codigo, corId: corEstampadoDino.codigo, quantidade: 6 },
    { produtoId: camisaDino.codigo, tamanhoId: tam68a.codigo, corId: corAzulMarinho.codigo, quantidade: 3, observacao: "Últimas peças" },
    // Calça Legging Colorida
    { produtoId: calcLegging.codigo, tamanhoId: tam24a.codigo, corId: corVerdeMenta.codigo, quantidade: 5 },
    { produtoId: calcLegging.codigo, tamanhoId: tam24a.codigo, corId: corAzulMarinho.codigo, quantidade: 4 },
    { produtoId: calcLegging.codigo, tamanhoId: tam810a.codigo, corId: corAzulMarinho.codigo, quantidade: 6 },
  ];
  await prisma.grade.createMany({ data: grades });
  console.log(`✓ ${grades.length} combinações de grade criadas (estoque).`);

  // 4) Filhos — Interesses (pedidos manifestados via WhatsApp) --------------
  const dt = (d) => new Date(d);
  await prisma.interesse.create({
    data: {
      mensagem: "Olá! Gostei do Vestido Floral Jardim no tamanho 4 a 6 anos, cor rosa. Vocês têm disponível?",
      status: "pendente",
      clienteId: cli1.codigo,
      produtoId: vestFloral.codigo,
      dataInteresse: dt("2026-08-08T10:30:00Z"),
    },
  });
  await prisma.interesse.create({
    data: {
      mensagem: "Quero 2 bodies tricô tamanho bebê M na cor amarela, por favor.",
      status: "contactado",
      clienteId: cli2.codigo,
      produtoId: conjBebe.codigo,
      dataInteresse: dt("2026-08-06T15:45:00Z"),
    },
  });
  await prisma.interesse.create({
    data: {
      mensagem: "A camiseta do dino no 6 a 8 anos ainda está disponível? Quero reservar.",
      status: "concluido",
      clienteId: cli3.codigo,
      produtoId: camisaDino.codigo,
      dataInteresse: dt("2026-08-03T09:10:00Z"),
    },
  });
  console.log("✓ Interesses criados: 3 pedidos via WhatsApp.");

  console.log("\n✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
