function onlyDigits(v){ return (v || '').replace(/\D+/g,''); }

function cpfValido(cpf) {
  cpf = onlyDigits(cpf);
  if (!cpf || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i=0; i<9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let dig1 = 11 - (soma % 11); dig1 = dig1 > 9 ? 0 : dig1;
  if (dig1 !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i=0; i<10; i++) soma += parseInt(cpf[i]) * (11 - i);
  let dig2 = 11 - (soma % 11); dig2 = dig2 > 9 ? 0 : dig2;
  return dig2 === parseInt(cpf[10]);
}

function idadeMinima(dataStr, min=16) {
  if (!dataStr) return false;
  const hoje = new Date();
  const d = new Date(dataStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return false;
  let idade = hoje.getFullYear() - d.getFullYear();
  const m = hoje.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < d.getDate())) idade--;
  return idade >= min;
}

function emailValido(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v || ''); }
function telefoneValido(v){ const d = onlyDigits(v); return d.length === 10 || d.length === 11; }
function cepValido(v){ return /^\d{5}-\d{3}$/.test(v || ''); }

function buildErrorsList(errors){
  if (!errors.length) return '';
  return `
    <div class="alert danger" role="alert" aria-live="assertive" style="margin-bottom:12px">
      <strong>Corrija os campos:</strong>
      <ul style="margin:6px 0 0 18px">
        ${errors.map(e => `<li>${e}</li>`).join('')}
      </ul>
    </div>`;
}

export function bindFormConsistency(form) {
  if (!form) return;
  const container = document.createElement('div');
  form.prepend(container);

  function validateAll() {
    const nome = form.querySelector('#nome')?.value;
    const email = form.querySelector('#email')?.value;
    const cpf = form.querySelector('#cpf')?.value;
    const tel = form.querySelector('#telefone')?.value;
    const nasc = form.querySelector('#nascimento')?.value;
    const cep = form.querySelector('#cep')?.value;

    const errors = [];
    if (!nome || nome.trim().split(/\s+/).length < 2) errors.push('Digite o nome completo.');
    if (!emailValido(email)) errors.push('E-mail inválido.');
    if (!cpfValido(cpf)) errors.push('CPF inválido.');
    if (!telefoneValido(tel)) errors.push('Telefone inválido.');
    if (!idadeMinima(nasc, 16)) errors.push('Idade mínima: 16 anos.');
    if (!cepValido(cep)) errors.push('CEP deve estar no formato 00000-000.');

    container.innerHTML = buildErrorsList(errors);
    return errors.length === 0;
  }

  form.addEventListener('submit', (e) => {
    const ok = validateAll();
    if (!ok) {
      e.preventDefault();
      window.showToast?.('Verifique os campos destacados.', 'danger');
      const firstInvalid = form.querySelector('.is-invalid, .input:invalid, .select:invalid, .textarea:invalid') || form.querySelector('.input, .select, .textarea');
      firstInvalid?.focus();
    }
  });

  form.addEventListener('blur', (e) => {
    if (e.target.matches('.input, .select, .textarea')) validateAll();
  }, true);
}

export function restoreFormDraft(form) {
  if (!form) return;
  const KEY = 'cadastroDraft';
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      for (const [k,v] of Object.entries(data)) {
        const field = form.querySelector(`[name="${k}"]`);
        if (field) field.value = v;
      }
    }
  } catch {}
  let t = null;
  form.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const data = {};
      form.querySelectorAll('[name]').forEach(el => data[el.name] = el.value);
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
    }, 250);
  });
}