//api.js
document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector('.modern-form')
    .addEventListener('submit', async (e) => {
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
  document.querySelector('.submit-button').style.display = 'none';
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
      'https://abntify-production.up.railway.app/historico'
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
