let sessionId = localStorage.getItem('sessionId');

if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem('sessionId', sessionId);
}

//api.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('abnt-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
      curso: document.getElementById('curso').value,
      titulo: document.getElementById('titulo').value,
      nome: document.getElementById('nome').value,
      instituicao: document.getElementById('instituicao').value,
      ano: document.getElementById('ano').value,
      cidade: document.getElementById('cidade').value,
      tipoTrabalho: document.getElementById('tipoTrabalho').value,
      objetivo: document.getElementById('objetivo').value,
      orientador: document.getElementById('orientador').value,
      dedicatoria: document.getElementById('dedicatoria').value,
      agradecimentos: document.getElementById('agradecimentos').value,
      epigrafe: document.getElementById('epigrafe').value,
      resumo: document.getElementById('resumo').value,
      palavrasChave: document.getElementById('palavrasChave').value,
      resumoEn: document.getElementById('resumoEn').value,
      keywords: document.getElementById('keywords').value,
    };

    try {
      const response = await fetch(
        'https://abntify-production.up.railway.app/gerar-pdf',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': sessionId,
          },
          body: JSON.stringify(dados),
        }
      );

      if (!response.ok) {
        console.log(`Erro HTTP! Status: ${response.status}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'abnt.pdf';
      a.click();

      await buscarHistorico(); // atualiza o histórico após gerar o PDF
    } catch (error) {
      console.error('ERRO:', error);
    }
  });
});

// step.js

let currentStep = 1;
const totalSteps = 3;

function nextStep(e) {
  e.preventDefault();
  e.stopPropagation();

  if (currentStep >= totalSteps) return;

  document
    .querySelector(`[data-step="${currentStep}"]`)
    .classList.remove('active');
  currentStep++;
  document
    .querySelector(`[data-step="${currentStep}"]`)
    .classList.add('active');
  updateStep();
}

function prevStep(e) {
  e.preventDefault();
  e.stopPropagation();
  if (currentStep <= 1) return;

  document
    .querySelector(`[data-step="${currentStep}"]`)
    .classList.remove('active');
  currentStep--;
  document
    .querySelector(`[data-step="${currentStep}"]`)
    .classList.add('active');
  updateStep();
}

function updateStep() {
  const btnGerar = document.querySelector('.submit-button');
  btnGerar.style.display = currentStep === totalSteps ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const btnGerar = document.querySelector('.submit-button');
  if (!btnGerar) return;

  btnGerar.style.display = 'none';
  document.querySelector('[data-step="1"]').classList.add('active'); // ← adiciona isso
});

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('switch');

  toggle.addEventListener('change', (e) => {
    document.body.classList.toggle('dark', e.target.checked);
  });
});

async function buscarHistorico() {
  const tbody = document.querySelector('tbody');

  if (!tbody) return;

  try {
    const response = await fetch(
      'https://abntify-production.up.railway.app/historico',
      {
        headers: {
          'X-Session-Id': sessionId,
        },
      }
    );
    const dados = await response.json();

    tbody.innerHTML = '';

    dados.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
    <td>${item.id}</td>
    <td>abnt</td>
    <td>${new Date(item.geradoEm).toLocaleString('pt-BR')}</td>
    <td>
      <a href="https://abntify-production.up.railway.app/download/${item.id}" download>
        📄 Baixar
      </a>
    </td>
  `;
      tbody.appendChild(tr);
    });
  } catch (erro) {
    console.error('Erro ao buscar histórico:', erro);
  }
}

document.addEventListener('DOMContentLoaded', buscarHistorico);

// ── Dark mode ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('switch');
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
    toggle.checked = true;
  }
  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark', toggle.checked);
    localStorage.setItem('theme', toggle.checked ? 'dark' : 'light');
  });
});

// ── Date header ───────────────────────────────────────────────────
const now = new Date();
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
const historyDate = document.getElementById('historyDate');
if (history) {
  historyDate.innerHTML = `Hoje — <span>${dayNames[now.getDay()]}, ${now.getDate()} de ${monthNames[now.getMonth()]} de ${now.getFullYear()}</span>`;
}

// ── Helpers ───────────────────────────────────────────────────────
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function menuDots() {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="3" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="8" cy="13" r="1.3"/>
      </svg>`;
}

function pdfIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round" style="color:#e05">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="15" y2="17"/>
        <line x1="9" y1="9" x2="11" y2="9"/>
      </svg>`;
}

function makeRow(item, showConnector) {
  const time = formatTime(item.geradoEm);
  const connector = showConnector
    ? `<div class="connector"><div class="connector-line"></div></div>`
    : '';
  return `
        <div class="history-item">
          <div class="item-check"><input type="checkbox"></div>
          <div class="item-time">${time}</div>
          <div class="item-icon">${pdfIcon()}</div>
          <div class="item-content">
            <span class="item-title">abnt</span>
            <span class="item-domain">${new Date(item.geradoEm).toLocaleDateString('pt-BR')}</span>
          </div>
          <div class="item-menu" title="Baixar">
            <a href="https://abntify-production.up.railway.app/download/${item.id}" download
               style="color:inherit;display:flex">${menuDots()}</a>
          </div>
        </div>${connector}`;
}

// ── Fetch from your existing API ──────────────────────────────────
async function renderHistory() {
  const list = document.getElementById('historyList');
  list.innerHTML = `<div class="empty-state">Carregando...</div>`;

  try {
    const res = await fetch(
      'https://abntify-production.up.railway.app/historico',
      {
        headers: {
          'X-Session-Id': sessionId,
        },
      }
    );
    const dados = await res.json();

    if (!dados.length) {
      list.innerHTML = `<div class="empty-state">Nenhum arquivo gerado ainda.</div>`;
      return;
    }

    const todayStr = now.toDateString();
    const todayItems = dados.filter(
      (i) => new Date(i.geradoEm).toDateString() === todayStr
    );
    const olderItems = dados.filter(
      (i) => new Date(i.geradoEm).toDateString() !== todayStr
    );

    let html = '';

    todayItems.forEach((item, idx) => {
      html += makeRow(item, idx < todayItems.length - 1);
    });

    if (olderItems.length) {
      html += `<div style="padding:10px 20px 4px;font-size:11px;font-weight:600;
            color:var(--time-color);letter-spacing:.06em;text-transform:uppercase">Anteriores</div>`;
      olderItems.forEach((item, idx) => {
        html += makeRow(item, idx < olderItems.length - 1);
      });
    }

    list.innerHTML = html;
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    list.innerHTML = `<div class="empty-state">Erro ao carregar histórico.</div>`;
  }
}

renderHistory();
