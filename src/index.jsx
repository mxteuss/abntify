import { useState } from 'react';

// ─── Ícones ────────────────────────────────────────────────────────────────
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

// ─── Campo reutilizável ────────────────────────────────────────────────────
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

// ─── Configuração dos steps ────────────────────────────────────────────────
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

// ─── Modal Ajuda ───────────────────────────────────────────────────────────
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

// ─── App ───────────────────────────────────────────────────────────────────
export default function ABNTify() {
  const [step, setStep] = useState(0);
  const [dark, setDark] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [form, setForm] = useState({});

  if (typeof document !== 'undefined') {
    document.body.className = dark ? 'dark' : '';
  }

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const isLast = step === STEPS.length - 1;

  return (
    <>
      {/* Navbar */}
      <div className="container" role="banner">
        <div className="container-tittle" aria-label="ABNTify">
          abntify
        </div>

        <button
          className="container-btn"
          onClick={() => (window.location.href = 'historico.html')}
          aria-label="Ver histórico de documentos"
        >
          <svg className="btn-icon" width="24" height="24" aria-hidden="true">
            {Icons.historico}
          </svg>
          <span className="span-btn">Histórico</span>
          <span className="btn-label">histórico</span>
        </button>

        <button
          className="container-btn btn-ajuda"
          onClick={() => setShowHelp(true)}
          aria-label="Abrir ajuda com especificações ABNT"
        >
          <svg
            className="btn-icon"
            width="24"
            height="24"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
          >
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
          <svg
            className="btn-icon-desktop"
            width="16"
            height="16"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
          >
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
          <span className="span-btn">Ajuda</span>
          <span className="btn-label">ajuda</span>
        </button>

        <label
          htmlFor="switch"
          className="toggle"
          aria-label="Alternar tema claro/escuro"
        >
          <input
            type="checkbox"
            className="input"
            id="switch"
            role="switch"
            checked={dark}
            onChange={() => setDark(!dark)}
          />
          <div className="icon icon--moon" aria-hidden="true">
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
          </div>
          <div className="icon icon--sun" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="32"
              height="32"
            >
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          </div>
          <span className="btn-label">tema</span>
        </label>
      </div>

      {/* Modal */}
      {showHelp && <ModalAjuda onClose={() => setShowHelp(false)} />}

      {/* Formulário */}
      <main>
        <form
          className="modern-form"
          id="abnt-form"
          noValidate
          aria-label="Formulário de geração de documento ABNT"
        >
          <div className="form-title">Faça seu arquivo acadêmico</div>

          {/* Step 1 */}
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

          {/* Step 2 */}
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

          {/* Step 3 */}
          <div className={`step3${step === 2 ? ' active' : ''}`} data-step="3">
            {STEPS[2].fields.map(({ id, ...props }) => (
              <Field
                key={id}
                id={id}
                onChange={handleChange}
                value={form[id] || ''}
                {...props}
              />
            ))}
          </div>

          {/* Navegação */}
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
              className="submit-button btn-gerar"
              type="submit"
              aria-label="Gerar PDF do documento"
            >
              <span className="button-text">Gerar PDF</span>
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
          aria-label="Ver perfil do desenvolvedor no GitHub"
        >
          Feito por mxteuss
        </button>
      </footer>
    </>
  );
}
