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
