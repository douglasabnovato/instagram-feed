/* Feed do alô, uai: carrega posts, recebe novos posts e curtidas em tempo real e permite curtir */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { api, API_URL } from "../lib/api";
import { corDoAvatar, iniciais, separarHashtags, tempoRelativo } from "../lib/format";
import Icon from "../components/Icon";
import "./Feed.css";

/* Insere ou substitui um post mantendo a ordem do mais recente */
export function upsert(feed, post) {
  return feed.some((p) => p._id === post._id) ? feed.map((p) => (p._id === post._id ? post : p)) : [post, ...feed];
}

/* Tamanho da página pedida à API (o padrão do servidor também é 20) */
export const PAGE_SIZE = 20;

/* Junta a página seguinte ao fim do feed, sem repetir posts */
export function appendPage(feed, page) {
  const ids = new Set(feed.map((p) => p._id));
  return [...feed, ...page.filter((p) => !ids.has(p._id))];
}

/* Lista de posts com estados de carregamento, vazio e erro */
export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  const [curtidos, setCurtidos] = useState(() => new Set());
  const [tentativa, setTentativa] = useState(0);
  const [mais, setMais] = useState({ temMais: false, carregando: false });

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: "" });
    api(`/posts?limit=${PAGE_SIZE}`)
      .then((posts) => {
        if (!alive) return;
        setFeed(posts);
        setMais({ temMais: posts.length === PAGE_SIZE, carregando: false });
        setState({ loading: false, error: "" });
      })
      .catch((err) => alive && setState({ loading: false, error: err.message }));
    const socket = io(API_URL);
    socket.on("post", (p) => setFeed((f) => upsert(f, p)));
    socket.on("like", (p) => setFeed((f) => (f.some((x) => x._id === p._id) ? upsert(f, p) : f)));
    return () => { alive = false; socket.disconnect(); };
  }, [tentativa]);

  /* Pede os posts mais antigos que o último da lista (paginação por data) */
  async function carregarMais() {
    const ultimo = feed[feed.length - 1];
    if (!ultimo) return;
    setMais((m) => ({ ...m, carregando: true }));
    try {
      const page = await api(`/posts?limit=${PAGE_SIZE}&before=${encodeURIComponent(ultimo.createdAt)}`);
      setFeed((f) => appendPage(f, page));
      setMais({ temMais: page.length === PAGE_SIZE, carregando: false });
    } catch (err) {
      setMais((m) => ({ ...m, carregando: false }));
      setState((s) => ({ ...s, error: err.message }));
    }
  }

  /* Curte, marca o coração e atualiza com a resposta; desfaz a marca se falhar */
  async function handleLike(id) {
    setCurtidos((s) => new Set(s).add(id));
    try {
      const post = await api(`/posts/${id}/like`, { method: "POST" });
      setFeed((f) => upsert(f, post));
    } catch (err) {
      setCurtidos((s) => { const n = new Set(s); n.delete(id); return n; });
      setState((s) => ({ ...s, error: `A curtida não foi registrada. ${err.message}` }));
    }
  }

  return (
    <section id="post-list" aria-labelledby="feed-title">
      <h1 id="feed-title" className="sr-only">Feed de fotos</h1>
      {state.error && (
        <div className="notice error" role="alert">
          <p>{state.error}</p>
          {feed.length === 0 && (
            <button type="button" className="btn" onClick={() => setTentativa((t) => t + 1)}>Tentar novamente</button>
          )}
        </div>
      )}
      {state.loading && (
        <p className="notice" role="status">Carregando o feed… Na versão gratuita, o servidor pode levar até 1 minuto para acordar.</p>
      )}
      {!state.loading && !state.error && feed.length === 0 && (
        <p className="notice"><strong>Tá quietim por aqui.</strong>Nenhuma publicação ainda. <Link to="/new">Publique a primeira foto</Link>.</p>
      )}
      {feed.map((post) => {
        const tags = separarHashtags(post.hashtags);
        const quando = tempoRelativo(post.createdAt);
        return (
          <article key={post._id} className="post">
            <header>
              <span className="avatar" style={{ background: corDoAvatar(post.author) }} aria-hidden="true">{iniciais(post.author)}</span>
              <div className="user-info">
                <span className="author">{post.author}</span>
                <span className="meta">
                  {[post.place, quando].filter(Boolean).join(" · ")}
                </span>
              </div>
            </header>
            <img className="photo" src={post.image_url} alt={`Foto de ${post.author}${post.description ? `: ${post.description}` : ""}`} loading="lazy" width="560" />
            <footer>
              <div className="actions">
                <button
                  type="button"
                  className={curtidos.has(post._id) ? "like liked" : "like"}
                  onClick={() => handleLike(post._id)}
                  aria-label={`Curtir a foto de ${post.author}`}
                >
                  <Icon name="heart" filled={curtidos.has(post._id)} />
                </button>
                <strong aria-live="polite">{post.likes} {post.likes === 1 ? "curtida" : "curtidas"}</strong>
              </div>
              {post.description && <p className="description"><span className="author">{post.author}</span> {post.description}</p>}
              {tags.length > 0 && (
                <ul className="tags" aria-label="Hashtags">
                  {tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
              )}
            </footer>
          </article>
        );
      })}
      {mais.temMais && (
        <p className="more">
          <button type="button" className="btn" onClick={carregarMais} disabled={mais.carregando} aria-controls="post-list">
            {mais.carregando ? "Carregando…" : "Carregar mais fotos"}
          </button>
        </p>
      )}
      <p className="sr-only" role="status" aria-live="polite">{feed.length > 0 ? `${feed.length} ${feed.length === 1 ? "foto" : "fotos"} no feed` : ""}</p>
    </section>
  );
}
/* Fim de Feed.jsx */
