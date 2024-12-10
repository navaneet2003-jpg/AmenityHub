// server.js
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile('form.html');
});

app.post('/scrape', async (req, res) => {
  const city = req.body.city;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`https://www.google.com/maps/search/restaurant+${city}/@15.3593758,75.1428627,15z/data=!3m1!4b1?entry=ttu`);

  // Wait for the page to load
  await page.waitForSelector('.section-result');

  // Extract restaurant names and addresses
  const restaurants = await page.$$eval('.section-result', (elements) => {
    return elements.map((element) => {
      const name = element.querySelector('.section-result-title').textContent;
      const address = element.querySelector('.section-result-address').textContent;
      return { name, address };
    });
  });

  // Close the browser
  await browser.close();

  // Send the results back to the client
  res.json(restaurants);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});