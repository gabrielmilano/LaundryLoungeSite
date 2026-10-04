# Fotos do site

O site espera estas fotos reais da loja, em `assets/img/fotos/`:

| Arquivo | Onde aparece |
|---|---|
| `fachada.webp` | Fundo do topo da home (1ª opção) e imagem da empresa nos dados estruturados |
| `balcao.webp` | Fundo do topo da home, se não houver fachada |
| `maquinas.webp` | Galeria "Conheça a loja", na seção de localização da home |
| `equipe.webp` | Galeria "Conheça a loja", na seção de localização da home |
| `edredom.webp` | Card "Edredons & Cobertores" da home e topo da página de edredom |
| `roupas-passadas.webp` | Card "Roupas" da home e topo da página de lavar e passar |
| `tapete-depois.webp` | Card "Tapetes" da home, topo da página de tapetes e "Antes e depois" |
| `tapete-antes.webp` | "Antes e depois" da página de tapetes (só aparece junto com o depois) |
| `planos.webp` | Card "Planos Mensais" da home e topo da página de planos |

Enquanto um arquivo não existir, o lugar onde ele aparece usa a versão sem foto
(fundo azul da marca ou ícone). Não é preciso mexer em código.

## Como converter as fotos do celular

Precisa do Node.js instalado (já está nesta máquina).

1. Copie as fotos originais para `ferramentas/fotos/originais/`, já com o nome final:
   `fachada.jpg`, `balcao.jpg`, `edredom.jpg` etc. (JPG, PNG ou HEIC).
2. No terminal, dentro de `ferramentas/fotos`:

   ```
   npm install
   node converter.mjs
   ```

3. O script grava `assets/img/fotos/<nome>.webp` (1600×1000) e `<nome>-800.webp` (800×500),
   já girados e recortados em 16:10.
4. Faça commit dos arquivos novos de `assets/img/fotos/` e publique.

A pasta `originais/` não vai para o git nem para o site.

Sem Node: dá para usar o https://squoosh.app (WebP, qualidade 80, largura 1600 e 800),
recortando antes em 16:10 e salvando com os mesmos nomes.
