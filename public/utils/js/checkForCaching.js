const cache = {};

links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const href = link.getAttribute('href').substring(1);
        const url = `${href}`;

        // Check if content is already cached
        if (cache[url]) {
            content.innerHTML = cache[url];
            return;
        }

        fetch(url)
            .then(response => response.text())
            .then(html => {
                content.innerHTML = html;
                // Cache fetched content
                cache[url] = html;
            })
            .catch(error => {
                console.log(error);
            });
    });
});