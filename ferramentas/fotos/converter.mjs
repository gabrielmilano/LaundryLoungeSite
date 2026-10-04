// Converte fotos do celular (JPG/PNG/HEIC) para o formato do site:
// WebP 1600×1000 (16:10) + versão 800×500 para celular, em assets/img/fotos/.
//
// Uso (dentro de ferramentas/fotos):
//   npm install          (só na primeira vez)
//   node converter.mjs   (lê a pasta originais/ e grava em ../../assets/img/fotos/)
//
// O nome do arquivo de saída é o nome do original, sem a extensão:
//   originais/balcao.jpg  ->  assets/img/fotos/balcao.webp e balcao-800.webp
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const entrada = path.join(aqui, 'originais');
const saida = path.resolve(aqui, '../../assets/img/fotos');

// Nomes que o site espera (iguais a _data/negocio.yml > fotos.lista)
const esperadas = ['fachada', 'balcao', 'maquinas', 'equipe', 'edredom',
  'tapete-antes', 'tapete-depois', 'roupas-passadas', 'planos'];

fs.mkdirSync(saida, { recursive: true });
const arquivos = fs.existsSync(entrada)
  ? fs.readdirSync(entrada).filter(f => /\.(jpe?g|png|heic|webp)$/i.test(f))
  : [];

if (arquivos.length === 0) {
  console.log(`Nenhuma foto em ${entrada}. Coloque lá os originais com os nomes: ${esperadas.join(', ')}`);
  process.exit(0);
}

for (const arquivo of arquivos) {
  const nome = path.parse(arquivo).name.toLowerCase();
  if (!esperadas.includes(nome)) {
    console.warn(`Ignorado: ${arquivo} (nome não esperado; use um destes: ${esperadas.join(', ')})`);
    continue;
  }
  const origem = path.join(entrada, arquivo);
  for (const [largura, sufixo] of [[1600, ''], [800, '-800']]) {
    const destino = path.join(saida, `${nome}${sufixo}.webp`);
    // rotate() aplica a orientação do celular; "attention" recorta mantendo a parte mais interessante
    await sharp(origem).rotate()
      .resize(largura, Math.round(largura * 10 / 16), { fit: 'cover', position: 'attention' })
      .webp({ quality: 80 })
      .toFile(destino);
    console.log(`OK  ${arquivo} -> assets/img/fotos/${nome}${sufixo}.webp`);
  }
}
