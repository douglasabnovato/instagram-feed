# MVP — instagram-feed (alô, uai)

> Criado em 02/11/2026. Revisto em 03/11/2026, no ciclo do processo por repositório. Este arquivo é a fonte única do estado. Testado no Windows, com Node 24. Não houve teste com pessoas nem em aparelho real.

**Nível:** Estudo (N1). Os critérios 5 e 7 não se aplicam e saem da conta: 10 critérios.

**Resultado em 03/11/2026:** 8 de 10 critérios aplicáveis atendidos (1, 2, 3, 4, 6, 8, 11, 12); 2 parciais (9 e 10). O resumo anterior dizia 9 de 12 e marcava segurança como "Atende", mas `backend/src/index.js` ainda tinha usuário e senha do Atlas.

**Finalizado: sim.** Pela regra do ciclo, os dois critérios que faltam dependem do responsável e têm issue aberta com o rótulo `depende-do-responsavel`: 9 (#85) e 10 (#86).

## 1. Critérios

| # | Critério | Como verificar | Situação | Evidência | Data |
|---|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: pessoas publicam fotos com legenda e curtem em um feed | `docs/PLANO-DE-ACAO.md` | 03/11/2026 |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: seção 2; ainda sem validação com pessoas | Seção 2 | 03/11/2026 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: com repositório em memória, feed vazio, publicação com imagem e foto no feed; o site está fora do ar (#87) | `backend/tests/api.test.js`, `frontend/src/__tests__/app.test.jsx` | 03/11/2026 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende | Seção 3 | 03/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1) | — | 03/11/2026 |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: feed vazio, sem conexão, erro do servidor com "Tentar novamente", curtida recusada (desfaz e avisa) e upload inválido têm resposta e teste | `app.test.jsx` (11 testes), `api.test.js` | 03/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1) | — | 03/11/2026 |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe sem violações em 2 telas (02/11); foco visível; botões novos com nome; contador em `aria-live` | `global.css`, `Feed.jsx` | 03/11/2026 |
| 9 | Segurança e conformidade | Riscos decididos | Parcial: o arquivo com a senha saiu do código e a varredura de segredos não acha nada; a senha segue no histórico do Git, e revogar o usuário no Atlas é do responsável | #85; `git grep` do guia de estado; `npm audit --omit=dev` sem alertas | 03/11/2026 |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Parcial: CI em PRs para `master` e `developer/**`; `master` sem proteção (API 404) | #86 | 03/11/2026 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 5 testes da API, 11 do web e o teste do app no CI | CI do PR do ciclo | 03/11/2026 |
| 12 | Documentação honesta | O README ensina a rodar, e os números estão certos | Atende: README e este resumo revistos; o README diz que o site está fora do ar | `Readme.md`, este arquivo | 03/11/2026 |

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
| 5 | Proteger a `master` | Com o responsável (#86) |
| 6 | Republicar no Render | Com o responsável (#87) |
| 7 | App móvel e Dependabot | Issue (#88) |
