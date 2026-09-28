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

/* Lista de posts com estados de carregamento, vazio e erro */
export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  const [curtidos, setCurtidos] = useState(() => new Set());

  useEffect(() => {
    let alive = true;
    api("/posts")
      .then((posts) => alive && (setFeed(posts), setState({ loading: false, error: "" })))
      .catch((err) => alive && setState({ loading: false, error: err.message }));
    const socket = io(API_URL);
    socket.on("post", (p) => setFeed((f) => upsert(f, p)));
    socket.on("like", (p) => setFeed((f) => (f.some((x) => x._id === p._id) ? upsert(f, p) : f)));
    return () => { alive = false; socket.disconnect(); };
  }, []);

  /* Curte, marca o coração e atualiza com a resposta (não depende só do socket) */
  async function handleLike(id) {
    setCurtidos((s) => new Set(s).add(id));
    try {
      const post = await api(`/posts/${id}/like`, { method: "POST" });
      setFeed((f) => upsert(f, post));
    } catch (err) {
      setState((s) => ({ ...s, error: err.message }));
    }
  }

  return (
    <section id="post-list" aria-labelledby="feed-title">
      <h1 id="feed-title" className="sr-only">Feed de fotos</h1>
      {state.error && <p className="notice error" role="alert">{state.error}</p>}
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
    </section>
  );
}
/* Fim de Feed.jsx */
