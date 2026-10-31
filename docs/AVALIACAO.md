# Avaliação — instagram-feed

> Data: 30/10/2026 · Base: `0b142ff`. Teste automático em cópia limpa, no Windows com Node 24; links testados uma vez.

## Execução

| Parte | Instalação | Testes | Build |
|---|---|---|---|
| `backend` | passa | passa | não há |
| `frontend` | passa | falha | falha |
| `instarocket` | passa | passa | não há |

Falhas de instalação de módulos nativos podem ser próprias do Node 24 no Windows. O CI do PR, com Node 22 no Linux, é a referência.

## Publicação

| Endereço citado no README | Situação |
|---|---|
| https://alo-uai-api.onrender.com/health | **404** |
| https://alo-uai-web.onrender.com | **404** |

## Limites

O código e as telas não foram revisados um a um. Um endereço que responde não prova que a aplicação funciona, e um servidor gratuito pode estar dormindo.
