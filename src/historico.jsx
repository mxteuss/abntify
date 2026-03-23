import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'https://abntify-production.up.railway.app';

let sessionId = localStorage.getItem('sessionId');
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem('sessionId', sessionId);
}

const dayNames = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];
const monthNames = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function PdfIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: '#e05' }}
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
      <line x1="9" y1="9" x2="11" y2="9" />
    </svg>
  );
}

function MenuDots() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="3" r="1.3" />
      <circle cx="8" cy="8" r="1.3" />
      <circle cx="8" cy="13" r="1.3" />
    </svg>
  );
}

function HistoryRow({ item, showConnector }) {
  return (
    <>
      <div className="history-item">
        <div className="item-check">
          <input type="checkbox" />
        </div>
        <div className="item-time">{formatTime(item.geradoEm)}</div>
        <div className="item-icon">
          <PdfIcon />
        </div>
        <div className="item-content">
          <span className="item-title">abnt</span>
          <span className="item-domain">
            {new Date(item.geradoEm).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <div className="item-menu" title="Baixar">
          <a
            href={`${API}/download/${item.id}`}
            download
            style={{ color: 'inherit', display: 'flex' }}
          >
            <MenuDots />
          </a>
        </div>
      </div>
      {showConnector && (
        <div className="connector">
          <div className="connector-line" />
        </div>
      )}
    </>
  );
}

export default function Historico() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  const now = new Date();

  useEffect(() => {
    document.body.className = dark ? 'dark' : '';
  }, [dark]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const res = await fetch(`${API}/historico`, {
          headers: { 'X-Session-Id': sessionId },
        });
        const dados = await res.json();
        setHistorico(dados);
      } catch {
        setErro(true);
      } finally {
        setLoading(false);
      }
    }
    fetchHistorico();
  }, []);

  const todayStr = now.toDateString();
  const todayItems = historico.filter(
    (i) => new Date(i.geradoEm).toDateString() === todayStr
  );
  const olderItems = historico.filter(
    (i) => new Date(i.geradoEm).toDateString() !== todayStr
  );

  return (
    <>
      <a
        className="container-tittle"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        abntify
      </a>

      <div className="container">
        <label
          className={`toggle ${dark ? 'is-dark' : ''}`}
          onClick={toggleDark}
        >
          <div className="icon icon--moon">
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
          <div className="icon icon--sun">
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
        </label>
      </div>

      <div className="page-content">
        <div className="modal" id="historyModal">
          <div className="modal-header">
            <h2 id="historyDate">
              Hoje —{' '}
              <span>
                {dayNames[now.getDay()]}, {now.getDate()} de{' '}
                {monthNames[now.getMonth()]} de {now.getFullYear()}
              </span>
            </h2>
          </div>
          <div className="history-list">
            {loading && <div className="empty-state">Carregando...</div>}
            {erro && (
              <div className="empty-state">Erro ao carregar histórico.</div>
            )}
            {!loading && !erro && historico.length === 0 && (
              <div className="empty-state">Nenhum arquivo gerado ainda.</div>
            )}
            {!loading && !erro && (
              <>
                {todayItems.map((item, idx) => (
                  <HistoryRow
                    key={item.id}
                    item={item}
                    showConnector={idx < todayItems.length - 1}
                  />
                ))}
                {olderItems.length > 0 && (
                  <>
                    <div
                      style={{
                        padding: '10px 20px 4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--time-color)',
                        letterSpacing: '.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Anteriores
                    </div>
                    {olderItems.map((item, idx) => (
                      <HistoryRow
                        key={item.id}
                        item={item}
                        showConnector={idx < olderItems.length - 1}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <button
          className="footer-button"
          onClick={() =>
            window.open(
              'https://github.com/mxteuss',
              '_blank',
              'noopener noreferrer'
            )
          }
        >
          Feito por mxteuss
        </button>
      </footer>
    </>
  );
}
