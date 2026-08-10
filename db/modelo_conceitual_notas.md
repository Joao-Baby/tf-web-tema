# Modelo Conceitual — Tico de Gente

## Contexto
Loja de roupa infantil. Site é galeria/catálogo virtual com controle de estoque,
sem checkout. Pedidos são feitos pelo WhatsApp da empresa.

## Entidades e atributos

### Categoria
- codigo (identificador)
- nome (ex.: bebês, meninas, meninos, acessórios)
- descricao (opcional)

### Produto
- codigo
- nome (ex.: Vestido Floral Jardim)
- descricao (opcional, mas existe com propósito)
- preco
- ativo (disponível na galeria)

### Tamanho
- codigo
- faixa (ex.: bebê P, 2 anos, 6 anos)
- idadeMinima / idadeMaxima (opcional)

### Cor
- codigo
- nome (ex.: Rosa Bebê, Azul Marinho)

### Grade (estoque do produto)
- codigo
- quantidade
- observacao (opcional: "últimas peças", "sob encomenda")

### Cliente (visitante da loja virtual que demonstra interesse)
- codigo
- nome
- telefone/whatsapp
- email (opcional)

### Interesse (pedido manifestado via WhatsApp, não é compra)
- codigo
- dataInteresse
- mensagem
- status (pendente, contactado, concluido)

## Relacionamentos e cardinalidades

- Categoria 1:N Produto — um Produto pertence a exatamente uma Categoria;
  uma Categoria tem muitos Produtos.
- Produto 1:N Grade — um Produto tem várias combinações de tamanho/cor com estoque;
  cada Grade pertence a um Produto.
- Tamanho 1:N Grade — um Tamanho aparece em várias Grades; cada Grade tem um Tamanho.
- Cor 1:N Grade — uma Cor aparece em várias Grades; cada Grade tem uma Cor.
  (Grade = ponto de interseção ternário Produto–Tamanho–Cor, desdobrado em chave
   da tabela Grade com quantidade por combinação.)
- Cliente 1:N Interesse — um Cliente pode demonstrar interesse várias vezes;
  cada Interesse pertence a um Cliente.
- Produto 1:N Interesse — um Interesse (pedido via WhatsApp) refere-se a um Produto;
  um Produto pode receber muitos Interesses.

Cardinalidades mínimas/máximas (MER):
- Categoria(1,n) —— (0,n)Produto
- Produto(1,n) —— (1,n)Grade —— (1,n)Tamanho
- Produto(1,n) —— (1,n)Grade —— (1,n)Cor
- Cliente(1,n) —— (0,n)Interesse —— (1,n)Produto

Observação sobre Grade: tabela de interseção que carrega o atributo quantidade.
Cada combinação produto+tamanho+cor possui sua quantidade em estoque.
