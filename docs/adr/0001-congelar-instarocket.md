# ADR 0001 · Congelar o app móvel `instarocket/`

**Data:** 15/11/2026 · **Situação:** aceita · **Decisão do responsável** (#88)

## Contexto

O app `instarocket/` é o React Native 0.61 do curso, de 2019. Ele não é publicado e não faz parte do MVP: a web e a API estão no ar no Render. Em 15/11/2026, o Dependabot listava 34 alertas abertos no `instarocket/package-lock.json` (7 críticos, 16 altos, 10 médios e 1 baixo). Os PRs automáticos (#78 a #82) sobem o React Native para 0.88 de uma vez e quebram o job `instarocket` do CI.

## Decisão

Congelar o app como histórico do curso:
- o código fica no repositório, sem atualização;
- os PRs #78 a #82 são fechados com este motivo;
- o job `instarocket` segue no CI, para mostrar que os testes antigos ainda rodam;
- a evolução é a migração para o Expo 57 (#105).

## Consequências

- **Risco aceito:** os alertas do app ficam abertos. Eles afetam só quem rodar o app localmente, porque nada do `instarocket/` vai para o Render.
- Novos PRs do Dependabot no `instarocket/` são fechados com referência a esta ADR.
- O critério 9 do `docs/MVP.md` passa a "Atende": o risco está decidido e registrado.

## Como desfazer

Fazer a migração da #105 e marcar esta ADR como substituída.
