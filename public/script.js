document.addEventListener('DOMContentLoaded', () => {
  const scrapeBtn = document.getElementById('scrapeBtn');
  const keywordInput = document.getElementById('keyword');
  const resultsDiv = document.getElementById('results');

  scrapeBtn.addEventListener('click', async () => {
    const keyword = keywordInput.value.trim();
    if (!keyword) {
      alert('Please enter a keyword');
      return;
    }

    try {
      const response = await fetch(`/api/scrape?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching data');
    }
  });

  function displayResults(data) {
    resultsDiv.innerHTML = '';
    data.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.innerHTML = `
        <h2>${product.title}</h2>
        <p>Rating: ${product.rating}</p>
        <p>Reviews: ${product.reviews}</p>
        <img src="${product.imageUrl}" alt="${product.title}">
      `;
      resultsDiv.appendChild(productDiv);
    });
  }
});
