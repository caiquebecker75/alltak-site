# Alltak — Site Institucional

Reconstrução em código do site da **Alltak** (envelopamento, decoração e
comunicação visual), a partir da prévia em Wix `75lab-alltak.com`, aplicando o
refino de marca solicitado no briefing **"75 LAB | ALLTAK | AJUSTES SITE"**.

Projeto da **75 LAB**.

## Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS**
- **React Router** (HashRouter — funciona em hospedagem estática sem regras de rewrite)

## Rodar localmente

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção em /dist
npm run preview  # pré-visualizar o build
```

## Identidade de marca aplicada

- **Tipografia:** Big Shoulders Display (fonte da marca, auto-hospedada em `public/fonts`).
- **Cores:** Vermelho Alltak `#e30613`, preto, branco e azul escuro.
  - **Wraps** → preto · **Decor** → azul escuro · **Signs** → azul escuro.
- **Elemento-assinatura:** trapézios/paralelogramos (máscaras de imagem, divisores e botões).
- **Textura:** padrão *caveiras & rosas* nas frentes Wraps.

## Estrutura da Home (nova ordem do briefing)

1. Banner principal
2. Unidades de negócio — **Wraps / Decor / Signs** (com marca e cor de cada frente)
3. Bloco de inspiração / vídeo institucional → canal do YouTube
4. Catálogos
5. Conteúdos complementares (Store, Onde Comprar, Instaladores, Cursos)
6. Sobre Nós (âncora `#sobre`)

## Páginas

`/` · `/catalogos` · `/produtos` · `/onde-comprar` · `/instaladores` ·
`/cursos` · `/contato` · `/politica-de-privacidade`

> As páginas internas seguem a arquitetura do documento **"Alltak _ Organização
> Site"**. Conteúdos marcados como *exemplo/demonstração* (distribuidores,
> instaladores, endereço, formulário) devem ser substituídos pelos dados oficiais
> da Alltak, e o botão de compra aponta para a **Alltak Store** (e-commerce externo).

## Assets

Imagens e fontes em `public/assets` e `public/fonts`, extraídas do Drive do
projeto (pastas *Site_Imagens Home*, *Banners*, *Elementos*, *Fontes*).
