/* Cabeçalho do alô, uai: marca (volta ao feed) e botão de nova publicação */
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import Icon from "./Icon";
import "./Header.css";

/* Barra fixa com símbolo, nome e chamada para publicar */
export default function Header() {
  return (
    <header id="main-header">
      <nav className="header-content" aria-label="Principal">
        <Link to="/" className="brand" aria-label="alô, uai — ir para o feed">
          <img src={logo} alt="" width="40" height="40" />
          <span className="brand-text">
            <span className="brand-name">alô, uai</span>
            <span className="brand-tagline">fotos com prosa</span>
          </span>
        </Link>
        <Link to="/new" className="btn-publish">
          <Icon name="plus" size={18} />
          <span>Publicar</span>
        </Link>
      </nav>
    </header>
  );
}
/* Fim de Header.jsx */
