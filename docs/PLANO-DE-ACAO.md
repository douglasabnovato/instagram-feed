# Plano de ação — alô, uai (antigo instagram-feed)

Timebox: 45 min.

| MoSCoW | Item | Ganho | Esforço | Status |
|---|---|---|---|---|
| Must | Credenciais fora do código (D1) | Alto | Baixo | ✅ só em 03/11/2026 (o `backend/src/index.js` ainda tinha a senha); revogar no Atlas: #85 |
| Must | Upload seguro (D2) | Alto | Baixo | ✅ |
| Must | Ordenação e curtida (D3, D4) | Alto | Baixo | ✅ |
| Should | Bugs de JS do app (D5) | Médio | Médio | ✅ código; ⏳ não compilado |
| Should | Limites de envio (D6) | Médio | Baixo | ✅ |
| Should | Web em Vite + acessibilidade (D7) | Médio | Médio | ✅ axe 0 |
| Should | Trocar logo/nome antes de publicar (D8) | Médio | Baixo | **Feito: alô, uai (27/09/2026)** |
| Could | Login para publicar | Médio | Médio | **Decisão sua** |
| Could | Migrar o app para Expo | Médio | Alto | **Decisão sua** |
| Could | Imagens no Cloudinary | Médio | Médio | Próximo ciclo |

## Ciclo de 03/11/2026

> Branch `feature/2026-11-03` → `developer/sprint-2026-11-05` → `master`. Nível: Estudo (N1). Critérios 5 e 7 não se aplicam.

### Produto

**Problema e público.** Quem estuda fullstack quer ver um feed de fotos com upload e tempo real funcionando de ponta a ponta. O alô, uai é esse exemplo.

**Hipótese e meta.** Publicar uma foto em até 3 passos e ver a curtida chegar sem recarregar. Proposta; sem teste com pessoas.

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Credencial vazada se revoga, não só se apaga do código | O arquivo com a senha saiu do código, e a revogação no Atlas virou issue do responsável (#85). O caso público de uma URI do Atlas vazada no GitHub recomenda girar a credencial e ler os logs de acesso | [NVD: CVE-2025-54428](https://nvd.nist.gov/vuln/detail/CVE-2025-54428) |
| Atualização otimista desfeita quando o servidor recusa | A curtida marca o coração na hora e, se a API recusar (limite de curtidas, rede), desfaz a marca e avisa | [OpenReplay: optimistic updates](https://blog.openreplay.com/optimistic-updates-make-apps-faster/), [SitePoint: useOptimistic](https://www.sitepoint.com/react-useoptimistic-production-patterns-for-instant-ui-updates/) |
| Botão "Carregar mais" em vez de rolagem infinita | O botão deixa o rodapé alcançável e funciona com teclado. Usamos `aria-controls` e um contador em `aria-live` | [NN/g: infinite scrolling tips](https://nngroup.com/articles/infinite-scrolling-tips), [Accessible infinite scroll and pagination](https://ezud.com/accessible-infinite-scroll-pagination/) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Apagar o servidor antigo com a senha | Alto | Baixo | Este ciclo (#92) |
| 2 | Revogar o usuário antigo no Atlas | Alto | Baixo | Responsável (#85) |
| 3 | "Tentar novamente" e curtida que desfaz | Médio | Baixo | Este ciclo (#92) |
| 4 | "Carregar mais fotos" | Médio | Baixo | Este ciclo (#92) |
| 5 | CI nos PRs para a `developer` | Alto | Baixo | Este ciclo |
| 6 | Proteger a `master` | Alto | Baixo | Responsável (#86) |
| 7 | Republicar no Render | Médio | Baixo | Responsável (#87) |
| 8 | App móvel e Dependabot | Médio | Alto | Issue (#88) |
| 9 | Aviso de tempo real desconectado | Médio | Baixo | Issue (#89) |
| 10 | Teste de navegador do fluxo | Médio | Médio | Issue (#90) |
| 11 | Apagar a identidade antiga sem uso | Baixo | Baixo | Issue (#91) |

**Fora do escopo.** Contas, comentários, seguidores e armazenamento permanente de imagens.

### Engenharia

**Arquitetura.** API Express 5 (`backend/src/server.js` → `app.js`) com repositório injetado: Mongoose na produção, memória nos testes. Imagens com Multer e Sharp em disco. Web em Vite + React 18 (`frontend/src/main.jsx`), com `fetch` em `lib/api.js` e Socket.IO para posts e curtidas. App React Native 0.61 em `instarocket/`, fora do deploy.

**Riscos.**
- A senha antiga segue no histórico do Git até a revogação no Atlas (#85).
- Sem proteção na `master`, um push direto entra sem CI (#86).
- O site está fora do ar (404 em 03/11/2026) (#87).
- O app móvel tem dependências de 2019; o Dependabot propõe saltos maiores que quebram o CI (#88).

**Qualidade.**
- Testes: 5 no backend (`node --test`) e 11 no web (Vitest), também com a ordem embaralhada.
- CI: agora também nos PRs para `developer/**`.
- Acessibilidade: foco visível global; botões novos com nome claro; contador de fotos em `aria-live`.
- Segurança: `npm audit --omit=dev` sem alertas no backend e no web; nenhuma URI com senha no código (só exemplos com `SENHA`).

**Definição de pronto.** `npm ci` e `npm test` (e `npm run build` no web) passam; CI verde no PR; `docs/MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. Apagar `backend/src/index.js` e o que só ele usava (`routes.js`, `config/upload.js`, `controllers/`), e o código antigo do CRA no web.
2. "Tentar novamente", curtida que desfaz e "Carregar mais fotos", com testes.
3. CI nos PRs para a `developer`.
4. `docs/MVP.md` com a régua N1 e o critério 9 corrigido; README com próximos passos.

**Vira issue.** #85, #86, #87 (responsável); #88, #89, #90, #91 (agente).

## Ciclo de 15/11/2026

> Branch `feature/2026-11-16` (o nome usa a data em UTC; o trabalho é de 15/11/2026, no horário de Brasília) → `developer/sprint-2026-11-12` → `master`. A sprint de 12/11 ainda não foi para a `master` (PR #98), então o trabalho entra nela. Nível: Estudo (N1).

### Produto

**Problema e público.** O mesmo de 03/11: quem estuda fullstack quer ver upload e tempo real funcionando de ponta a ponta.

**Hipótese e meta.** A mesma: publicar uma foto em até 3 passos e ver a curtida chegar sem recarregar. Neste ciclo, ela passa a ser conferida por um teste no navegador, e não só por testes com `fetch` falso.

**O que a análise achou.**
- O `MVP.md` dava os critérios 3 e 8 como "Atende" sem o que a régua pede: teste de ponta a ponta no navegador (Playwright) passando no CI, e axe dentro dele. Os testes do web rodam no jsdom.
- O feed não avisa quando o tempo real cai. No plano gratuito, o servidor dorme, e a tela fica parada sem aviso.
- São 7 PRs esperando o responsável: a sprint (#98), o mongoose (#99) e 5 do Dependabot no app móvel (#78 a #82), todos com o job `instarocket` quebrado.
- Arquivos da identidade antiga seguem no repositório e no build.

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Duas páginas no mesmo teste simulam duas pessoas | O teste abre uma segunda página e confere que a curtida chega nela sem recarregar | [Playwright: páginas](https://playwright.dev/docs/pages) |
| axe dentro do teste de ponta a ponta | `@axe-core/playwright` no feed e na publicação, com dados reais da API em memória | [Playwright: testes de acessibilidade](https://playwright.dev/docs/accessibility-testing) |
| O socket avisa quando cai e quando volta | Os eventos `disconnect` e `connect` do cliente ligam e desligam o aviso; ao voltar, o feed busca a primeira página de novo | [Socket.IO: instância do cliente](https://socket.io/docs/v4/client-socket-instance/) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Teste de navegador do fluxo, com axe, num job do CI | Alto | Médio | Este ciclo (#90) |
| 2 | Aviso de tempo real desconectado e reconexão | Médio | Baixo | Este ciclo (#89) |
| 3 | Apagar a identidade antiga sem uso | Baixo | Baixo | Este ciclo (#91) |
| 4 | `MVP.md` e README de acordo com a régua | Alto | Baixo | Este ciclo |
| 5 | Mesclar #98 e #99 | Alto | Baixo | Responsável |
| 6 | Revogar o usuário antigo no Atlas | Alto | Baixo | Responsável (#85) |
| 7 | Republicar no Render com banco novo | Médio | Baixo | Responsável (#87) |
| 8 | Congelar ou migrar o app móvel | Médio | Alto | Decisão do responsável (#88) |

**Fora do escopo.** Contas, comentários, seguidores e armazenamento permanente de imagens.

### Engenharia

**Arquitetura.** Sem mudança. Entra `backend/src/demo.js`: a mesma API com o repositório em memória e o Socket.IO, para o teste de ponta a ponta subir sem banco.

**Riscos.**
- O teste de navegador depende do tempo real; espera por estado na tela, nunca por tempo fixo.
- O job novo `e2e` não entra nos checks obrigatórios do ruleset: isso é configuração do responsável.

**Qualidade.** Testes do backend e do web seguem; entra o Playwright com axe. Lint, testes e build antes de cada push.

**Definição de pronto.** CI verde no PR, com o job `e2e` passando; `docs/MVP.md` com evidência de comando, data e resultado.

### Plano de ação

**Este ciclo executa.** #90, #89, #91 e a revisão do `MVP.md` e do README.

**Fica com o responsável.** #85, #87, o merge de #98 e #99 e a decisão de #88.
