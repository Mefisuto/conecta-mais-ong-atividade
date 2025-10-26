export const store = {
  get(key, def = null){
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
    catch { return def; }
  },
  set(key, val){
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },
  del(key){ try { localStorage.removeItem(key); } catch {} }
};

export function initState(){
  // Espaço reservado para preferências; o formulário já usa localStorage
}