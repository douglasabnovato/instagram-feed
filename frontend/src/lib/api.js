/* Cliente HTTP do feed: URL por VITE_API_URL e mensagens de erro da API */
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3333").replace(/\/$/, "");

/* Chama a API e devolve o JSON; lança Error com a mensagem do servidor */
export async function api(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error("Sem conexão com o servidor. Tente novamente.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.errors?.join(" ") || "Algo deu errado. Tente novamente.");
  return data;
}
/* Fim de api.js */
