# Análise — alô, uai (antigo instagram-feed)

## 1. Especificação

Feed de fotos social (na origem, um clone de rede social; hoje com identidade própria, alô, uai): qualquer pessoa publica uma foto com autor, local, descrição e hashtags; o feed mostra as publicações e curtidas em tempo real na web e no app.

| ID | Requisito | Critério de aceite | Antes |
|---|---|---|---|
| RF01 | Publicar foto | Imagem válida, otimizada para 500 px | ⚠️ qualquer arquivo, nome original |
| RF02 | Ver feed | Mais recentes primeiro | ❌ ordenação por campo inexistente |
| RF03 | Curtir | Contagem correta, tempo real | ⚠️ não atômica; post inexistente derruba a API |
| RF04 | Tempo real | Novos posts e curtidas aparecem sem recarregar | ✅ web; ❌ app (feed apagado) |

## 2. Defeitos encontrados

| # | Severidade | Defeito | Referência |
|---|---|---|---|
| D1 | Crítica | Usuário e senha do MongoDB Atlas no código | OWASP A02/A07:2025 |
| D2 | Alta | Upload grava com `file.originalname`: sobrescreve arquivos e aceita qualquer tipo | OWASP A05:2025 |
| D3 | Alta | `sort('-createAt')` (campo inexistente) → feed fora de ordem | — |
| D4 | Alta | Curtir post inexistente → `TypeError` (API cai); `likes += 1` com corrida | OWASP A10:2025 |
| D5 | Alta | App: `map` sem `return` apaga o feed a cada curtida; todos os campos gravam `author`; `style`/`styles`; variável `exit`; `showImagePicker` removido no v4; `url` no lugar de `uri`; react-navigation ausente do package.json | — |
| D6 | Média | Sem limites de envio/curtida (spam) | OWASP A06:2025 |
| D7 | Média | Ícone de curtir sem nome acessível, `outline: 0`, imagens sem texto alternativo útil | WCAG 2.2 1.1.1, 2.4.7, 4.1.2 |
| D8 | Média | Logo e nome imitavam a marca de uma rede social | **Resolvido em 27/09/2026:** identidade própria alô, uai |

## 3. Baseline automatizado

| Verificação | Antes | Depois |
|---|---|---|
| Testes | 0 | 5 API (imagens reais via sharp) + 4 web + 1 app |
| `npm audit` | vários (Express 4, Mongoose 5, CRA 3, socket.io-client 2) | API 0, web 0 |
| axe-core | não medido | 0 violações |

## Rubrica v2 (grupo fullstack)

Aprovação: média ponderada ≥ 7,0 **e** C1 e C4 (eliminatórios) ≥ 5. Regras: nota sem evidência vale no máximo 6; C1 limitado a 7 para parte não executada de ponta a ponta; C9 ≥ 8 só com URL publicada e CI verde.

| # | Critério | Referência | Peso | Antes | Depois | Evidência | Justificativa |
|---|---|---|---|---|---|---|---|
| C1 | Núcleo de valor | MVP (Ries); SWEBOK Requirements | 16% | 3 | 7 | E2E web+API (Playwright): publicar com imagem → feed → curtir em tempo real | API e web rodam de ponta a ponta; app não executado (limite 7) |
| C2 | Estados e condições excepcionais | Nielsen; OWASP A10:2025 | 8% | 1 | 8 | testes 400/404 + estados vazio/erro/carregando | Sem falhas silenciosas; post inexistente não derruba a API |
| C3 | Acessibilidade | WCAG 2.2 AA (axe-core) | 7% | 3 | 8 | axe-core 0 violações (feed, nova publicação) | Rótulos, texto alternativo com autor e descrição, foco visível, contraste AA |
| C4 | Segurança e privacidade | OWASP Top 10:2025 / ASVS 5.0 N1 | 14% | 1 | 6 | testes: imagem validada pelo conteúdo, nome aleatório, limites | Senha do Atlas estava no código; upload com nome original permitia sobrescrever arquivos. Publicação continua aberta a qualquer pessoa (só limite por IP) |
| C5 | Dados | 3FN / ACID / fonte única | 10% | 3 | 6 | repositório Mongo com $inc atômico; não executado aqui | Ordenação corrigida (createAt → createdAt); sem teste contra Mongo real |
| C6 | Testes | Pirâmide de testes; SWEBOK Testing | 9% | 0 | 7 | node:test 5 (API) + vitest 4 (web) + 1 teste do app (não executado) | Faltam testes do app |
| C7 | Qualidade de código | SOLID / camadas; SWEBOK Construction | 7% | 4 | 8 | DI, repositórios, processamento de imagem isolado | Sem controllers com efeitos colaterais soltos |
| C8 | Desempenho | Complexidade; Core Web Vitals | 5% | 5 | 8 | JPEG 500 px mozjpeg, cache 30 dias, lazy, paginação por cursor | Imagem otimizada e sem ampliar |
| C9 | Operação | 12-Factor; DORA | 7% | 2 | 7 | render.yaml, .env.example, CI em ci/ | Sem URL publicada |
| C10 | Documentação | README como contrato | 5% | 4 | 8 | Readme + docs/ | Como rodar API, web e app |
| C11 | Produto e evidência | Cagan (4 riscos); Torres | 7% | 4 | 6 | feed funcional; logo imita marca registrada | Logo e nome remetiam a uma rede social (resolvido: alô, uai) |
| C12 | Sustentabilidade técnica | OWASP A03:2025; SWEBOK Maintenance | 5% | 1 | 7 | npm audit 0 (API/web); app em RN 0.61 (2019) | API e web atualizados (Express 5, Mongoose 8, Vite 8); app RN 0.61 só corrigido no JS, congelado por decisão do autor no readme ("não evoluir esse módulo") |

**Média ponderada:** antes **2,41** (REPROVADO) → depois **7,01** (APROVADO).

## Limitações da avaliação

- MongoDB não executado aqui (repositório em memória com o mesmo contrato).
- O app React Native CLI 0.61 só teve o JavaScript corrigido; não foi compilado. O readme original pede para não evoluir esse módulo, por isso ele não pesa em C12. Aprovação no limite (7,01).
