const tpl = (strings, ...values) =>
  strings.reduce((acc, s, i) => acc + s + (values[i] ?? ''), '');

const projects = [
  { id: 'educacao', titulo: 'Reforço Escolar', categoria: 'Educação', impacto: 200, local: 'Bairro X', desde: 2022, img: 'img/projeto1.svg' },
  { id: 'saude', titulo: 'Cuidado em Foco', categoria: 'Saúde', impacto: 500, local: 'Região Y', desde: 2021, img: 'img/projeto2.svg' },
  { id: 'meioambiente', titulo: 'Verde de Volta', categoria: 'Meio ambiente', impacto: 1000, local: 'Parque Z', desde: 2020, img: 'img/projeto3.svg' },
];

function ProjectCard(p) {
  return tpl`
    <article class="card" id="${p.id}">
      <div class="card-media"><img src="${p.img}" alt="${p.titulo}"></div>
      <div class="card-body">
        <h3 class="card-title">${p.titulo}</h3>
        <div class="badges">
          <span class="badge info">${p.categoria}</span>
          <span class="badge success">Impacto: ${p.impacto}+</span>
        </div>
        <p class="card-meta">${p.local} • Desde ${p.desde}</p>
        <p>Projeto com foco em ações sociais e comunitárias.</p>
        <div style="display:flex; gap:10px; margin-top:10px">
          <a class="btn btn-primary" href="voluntarios.html" data-spa-link>Quero ser voluntário</a>
          <a class="btn btn-outline" href="doacoes.html" data-spa-link>Apoiar</a>
        </div>
      </div>
    </article>`;
}

export async function renderProjects() {
  const html = tpl`
    <section class="section">
      <div class="container">
        <h2 class="section-title">Projetos em destaque</h2>
        <div class="projects-grid">
          ${projects.map(ProjectCard).join('')}
        </div>
      </div>
    </section>
  `;
  return html;
}