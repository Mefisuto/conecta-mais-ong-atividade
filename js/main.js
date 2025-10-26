import { initRouter } from './router.js';
import { renderProjects } from './templates.js';
import { bindFormConsistency, restoreFormDraft } from './validators.js';
import { initState } from './state.js';

(function(){
  const burger=document.querySelector('[data-hamburger]');
  const nav=document.querySelector('[data-nav]');
  if(burger&&nav){
    burger.addEventListener('click',()=>{
      nav.classList.toggle('open');
      burger.setAttribute('aria-expanded',nav.classList.contains('open'));
    });
  }
  window.showToast=function(msg,type='info'){
    const container=document.querySelector('.toast-container')||(()=>{const c=document.createElement('div');c.className='toast-container';document.body.appendChild(c);return c;})();
    const el=document.createElement('div');el.className='toast alert '+type;el.textContent=msg;container.appendChild(el);
    setTimeout(()=>el.remove(),4000);
  }
  const backdrop=document.querySelector('[data-modal-backdrop]');
  document.addEventListener('click',(e)=>{
    const openBtn=e.target.closest('[data-open-modal]');
    const closeBtn=e.target.closest('[data-close-modal]');
    if(openBtn&&backdrop){backdrop.classList.add('open');}
    if(closeBtn&&backdrop){backdrop.classList.remove('open');}
    if(backdrop&&e.target===backdrop){backdrop.classList.remove('open');}
  });
  function applyMask(el, formatter){
    const handle=()=>{ const start=el.selectionStart; const before=el.value.length; el.value=formatter(el.value); const after=el.value.length; const diff=after-before; el.selectionStart=el.selectionEnd=start+(diff>0?1:0); };
    ['input','blur'].forEach(evt=>el.addEventListener(evt,handle));
  }
  function onlyDigits(v){ return v.replace(/\D+/g,''); }
  function formatCPF(v){ v=onlyDigits(v).slice(0,11); return v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2'); }
  function formatPhone(v){ v=onlyDigits(v).slice(0,11); return (v.length<=10? v.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3'): v.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3')).trim(); }
  function formatCEP(v){ v=onlyDigits(v).slice(0,8); return v.replace(/(\d{5})(\d{0,3})/,'$1-$2').trim(); }
  document.addEventListener('DOMContentLoaded', ()=>{
    const cpf=document.querySelector('#cpf'); const tel=document.querySelector('#telefone'); const cep=document.querySelector('#cep');
    if(cpf) applyMask(cpf,formatCPF); if(tel) applyMask(tel,formatPhone); if(cep) applyMask(cep,formatCEP);
  });
})();

function afterNavigate(path){
  if (path.endsWith('/cadastro.html')) {
    const form = document.querySelector('form');
    if (form) {
      bindFormConsistency(form);
      restoreFormDraft(form);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initState();
  const dynamicRoutes = {
    '/projetos.html': async () => await renderProjects(),
  };
  initRouter({ onAfterNavigate: afterNavigate, dynamicRoutes });
  afterNavigate(window.location.pathname || '/index.html');
  if ((window.location.pathname || '').endsWith('/cadastro.html')) {
    const form = document.querySelector('form');
    if (form) {
      bindFormConsistency(form);
      restoreFormDraft(form);
    }
  }
});