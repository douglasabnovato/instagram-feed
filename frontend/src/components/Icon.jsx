/* Ícones próprios do alô, uai: traço de 24 px em currentColor, sem dependência externa */
const PATHS = {
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="3" />
      <path d="M6.5 16l4-4.5 3 3 2-2 2.5 3.5" />
      <circle cx="16" cy="9" r="1.4" />
    </>
  ),
};

/* Desenha o ícone pedido; decorativo por padrão (o texto do botão dá o nome acessível) */
export default function Icon({ name, size = 22, filled = false, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
/* Fim de Icon.jsx */
