/* Formatação dos posts do alô, uai: iniciais e cor do avatar, tempo relativo e hashtags */
const CORES_AVATAR = ["#a8432f", "#2f6b4f", "#3b2417", "#7a4e1d", "#4a5a7a"];
const UNIDADES = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

/* Até duas iniciais do nome, em maiúsculas; "?" quando vazio */
export function iniciais(nome = "") {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  const letras = partes.length === 1 ? partes[0].slice(0, 2) : partes[0][0] + partes[partes.length - 1][0];
  return letras.toLocaleUpperCase("pt-BR");
}

/* Cor estável por nome, escolhida na paleta (todas com contraste AA para texto branco) */
export function corDoAvatar(nome = "") {
  let soma = 0;
  for (const ch of nome) soma = (soma * 31 + ch.codePointAt(0)) >>> 0;
  return CORES_AVATAR[soma % CORES_AVATAR.length];
}

/* "agora", "há 5 minutos", "ontem"... a partir da data de criação */
export function tempoRelativo(data, agora = Date.now()) {
  const t = new Date(data).getTime();
  if (Number.isNaN(t)) return "";
  const seg = Math.round((t - agora) / 1000);
  if (Math.abs(seg) < 60) return "agora";
  for (const [unidade, s] of UNIDADES) {
    if (Math.abs(seg) >= s) return rtf.format(Math.round(seg / s), unidade);
  }
  return "agora";
}

/* Separa "#a, #b c" em ["#a", "#b", "#c"], sem repetidas */
export function separarHashtags(texto = "") {
  const tags = texto.split(/[\s,;]+/).map((t) => t.replace(/^#*/, "")).filter(Boolean).map((t) => `#${t}`);
  return [...new Set(tags)];
}
/* Fim de format.js */
