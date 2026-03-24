import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

let sessionId = localStorage.getItem('sessionId');
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem('sessionId', sessionId);
}

const API = import.meta.env.VITE_API_URL;
const Icons = {
  curso: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 10v6M2 10l10-5 10 5-10 5z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12v5c3 3 9 3 12 0v-5"
      />
    </svg>
  ),
  pessoa: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <circle stroke="currentColor" strokeWidth="1.5" r="4" cy="8" cx="12" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20"
      />
    </svg>
  ),
  titulo: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6V19M6 6H18"
      />
    </svg>
  ),
  instituicao: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 9.78V16.2C5 17.88 5 18.72 5.33 19.36C5.61 19.93 6.07 20.39 6.64 20.67C7.28 21 8.12 21 9.8 21H14.2C15.88 21 16.72 21 17.36 20.67C17.93 20.39 18.39 19.93 18.67 19.36C19 18.72 19 17.88 19 16.2V5M21 12L15.57 5.96C14.33 4.59 13.71 3.9 12.99 3.65C12.35 3.43 11.65 3.43 11.01 3.65C10.28 3.91 9.67 4.59 8.43 5.96L3 12"
      />
    </svg>
  ),
  calendario: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M16 2v4M8 2v4M3 10h18"
      />
    </svg>
  ),
  local: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21C15.5 17.4 19 14.18 19 10.2C19 6.22 15.87 3 12 3C8.13 3 5 6.22 5 10.2C5 14.18 8.5 17.4 12 21Z"
      />
      <circle stroke="currentColor" strokeWidth="1.5" cx="12" cy="10" r="3" />
    </svg>
  ),
  documento: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
      />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
      />
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
      />
    </svg>
  ),
  linhas: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  ),
  historico: (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
      <path
        d="M3 5.67541V3C3 2.44772 2.55228 2 2 2C1.44772 2 1 2.44772 1 3V7C1 8.10457 1.89543 9 3 9H7C7.55229 9 8 8.55229 8 8C8 7.44772 7.55229 7 7 7H4.52186C5.621 5.40094 7.11009 4.22911 8.85191 3.57803C10.9074 2.80968 13.173 2.8196 15.2217 3.6059C17.2704 4.3922 18.9608 5.90061 19.9745 7.8469C20.9881 9.79319 21.2549 12.043 20.7247 14.1724C20.1945 16.3018 18.9039 18.1638 17.0959 19.4075C15.288 20.6513 13.0876 21.1909 10.9094 20.9247C8.73119 20.6586 6.72551 19.605 5.27028 17.9625C4.03713 16.5706 3.27139 14.8374 3.06527 13.0055C3.00352 12.4566 2.55674 12.0079 2.00446 12.0084C1.45217 12.0088 0.995668 12.4579 1.04626 13.0078C1.25994 15.3309 2.2082 17.5356 3.76666 19.2946C5.54703 21.3041 8.00084 22.5931 10.6657 22.9188C13.3306 23.2444 16.0226 22.5842 18.2345 21.0626C20.4464 19.541 22.0254 17.263 22.6741 14.6578C23.3228 12.0526 22.9963 9.30013 21.7562 6.91897C20.5161 4.53782 18.448 2.69239 15.9415 1.73041C13.4351 0.768419 10.6633 0.756291 8.14853 1.69631C6.06062 2.47676 4.26953 3.86881 3 5.67541Z"
        fill="currentColor"
      />
      <path
        d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.7274 11.1267 12.9235 11.1267 12.9235C11.2115 13.0898 11.3437 13.2344 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.546 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z"
        fill="currentColor"
      />
    </svg>
  ),
};

// ── AI Button ──────────────────────────────────────────────────────────────
const AI_COLORS = ['#7F77DD', '#1D9E75', '#534AB7', '#5DCAA5', '#AFA9EC'];

function spawnParticles(container) {
  for (let i = 0; i < 7; i++) {
    const p = document.createElement('div');
    const angle = (i / 7) * 360 + Math.random() * 20;
    const dist = 22 + Math.random() * 18;
    const rad = (angle * Math.PI) / 180;
    const tx = Math.cos(rad) * dist;
    const ty = Math.sin(rad) * dist;

    Object.assign(p.style, {
      position: 'absolute',
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      left: '50%',
      top: '50%',
      marginLeft: '-2px',
      marginTop: '-2px',
      background: AI_COLORS[i % AI_COLORS.length],
      opacity: '0',
      pointerEvents: 'none',
      '--tx': `${tx}px`,
      '--ty': `${ty}px`,
      animation: `ai-particle-fly 0.55s cubic-bezier(.22,1,.36,1) ${i * 30}ms forwards`,
    });

    container.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

const AI_BTN_STYLES = `
  @keyframes ai-orbit-idle {
    to { transform: rotate(360deg); }
  }
  @keyframes ai-pulse-ring {
    0%   { transform: scale(0.85); opacity: 1; }
    60%  { transform: scale(1.5);  opacity: 0.35; }
    100% { transform: scale(2);    opacity: 0; }
  }
  @keyframes ai-spin-icon {
    0%   { transform: rotate(0deg)   scale(1); }
    50%  { transform: rotate(180deg) scale(1.25); }
    100% { transform: rotate(360deg) scale(1); }
  }
  @keyframes ai-particle-fly {
    0%   { transform: translate(0, 0) scale(1); opacity: 0.85; }
    100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
  }
  .ai-btn {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: visible;
    transition: border-color 0.2s, background 0.2s;
    padding: 0;
  }
  .ai-btn::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 1.5px solid transparent;
    border-top-color: #7F77DD;
    border-right-color: #534AB7;
    opacity: 0.35;
    animation: ai-orbit-idle 4s linear infinite;
    pointer-events: none;
    transition: opacity 0.25s;
  }
  .ai-btn:hover::before {
    opacity: 0.85;
    animation-duration: 2s;
  }
  .ai-btn::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, #7F77DD22, #1D9E7522, #7F77DD22);
    opacity: 0;
    pointer-events: none;
  }
  .ai-btn.active::after {
    animation: ai-pulse-ring 0.7s ease-out forwards;
  }
  .ai-btn:hover {
    border-color: #7F77DD55;
    background: #EEEDFE55;
  }
  .ai-btn:focus-visible {
    outline: 2px solid #7F77DD;
    outline-offset: 3px;
  }
  .ai-icon {
    position: relative;
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease;
    pointer-events: none;
  }
  .ai-btn:hover .ai-icon {
    transform: scale(1.12);
  }
  .ai-btn.active .ai-icon {
    animation: ai-spin-icon 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  .ai-btn-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 4px;
  }
  .ai-tooltip {
    position: absolute;
    top: 42px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 11px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.18s;
    z-index: 10;
    background: var(--tooltip-bg, #1f1f2e);
    border: 1px solid rgba(0,0,0,0.1);
    color: var(--tooltip-color, #e2e2f0);
  }
  .ai-btn:hover ~ .ai-tooltip,
  .ai-btn:focus-visible ~ .ai-tooltip {
    opacity: 1;
  }
`;

function AIButton({ onClick }) {
  const [active, setActive] = useState(false);
  const particlesRef = useRef(null);

  const handleClick = () => {
    setActive(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setActive(true);
        if (particlesRef.current) spawnParticles(particlesRef.current);
        setTimeout(() => setActive(false), 700);
      });
    });
    onClick?.();
  };

  return (
    <>
      <style>{AI_BTN_STYLES}</style>
      <div className="ai-btn-wrap">
        <button
          type="button"
          className={`ai-btn${active ? ' active' : ''}`}
          aria-label="Gerar com IA"
          onClick={handleClick}
        >
          <div
            ref={particlesRef}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          />
          <svg
            className="ai-icon"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M9 1.5C9 1.5 9.8 5.4 11 6.5C12.2 7.6 16 8 16 9C16 10 12.2 10.4 11 11.5C9.8 12.6 9 16 9 16C9 16 8.2 12.6 7 11.5C5.8 10.4 2 10 2 9C2 8 5.8 7.6 7 6.5C8.2 5.4 9 1.5 9 1.5Z"
              fill="#7F77DD"
              fillOpacity="0.85"
            />
            <path
              d="M14 2C14 2 14.4 3.6 15 4.1C15.6 4.6 17 5 17 5C17 5 15.6 5.4 15 5.9C14.4 6.4 14 8 14 8C14 8 13.6 6.4 13 5.9C12.4 5.4 11 5 11 5C11 5 12.4 4.6 13 4.1C13.6 3.6 14 2 14 2Z"
              fill="#1D9E75"
              fillOpacity="0.75"
            />
            <path
              d="M4 11C4 11 4.3 11.9 4.6 12.2C4.9 12.5 6 12.8 6 13C6 13.2 4.9 13.5 4.6 13.8C4.3 14.1 4 15 4 15C4 15 3.7 14.1 3.4 13.8C3.1 13.5 2 13.2 2 13C2 12.8 3.1 12.5 3.4 12.2C3.7 11.9 4 11 4 11Z"
              fill="#7F77DD"
              fillOpacity="0.6"
            />
          </svg>
        </button>
        <div className="ai-tooltip">Gerar com IA</div>
      </div>
    </>
  );
}
// ──────────────────────────────────────────────────────────────────────────

function Field({
  id,
  label,
  icon,
  textarea,
  rows = 4,
  select,
  options,
  ...props
}) {
  return (
    <div className={`input-group${textarea ? ' full-width' : ''}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="input-wrapper">
        <span className="input-icon" aria-hidden="true">
          {Icons[icon]}
        </span>
        {select ? (
          <select id={id} name={id} className="form-input" {...props}>
            <option value="" disabled>
              {label}
            </option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : textarea ? (
          <textarea
            id={id}
            name={id}
            placeholder={label}
            className="form-input"
            rows={rows}
            {...props}
          />
        ) : (
          <input
            id={id}
            name={id}
            placeholder={label}
            className="form-input"
            {...props}
          />
        )}
      </div>
    </div>
  );
}

const STEPS = [
  {
    fields: [
      { id: 'curso', label: 'Curso', icon: 'curso' },
      { id: 'nome', label: 'Nome', icon: 'pessoa' },
      { id: 'titulo', label: 'Título', icon: 'titulo' },
      { id: 'instituicao', label: 'Instituição', icon: 'instituicao' },
      {
        id: 'ano',
        label: 'Ano',
        icon: 'calendario',
        inputMode: 'numeric',
        maxLength: 4,
      },
      { id: 'cidade', label: 'Cidade', icon: 'local' },
      {
        id: 'tipoTrabalho',
        label: 'Tipo de Trabalho',
        icon: 'documento',
        select: true,
        options: ['TCC', 'Dissertação', 'Tese'],
      },
      { id: 'objetivo', label: 'Objetivo', icon: 'documento' },
      { id: 'orientador', label: 'Orientador', icon: 'pessoa' },
    ],
  },
  {
    fields: [
      { id: 'dedicatoria', label: 'Dedicatória', icon: 'chat', textarea: true },
      {
        id: 'agradecimentos',
        label: 'Agradecimentos',
        icon: 'chat',
        textarea: true,
      },
      {
        id: 'epigrafe',
        label: 'Epígrafe',
        icon: 'chat',
        textarea: true,
        rows: 6,
      },
    ],
  },
  {
    fields: [
      {
        id: 'resumo',
        label: 'Resumo',
        icon: 'linhas',
        textarea: true,
        rows: 6,
      },
      { id: 'palavrasChave', label: 'Palavras-chave', icon: 'tag' },
      {
        id: 'resumoEn',
        label: 'Abstract',
        icon: 'linhas',
        textarea: true,
        rows: 6,
      },
      { id: 'keywords', label: 'Keywords', icon: 'tag' },
    ],
  },
];

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="32"
    height="32"
  >
    <path
      fillRule="evenodd"
      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
      clipRule="evenodd"
    />
  </svg>
);

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="32"
    height="32"
  >
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

function ModalAjuda({ onClose }) {
  return (
    <div
      className="modal-overlay modal-open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
    >
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>
        <h2 id="modal-titulo" className="modal-title">
          📐 Especificações ABNT
          <span className="modal-subtitle">NBR 14724:2011</span>
        </h2>
        {[
          {
            title: 'Margens',
            items: [
              ['Superior', '3 cm'],
              ['Esquerda', '3 cm'],
              ['Direita', '2 cm'],
              ['Inferior', '2 cm'],
            ],
          },
          {
            title: 'Formatação',
            items: [
              ['Fonte — Título', 'Arial, 14pt'],
              ['Fonte — Texto', 'Arial, 12pt'],
              ['Alinhamento', 'Centralizado'],
              ['Espaçamento', 'Simples'],
              ['Título', 'Negrito'],
            ],
          },
        ].map(({ title, items }) => (
          <div key={title} className="modal-section">
            <h3 className="modal-section-title">{title}</h3>
            <ul className="modal-list">
              {items.map(([k, v]) => (
                <li key={k}>
                  <span>{k}</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ABNTify() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dark, setDark] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );
  const [showHelp, setShowHelp] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  if (typeof document !== 'undefined') {
    document.body.className = dark ? 'dark' : '';
  }

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const isLast = step === STEPS.length - 1;

  const handleGenerateAbstract = async () => {
    if (!form.resumo && !form.palavrasChave) return;

    try {
      const response = await fetch(`${API}/traduzir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
        },
        body: JSON.stringify({
          resumo: form.resumo,
          palavrasChave: form.palavrasChave,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      setForm((f) => ({
        ...f,
        resumoEn: data.resumoEn,
        keywords: data.keywords,
      }));
    } catch (error) {
      console.error('Erro ao traduzir:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API}/gerar-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'abnt.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Desktop Nav ── */}
      <div className="container desktop-only" role="banner">
        <div className="container-tittle" aria-label="ABNTify">
          abntify
        </div>

        <button
          className="container-btn"
          onClick={() => navigate('/historico')}
          aria-label="Ver histórico"
        >
          <span className="span-btn">histórico</span>
        </button>

        <button
          className="container-btn btn-ajuda"
          onClick={() => setShowHelp(true)}
          aria-label="Ajuda"
        >
          <span className="span-btn">ajuda</span>
        </button>

        <label
          htmlFor="switch"
          className={`toggle ${dark ? 'is-dark' : ''}`}
          aria-label="Alternar tema"
        >
          <input
            type="checkbox"
            className="input"
            id="switch"
            role="switch"
            checked={dark}
            onChange={toggleDark}
          />
          <div className="icon icon--moon" aria-hidden="true">
            <MoonIcon />
          </div>
          <div className="icon icon--sun" aria-hidden="true">
            <SunIcon />
          </div>
        </label>
      </div>

      {/* ── Mobile Nav ── */}
      <nav className="mobile-nav">
        <button
          className="container-btn"
          onClick={() => navigate('/historico')}
        >
          <span className="btn-icon">{Icons.historico}</span>
          <span className="btn-label">histórico</span>
        </button>

        <button
          className="container-btn btn-ajuda"
          onClick={() => setShowHelp(true)}
        >
          <span className="btn-icon">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                d="M12 17v-1m0-4c0-1.5 2-1.5 2-3a2 2 0 10-4 0"
              />
            </svg>
          </span>
          <span className="btn-label">ajuda</span>
        </button>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <label
            className={`toggle ${dark ? 'is-dark' : ''}`}
            onClick={toggleDark}
            aria-label="Alternar tema"
          >
            <div className="icon icon--moon" aria-hidden="true">
              <MoonIcon />
            </div>
            <div className="icon icon--sun" aria-hidden="true">
              <SunIcon />
            </div>
          </label>
          <span className="btn-label">tema</span>
        </div>
      </nav>

      {/* Modal */}
      {showHelp && <ModalAjuda onClose={() => setShowHelp(false)} />}

      {/* Formulário */}
      <main>
        <form
          className="modern-form"
          id="abnt-form"
          noValidate
          aria-label="Formulário de geração de documento ABNT"
          onSubmit={handleSubmit}
        >
          <div className="form-title">Faça seu arquivo acadêmico</div>

          {/* ── Step 1 ── */}
          <div className={`step1${step === 0 ? ' active' : ''}`} data-step="1">
            <div className="form-body">
              {STEPS[0].fields.map(({ id, ...props }) => (
                <Field
                  key={id}
                  id={id}
                  onChange={handleChange}
                  value={form[id] || ''}
                  {...props}
                />
              ))}
            </div>
          </div>

          {/* ── Step 2 ── */}
          <div className={`step2${step === 1 ? ' active' : ''}`} data-step="2">
            {STEPS[1].fields.map(({ id, ...props }) => (
              <Field
                key={id}
                id={id}
                onChange={handleChange}
                value={form[id] || ''}
                {...props}
              />
            ))}
          </div>

          {/* ── Step 3 ── */}
          <div className={`step3${step === 2 ? ' active' : ''}`} data-step="3">
            {/* Resumo */}
            <Field
              id="resumo"
              label="Resumo"
              icon="linhas"
              textarea
              rows={6}
              onChange={handleChange}
              value={form['resumo'] || ''}
            />

            {/* Palavras-chave */}
            <Field
              id="palavrasChave"
              label="Palavras-chave"
              icon="tag"
              onChange={handleChange}
              value={form['palavrasChave'] || ''}
            />

            {/* Abstract + botão IA lado a lado */}
            <div
              className="input-group full-width"
              style={{ position: 'relative' }}
            >
              <label htmlFor="resumoEn" className="sr-only">
                Abstract
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <div className="input-wrapper" style={{ flex: 1 }}>
                  <span className="input-icon" aria-hidden="true">
                    {Icons.linhas}
                  </span>
                  <textarea
                    id="resumoEn"
                    name="resumoEn"
                    placeholder="Abstract"
                    className="form-input"
                    rows={6}
                    onChange={handleChange}
                    value={form['resumoEn'] || ''}
                  />
                </div>
                <AIButton onClick={handleGenerateAbstract} />
              </div>
            </div>

            {/* Keywords */}
            <Field
              id="keywords"
              label="Keywords"
              icon="tag"
              onChange={handleChange}
              value={form['keywords'] || ''}
            />
          </div>

          {/* ── Navegação entre steps ── */}
          <div
            className="step-buttons"
            role="group"
            aria-label="Navegação entre etapas"
          >
            {step > 0 && (
              <button
                type="button"
                className="btn-prev"
                onClick={() => setStep(step - 1)}
              >
                &larr; Voltar
              </button>
            )}
            {!isLast && (
              <button
                type="button"
                className="btn-next"
                onClick={() => setStep(step + 1)}
              >
                Próximo &rarr;
              </button>
            )}
          </div>

          {isLast && (
            <button
              className="submit-button"
              type="submit"
              disabled={loading}
              aria-label="Gerar PDF"
            >
              <span className="button-text">
                {loading ? 'Gerando...' : 'Gerar PDF'}
              </span>
              <div className="button-glow" aria-hidden="true" />
            </button>
          )}
        </form>
      </main>

      <footer className="footer" role="contentinfo">
        <button
          className="footer-button"
          onClick={() =>
            window.open(
              'https://github.com/mxteuss',
              '_blank',
              'noopener noreferrer'
            )
          }
          aria-label="Ver perfil no GitHub"
        >
          Feito por mxteuss
        </button>
      </footer>
    </>
  );
}
