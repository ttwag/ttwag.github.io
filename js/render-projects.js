// Renders projects.json into the element with id="project-list".
// To add a new project, simply add a new object to projects.json.
(async function renderProject() {
  const container = document.getElementById('project-list');
  if (!container) return;

  try {
    const res = await fetch('projects.json'); // Adjust path if needed
    if (!res.ok) throw new Error('projects.json not found');
    const projects = await res.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      container.innerHTML = '<div>No projects listed yet.</div>';
      return;
    }

    // Maps over the JSON array and generates the exact HTML structure you had previously
    container.innerHTML = projects.map(project => `
      <div class="project-item">
        <div>
          <div class="oi-name">
            ${escapeHtml(project.name)}
            ${project.language ? `<a class="lang-tag">${escapeHtml(project.language)}</a>` : ''}
          </div>
          <div class="oi-desc">${escapeHtml(project.description)}</div>
        </div>
        ${project.repo ? `<a class="repo-link" href="${escapeAttr(project.repo)}">repo →</a>` : ''}
      </div>
    `).join('');
    
  } catch (err) {
    container.innerHTML = '<div>Couldn\'t load projects.</div>';
    console.error(err);
  }

  // Security helpers to prevent Cross-Site Scripting (XSS)
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function escapeAttr(str) { return escapeHtml(str); }
})();