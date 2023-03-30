document.getElementById('create-page-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  // Ensure title and content are not empty
  if (!title || !content) {
    alert('Please provide both title and content.');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);

  try {
    const response = await fetch("/create-page", {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

    const data = await response.json();

    if (data.success) {
      alert('Page created successfully!');
    } else {
      alert('Error creating page.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error creating page.');
  }
});