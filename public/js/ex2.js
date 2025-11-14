document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('callApi');
  const output = document.getElementById('apiResponse');
  if (!button || !output) return;

  button.addEventListener('click', async () => {
    output.textContent = 'Calling API...';
    const payload = { name: 'Ansh', countries: ['USA', 'France', 'Japan', 'Canada', 'Spain'] };
    try {
      const res = await fetch('/api/countries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      output.textContent = data.message || 'No message returned';
    } catch {
      output.textContent = 'Network error';
    }
  });
});


