const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));


// Endpoint for scraping Amazon search results
app.get('/api/scrape', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    if (!keyword) {
      throw new Error('Keyword parameter is missing');
    }

    const response = await axios.get(`https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`);
    const html = response.data;
    const dom = new JSDOM(html);

    const products = Array.from(dom.window.document.querySelectorAll('[data-component-type="s-search-result"]'));

    const scrapedData = products.map(product => ({
      title: product.querySelector('h2 a') ? product.querySelector('h2 a').textContent.trim() : 'N/A',
      imageUrl: product.querySelector('img') ? product.querySelector('img').src : 'N/A',
      rating: product.querySelector('span[aria-label*="out of 5 stars"]') ? product.querySelector('span[aria-label*="out of 5 stars"]').getAttribute('aria-label') : 'N/A',
      reviews: product.querySelector('span[aria-label*="ratings"]') ? product.querySelector('span[aria-label*="ratings"]').getAttribute('aria-label') : 'N/A'
    }));

    res.json(scrapedData);
  } catch (error) {
    console.error('Fetching data error', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
