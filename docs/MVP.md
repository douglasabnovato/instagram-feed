# MVP — instagram-feed (alô, uai)

> Criado em 02/11/2026. Revisto em 03/11/2026 e em 15/11/2026, nos ciclos do processo por repositório. Este arquivo é a fonte única do estado. Testado no Windows, com Node 24. Não houve teste com pessoas nem em aparelho real.

**Nível:** Estudo (N1). Os critérios 5 e 7 não se aplicam e saem da conta: 10 critérios.

**Resumo:** 9 de 10 aplicáveis atendidos (1, 2, 3, 4, 6, 8, 10, 11, 12); 1 parcial (9). Estado em 15/11/2026: os critérios 3, 8 e 11 passaram a ter a evidência que a régua pede (teste no navegador, com axe, no CI).

**Finalizado:** sim

Em 03/11/2026 eram 8 de 10 (9 e 10 parciais). O resumo de antes dizia 9 de 12 e marcava segurança como "Atende", mas `backend/src/index.js` ainda tinha usuário e senha do Atlas.

Pela regra do ciclo, o critério que falta depende do responsável: 9, com #85 (revogar) e #88 (decidir o app móvel), ambas com o rótulo `depende-do-responsavel`.

Até 10/11/2026, os critérios 3 e 8 constavam como "Atende" só com testes no jsdom, sem o teste de navegador que a régua pede. Em 15/11/2026 essa evidência passou a existir.

## 1. Critérios

| # | Critério | Como verificar | Situação | Evidência | Data |
|---|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: pessoas publicam fotos com legenda e curtem em um feed | `docs/PLANO-DE-ACAO.md` | 03/11/2026 |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: seção 2; ainda sem validação com pessoas | Seção 2 | 03/11/2026 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: no navegador, o Playwright publica uma foto, vê a imagem no feed e curte; a curtida chega numa segunda página sem recarregar. Roda no job `e2e` do CI, contra a API em memória. O site está no ar desde 15/11/2026: <https://alo-uai-web.onrender.com> | `cd frontend && npm run test:e2e`: 2 passed em cada uma de 3 execuções seguidas. Prova de que o teste pega a quebra: trocar `socket.on("like"` por outro nome em `Feed.jsx` faz o teste falhar em "1 curtida" na segunda página | 15/11/2026 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende | Seção 3 | 03/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1) | — | 03/11/2026 |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: feed vazio, sem conexão, erro do servidor com "Tentar novamente", curtida recusada (desfaz e avisa), upload inválido e tempo real desconectado ou sem conseguir conectar (aviso; ao reconectar, a primeira página se junta ao feed sem perder as páginas já carregadas) têm resposta e teste | `cd frontend && npm test`: 14 passed; `cd backend && npm test`: 5 passed | 15/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1) | — | 03/11/2026 |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe (WCAG A e AA) sem violações no feed com uma foto real e na publicação, dentro do teste de navegador; o primeiro Tab mostra o contorno de foco de 3px. O axe achou o nome do link da marca sem o texto visível (WCAG 2.5.3), corrigido. O app não tem tema escuro | `npm run test:e2e` (funções `semViolacoes` e teste de teclado em `frontend/e2e/fluxo.e2e.js`) | 15/11/2026 |
| 9 | Segurança e conformidade | Riscos decididos | Parcial: API e web sem alertas de produção; nenhuma URI com senha no código. A senha antiga segue no histórico do Git até o responsável revogar o usuário no Atlas (#85). O app `instarocket/` tem 34 alertas abertos do Dependabot (7 críticos, 16 altos, 10 médios, 1 baixo) e espera a decisão de congelar ou migrar (#88) | `npm audit --omit=dev`: 0 em `backend/` (mongoose 8.24.9) e em `frontend/`; `gh api repos/douglasabnovato/instagram-feed/dependabot/alerts` | 15/11/2026 |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Atende: ruleset `principal-protegida` ativo na `master` (exige PR, bloqueia force push e exclusão); o workflow `CI` roda nos PRs para `master` e `developer/**` | `gh api repos/douglasabnovato/instagram-feed/rulesets`; #86 | 10/11/2026 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 5 testes da API, 14 do web, 2 de navegador (job `e2e`) e o teste do app no CI, sem testes pulados | CI do PR do ciclo de 15/11/2026 | 15/11/2026 |
| 12 | Documentação honesta | O README ensina a rodar, e os números estão certos | Atende: README com `npm run demo` e `npm run test:e2e` conferidos contra os `package.json`; traz o link publicado, conferido em 15/11/2026 | `Readme.md`, este arquivo | 15/11/2026 |

## 2. Hipótese (proposta)

Praticar upload e tempo real: publicar uma foto em até 3 passos e ver a curtida chegar sem recarregar.

## 3. Fora do MVP

Contas, comentários, seguidores e armazenamento permanente de imagens.

## 4. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Apagar o servidor antigo com a senha | Feito (#92) |
| 2 | "Tentar novamente", curtida que desfaz, "Carregar mais fotos" | Feito (#92) |
| 3 | CI nos PRs para a `developer` | Feito neste ciclo |
| 4 | Revogar o usuário antigo no Atlas | Com o responsável (#85) |
| 5 | Proteger a `master` | Feito (#86) |
| 6 | Republicar no Render | Feito em 15/11/2026 (#87) |
| 7 | App móvel e Dependabot | Decisão do responsável (#88) |
| 8 | Aviso de tempo real desconectado | Feito (#89) |
| 9 | Teste de navegador do fluxo, com axe | Feito (#90) |
| 10 | Apagar a identidade antiga sem uso | Feito (#91) |
| 11 | mongoose sem o alerta alto | Feito neste ciclo (mesma correção do #99) |
