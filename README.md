# Tico de Gente — Projeto de Banco de Dados (TF03)

> **Trabalho #TF03 — Projeto de Banco de Dados (Conceitual, Lógico e Físico)**
> Disciplina: WEBM 2026 | Tecnologias: Express + Prisma + Neon

## Descrição do domínio

A **Tico de Gente** é uma loja de roupa infantil. O sistema desenvolvido pelo grupo é um **site galeria com controle de estoque**: uma loja virtual em que os clientes podem navegar pelo catálogo de peças, ver preços, tamanhos e cores disponíveis em estoque, mas **sem realizar a compra dentro do próprio site**. O fechamento dos pedidos acontece por um canal externo — o **WhatsApp da empresa** — que o site disponibiliza de forma destacada. Dessa forma, o site cumpre dois papéis: apresentar o catálogo da loja (inclusive peças esgotadas, marcadas como inativas) e ajudar a equipe da loja a acompanhar as demandas manifestadas pelos clientes.

| Item | Descrição |
| --- | --- |
| Integrantes da equipe | *(preencher com os nomes dos integrantes)* |
| Tema do sistema | Catálogo virtual com controle de estoque da loja de roupa infantil Tico de Gente |
| Usuários | Clientes (mães, pais e familiares que navegam na loja virtual) e a equipe da loja (que gerencia o catálogo, o estoque e os contatos recebidos) |
| Problema resolvido | O site permite que o cliente consulte as peças e a disponibilidade em tempo real sem depender de mensagens no WhatsApp, e permite que a loja registre e acompanhe cada pedido manifestado pelo canal |

O banco de dados modela, portanto, o **catálogo** (categorias, produtos, tamanhos e cores), a **grade de estoque** (quantidade de cada combinação de produto, tamanho e cor) e os **contatos** (clientes que demonstraram interesse e seus pedidos feitos via WhatsApp).

---

## Modelo Conceitual

![Modelo Conceitual — Tico de Gente](db/conceitual.png)

### Entidades

**Categoria** representa os grupos de público do catálogo (por exemplo, "Bebês (0-24 meses)", "Meninas (2-12 anos)", "Meninos (2-12 anos)" e "Acessórios"). Seus atributos são o código identificador, o nome (que também identifica unicamente a categoria, pois não existem dois grupos com o mesmo rótulo) e uma descrição opcional, presente porque alguns grupos podem receber um texto de apresentação no site, mas categorias simples não precisam dele.

**Produto** é a peça do catálogo (por exemplo, "Vestido Floral Jardim" ou "Camiseta Dino Explorer"). Seus atributos são o código, o nome (único no catálogo), a descrição opcional (peças simples do catálogo não têm texto detalhado), o preço (obrigatório, pois toda peça exposta tem valor) e o atributo booleano `ativo`, que permite retirar da galeria uma peça esgotada ou descontinuada sem apagá-la do histórico.

**Tamanho** representa as faixas etárias de roupa infantil ("Bebê P", "12 meses", "2 a 4 anos"...). Além do código e do nome da faixa, possui idade mínima e máxima opcionais, porque nem toda faixa tem uma correspondência etária clara (como "Bebê P").

**Cor** lista as cores das peças (por exemplo, "Rosa Bebê" ou "Azul Marinho"). Mantida como entidade separada, e não como texto solto no produto, para que a mesma cor seja reutilizada em diversos produtos e facilite filtros no site.

**Grade** é o estoque real da loja: cada linha representa a quantidade disponível de **uma combinação específica de produto, tamanho e cor** (por exemplo, 8 unidades do Vestido Floral Jardim no tamanho 4 a 6 anos, cor Rosa Bebê). O atributo `quantidade` é o coração do controle de estoque; a `observacao` opcional permite avisos como "Últimas peças" ou "Sob encomenda". A Grade funciona como ponto de interseção entre Produto, Tamanho e Cor, carregando o atributo de quantidade que não pertence a nenhuma das três entidades isoladamente.

**Cliente** é o visitante da loja virtual que deixa contato para receber atendimento. Seus atributos são o código, o nome e o WhatsApp (canal principal de contato e de fechamento dos pedidos, único no sistema). O e-mail é opcional porque nem todo cliente informa esse dado ao entrar em contato pelo WhatsApp.

**Interesse** registra um pedido manifestado pelo cliente via WhatsApp — não é uma compra dentro do site, e sim a documentação da demanda para a loja acompanhar. Seus atributos são a data do interesse, a mensagem enviada pelo cliente (qual peça, qual tamanho, dúvidas), o status de atendimento ("pendente", "contactado" ou "concluido") e as referências ao cliente e ao produto desejado.

### Relacionamentos e cardinalidades

Cada **Categoria** possui um ou mais **Produtos** (1,n), mas cada **Produto** pertence a exatamente uma Categoria (1,1) — uma peça não pode estar em dois grupos de público ao mesmo tempo.

Cada **Produto** possui zero ou mais registros na **Grade** (0,n), pois uma peça recém-cadastrada pode ainda não ter estoque lançado; já cada **Grade** pertence a exatamente um Produto (1,1). O mesmo raciocínio vale para **Tamanho** e **Cor**: cada Tamanho aplica-se a zero ou mais Grades (0,n), e cada Grade referencia exatamente um Tamanho (1,1) e exatamente uma Cor (1,1). Na prática, a combinação Produto + Tamanho + Cor é única no estoque (restrição de unicidade na Grade).

Cada **Cliente** pode demonstrar zero ou mais **Interesses** (0,n) — um mesmo cliente pode pedir várias peças ao longo do tempo — e cada **Interesse** pertence a exatamente um Cliente (1,1). Por fim, cada **Produto** pode ser referenciado por zero ou mais Interesses (0,n), e cada Interesse se refere a exatamente um Produto (1,1), pois o cliente pergunta por uma peça específica de cada vez.

---

## Modelo Lógico

O modelo lógico está representado diretamente no arquivo [`prisma/schema.prisma`](prisma/schema.prisma), que define as tabelas, os campos, os tipos de dados e os relacionamentos de forma executável.

```prisma
// prisma/schema.prisma — resumo das entidades
model Categoria {
  codigo    String    @id @default(uuid())
  nome      String    @unique
  descricao String?
  criadoEm  DateTime  @default(now())
  produtos  Produto[]
}

model Produto {
  codigo       String   @id @default(uuid())
  nome         String   @unique
  descricao    String?
  preco        Decimal
  ativo        Boolean  @default(true)
  categoriaId  String
  criadoEm     DateTime @default(now())
  atualizadoEm DateTime @updatedAt
  categoria    Categoria @relation(fields: [categoriaId], references: [codigo])
  grade        Grade[]
  interesses   Interesse[]
}

model Tamanho {
  codigo      String   @id @default(uuid())
  faixa       String   @unique
  idadeMinima Int?
  idadeMaxima Int?
  criadoEm    DateTime @default(now())
  grade       Grade[]
}

model Cor {
  codigo   String   @id @default(uuid())
  nome     String   @unique
  criadoEm DateTime @default(now())
  grade    Grade[]
}

model Grade {
  codigo       String   @id @default(uuid())
  quantidade   Int      @default(0)
  observacao   String?
  produtoId    String
  tamanhoId    String
  corId        String
  criadoEm     DateTime @default(now())
  atualizadoEm DateTime @updatedAt
  produto      Produto  @relation(fields: [produtoId], references: [codigo])
  tamanho      Tamanho  @relation(fields: [tamanhoId], references: [codigo])
  cor          Cor      @relation(fields: [corId], references: [codigo])
  @@unique([produtoId, tamanhoId, corId], name: "grade_uk")
}

model Cliente {
  codigo     String      @id @default(uuid())
  nome       String
  whatsapp   String      @unique
  email      String?
  criadoEm   DateTime    @default(now())
  interesses Interesse[]
}

model Interesse {
  codigo        String    @id @default(uuid())
  dataInteresse DateTime   @default(now())
  mensagem      String
  status        String    @default("pendente")
  clienteId     String
  produtoId     String
  criadoEm      DateTime  @default(now())
  atualizadoEm  DateTime  @updatedAt
  cliente       Cliente   @relation(fields: [clienteId], references: [codigo])
  produto       Produto   @relation(fields: [produtoId], references: [codigo])
}
```

### Diagrama do modelo lógico (Mermaid)

```mermaid
erDiagram
    CATEGORIA ||--o{ PRODUTO : "possui"
    PRODUTO ||--o{ GRADE : "possui em estoque"
    TAMANHO ||--o{ GRADE : "aplica-se a"
    COR ||--o{ GRADE : "aplica-se a"
    CLIENTE ||--o{ INTERESSE : "demonstra"
    PRODUTO ||--o{ INTERESSE : "referenciado em"

    CATEGORIA {
        String codigo PK
        String nome UK
        String? descricao
        DateTime criadoEm
    }
    PRODUTO {
        String codigo PK
        String nome UK
        String? descricao
        Decimal preco
        Boolean ativo
        String categoriaId FK
        DateTime criadoEm
        DateTime atualizadoEm
    }
    TAMANHO {
        String codigo PK
        String faixa UK
        Int? idadeMinima
        Int? idadeMaxima
        DateTime criadoEm
    }
    COR {
        String codigo PK
        String nome UK
        DateTime criadoEm
    }
    GRADE {
        String codigo PK
        Int quantidade
        String? observacao
        String produtoId FK
        String tamanhoId FK
        String corId FK
        DateTime criadoEm
        DateTime atualizadoEm
    }
    CLIENTE {
        String codigo PK
        String nome
        String whatsapp UK
        String? email
        DateTime criadoEm
    }
    INTERESSE {
        String codigo PK
        DateTime dataInteresse
        String mensagem
        String status
        String clienteId FK
        String produtoId FK
        DateTime criadoEm
        DateTime atualizadoEm
    }
```

---

## Modelo Físico

O modelo físico é o banco de dados real rodando no **Neon** (PostgreSQL), construído pelas migrations e populado pelo seed.

### Migrations

O histórico completo de migrations está versionado no Git em [`prisma/migrations/`](prisma/migrations/), gerado por `npx prisma migrate dev` (nunca por `db push`). A migration `20260810141308_init` cria as sete tabelas com suas chaves primárias, chaves estrangeiras, restrições únicas (nomes de categoria, faixa de tamanho, cor, WhatsApp e a combinação produto+tamanho+cor da grade) e colunas de timestamp.

### Seed

O script [`prisma/seed.js`](prisma/seed.js) popula todas as tabelas com dados fictícios coerentes com o domínio da loja de roupa infantil e respeita a ordem das chaves estrangeiras: primeiro os registros pais (Categoria, Tamanho, Cor e Cliente) e depois os filhos (Produto, Grade e Interesse). O comando de seed está configurado no `package.json`:

```json
"prisma": { "seed": "node prisma/seed.js" }
```

O seed é **idempotente**: se o banco já estiver populado, ele simplesmente não faz nada, permitindo reexecutar com segurança.

### Configuração de conexão

O arquivo [`.env.example`](.env.example) contém a string de conexão no formato do Neon com valores genéricos:

```env
DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"
```

O `.env` real **não está versionado**: ele aparece em linha própria no `.gitignore`, o que é confirmado por `git status .env` e `git check-ignore -v .env`.

### Evidência funcional

Os prints abaixo foram capturados no **Prisma Studio** (`npx prisma studio`) após a execução de `npx prisma migrate dev` e `npx prisma db seed`, provando que o modelo físico está rodando com tabelas criadas e dados populados.

**Todas as tabelas criadas e populadas (visão geral do Prisma Studio):**

![Evidência — visão geral do Prisma Studio](db/evidencia_prisma_overview.png)

**Tabela Produto com dados do catálogo:**

![Evidência — tabela Produto](db/evidencia_prisma_produtos.png)

**Tabela Grade com o controle de estoque (quantidades e observações como "Últimas peças" e "Sob encomenda"):**

![Evidência — tabela Grade](db/evidencia_prisma_grade.png)

---

## Como rodar o projeto

```bash
# 1. Instalar dependências
npm install

# 2. Copiar o exemplo de variáveis de ambiente e editar com a URL do Neon
cp .env.example .env

# 3. Aplicar as migrations (cria as tabelas no banco)
npx prisma migrate dev

# 4. Popular o banco com o seed
npx prisma db seed

# 5. (Opcional) Inspecionar o banco visualmente
npx prisma studio
```

## Checklist de entrega

| ✓ | Item |
| --- | --- |
| ☐ | README começa com a descrição do domínio (tema, usuários, problema) |
| ☐ | Pasta `db/` existe com `conceitual.png` |
| ☐ | README tem link para `db/conceitual.png` |
| ☐ | Toda entidade do conceitual tem parágrafo explicativo no README |
| ☐ | Cardinalidades descritas em texto, não só no desenho |
| ☐ | `schema.prisma` tem 7 entidades com nomes do domínio real |
| ☐ | Todo campo opcional (`?`) tem justificativa de negócio no schema |
| ☐ | Relacionamentos com `@relation` explícito e cardinalidade coerente |
| ☐ | Diagrama Mermaid presente no README |
| ☐ | Diagrama Mermaid bate com o `schema.prisma` (mesmas tabelas, campos e relacionamentos) |
| ☐ | `prisma/migrations/` versionado no Git (não foi usado `db push`) |
| ☐ | `npx prisma db seed` popula todas as tabelas sem violar FK |
| ☐ | `git status .env` confirma que o `.env` real está protegido pelo `.gitignore` |
| ☐ | `.env.example` está no repositório com o formato do Neon |
| ☐ | README tem print do Prisma Studio com tabelas populadas |
| ☐ | README tem links para `schema.prisma`, `migrations/` e `seed.js` |
| ☐ | Nenhum campo genérico sem significado |
| ☐ | Nenhuma entidade sem relacionamento quando o domínio exige um |
