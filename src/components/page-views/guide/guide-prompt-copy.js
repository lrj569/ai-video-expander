// Import once from the Guide page script. Astro navigation may replace the cards.
function enableCopyButtons() {
  for (const button of document.querySelectorAll('#prompt-examples button[data-copy-prompt]')) {
    button.hidden = false;
  }
}

const pending = new WeakSet();
const resets = new WeakMap();

document.addEventListener('click', async (event) => {
  const button = event.target instanceof Element && event.target.closest('#prompt-examples button[data-copy-prompt]');
  if (!button || pending.has(button)) return;
  const card = button.closest('[data-prompt-case]');
  const prompt = card?.querySelector('[data-prompt-text]');
  const status = card?.querySelector('[data-copy-status]');
  if (!prompt || !status) return;

  clearTimeout(resets.get(button));
  button.textContent = 'Copy prompt';
  status.textContent = '';
  status.classList.remove('sr-only');
  pending.add(button);
  try {
    await navigator.clipboard.writeText(prompt.textContent);
    status.classList.add('sr-only');
    status.textContent = 'Prompt copied.';
    button.textContent = '✓ Copied';
    resets.set(button, setTimeout(() => {
      button.textContent = 'Copy prompt';
      status.textContent = '';
    }, 2000));
  } catch {
    status.textContent = 'Could not copy. Select the prompt and copy it manually.';
  } finally {
    pending.delete(button);
  }
});

enableCopyButtons();
document.addEventListener('astro:page-load', enableCopyButtons);
