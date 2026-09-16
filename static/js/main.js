// Front/back view toggle for each terrain video card, plus graceful
// placeholders for clips that have not been dropped in yet.

function initVideoCards() {
  document.querySelectorAll(".video-card").forEach((card) => {
    const frame = card.querySelector(".video-frame");
    const buttons = card.querySelectorAll(".view-toggle button");
    const broken = {}; // view -> bool, set once a <source> 404s

    function render() {
      const view = card.dataset.activeView;
      buttons.forEach((b) => b.classList.toggle("active", b.dataset.view === view));
      frame.querySelectorAll("video").forEach((v) => {
        const show = v.dataset.view === view && !broken[v.dataset.view];
        v.hidden = !show;
        if (show) v.play().catch(() => {});
        else v.pause();
      });
      frame.querySelectorAll(".video-placeholder").forEach((p) => {
        p.hidden = !(p.dataset.view === view && broken[p.dataset.view]);
      });
    }

    function showView(view) {
      card.dataset.activeView = view;
      render();
    }

    buttons.forEach((b) => b.addEventListener("click", () => showView(b.dataset.view)));

    frame.querySelectorAll("video").forEach((v) => {
      v.addEventListener("error", () => {
        broken[v.dataset.view] = true;
        render();
      });
    });

    const firstBtn = buttons[0];
    if (firstBtn) showView(firstBtn.dataset.view);
  });
}

function initBibtexCopy() {
  const btn = document.querySelector(".copy-btn");
  const box = document.querySelector(".bibtex-box code");
  if (!btn || !box) return;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(box.textContent.trim());
      const original = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = original), 1500);
    } catch (e) {
      // Clipboard API unavailable (e.g. non-HTTPS) -- select the text instead.
      const range = document.createRange();
      range.selectNode(box);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  });
}

// This script is loaded at the end of <body>, after all the markup above it
// -- DOMContentLoaded may already have fired by the time we get here, so
// don't wait for it; just run.
initVideoCards();
initBibtexCopy();
