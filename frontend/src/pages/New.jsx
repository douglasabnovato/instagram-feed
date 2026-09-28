/* Nova publicação do alô, uai: imagem com pré-visualização, nome, local, causo e hashtags */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Icon from "../components/Icon";
import "./New.css";

const FIELDS = [
  ["author", "Seu nome", 40, "Como quer aparecer no feed"],
  ["place", "Onde foi?", 60, "Ex.: Mercado Central, BH"],
  ["description", "Conta o causo", 500, "O que tá acontecendo na foto?"],
  ["hashtags", "Hashtags", 200, "#pãodequeijo #serra"],
];

/* Formulário com validação mínima no cliente; a API valida de novo */
export default function New() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({ author: "", place: "", description: "", hashtags: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const preview = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  /* Valida o mínimo e envia como multipart */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) return setError("Escolha uma imagem.");
    if (!form.author.trim()) return setError("Informe seu nome.");
    const data = new FormData();
    data.append("image", image);
    for (const [k, val] of Object.entries(form)) data.append(k, val);
    setError("");
    setBusy(true);
    try {
      await api("/posts", { method: "POST", body: data });
      navigate("/");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <form id="new-post" onSubmit={handleSubmit} noValidate>
      <h1>Nova publicação</h1>
      <p className="lead">Manda uma foto e puxa uma prosa.</p>
      <input id="image" className="sr-only" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <label htmlFor="image" className={preview ? "dropzone has-preview" : "dropzone"}>
        {preview ? (
          <img className="preview" src={preview} alt="Pré-visualização da imagem escolhida" />
        ) : (
          <span className="dropzone-hint">
            <Icon name="image" size={32} />
            <span>Imagem (até 5 MB)</span>
            <small>Clique para escolher</small>
          </span>
        )}
      </label>
      {FIELDS.map(([name, label, max, hint]) => (
        <div key={name} className="field">
          <label htmlFor={name}>{label}</label>
          <input id={name} type="text" name={name} maxLength={max} placeholder={hint} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
        </div>
      ))}
      <p className="aviso">Demonstração pública: não envie fotos de pessoas nem dados pessoais. As publicações somem quando o servidor reinicia.</p>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" disabled={busy}>{busy ? "Publicando…" : "Publicar"}</button>
    </form>
  );
}
/* Fim de New.jsx */
