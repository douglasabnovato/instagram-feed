/* Layout do alô, uai: cabeçalho, rotas (feed e nova publicação) e rodapé de demonstração */
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Feed from "./pages/Feed";
import New from "./pages/New";
import "./global.css";

/* Estrutura da página com o aviso de projeto de estudo no rodapé */
export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/new" element={<New />} />
          <Route path="*" element={<p className="notice" role="alert"><strong>Uai, sô!</strong>Página não encontrada.</p>} />
        </Routes>
      </main>
      <footer id="site-footer">
        <p>alô, uai · projeto de estudo fullstack com React, Express, MongoDB e Socket.IO.</p>
        <p>Demonstração pública: não envie fotos de pessoas. As publicações somem quando o servidor reinicia.</p>
      </footer>
    </>
  );
}
/* Fim de App.jsx */
