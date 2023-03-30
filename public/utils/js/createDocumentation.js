document.getElementById('documentation-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const content = document.getElementById('content').value;

  try {
    const response = await fetch('/create-documentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `content=${encodeURIComponent(content)}`,
    });

    if (response.ok) {
      // Insert the submitted content into the submitted-content element
      document.getElementById('submitted-content').innerHTML = `
          <h2>Submitted Content:</h2>
          <p>${content}</p>
        `;
    } else {
      alert('Error creating documentation page');
    }
  } catch (error) {
    console.error(error);
    alert('Error creating documentation page');
  }
});