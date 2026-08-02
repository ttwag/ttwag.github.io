// Renders posts.json into the element with id="post-list" on the homepage.
// To publish a new post: add a .html file under /posts/, then add one
// entry to posts.json. This script does the rest — no HTML edits needed.
(async function renderPosts() {
  const container = document.getElementById('post-list');
  if (!container) return;

  try {
    const res = await fetch('posts.json');
    if (!res.ok) throw new Error('posts.json not found');
    const posts = await res.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      container.innerHTML = '<div class="post-list-empty">No posts yet.</div>';
      return;
    }

    posts.sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first

    container.innerHTML = posts.map(post => `
      <div class="post-item">
        <div class="post-item-top">
          <a class="post-title-link" href="${escapeAttr(post.path)}">${escapeHtml(post.title)}</a>
          ${post.category ? `<span class="post-tag">${escapeHtml(post.category)}</span>` : ''}
        </div>
        <div class="post-date">${escapeHtml(post.date)}</div>
        <div class="post-summary">${escapeHtml(post.summary)}</div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<div class="post-list-empty">Couldn\'t load posts.</div>';
    console.error(err);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function escapeAttr(str) { return escapeHtml(str); }
})();